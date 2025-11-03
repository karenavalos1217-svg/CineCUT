// src/services/room.service.js
const Room = require('../models/Room');

async function crear(data) { return await Room.create(data); }
async function listar() { return await Room.findAll(); }
async function obtenerUna(id) {
  const item = await Room.findByPk(id);
  if (!item) { const e = new Error('Sala no encontrada'); e.status = 404; throw e; }
  return item;
}
async function actualizar(id, data) { const i = await obtenerUna(id); return await i.update(data); }
async function eliminar(id) { const i = await obtenerUna(id); await i.destroy(); return true; }

module.exports = { crear, listar, obtenerUna, actualizar, eliminar };
