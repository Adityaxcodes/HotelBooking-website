import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import {v2 as cloudinary} from 'cloudinary'
import {clerkMiddleware} from '@clerk/express'

// Import routes and controllers
import clerkWebhooks from '../controllers/clerkWebhooks.js'
import userRouter from '../routes/userRoutes.js'
import hotelRouter from '../routes/hotelRoutes.js'
import roomRouter from '../routes/roomRoutes.js'
import bookingRouter from '../routes/bookingRoutes.js'

dotenv.config()

const app = express()

// Global connection state for serverless
let isConnected = false

// Database connection optimized for serverless
const connectDB = async () => {
  if (isConnected) {
    return
  }

  try {
    const dbUri = process.env.DBURI || process.env.MONGO_URI
    if (!dbUri) {
      throw new Error('Database connection string not found')
    }

    await mongoose.connect(dbUri, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    
    isConnected = true
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

// Cloudinary configuration
const connectCloudinary = () => {
  try {
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      })
      console.log('Cloudinary configured successfully')
    }
  } catch (error) {
    console.error('Cloudinary config error:', error)
  }
}

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://your-frontend-domain.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(clerkMiddleware())

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: "Hotel Booking API is working!", 
    status: "success",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  })
})

app.get('/api/health', (req, res) => {
  res.json({ 
    message: "API Health Check", 
    status: "healthy",
    database: isConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  })
})

// API routes
app.use('/api/clerk', clerkWebhooks)
app.use('/api/user', userRouter)
app.use('/api/hotels', hotelRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/bookings', bookingRouter)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err)
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: ['/api/user', '/api/hotels', '/api/rooms', '/api/bookings']
  })
})

// Serverless function handler for Vercel
export default async function handler(req, res) {
  try {
    // Initialize services on cold start
    if (!isConnected) {
      await connectDB()
      connectCloudinary()
    }
    
    // Handle the request with Express app
    return app(req, res)
  } catch (error) {
    console.error('Serverless function error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Server initialization failed',
      error: error.message 
    })
  }
}
