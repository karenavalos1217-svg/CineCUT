const Usuario = require('../models/Usuario');

//Middleware que requiere rol de administrador
 async function requiereAdmin(req, res, next) {
  try {
    const usuarioId = req.user?.id;

    if (!usuarioId) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado'
      });
    }

    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    if (usuario.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Acceso denegado. Se requiere rol de administrador'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Error verificando rol'
    });
  }
}

module.exports = { requiereAdmin };