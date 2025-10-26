const { Op } = require('sequelize');
const Funcion  = require('../models/Funcion');
const Pelicula = require('../models/Pelicula');
const Sala     = require('../models/Sala');

function addMinutes(date, mins) {
  return new Date(new Date(date).getTime() + mins * 60000);
}

async function calcFin(peliculaId, inicio, bufferMin = 10) {
  const movie = await Pelicula.findByPk(peliculaId);
  if (!movie) {
    const e = new Error('Película no encontrada');
    e.status = 404; throw e;
  }
  const dur =
    movie.duracionMin ?? movie.duracion ?? movie.duracion_min ?? 0;

  if (!dur) {
    const e = new Error('La película no tiene duración configurada');
    e.status = 400; throw e;
  }
  return addMinutes(inicio, Number(dur) + bufferMin);
}

async function existsOverlap(salaId, inicio, fin, excludeId) {
  const where = {
    salaId,
    estado: 'activa',
    [Op.and]: [
      { inicio: { [Op.lt]: fin } },   // arranca antes de que acabe la nueva
      { fin:    { [Op.gt]: inicio } } // termina después de que empieza la nueva
    ]
  };
  if (excludeId) where.id = { [Op.ne]: excludeId };
  const clash = await Funcion.findOne({ where });
  return !!clash;
}

async function create({ peliculaId, salaId, inicio, precio }) {
  // validar sala existente
  const sala = await Sala.findByPk(salaId);
  if (!sala){ 
    const e = new Error('Sala no encontrada'); 
    e.status = 404; throw e; }

  const fin = await calcFin(peliculaId, inicio);
  if (await existsOverlap(salaId, inicio, fin)) {
    const e = new Error('La sala ya tiene una función que se traslapa en ese horario');
    e.status = 409; throw e;
  }
  const func = await Funcion.create({ peliculaId, salaId, inicio, fin, precio });
  return func;
}

async function list({ peliculaId, salaId, desde, hasta, estado }) {
  const where = {};
  if (peliculaId) where.peliculaId = peliculaId;
  if (salaId)     where.salaId     = salaId;
  if (estado)     where.estado     = estado;
  if (desde || hasta) {
    where.inicio = {};
    if (desde) where.inicio[Op.gte] = new Date(desde);
    if (hasta) where.inicio[Op.lte] = new Date(hasta);
  }
  return await Funcion.findAll({ where, order: [['inicio', 'ASC']] });
}

async function getById(id) {
  const func = await Funcion.findByPk(id);
  if (!func) { const e = new Error('Función no encontrada'); e.status = 404; throw e; }
  return func;
}

async function update(id, data) {
  const func = await getById(id);

  const peliculaId = data.peliculaId ?? func.peliculaId;
  const salaId     = data.salaId     ?? func.salaId;
  const inicio     = data.inicio ? new Date(data.inicio) : func.inicio;
  const precio     = data.precio     ?? func.precio;
  const estado     = data.estado     ?? func.estado;

  // validar sala
  const sala = await Sala.findByPk(salaId);
  if (!sala) { const e = new Error('Sala no encontrada'); e.status = 404; throw e; }

  const fin = await calcFin(peliculaId, inicio);
  if (await existsOverlap(salaId, inicio, fin, func.id)) {
    const e = new Error('Traslape con otra función en esa sala');
    e.status = 409; throw e;
  }

  func.peliculaId = peliculaId;
  func.salaId     = salaId;
  func.inicio     = inicio;
  func.fin        = fin;
  func.precio     = precio;
  func.estado     = estado;

  await func.save();
  return func;
}

async function remove(id) {
  const func = await getById(id);
  // baja lógica
  func.estado = 'cancelada';
  await func.save();
  return { ok: true };
}

module.exports = { create, list, getById, update, remove };
