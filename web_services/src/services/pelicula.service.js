const Pelicula = require('../models/Pelicula');
const { Op } = require('sequelize');

const limpiar = (pelicula) => (pelicula?.toJSON ? pelicula.toJSON() : pelicula);

// Crea una nueva película
async function crear(datos) {
  const payload = {
    titulo: String(datos.titulo || '').trim(),
    sinopsis: datos.sinopsis || null,
    director: datos.director || null,
    genero: datos.genero || null,
    clasificacion: datos.clasificacion || null,
    anio: datos.anio ?? null,
    duracionMin: datos.duracionMin ?? null,
    posterUrl: datos.posterUrl || null,
    disponible: datos.disponible !== undefined ? !!datos.disponible : true
  };

  if (!payload.titulo) {
    const error = new Error('El título es obligatorio');
    error.status = 400;
    throw error;
  }

  const pelicula = await Pelicula.create(payload);
  return limpiar(pelicula);
}

// Lista películas con filtros y paginación

async function listar(query) {
  let {
    page = 1,
    limit = 10,
    q,
    genero,
    clasificacion,
    anio,
    anioDesde,
    anioHasta,
    disponible,
    ordenar // ej: "anio:desc" o "titulo:asc"
  } = query;

  const where = {};

  // Búsqueda de texto en varias columnas
  if (q) {
    const like = `%${q}%`;
    where[Op.or] = [
      { titulo: { [Op.like]: like } },
      { sinopsis: { [Op.like]: like } },
      { director: { [Op.like]: like } }
    ];
  }

  // Filtros por género / clasificación (lista separada por comas)
  const parsearLista = (valor) =>
    String(valor).split(',').map(s => s.trim()).filter(Boolean);

  if (genero) {
    const arr = parsearLista(genero);
    where.genero = arr.length > 1 ? { [Op.in]: arr } : arr[0];
  }

  if (clasificacion) {
    const arr = parsearLista(clasificacion);
    where.clasificacion = arr.length > 1 ? { [Op.in]: arr } : arr[0];
  }

  // Año exacto o rango de años
  if (anio !== undefined) {
    const numero = Number(anio);
    if (!Number.isNaN(numero)) where.anio = numero;
  }

  if (anioDesde || anioHasta) {
    where.anio = { ...(where.anio || {}) };
    if (anioDesde && !Number.isNaN(Number(anioDesde))) {
      where.anio[Op.gte] = Number(anioDesde);
    }
    if (anioHasta && !Number.isNaN(Number(anioHasta))) {
      where.anio[Op.lte] = Number(anioHasta);
    }
  }

  // Disponible
  if (disponible !== undefined) {
    where.disponible = (disponible === 'true' || disponible === true);
  }

  // Paginación y orden
  const offset = (Number(page) - 1) * Number(limit);
  let order = [['id', 'DESC']];

  if (ordenar) {
    const [columna, direccionRaw] = String(ordenar).split(':');
    const direccion = (direccionRaw || 'asc').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    
    // Validar columnas permitidas
    const permitidas = new Set(['id', 'titulo', 'anio', 'duracionMin']);
    if (permitidas.has(columna)) {
      order = [[columna, direccion]];
    }
  }

  const { rows, count } = await Pelicula.findAndCountAll({
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

/**
 * Obtiene una película por ID
 */
async function obtenerPorId(id) {
  const pelicula = await Pelicula.findByPk(id);
  if (!pelicula) {
    const error = new Error('Película no encontrada');
    error.status = 404;
    throw error;
  }
  return limpiar(pelicula);
}

/**
 * Actualiza una película
 */
async function actualizar(id, datos) {
  const pelicula = await Pelicula.findByPk(id);
  if (!pelicula) {
    const error = new Error('Película no encontrada');
    error.status = 404;
    throw error;
  }

  const camposActualizables = [
    'titulo', 'sinopsis', 'director', 'genero', 
    'clasificacion', 'anio', 'duracionMin', 
    'posterUrl', 'disponible'
  ];

  camposActualizables.forEach((campo) => {
    if (datos[campo] !== undefined) {
      pelicula[campo] = datos[campo];
    }
  });

  await pelicula.save();
  return limpiar(pelicula);
}

/**
 * Elimina una película (física o lógica)
 */
async function eliminar(id, { suave = false } = {}) {
  const pelicula = await Pelicula.findByPk(id);
  if (!pelicula) {
    const error = new Error('Película no encontrada');
    error.status = 404;
    throw error;
  }

  if (suave) {
    // Baja lógica
    pelicula.disponible = false;
    await pelicula.save();
    return { ok: true, eliminacionSuave: true };
  }

  // Baja física
  await pelicula.destroy();
  return { ok: true, eliminado: true };
}

module.exports = {
  crear,
  listar,
  obtenerPorId,
  actualizar,
  eliminar
};