require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const SERVER_ROOT = process.env.SERVER_ROOT || `http://localhost:${PORT}`;

app.get('/auth/github', (req, res) => {
  if (!CLIENT_ID) return res.status(500).send('Missing GITHUB_CLIENT_ID in .env');
  const redirectUri = `${SERVER_ROOT}/auth/callback`;
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: redirectUri,
    scope: 'read:user user:email'
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
});

app.get('/auth/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('No code provided');
  try {
    const tokenResp = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code })
    });
    const tokenJson = await tokenResp.json();
    if (tokenJson.error) return res.status(500).send(tokenJson.error_description || 'OAuth error');
    const accessToken = tokenJson.access_token;

    const userResp = await fetch('https://api.github.com/user', {
      headers: { 'Authorization': `token ${accessToken}`, 'User-Agent': 'node.js' }
    });
    const user = await userResp.json();

    req.session.user = { login: user.login, name: user.name, avatar_url: user.avatar_url, id: user.id };
    res.redirect('/profile.html');
  } catch (err) {
    console.error(err);
    res.status(500).send('Authentication failed');
  }
});

app.get('/api/user', (req, res) => {
  if (req.session.user) return res.json({ user: req.session.user });
  res.json({ user: null });
});

app.get('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    res.redirect('/');
  });
});

app.listen(PORT, () => console.log(`Server running on ${SERVER_ROOT}`));
