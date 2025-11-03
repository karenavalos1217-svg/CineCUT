// src/services/function.service.js
const FunctionModel = require('../models/Function');

async function crear(data) { return await FunctionModel.create(data); }
async function listar() { return await FunctionModel.findAll(); }
async function obtenerUna(id) {
  const item = await FunctionModel.findByPk(id);
  if (!item) { const e = new Error('Función no encontrada'); e.status = 404; throw e; }
  return item;
}
async function actualizar(id, data) { const i = await obtenerUna(id); return await i.update(data); }
async function eliminar(id) { const i = await obtenerUna(id); await i.destroy(); return true; }

module.exports = { crear, listar, obtenerUna, actualizar, eliminar };
