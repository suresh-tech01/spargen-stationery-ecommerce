const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'carts',
  timestamps: true
});

Cart.associate = (models) => {
  Cart.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
  Cart.hasMany(models.CartItem, {
    foreignKey: 'cartId',
    as: 'items'
  });
};

module.exports = Cart;