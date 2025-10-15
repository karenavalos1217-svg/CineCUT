const salaServices = require('../services/salaServices');

class SalaControllers {
  async create(req, res) {
    try { const sala = await salaServices.createSala(req.body);
      return res.status(201).json({ message: 'Sala creada', sala });
    } catch (error) { return res.status(error.status || 500).json({ error: error.message }); }
  }
  async list(req, res) {
    try { const data = await salaServices.listSalas(req.query);
      return res.json(data);
    } catch (error) { return res.status(error.status || 500).json({ error: error.message }); }
  }
  async getOne(req, res) {
    try { const sala = await salaServices.getSalaById(req.params.id);
      return res.json(sala);
    } catch (error) { return res.status(error.status || 500).json({ error: error.message }); }
  }
  async update(req, res) {
    try { const sala = await salaServices.updateSala(req.params.id, req.body);
      return res.json({ message: 'Sala actualizada', sala });
    } catch (error) { return res.status(error.status || 500).json({ error: error.message }); }
  }
  async remove(req, res) {
    try { const result = await salaServices.deleteSala(req.params.id, { soft: false });
      return res.json({ message: 'Sala eliminada', ...result });
    } catch (error) { return res.status(error.status || 500).json({ error: error.message }); }
  }
}
module.exports = new SalaControllers();
