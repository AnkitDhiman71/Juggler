const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const tweetRoutes = require('./tweetRoutes');
const protectedRoutes = require('./protectedRoutes');

router.use('/auth', userRoutes);
router.use('/tweets', tweetRoutes);
router.use('/protected', protectedRoutes);

module.exports = router;
