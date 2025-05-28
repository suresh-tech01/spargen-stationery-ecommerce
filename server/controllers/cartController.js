const { sequelize } = require('../config/db');
const { Op } = require('sequelize');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    // Find or create cart for user
    const [cart] = await Cart.findOrCreate({
      where: { userId: req.user.id },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price', 'images']
            }
          ]
        }
      ],
      defaults: { userId: req.user.id }
    });

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { productId, quantity } = req.body;

    // Get product
    const product = await Product.findByPk(productId, { transaction });

    if (!product) {
      await transaction.rollback();
      return next(new ErrorResponse('Product not found', 404));
    }

    // Find or create cart for user
    const [cart] = await Cart.findOrCreate({
      where: { userId: req.user.id },
      defaults: { userId: req.user.id },
      transaction
    });

    // Check if item already in cart
    const existingItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId
      },
      transaction
    });

    if (existingItem) {
      // Update quantity if item exists
      existingItem.quantity += quantity;
      await existingItem.save({ transaction });
    } else {
      // Add new item to cart
      await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
        price: product.price
      }, { transaction });
    }

    await transaction.commit();

    // Return updated cart
    const updatedCart = await Cart.findByPk(cart.id, {
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price', 'images']
            }
          ]
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: updatedCart
    });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: CartItem,
          as: 'items',
          where: { id: req.params.itemId }
        }
      ]
    });

    if (!cart || cart.items.length === 0) {
      return next(new ErrorResponse('Item not found in cart', 404));
    }

    await CartItem.destroy({
      where: {
        id: req.params.itemId,
        cartId: cart.id
      }
    });

    // Return updated cart
    const updatedCart = await Cart.findByPk(cart.id, {
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price', 'images']
            }
          ]
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: updatedCart
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({
      where: { userId: req.user.id }
    });

    if (!cart) {
      return next(new ErrorResponse('Cart not found', 404));
    }

    await CartItem.destroy({
      where: { cartId: cart.id }
    });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};