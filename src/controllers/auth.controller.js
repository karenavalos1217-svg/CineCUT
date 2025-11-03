// src/controllers/auth.controller.js
const userService = require('../services/user.service');

class AuthController {
  async registrar(req, res) {
    try { const u = await userService.registrar(req.body);
      return res.status(201).json({ success: true, message: 'Usuario registrado', data: u });
    } catch (error) { return res.status(error.status || 500).json({ success: false, error: error.message }); }
  }
  async iniciarSesion(req, res) {
    try { const r = await userService.iniciarSesion(req.body);
      return res.json({ success: true, message: 'Inicio de sesión exitoso', data: r });
    } catch (error) { return res.status(error.status || 500).json({ success: false, error: error.message }); }
  }
  async olvidoPassword(req, res) {
    return res.status(501).json({ success: false, error: 'No implementado en esta versión' });
  }
  async restablecerPassword(req, res) {
    return res.status(501).json({ success: false, error: 'No implementado en esta versión' });
  }
}
module.exports = new AuthController();
