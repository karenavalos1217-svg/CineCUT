require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD || undefined,
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  dialect: 'mysql',
  logging: false,
});

async function conectarDB() {
  try {
    await sequelize.authenticate();
    console.log('MySQL conectado correctamente');
    return true;
  } catch (error) {
    console.error('Error conectando a MySQL:', error.message);
    throw error;
  }
}

module.exports = { sequelize, conectarDB };
