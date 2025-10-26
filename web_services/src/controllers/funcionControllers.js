const svc = require('../services/funcionServices');

class FuncionControllers {
  async create(req, res) {
    try {
      const { peliculaId, salaId, inicio, precio } = req.body;
      const funcion = await svc.create({ peliculaId, salaId, inicio, precio });
      return res.status(201).json({ funcion });
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  async list(req, res) {
    try {
      const { peliculaId, salaId, desde, hasta, estado } = req.query;
      const funciones = await svc.list({ peliculaId, salaId, desde, hasta, estado });
      return res.json({ funciones });
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  async getOne(req, res) {
    try {
      const funcion = await svc.getById(req.params.id);
      return res.json({ funcion });
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const funcion = await svc.update(req.params.id, req.body);
      return res.json({ funcion });
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  async remove(req, res) {
    try {
      const result = await svc.remove(req.params.id);
      return res.json(result);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }
}

module.exports = new FuncionControllers();
