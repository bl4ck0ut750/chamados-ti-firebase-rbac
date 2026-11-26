const express = require('express');
const { getFirebaseAdmin } = require('../config/firebaseAdmin');
const { readCookie } = require('../middlewares/auth');

const router = express.Router();

router.get('/login', (req, res) => {
  if (readCookie(req, 'firebase_token')) return res.redirect('/');
  res.render('login', { title: 'Entrar', next: req.query.next || '/', loginError: req.query.erro || null });
});

router.post('/auth/session', express.json(), async (req, res) => {
  const firebase = getFirebaseAdmin();
  if (!firebase || !req.body.idToken) return res.status(400).json({ error: 'Sessão Firebase não configurada.' });
  try {
    await firebase.auth().verifyIdToken(req.body.idToken);
    res.cookie('firebase_token', req.body.idToken, { httpOnly: false, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 1000 * 60 * 60 * 24 * 5 });
    res.json({ ok: true });
  } catch (err) {
    res.status(401).json({ error: 'Token de autenticação inválido.' });
  }
});

router.post('/logout', (req, res) => { res.clearCookie('firebase_token'); res.redirect('/login'); });
router.get('/logout', (req, res) => { res.clearCookie('firebase_token'); res.redirect('/login'); });

module.exports = router;
