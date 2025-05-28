const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Wishlist = sequelize.define('Wishlist', {
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
  tableName: 'wishlists',
  timestamps: true
});

Wishlist.associate = (models) => {
  Wishlist.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
  Wishlist.hasMany(models.WishlistItem, {
    foreignKey: 'wishlistId',
    as: 'items'
  });
};

module.exports = Wishlist;