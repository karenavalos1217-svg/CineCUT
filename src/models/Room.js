// src/models/Room.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Room = sequelize.define('Room', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  capacidad: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'rooms' });

module.exports = Room;
