// web_services/src/models/Pelicula.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Pelicula = sequelize.define('pelicula', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titulo:       { type: DataTypes.STRING(150), allowNull: false },
  sinopsis:     { type: DataTypes.TEXT, allowNull: true },
  director:     { type: DataTypes.STRING(100), allowNull: true },
  genero:       { type: DataTypes.STRING(60), allowNull: true },
  clasificacion:{ type: DataTypes.STRING(10), allowNull: true },   // p.ej. "PG-13"
  anio:         { type: DataTypes.INTEGER, allowNull: true },       // 1888..2100
  duracionMin:  { type: DataTypes.INTEGER, allowNull: true },       // minutos
  posterUrl:    { type: DataTypes.STRING(500), allowNull: true },
  disponible:   { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, {
  tableName: 'peliculas',
  timestamps: false,
});

module.exports = Pelicula;
