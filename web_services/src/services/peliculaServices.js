const Pelicula = require('../models/Pelicula');
const { Op } = require('sequelize');

function sanitize(p) {
  return p?.toJSON ? p.toJSON() : p;
}

async function createMovie(data) {
  const payload = {
    titulo: String(data.titulo || '').trim(),
    sinopsis: data.sinopsis || null,
    director: data.director || null,
    genero: data.genero || null,
    clasificacion: data.clasificacion || null,
    anio: data.anio ?? null,
    duracionMin: data.duracionMin ?? null,
    posterUrl: data.posterUrl || null,
    disponible: data.disponible !== undefined ? !!data.disponible : true,
  };
  if (!payload.titulo) {
    const e = new Error('El titulo es obligatorio');
    e.status = 400; throw e;
  }
  const movie = await Pelicula.create(payload);
  return sanitize(movie);
}

// ******* REEMPLAZA ESTA FUNCIÓN POR ESTA VERSIÓN *******
async function listMovies(query) {
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
    sort // ej: "anio:desc" o "titulo:asc"
  } = query;

  const where = {};

  // Búsqueda de texto en varias columnas
  if (q) {
    const like = `%${q}%`;
    where[Op.or] = [
      { titulo:   { [Op.like]: like } },
      { sinopsis: { [Op.like]: like } },
      { director: { [Op.like]: like } },
    ];
  }

  // Filtros por género / clasificación (lista separada por comas)
  const parseList = (v) =>
    String(v).split(',').map(s => s.trim()).filter(Boolean);

  if (genero) {
    const arr = parseList(genero);
    where.genero = arr.length > 1 ? { [Op.in]: arr } : arr[0];
  }

  if (clasificacion) {
    const arr = parseList(clasificacion);
    where.clasificacion = arr.length > 1 ? { [Op.in]: arr } : arr[0];
  }

  // Año exacto o rango de años
  if (anio !== undefined) {
    const n = Number(anio);
    if (!Number.isNaN(n)) where.anio = n;
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

  if (sort) {
    const [col, dirRaw] = String(sort).split(':');
    const dir = (dirRaw || 'asc').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    // valida columnas permitidas
    const allowed = new Set(['id', 'titulo', 'anio', 'duracionMin']);
    if (allowed.has(col)) order = [[col, dir]];
  }

  const { rows, count } = await Pelicula.findAndCountAll({
    where,
    offset,
    limit: Number(limit),
    order,
  });

  return {
    items: rows.map(sanitize),
    total: count,
    page: Number(page),
    limit: Number(limit),
  };
}
// ******************************************************

async function getMovieById(id) {
  const movie = await Pelicula.findByPk(id);
  if (!movie) { const e = new Error('Película no encontrada'); e.status = 404; throw e; }
  return sanitize(movie);
}

async function updateMovie(id, data) {
  const movie = await Pelicula.findByPk(id);
  if (!movie) { const e = new Error('Película no encontrada'); e.status = 404; throw e; }

  [
    'titulo','sinopsis','director','genero','clasificacion','anio','duracionMin','posterUrl','disponible'
  ].forEach((k) => {
    if (data[k] !== undefined) movie[k] = data[k];
  });

  await movie.save();
  return sanitize(movie);
}

async function deleteMovie(id, { soft = false } = {}) {
  const movie = await Pelicula.findByPk(id);
  if (!movie) { const e = new Error('Película no encontrada'); e.status = 404; throw e; }

  if (soft) {
    movie.disponible = false;
    await movie.save();
    return { ok: true, softDeleted: true };
  }
  await movie.destroy();
  return { ok: true, deleted: true };
}

module.exports = { createMovie, listMovies, getMovieById, updateMovie, deleteMovie };
