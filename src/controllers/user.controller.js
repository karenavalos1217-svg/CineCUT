// src/controllers/user.controller.js
const userService = require('../services/user.service');

class UserController {
  async obtenerPerfil(req, res) {
    try { const u = await userService.obtenerPorId(req.user.id);
      return res.json({ success: true, data: u });
    } catch (error) { return res.status(error.status || 500).json({ success: false, error: error.message }); }
  }
  async actualizarPerfil(req, res) {
    try { const u = await userService.actualizarPerfil(req.user.id, req.body);
      return res.json({ success: true, message: 'Perfil actualizado', data: u });
    } catch (error) { return res.status(error.status || 500).json({ success: false, error: error.message }); }
  }
  async cambiarPassword(req, res) {
    try { const { actual, nueva } = req.body; await userService.cambiarPassword(req.user.id, actual, nueva);
      return res.json({ success: true, message: 'Contraseña cambiada' });
    } catch (error) { return res.status(error.status || 500).json({ success: false, error: error.message }); }
  }
}
module.exports = new UserController();
