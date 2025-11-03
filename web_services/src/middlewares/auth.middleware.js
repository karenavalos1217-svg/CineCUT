
const jwt = require('jsonwebtoken');

//Middleware para verificar el token JWT
function verificarToken(req, res, next) {
  const encabezadoAuth = req.headers.authorization || '';
  const token = encabezadoAuth.startsWith('Bearer ')
    ? encabezadoAuth.slice(7): null;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Token requerido'
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // id, email, rol 
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token inválido o expirado'
    });
  }
}

module.exports = { verificarToken };