const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const WishlistItem = sequelize.define('WishlistItem', {
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
  tableName: 'wishlist_items',
  timestamps: true
});

WishlistItem.associate = (models) => {
  WishlistItem.belongsTo(models.Wishlist, {
    foreignKey: 'wishlistId',
    as: 'wishlist'
  });
  WishlistItem.belongsTo(models.Product, {
    foreignKey: 'productId',
    as: 'product'
  });
};

module.exports = WishlistItem;