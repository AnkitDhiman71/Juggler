const express = require('express');
const router = express.Router();
const tweetController = require('../controllers/tweetController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', authMiddleware, tweetController.getAllTweets);
router.post('/', authMiddleware, upload.single('image'), tweetController.createTweet);
router.post('/:id/like', authMiddleware, tweetController.likeTweet);
router.get('/me', authMiddleware, tweetController.getMyTweets);
module.exports = router;
