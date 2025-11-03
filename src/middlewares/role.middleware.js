// src/middlewares/role.middleware.js
function requiereAdmin(req, res, next) {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ success:false, error:'Requiere rol admin' });
  }
  next();
}
module.exports = { requiereAdmin };
