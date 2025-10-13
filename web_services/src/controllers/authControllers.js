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
}

module.exports = new AuthControllers();
