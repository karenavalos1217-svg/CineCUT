// web_services/src/controllers/peliculaControllers.js
const peliculaServices = require('../services/peliculaServices');

class PeliculaControllers {
  async create(req, res) {
    try {
      const movie = await peliculaServices.createMovie(req.body);
      return res.status(201).json({ message: 'Película creada', movie });
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message || 'Error creando película' });
    }
  }

  async list(req, res) {
    try {
      const data = await peliculaServices.listMovies(req.query);
      return res.json(data);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message || 'Error listando películas' });
    }
  }

  async getOne(req, res) {
    try {
      const movie = await peliculaServices.getMovieById(req.params.id);
      return res.json(movie);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message || 'Error obteniendo película' });
    }
  }

  async update(req, res) {
    try {
      const movie = await peliculaServices.updateMovie(req.params.id, req.body);
      return res.json({ message: 'Película actualizada', movie });
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message || 'Error actualizando película' });
    }
  }

  async remove(req, res) {
    try {
      const result = await peliculaServices.deleteMovie(req.params.id, { soft: false }); // pon soft:true si prefieres
      return res.json({ message: 'Película eliminada', ...result });
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message || 'Error eliminando película' });
    }
  }
}

module.exports = new PeliculaControllers();
