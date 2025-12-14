# Skate City — GitHub Sign-In Example

This small project demonstrates adding GitHub OAuth sign-in to a static site by using a minimal Node/Express server to handle the OAuth exchange and sessions.

Files added/changed:

- `server.js` — Express server to handle `/auth/github`, `/auth/callback`, `/api/user`, and `/auth/logout`.
- `package.json` — Node dependencies and `start` script.
- `.env.example` — Example environment variables.
- `profile.html` — Simple profile page showing GitHub user info.
- Updated `index.html`, `category.html`, and `script.js` to add sign-in UI.

Setup

1. Register an OAuth App on GitHub:
   - Go to https://github.com/settings/developers and register a new OAuth App.
   - Set the Authorization callback URL to `http://localhost:3000/auth/callback` (or your `SERVER_ROOT` if different).
   - Copy the Client ID and Client Secret.

2. Create a `.env` file in the project root (next to `server.js`) using `.env.example` as a template:

```
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
SESSION_SECRET=some_random_secret
# SERVER_ROOT=http://localhost:3000
```

3. Install dependencies and run:

```powershell
npm install
npm start
```

4. Open `http://localhost:3000` in your browser and click "Sign in with GitHub".

Notes
- This example uses an in-memory session store (not suitable for production).
- Keep `GITHUB_CLIENT_SECRET` private. In production, use HTTPS and a secure session store.
