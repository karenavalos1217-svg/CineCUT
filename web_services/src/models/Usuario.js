const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define('usuario', {
  id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre:   { type: DataTypes.STRING(100), allowNull: false },
  email:    { type: DataTypes.STRING(255), allowNull: false, unique: true,
              set(value){ this.setDataValue('email', String(value||'').trim().toLowerCase()); } },
  password: { type: DataTypes.STRING(255), allowNull: false },
  rol:      { type: DataTypes.STRING(20),  allowNull: false, defaultValue: 'user' },
}, { tableName: 'usuarios', timestamps: false });

Usuario.beforeCreate(async (user) => {
  const rounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
  user.password = await bcrypt.hash(user.password, rounds);
});
Usuario.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const rounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
    user.password = await bcrypt.hash(user.password, rounds);
  }
});

module.exports = Usuario;
