const Sala = require('../models/Sala');
const { Op } = require('sequelize');

const limpiar = (sala) => (sala?.toJSON ? sala.toJSON() : sala);

// Crea una nueva sala
async function crear(datos) {
  const payload = {
    nombre: String(datos.nombre || '').trim(),
    numero: Number(datos.numero),
    capacidad: Number(datos.capacidad),
    tipo: datos.tipo || null,
    activa: datos.activa !== undefined ? !!datos.activa : true
  };

  // Validaciones
  if (!payload.nombre || !payload.numero || !payload.capacidad) {
    const error = new Error('Nombre, número y capacidad son obligatorios');
    error.status = 400;
    throw error;
  }

  if (payload.capacidad < 1) {
    const error = new Error('La capacidad debe ser mayor o igual a 1');
    error.status = 400;
    throw error;
  }

  // Verificar unicidad por número o nombre
  const existe = await Sala.findOne({
    where: {
      [Op.or]: [
        { numero: payload.numero },
        { nombre: payload.nombre }
      ]
    }
  });

  if (existe) {
    const error = new Error('Ya existe una sala con ese número o nombre');
    error.status = 409;
    throw error;
  }

  const sala = await Sala.create(payload);
  return limpiar(sala);
}

// Lista salas con filtros y paginación
async function listar(query) {
  const {
    page = 1,
    limit = 10,
    q,
    activa,
    tipo,
    ordenar // ej: "capacidad:desc" o "numero:asc"
  } = query;

  const where = {};

  // Búsqueda de texto
  if (q) {
    const like = `%${q}%`;
    where[Op.or] = [
      { nombre: { [Op.like]: like } },
      { tipo: { [Op.like]: like } }
    ];
  }

  // Filtros
  if (tipo) where.tipo = tipo;
  if (activa !== undefined) {
    where.activa = (activa === 'true' || activa === true);
  }

  // Paginación
  const offset = (Number(page) - 1) * Number(limit);
  let order = [['numero', 'ASC']];

  // Orden personalizado
  if (ordenar) {
    const [columna, direccionRaw] = String(ordenar).split(':');
    const direccion = (direccionRaw || 'asc').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    
    const permitidas = new Set(['numero', 'capacidad', 'nombre']);
    if (permitidas.has(columna)) {
      order = [[columna, direccion]];
    }
  }

  const { rows, count } = await Sala.findAndCountAll({
    where,
    offset,
    limit: Number(limit),
    order
  });

  return {
    items: rows.map(limpiar),
    total: count,
    pagina: Number(page),
    limite: Number(limit)
  };
}

// Obtiene una sala por ID
async function obtenerPorId(id) {
  const sala = await Sala.findByPk(id);
  if (!sala) {
    const error = new Error('Sala no encontrada');
    error.status = 404;
    throw error;
  }
  return limpiar(sala);
}

// Actualiza una sala
async function actualizar(id, datos) {
  const sala = await Sala.findByPk(id);
  if (!sala) {
    const error = new Error('Sala no encontrada');
    error.status = 404;
    throw error;
  }

  const camposActualizables = ['nombre', 'numero', 'capacidad', 'tipo', 'activa'];
  
  camposActualizables.forEach((campo) => {
    if (datos[campo] !== undefined) {
      sala[campo] = datos[campo];
    }
  });

  if (sala.capacidad < 1) {
    const error = new Error('La capacidad debe ser mayor o igual a 1');
    error.status = 400;
    throw error;
  }

  await sala.save();
  return limpiar(sala);
}

// Elimina una sala (física y/o lógica)
 
async function eliminar(id, { suave = false } = {}) {
  const sala = await Sala.findByPk(id);
  if (!sala) {
    const error = new Error('Sala no encontrada');
    error.status = 404;
    throw error;
  }

  if (suave) {
    // Baja lógica
    sala.activa = false;
    await sala.save();
    return { ok: true, eliminacionSuave: true };
  }

  // Baja física
  await sala.destroy();
  return { ok: true, eliminado: true };
}

module.exports = {
  crear,
  listar,
  obtenerPorId,
  actualizar,
  eliminar
};