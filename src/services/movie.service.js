// src/services/movie.service.js
const Movie = require('../models/Movie');

async function crear(data) { return await Movie.create(data); }
async function listar() { return await Movie.findAll(); }
async function obtenerUna(id) {
  const item = await Movie.findByPk(id);
  if (!item) { const e = new Error('Película no encontrada'); e.status = 404; throw e; }
  return item;
}
async function actualizar(id, data) { const i = await obtenerUna(id); return await i.update(data); }
async function eliminar(id) { const i = await obtenerUna(id); await i.destroy(); return true; }

module.exports = { crear, listar, obtenerUna, actualizar, eliminar };
