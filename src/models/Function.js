// src/models/Function.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Movie = require('./Movie');
const Room = require('./Room');

const FunctionModel = sequelize.define('Function', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  hora: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'functions' });

Movie.hasMany(FunctionModel, { foreignKey: 'movieId' });
Room.hasMany(FunctionModel, { foreignKey: 'roomId' });
FunctionModel.belongsTo(Movie, { foreignKey: 'movieId' });
FunctionModel.belongsTo(Room, { foreignKey: 'roomId' });

module.exports = FunctionModel;
