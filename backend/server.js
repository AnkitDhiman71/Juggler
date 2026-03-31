const app = require('./app')
const connectDB = require('./db')
const ensureAdmin = require('./controllers/adminBootstrap')

const PORT = process.env.PORT || 5000

// Connect to database
connectDB().then(async () => {
  await ensureAdmin()
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
