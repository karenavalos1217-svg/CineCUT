// src/services/user.service.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const limpiar = (u) => {
  if (!u) return null;
  const { password, ...rest } = u.toJSON ? u.toJSON() : u;
  return rest;
};

async function registrar(datos) {
  const { nombre, email, password, rol } = datos;
  const existe = await User.findOne({ where: { email: String(email).toLowerCase().trim() } });
  if (existe) {
    const err = new Error('El email ya está registrado');
    err.status = 409; throw err;
  }
  const user = await User.create({ nombre, email, password, rol });
  return limpiar(user);
}

async function iniciarSesion({ email, password }) {
  const usuario = await User.findOne({ where: { email: String(email).toLowerCase().trim() } });
  if (!usuario) { const e = new Error('Credenciales inválidas'); e.status = 401; throw e; }
  const ok = await bcrypt.compare(String(password), usuario.password);
  if (!ok) { const e = new Error('Credenciales inválidas'); e.status = 401; throw e; }
  const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRETO, { expiresIn: '8h' });
  return { token, usuario: limpiar(usuario) };
}

async function obtenerPorId(id) {
  const user = await User.findByPk(id);
  if (!user) { const e = new Error('Usuario no encontrado'); e.status = 404; throw e; }
  return limpiar(user);
}

async function actualizarPerfil(id, datos) {
  const user = await User.findByPk(id);
  if (!user) { const e = new Error('Usuario no encontrado'); e.status = 404; throw e; }
  if (datos.nombre) user.nombre = String(datos.nombre);
  await user.save();
  return limpiar(user);
}

async function cambiarPassword(id, actual, nueva) {
  const user = await User.findByPk(id);
  if (!user) { const e = new Error('Usuario no encontrado'); e.status = 404; throw e; }
  const ok = await bcrypt.compare(String(actual), user.password);
  if (!ok) { const e = new Error('Contraseña actual incorrecta'); e.status = 400; throw e; }
  user.password = String(nueva);
  await user.save();
  return true;
}

module.exports = { registrar, iniciarSesion, obtenerPorId, actualizarPerfil, cambiarPassword };
