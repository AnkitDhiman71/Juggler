const Tweet = require('../models/Tweet')
const User = require('../models/User')

exports.getAllTweets = async (req, res) => {
  try {
    const tweets = await Tweet.find().sort({ createdAt: -1 })
    res.json({ data: tweets })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.createTweet = async (req, res) => {
  try {
    const { content } = req.body
    if (!content) return res.status(400).json({ error: 'Content is required' })
    
    const tweetData = { 
      content, 
      author: req.session.user._id 
    }
    
    if (req.file) {
      tweetData.image = '/uploads/' + req.file.filename
    }
    
    const tweet = new Tweet(tweetData)
    await tweet.save()
    res.status(201).json(tweet)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.likeTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id)
    if (!tweet) return res.status(404).json({ error: 'Tweet not found' })
    tweet.likes.push(req.session.user._id)
    await tweet.save()
    res.json(tweet)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.getMyTweets = async (req, res) => {
  try {
    const tweets = await Tweet.find({ author: req.session.user._id }).sort({ createdAt: -1 })
    res.json({ data: tweets })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
