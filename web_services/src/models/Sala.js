const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Sala = sequelize.define('sala', {
  id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre:    { type: DataTypes.STRING(100), allowNull: false },  // p.ej. "Sala 1"
  numero:    { type: DataTypes.INTEGER, allowNull: false, unique: true }, // identificador corto
  capacidad: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
  tipo:      { type: DataTypes.STRING(20), allowNull: true },     // "2D", "3D", "IMAX", etc.
  activa:    { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, {
  tableName: 'salas',
  timestamps: false,
});

module.exports = Sala;
