const { DataTypes } = require('sequelize');
const sequelize = require("../config/db");

const Funcion = sequelize.define('function', {
id:             {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
peliculaId:     {type: DataTypes.INTEGER, allowNull: false},
salaId:         {type: DataTypes.INTEGER, allowNull: false},
inicio:         {type: DataTypes.DATE, allowNull: false}, //inicio de la funcion
fin:            {type: DataTypes.DATE, allowNull: false}, //fin de la funcion
precio:         {type: DataTypes.DECIMAL(10,2), allowNull: true},
estado:         {type: DataTypes.STRING(20), allowNull: false, defaultValue: 'activa'},
}, {
    tableName:'funciones',
    timestamps: false,

});

module.exports = Funcion;