const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getOrders,
  updateOrder,
  getSalesStats
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// User routes
router.route('/users')
  .get(protect, authorize('admin'), getUsers);

router.route('/users/:id')
  .get(protect, authorize('admin'), getUser)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

// Order routes
router.route('/orders')
  .get(protect, authorize('admin'), getOrders);

router.route('/orders/:id')
  .put(protect, authorize('admin'), updateOrder);

// Stats route
router.route('/sales')
  .get(protect, authorize('admin'), getSalesStats);

module.exports = router;