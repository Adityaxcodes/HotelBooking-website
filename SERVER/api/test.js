const express = require('express')
const cors = require('cors')

const app = express()

// Basic middleware
app.use(cors())
app.use(express.json())

// Simple test routes
app.get('/', (req, res) => {
  res.json({ 
    message: "Hotel Booking API is working!", 
    status: "success",
    timestamp: new Date().toISOString(),
    vercel: true
  })
})

app.get('/api', (req, res) => {
  res.json({ 
    message: "API Test Endpoint", 
    status: "success",
    environment: process.env.NODE_ENV || 'development'
  })
})

app.get('/health', (req, res) => {
  res.json({ 
    status: "healthy",
    timestamp: new Date().toISOString()
  })
})

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Internal server error'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  })
})

module.exports = app
