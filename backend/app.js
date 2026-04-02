const express = require('express')
const cors = require('cors')
const session = require('express-session')
const path = require('path')
const app = express()
const routes = require('./routes')
const { errorMiddleware } = require('./middleware')


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json())

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(session({
  secret: process.env.SESSION_SECRET || 'juggler_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60,
    sameSite: 'lax',
    secure: false, // Set to true in production with HTTPS
    httpOnly: true
  },
}))

// Use centralized routes
app.use('/api', routes)

// Debug route to check session
app.get('/debug/session', (req, res) => {
  res.json({ 
    hasSession: !!req.session, 
    hasUser: !!req.session?.user, 
    user: req.session?.user || null,
    sessionId: req.sessionID 
  });
});

app.get('/', (req, res) => res.send('Juggler API is running!'))

app.use(errorMiddleware)

module.exports = app