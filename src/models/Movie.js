// src/models/Movie.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Movie = sequelize.define('Movie', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titulo: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  duracionMin: { type: DataTypes.INTEGER }
}, { tableName: 'movies' });

module.exports = Movie;
