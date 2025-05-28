const { sequelize } = require('../config/db');
const { Op } = require('sequelize');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    // Building query options
    const queryOptions = {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      where: {}
    };

    // Filtering
    if (req.query.category) {
      queryOptions.where.category = req.query.category;
    }

    if (req.query.price) {
      const [minPrice, maxPrice] = req.query.price.split('-');
      queryOptions.where.price = {
        [Op.between]: [minPrice || 0, maxPrice || 999999]
      };
    }

    if (req.query.search) {
      queryOptions.where.name = {
        [Op.like]: `%${req.query.search}%`
      };
    }

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',');
      queryOptions.order = [sortBy];
    } else {
      queryOptions.order = [['createdAt', 'DESC']];
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    queryOptions.limit = limit;
    queryOptions.offset = offset;

    // Executing query
    const { count, rows: products } = await Product.findAndCountAll(queryOptions);

    // Pagination result
    const pagination = {
      total: count,
      page,
      pages: Math.ceil(count / limit),
      limit
    };

    res.status(200).json({
      success: true,
      count: products.length,
      pagination,
      data: products
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          association: 'reviews',
          include: ['user']
        }
      ]
    });

    if (!product) {
      return next(
        new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return next(
        new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
      );
    }

    await product.update(req.body);

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return next(
        new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
      );
    }

    await product.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};