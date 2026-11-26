const constants = require('../config/constants');
const helpers = require('../utils/helpers');
const { publicConfig } = require('../config/firebaseAdmin');

// Disponibiliza constantes, helpers e mensagens de feedback em todas as views.
// As mensagens são enviadas via query string (?msg=... / ?erro=...) após redirects,
// evitando a necessidade de sessão/login.
module.exports = (req, res, next) => {
  Object.assign(res.locals, constants, helpers);
  res.locals.msg = req.query.msg || null;
  res.locals.erro = req.query.erro || null;
  res.locals.currentPath = req.path;
  res.locals.title = 'HelpDesk TI';
  res.locals.firebaseConfig = publicConfig();
  res.locals.user = req.user || null;
  next();
};
