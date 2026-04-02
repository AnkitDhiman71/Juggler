const express = require('express');
const router = express.Router();
const { tweetController } = require('../controllers');
const { authMiddleware, upload } = require('../middleware');

router.get('/', authMiddleware, tweetController.getAllTweets);
router.post('/', authMiddleware, upload.single('image'), tweetController.createTweet);
router.post('/:id/like', authMiddleware, tweetController.likeTweet);
router.get('/me', authMiddleware, tweetController.getMyTweets);
module.exports = router;
