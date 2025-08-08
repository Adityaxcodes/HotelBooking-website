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

// Load environment variables
dotenv.config()

// Create Express app
const app = express()

// Global flags for serverless optimization
let dbConnected = false
let cloudinaryConfigured = false

// Database connection for serverless
const connectDB = async () => {
  if (dbConnected && mongoose.connection.readyState === 1) {
    return
  }

  try {
    const dbUri = process.env.DBURI || process.env.MONGO_URI
    if (!dbUri) {
      throw new Error('Database URI not found in environment variables')
    }

    // Disconnect existing connection if any
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect()
    }

    await mongoose.connect(dbUri, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    })
    
    dbConnected = true
    console.log('✅ MongoDB connected for serverless function')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    dbConnected = false
    throw error
  }
}

// Cloudinary configuration
const configureCloudinary = () => {
  if (cloudinaryConfigured) return

  try {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env
    
    if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
      cloudinary.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
      })
      cloudinaryConfigured = true
      console.log('✅ Cloudinary configured')
    } else {
      console.log('⚠️ Cloudinary credentials not found')
    }
  } catch (error) {
    console.error('❌ Cloudinary config error:', error.message)
  }
}

// Configure CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    /\.vercel\.app$/,
    /\.netlify\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-clerk-*']
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Clerk middleware
app.use(clerkMiddleware())

// Health check routes
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Hotel Booking API is working!",
    status: "success",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || 'development'
  })
})

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: "healthy",
    database: dbConnected ? "connected" : "disconnected",
    cloudinary: cloudinaryConfigured ? "configured" : "not configured",
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
  console.error('🔥 API Error:', err)
  
  if (!res.headersSent) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
      timestamp: new Date().toISOString()
    })
  }
})

// 404 handler
app.use('*', (req, res) => {
  if (!res.headersSent) {
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`,
      availableRoutes: ['/', '/api/health', '/api/user', '/api/hotels', '/api/rooms', '/api/bookings'],
      timestamp: new Date().toISOString()
    })
  }
})

// Main serverless function handler
export default async function handler(req, res) {
  try {
    console.log(`🚀 ${req.method} ${req.url} - Serverless function invoked`)
    
    // Initialize services
    await connectDB()
    configureCloudinary()
    
    // Handle the request with Express
    app(req, res)
    
  } catch (error) {
    console.error('💥 Serverless function error:', error)
    
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Server initialization failed',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    }
  }
}
