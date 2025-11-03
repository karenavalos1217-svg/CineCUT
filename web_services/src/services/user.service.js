// src/services/usuario.service.js
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/// Limpia el objeto usuario (elimina password)
 
const limpiar = (usuario) => {
  if (!usuario) return null;
  const plain = usuario.toJSON ? usuario.toJSON() : usuario;
  const { password, ...resto } = plain;
  return resto;
};

// Registra un nuevo usuario
async function registrar(datos) {
  const nombre = datos.nombre?.trim();
  const email = String(datos.email || '').trim().toLowerCase();
  const password = String(datos.password || '');

  // Validaciones básicas
  if (!nombre || !email || !password) {
    const error = new Error('Nombre, email y contraseña son obligatorios');
    error.status = 400;
    throw error;
  }

  // Verificar si el email ya existe
  const existe = await Usuario.findOne({ where: { email } });
  if (existe) {
    const error = new Error('El email ya está registrado');
    error.status = 409;
    throw error;
  }

  try {
    // El password se hashea automáticamente en el hook beforeCreate del modelo
    const usuario = await Usuario.create({ nombre, email, password });
    return limpiar(usuario);
  } catch (err) {
    // Manejo de error de índice único (carrera de condiciones)
    if (err.name === 'SequelizeUniqueConstraintError' || err.original?.code === 'ER_DUP_ENTRY') {
      const error = new Error('El email ya está registrado');
      error.status = 409;
      throw error;
    }
    throw err;
  }
}

//Inicia sesión de usuario
async function iniciarSesion({ email, password }) {
  const emailNormalizado = String(email || '').trim().toLowerCase();

  if (!emailNormalizado || !password) {
    const error = new Error('Email y contraseña son obligatorios');
    error.status = 400;
    throw error;
  }

  const usuario = await Usuario.findOne({ where: { email: emailNormalizado } });
  if (!usuario) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    throw error;
  }

  const esValido = await bcrypt.compare(String(password), usuario.password);
  if (!esValido) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '2h' }
  );

  return { usuario: limpiar(usuario), token };
}

// Obtiene un usuario por ID
async function obtenerPorId(id) {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
  }
  return limpiar(usuario);
}

// Actualiza el perfil de un usuario
async function actualizarPerfil(id, datos) {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
  }

  if (datos.nombre) {
    usuario.nombre = datos.nombre.trim();
  }

  if (datos.password) {
    usuario.password = String(datos.password);
  }

  await usuario.save();
  return limpiar(usuario);
}

/**
 * Genera token de recuperación de contraseña
 */
async function generarTokenRecuperacion(email) {
  const emailNormalizado = String(email || '').trim().toLowerCase();
  const usuario = await Usuario.findOne({ where: { email: emailNormalizado } });
  if (!usuario) {
    const error = new Error('Correo no encontrado');
    error.status = 404;
    throw error;
  }

  // Token de corta duración para recuperación
  const token = jwt.sign(
    { id: usuario.id, accion: 'recuperar-password' },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  return token;
}

// Restablece la contraseña usando token
async function restablecerPassword(token, nuevaPassword) {
  try {
    const decodificado = jwt.verify(String(token || ''), process.env.JWT_SECRET);
    if (decodificado.accion !== 'recuperar-password') {
      throw new Error('Token inválido');
    }
    const usuario = await Usuario.findByPk(decodificado.id);
    if (!usuario) {
      const error = new Error('Usuario no encontrado');
      error.status = 404;
      throw error;
    }

    // El hook beforeUpdate o (antes de actualizar) hasheará la contraseña
    usuario.password = String(nuevaPassword || '');
    await usuario.save();

    return { ok: true };
  } catch (err) {
    const error = new Error('Token inválido o expirado');
    error.status = 400;
    throw error;
  }
}

module.exports = {
  registrar,
  iniciarSesion,
  obtenerPorId,
  actualizarPerfil,
  generarTokenRecuperacion,
  restablecerPassword
};