// src/config/db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NOMBRE,
  process.env.DB_USUARIO,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
  }
);

async function conectarDB() {
  try {
    await sequelize.authenticate();
    console.log('📦 Base de datos conectada');
  } catch (error) {
    console.error('❌ Error al conectar DB:', error.message);
    process.exit(1);
  }
}

module.exports = { sequelize, conectarDB };
