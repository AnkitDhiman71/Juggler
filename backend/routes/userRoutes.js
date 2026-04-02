const express = require('express');
const router = express.Router();
const { userController } = require('../controllers');

// Register a new user
router.post('/register', userController.register);

// Login
router.post('/login', userController.login);

// Logout
router.post('/logout', userController.logout);

// Get current user info
router.get('/me', userController.me);

module.exports = router;
