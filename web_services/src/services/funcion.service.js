const { Op } = require('sequelize');
const Funcion = require('../models/Funcion');
const Pelicula = require('../models/Pelicula');
const Sala = require('../models/Sala');

// agregar minutos a una fecha
function agregarMinutos(fecha, minutos) {
  return new Date(new Date(fecha).getTime() + minutos * 60000);
}

// Calcular la hora de fin de una función basandose en la duración de la película 
async function calcularFin(peliculaId, inicio, bufferMinutos = 10) {
  const pelicula = await Pelicula.findByPk(peliculaId);
  if (!pelicula) {
    const error = new Error('Película no encontrada');
    error.status = 404;
    throw error;
  }

  const duracion = pelicula.duracionMin ?? pelicula.duracion ?? 0;
  if (!duracion) {
    const error = new Error('La película no tiene duración configurada');
    error.status = 400;
    throw error;
  }

  return agregarMinutos(inicio, Number(duracion) + bufferMinutos);
}

// Verifica si existe bloqueo de horarios en una sala
async function existeTraslape(salaId, inicio, fin, excluirId) {
  const where = {
    salaId,
    estado: 'activa',
    [Op.and]: [
      { inicio: { [Op.lt]: fin } },   // La función arranca antes de que acabe la nueva
      { fin: { [Op.gt]: inicio } }     // La función termina después de que empiece la nueva
    ]
  };

  if (excluirId) {
    where.id = { [Op.ne]: excluirId };
  }

  const conflicto = await Funcion.findOne({ where });
  return !!conflicto;
}

//crea una nueva función
async function crear({ peliculaId, salaId, inicio, precio }) {
  // Validar que la sala exista
  const sala = await Sala.findByPk(salaId);
  if (!sala) {
    const error = new Error('Sala no encontrada');
    error.status = 404;
    throw error;
  }

  // Calcular hora de fin
  const fin = await calcularFin(peliculaId, inicio);

  // Verificar traslape de horarios
  if (await existeTraslape(salaId, inicio, fin)) {
    const error = new Error('La sala ya tiene una función que se interpone en ese horario');
    error.status = 409;
    throw error;
  }

  const funcion = await Funcion.create({
    peliculaId,
    salaId,
    inicio,
    fin,
    precio
  });

  return funcion;
}

// Lista funciones con filtros
async function listar({ peliculaId, salaId, desde, hasta, estado }) {
  const where = {};

  if (peliculaId) where.peliculaId = peliculaId;
  if (salaId) where.salaId = salaId;
  if (estado) where.estado = estado;

  if (desde || hasta) {
    where.inicio = {};
    if (desde) where.inicio[Op.gte] = new Date(desde);
    if (hasta) where.inicio[Op.lte] = new Date(hasta);
  }

  return await Funcion.findAll({
    where,
    order: [['inicio', 'ASC']]
  });
}

//Obtiene una función por ID
async function obtenerPorId(id) {
  const funcion = await Funcion.findByPk(id);
  if (!funcion) {
    const error = new Error('Función no encontrada');
    error.status = 404;
    throw error;
  }

  return funcion;
}

// Actualiza una función
async function actualizar(id, datos) {
  const funcion = await obtenerPorId(id);

  const peliculaId = datos.peliculaId ?? funcion.peliculaId;
  const salaId = datos.salaId ?? funcion.salaId;
  const inicio = datos.inicio ? new Date(datos.inicio) : funcion.inicio;
  const precio = datos.precio ?? funcion.precio;
  const estado = datos.estado ?? funcion.estado;

  // Validar que la sala exista
  const sala = await Sala.findByPk(salaId);
  if (!sala) {
    const error = new Error('Sala no encontrada');
    error.status = 404;
    throw error;
  }

  // Calcular nueva hora de fin
  const fin = await calcularFin(peliculaId, inicio);
  // Verificar traslape (excluyendo la función actual)
  if (await existeTraslape(salaId, inicio, fin, funcion.id)) {
    const error = new Error('La sala ya tiene una función que se interpone en ese horario');
    error.status = 409;
    throw error;
  }

  // Actualizar campos
  funcion.peliculaId = peliculaId;
  funcion.salaId = salaId;
  funcion.inicio = inicio;
  funcion.fin = fin;
  funcion.precio = precio;
  funcion.estado = estado;

  await funcion.save();
  return funcion;
}

// Elimina una función (baja lógica)
async function eliminar(id) {
  const funcion = await obtenerPorId(id);

  // Baja lógica: cambiar estado a cancelada
  funcion.estado = 'cancelada';
  await funcion.save();

  return { ok: true, cancelada: true };
}

module.exports = {
  crear,
  listar,
  obtenerPorId,
  actualizar,
  eliminar
};