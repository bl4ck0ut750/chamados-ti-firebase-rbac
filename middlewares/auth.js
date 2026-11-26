const { getFirebaseAdmin } = require('../config/firebaseAdmin');
const { User } = require('../models');

// Lê o cookie que contém o token do Firebase.
function getCookie(req, name) {
  const cookies = (req.headers.cookie || '').split(';');
  const cookie = cookies.find((item) => item.trim().startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.trim().slice(name.length + 1)) : null;
}

// Protege as páginas que precisam de usuário logado.
async function authenticate(req, res, next) {
  const token = getCookie(req, 'firebase_token');

  if (!token) {
    return res.redirect(`/login?next=${encodeURIComponent(req.originalUrl)}`);
  }

  const firebase = getFirebaseAdmin();
  if (!firebase) {
    return res.status(503).render('error', {
      title: 'Firebase não configurado',
      error: { message: 'Configure as variáveis FIREBASE_* no ambiente.' },
    });
  }

  try {
    const data = await firebase.auth().verifyIdToken(token);
    let user = await User.findOne({ where: { uid: data.uid } });

    // O primeiro acesso sempre começa como usuário comum.
    if (!user) {
      user = await User.create({
        uid: data.uid,
        nome: data.name || data.email.split('@')[0],
        email: data.email,
        perfil: 'user',
      });
    }

    req.user = user;
    res.locals.user = user;
    next();
  } catch (error) {
    console.log('Token Firebase inválido:', error.message);
    res.clearCookie('firebase_token');
    res.redirect('/login?erro=Faça login novamente');
  }
}

// Restringe uma rota para um ou mais perfis.
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.perfil)) {
      return res.status(403).render('error', {
        title: 'Acesso negado',
        error: { message: 'Seu perfil não tem permissão para esta página.' },
      });
    }

    next();
  };
}

module.exports = { authenticate, requireRole, getCookie };
