// web_services/src/services/userServices.js
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const sanitize = (u) => {
  if (!u) return null;
  const plain = u.toJSON ? u.toJSON() : u;
  const { password, ...rest } = plain;
  return rest;
};

async function register(data) {
  const nombre = data.nombre?.trim();
  const email = String(data.email || '').trim().toLowerCase();
  const password = String(data.password || '');

  // Chequeo optimista (además del índice único en DB)
  const exists = await Usuario.findOne({ where: { email } });
  if (exists) {
    const err = new Error('El email ya está registrado');
    err.status = 409;
    throw err;
  }

  // Si tu MODELO tiene hooks beforeCreate/beforeUpdate que hashean,
  // basta con pasar la contraseña en texto plano aquí.
  // (Si NO tienes hooks, entonces hashea aquí con bcrypt antes de crear.)
  try {
    const user = await Usuario.create({ nombre, email, password });
    return sanitize(user);
  } catch (err) {
    // Colisión por índice único (carrera) o validación de Sequelize
    if (err.name === 'SequelizeUniqueConstraintError' || err.original?.code === 'ER_DUP_ENTRY') {
      const e = new Error('El email ya está registrado');
      e.status = 409;
      throw e;
    }
    throw err;
  }
}

async function login({ email, password }) {
  const normEmail = String(email || '').trim().toLowerCase();

  const user = await Usuario.findOne({ where: { email: normEmail } });
  if (!user) {
    const err = new Error('Credenciales inválidas');
    err.status = 401;
    throw err;
  }

  const ok = await bcrypt.compare(String(password || ''), user.password);
  if (!ok) {
    const err = new Error('Credenciales inválidas');
    err.status = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '2h' }
  );

  return { user: sanitize(user), token };
}

async function getById(id) {
  const user = await Usuario.findByPk(id);
  if (!user) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }
  return sanitize(user);
}

async function updateProfile(id, data) {
  const user = await Usuario.findByPk(id);
  if (!user) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }

  if (data.nombre) user.nombre = data.nombre.trim();
  if (data.password) {
    // Si tienes hooks en el modelo, asignar así disparará el hash en beforeUpdate
    user.password = String(data.password);
  }
  await user.save();

  return sanitize(user);
}

async function generarTokenRecuperacion(email) {
  const normEmail = String(email || '').trim().toLowerCase();
  const user = await Usuario.findOne({ where: { email: normEmail } });
  if (!user) {
    const e = new Error('Correo no encontrado');
    e.status = 404;
    throw e;
  }

  // Token corto y de un solo uso “lógico” (si cambias password deja de tener sentido)
  const token = jwt.sign(
    { id: user.id, action: 'reset-password' },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  // En prod se enviaría por correo. Para práctica, devuélvelo.
  return token;
}

async function resetPassword(token, nuevaContrasena) {
  try {
    const decoded = jwt.verify(String(token || ''), process.env.JWT_SECRET);
    if (decoded.action !== 'reset-password') throw new Error('bad action');

    const user = await Usuario.findByPk(decoded.id);
    if (!user) {
      const e = new Error('Usuario no encontrado');
      e.status = 404;
      throw e;
    }

    // IMPORTANTE: no hashees aquí. Deja que el hook beforeUpdate haga el hash.
    user.password = String(nuevaContrasena || '');
    await user.save();

    return { ok: true };
  } catch (_err) {
    const e = new Error('Token inválido o expirado');
    e.status = 400;
    throw e;
  }
}

module.exports = { register, login, getById, updateProfile, generarTokenRecuperacion, resetPassword, };
