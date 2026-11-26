const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  uid: { type: DataTypes.STRING(180), allowNull: false, unique: true },
  nome: { type: DataTypes.STRING(120), allowNull: false },
  email: { type: DataTypes.STRING(160), allowNull: false, validate: { isEmail: true } },
  perfil: { type: DataTypes.ENUM('user', 'tecnico', 'admin'), allowNull: false, defaultValue: 'user' },
}, { tableName: 'usuarios' });

module.exports = User;
