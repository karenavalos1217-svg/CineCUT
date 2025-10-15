const Usuario = require('../models/Usuario');

async function requireAdmin(req, res, next) {
  try {
    // req.user viene del middleware auth (JWT)
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    const dbUser = await Usuario.findByPk(userId);
    if (!dbUser) return res.status(401).json({ error: 'Usuario no encontrado' });

    if (dbUser.rol !== 'admin') {
      return res.status(403).json({ error: 'Requiere rol administrador' });
    }
    return next();
  } catch (e) {
    return res.status(500).json({ error: 'Error verificando rol' });
  }
}

module.exports = { requireAdmin };
