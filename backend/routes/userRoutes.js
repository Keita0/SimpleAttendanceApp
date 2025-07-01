const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Update user by ID
router.put('/:id', verifyToken, isAdmin, userController.updateUser);

// Delete user by ID
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);

module.exports = router;
