// Smooth fade-in effect on load
document.addEventListener("DOMContentLoaded", () => {
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 2s ease-in";
    document.body.style.opacity = "1";
  }, 100);
});

// Click on cards → upload image and replace +
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = e => {
      let file = e.target.files[0];
      if (!file) return;

      let reader = new FileReader();
      reader.onload = ev => {
        card.innerHTML = `<img src="${ev.target.result}" 
          style="width:100%; height:100%; border-radius:15px; object-fit:cover;">`;
      };
      reader.readAsDataURL(file);
    };

    input.click();
  });
});

// --- GitHub sign-in helpers ---
async function fetchUser() {
  try {
    const res = await fetch('/api/user');
    return await res.json();
  } catch (err) {
    return { user: null };
  }
}

function renderAuthArea(user) {
  const area = document.getElementById('auth-area');
  if (!area) return;
  area.innerHTML = '';
  if (user) {
    const img = document.createElement('img');
    img.src = user.avatar_url || '';
    img.alt = user.login || 'user';
    img.style.width = '36px';
    img.style.height = '36px';
    img.style.borderRadius = '50%';
    img.style.marginRight = '10px';
    const name = document.createElement('span');
    name.textContent = user.name || user.login || '';
    name.style.marginRight = '12px';
    const out = document.createElement('a');
    out.href = '/auth/logout';
    out.textContent = 'Sign out';
    area.appendChild(img);
    area.appendChild(name);
    area.appendChild(out);
  } else {
    const btn = document.createElement('a');
    btn.href = '/auth/github';
    btn.textContent = 'Sign in with GitHub';
    btn.className = 'github-btn';
    area.appendChild(btn);
  }
}

// Initialize auth area
(async () => {
  const data = await fetchUser();
  renderAuthArea(data.user);
  // If we're on profile page, render profile details
  if (document.getElementById('profile')) {
    const p = document.getElementById('profile');
    if (data.user) {
      p.innerHTML = `\n+        <img src="${data.user.avatar_url || ''}" style="width:120px;border-radius:8px;">\n+        <h2>${data.user.name || data.user.login}</h2>\n+        <p>GitHub: <strong>${data.user.login}</strong></p>\n+      `;
    } else {
      p.innerHTML = `<p>You are not signed in. <a href="/auth/github">Sign in with GitHub</a></p>`;
    }
  }
})();
// Get current cart count from localStorage
let cartCount = parseInt(localStorage.getItem("cartCount")) || 0;

// Display the count on the cart icon
document.getElementById("cart-count").innerText = cartCount;

// Example: function to add items to cart
function addToCart() {
    cartCount++;
    localStorage.setItem("cartCount", cartCount);
    document.getElementById("cart-count").innerText = cartCount;
}

function editProfile() {
    alert("Redirect to edit profile page or open modal.");
}

function changePassword() {
    alert("Redirect to change password page or open modal.");
}

function logout() {
    alert("Perform logout logic here.");
}
// Sample cart stored in localStorage
let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

// Function to render the cart
function renderCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    cartItemsContainer.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>Price: $${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-actions">
                <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${index}, this.value)">
                <button onclick="removeItem(${index})">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotal.innerText = total.toFixed(2);
}

// Update quantity
function updateQuantity(index, value) {
    cart[index].quantity = parseInt(value);
    localStorage.setItem("cartItems", JSON.stringify(cart));
    renderCart();
}

// Remove item
function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cartItems", JSON.stringify(cart));
    renderCart();
}

// Checkout button
function checkout() {
    if(cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    alert("Proceeding to checkout...");
    // Add your checkout logic here
}

// Initialize cart on page load
renderCart();

const toggleBtn = document.querySelector('.menu-toggle');
const menu = document.getElementById('primary-menu');

toggleBtn.addEventListener('click', () => {
	const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';

	// Toggle state
	toggleBtn.setAttribute('aria-expanded', !isOpen);
	menu.classList.toggle('show');
});
