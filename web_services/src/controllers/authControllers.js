const userServices = require('../services/userServices');

class AuthControllers {
  async register(req, res) {
    try {
      const user = await userServices.register(req.body);
      return res.status(201).json({ message: 'Usuario registrado', user });
    } catch (error) {
      const code = error.status || 500;
      return res.status(code).json({ error: error.message || 'Error registrando usuario' });
    }
  }

  async login(req, res) {
    try {
      const { user, token } = await userServices.login(req.body);
      return res.status(200).json({ message: 'Login exitoso', user, token });
    } catch (error) {
      const code = error.status || 500;
      return res.status(code).json({ error: error.message || 'Error en login' });
    }
  }

  async me(req, res) {
    try {
      const user = await userServices.getById(req.user.id);
      return res.status(200).json(user);
    } catch (error) {
      const code = error.status || 500;
      return res.status(code).json({ error: error.message || 'Error obteniendo perfil' });
    }
  }

  async updateMe(req, res) {
    try {
      const user = await userServices.updateProfile(req.user.id, req.body);
      return res.status(200).json({ message: 'Perfil actualizado', user });
    } catch (error) {
      const code = error.status || 500;
      return res.status(code).json({ error: error.message || 'Error actualizando perfil' });
    }
  }
    async forgotPassword(req, res) {
    try {
      const { email } = req.body || {};
      if (!email) return res.status(400).json({ error: 'Email requerido' });

      const token = await userServices.generarTokenRecuperacion(email);
      // Para práctica, devuélvelo. En prod lo enviarías por correo.
      return res.json({ message: 'Token de recuperación generado', token });
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, password } = req.body || {};
      if (!token || !password) {
        return res.status(400).json({ error: 'token y password son requeridos' });
      }

      await userServices.resetPassword(token, password);
      return res.json({ message: 'Contraseña restablecida con éxito' });
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }
}

module.exports = new AuthControllers();
