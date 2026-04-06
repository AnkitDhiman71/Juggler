const express = require('express');
const router = express.Router();
const { userController } = require('../controllers');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', userController.register);
router.post('/verify-otp', userController.verifyOTP);
router.post('/resend-otp', userController.resendOTP);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/me', authMiddleware, (req, res) => res.json({ user: req.user }));

module.exports = router;
