const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Please enter product name'
      },
      len: {
        args: [1, 100],
        msg: 'Product name cannot exceed 100 characters'
      }
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
    validate: {
      isDecimal: {
        msg: 'Price must be a decimal number'
      },
      min: {
        args: [0],
        msg: 'Price cannot be negative'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Please enter product description'
      },
      len: {
        args: [1, 1000],
        msg: 'Description cannot exceed 1000 characters'
      }
    }
  },
  category: {
    type: DataTypes.ENUM(
      'Pens',
      'Notebooks',
      'Art Supplies',
      'Office Supplies',
      'School Supplies',
      'Stationery Sets'
    ),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Please select category for this product'
      }
    }
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isInt: {
        msg: 'Stock must be an integer'
      },
      min: {
        args: [0],
        msg: 'Stock cannot be negative'
      }
    }
  },
  ratings: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  numOfReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'products',
  timestamps: true
});

// Define associations
Product.associate = (models) => {
  Product.hasMany(models.Review, {
    foreignKey: 'productId',
    as: 'reviews'
  });
  Product.hasMany(models.CartItem, {
    foreignKey: 'productId',
    as: 'cartItems'
  });
  Product.hasMany(models.WishlistItem, {
    foreignKey: 'productId',
    as: 'wishlistItems'
  });
};

module.exports = Product;