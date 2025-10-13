const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define('usuario', {
  id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre:   { type: DataTypes.STRING,  allowNull: false },
  email:    { type: DataTypes.STRING,  allowNull: false, unique: true },
  password: { type: DataTypes.STRING,  allowNull: false },
}, {
  tableName: 'usuarios',
  timestamps: false,
});

Usuario.beforeCreate(async (user) =>{
  if (user.changed('password')){
  const rounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
  user.password = await bcrypt.hash(user.password, rounds);
  }
});

Usuario.beforeUpdate(async (user) =>{
if (user.changed('password')){
  const rounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
  user.password = await bcrypt.hash(user.password, rounds);
}
});


module.exports = Usuario;
