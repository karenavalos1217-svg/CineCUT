// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ success:false, error:'Token requerido' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRETO);
    req.user = payload; // { id, rol }
    next();
  } catch (e) {
    return res.status(401).json({ success:false, error:'Token inválido o expirado' });
  }
}

module.exports = { auth };
