const { sequelize } = require('../config/db');
const Wishlist = require('../models/Wishlist');
const WishlistItem = require('../models/WishlistItem');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    // Find or create wishlist for user
    const [wishlist] = await Wishlist.findOrCreate({
      where: { userId: req.user.id },
      include: [
        {
          model: WishlistItem,
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
      data: wishlist
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
exports.addToWishlist = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { productId } = req.body;

    // Get product
    const product = await Product.findByPk(productId, { transaction });

    if (!product) {
      await transaction.rollback();
      return next(new ErrorResponse('Product not found', 404));
    }

    // Find or create wishlist for user
    const [wishlist] = await Wishlist.findOrCreate({
      where: { userId: req.user.id },
      defaults: { userId: req.user.id },
      transaction
    });

    // Check if item already in wishlist
    const existingItem = await WishlistItem.findOne({
      where: {
        wishlistId: wishlist.id,
        productId
      },
      transaction
    });

    if (existingItem) {
      await transaction.rollback();
      return next(new ErrorResponse('Item already in wishlist', 400));
    }

    // Add new item to wishlist
    await WishlistItem.create({
      wishlistId: wishlist.id,
      productId
    }, { transaction });

    await transaction.commit();

    // Return updated wishlist
    const updatedWishlist = await Wishlist.findByPk(wishlist.id, {
      include: [
        {
          model: WishlistItem,
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
      data: updatedWishlist
    });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:itemId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: WishlistItem,
          as: 'items',
          where: { id: req.params.itemId }
        }
      ]
    });

    if (!wishlist || wishlist.items.length === 0) {
      return next(new ErrorResponse('Item not found in wishlist', 404));
    }

    await WishlistItem.destroy({
      where: {
        id: req.params.itemId,
        wishlistId: wishlist.id
      }
    });

    // Return updated wishlist
    const updatedWishlist = await Wishlist.findByPk(wishlist.id, {
      include: [
        {
          model: WishlistItem,
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
      data: updatedWishlist
    });
  } catch (err) {
    next(err);
  }
};