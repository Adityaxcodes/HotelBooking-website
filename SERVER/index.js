import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'

dotenv.config()

const app = express()

// Simple test function first
app.use(cors())
app.use(express.json())

// Basic test route
app.get('/', (req, res) => {
  res.json({ 
    message: "Hotel Booking API is working!", 
    status: "success",
    timestamp: new Date().toISOString(),
    env: {
      nodeEnv: process.env.NODE_ENV,
      hasDB: !!process.env.DBURI
    }
  })
})

app.get('/api', (req, res) => {
  res.json({ 
    message: "API endpoints available", 
    status: "success"
  })
})

// Simple health check
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

export default app
