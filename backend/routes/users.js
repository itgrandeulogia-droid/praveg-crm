const express = require('express');
const {
  getUsers,
  createUser,
  updateUser,
  deactivateUser,
  deleteUser
} = require('../controllers/userController');
const { authMiddleware, adminMiddleware, superAdminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/', authMiddleware, adminMiddleware, getUsers);

// @route   POST /api/users
// @desc    Create new user
// @access  Private (Master only)
router.post('/', authMiddleware, superAdminMiddleware, createUser);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Master only)
router.put('/:id', authMiddleware, superAdminMiddleware, updateUser);

// @route   DELETE /api/users/:id
// @desc    Deactivate user
// @access  Private (Master only)
router.delete('/:id', authMiddleware, superAdminMiddleware, deactivateUser);

// @route   DELETE /api/users/:id/delete
// @desc    Delete user permanently
// @access  Private (Master only)
router.delete('/:id/delete', authMiddleware, superAdminMiddleware, deleteUser);

module.exports = router;

