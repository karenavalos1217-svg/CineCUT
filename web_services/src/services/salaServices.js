const Sala = require('../models/Sala');
const { Op } = require('sequelize');

const sanitize = (x) => (x?.toJSON ? x.toJSON() : x);

async function createSala(data) {
  const payload = {
    nombre: String(data.nombre || '').trim(),
    numero: Number(data.numero),
    capacidad: Number(data.capacidad),
    tipo: data.tipo || null,
    activa: data.activa !== undefined ? !!data.activa : true,
  };

  if (!payload.nombre || !payload.numero || !payload.capacidad) {
    const e = new Error('nombre, numero y capacidad son obligatorios');
    e.status = 400; throw e;
  }
  if (payload.capacidad < 1) {
    const e = new Error('capacidad debe ser >= 1');
    e.status = 400; throw e;
  }

  // Unicidad por numero (y/o nombre si quieres reforzar)
  const exists = await Sala.findOne({ where: { [Op.or]: [{ numero: payload.numero }, { nombre: payload.nombre }] } });
  if (exists) { const e = new Error('La sala ya existe (por número o nombre)'); e.status = 409; throw e; }

  const sala = await Sala.create(payload);
  return sanitize(sala);
}

async function listSalas(query) {
  const {
    page = 1, limit = 10, q, activa, tipo, sort // sort: "capacidad:desc" | "numero:asc" | etc.
  } = query;

  const where = {};
  if (q) {
    const like = `%${q}%`;
    where[Op.or] = [{ nombre: { [Op.like]: like } }, { tipo: { [Op.like]: like } }];
  }
  if (tipo) where.tipo = tipo;
  if (activa !== undefined) where.activa = (activa === 'true' || activa === true);

  const offset = (Number(page) - 1) * Number(limit);
  let order = [['numero', 'ASC']];

  if (sort) {
    const [col, dirRaw] = String(sort).split(':');
    const dir = (dirRaw || 'asc').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const allowed = new Set(['numero', 'capacidad', 'nombre']);
    if (allowed.has(col)) order = [[col, dir]];
  }

  const { rows, count } = await Sala.findAndCountAll({
    where, offset, limit: Number(limit), order
  });
  return { items: rows.map(sanitize), total: count, page: Number(page), limit: Number(limit) };
}

async function getSalaById(id) {
  const sala = await Sala.findByPk(id);
  if (!sala) { const e = new Error('Sala no encontrada'); e.status = 404; throw e; }
  return sanitize(sala);
}

async function updateSala(id, data) {
  const sala = await Sala.findByPk(id);
  if (!sala) { const e = new Error('Sala no encontrada'); e.status = 404; throw e; }

  ['nombre','numero','capacidad','tipo','activa'].forEach((k) => {
    if (data[k] !== undefined) sala[k] = data[k];
  });

  if (sala.capacidad < 1) { const e = new Error('capacidad debe ser >= 1'); e.status = 400; throw e; }
  await sala.save();
  return sanitize(sala);
}

async function deleteSala(id, { soft = false } = {}) {
  const sala = await Sala.findByPk(id);
  if (!sala) { const e = new Error('Sala no encontrada'); e.status = 404; throw e; }

  if (soft) {
    sala.activa = false;
    await sala.save();
    return { ok: true, softDeleted: true };
  }
  await sala.destroy();
  return { ok: true, deleted: true };
}

module.exports = { createSala, listSalas, getSalaById, updateSala, deleteSala };
