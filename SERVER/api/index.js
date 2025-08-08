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

// Global connection state
let isConnected = false

// Database connection function
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
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

// Cloudinary connection
const connectCloudinary = () => {
  try {
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      })
      console.log('Cloudinary configured')
    }
  } catch (error) {
    console.error('Cloudinary config error:', error)
  }
}

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://your-frontend-domain.vercel.app'
  ],
  credentials: true
}))

app.use(express.json())
app.use(clerkMiddleware())

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: "Hotel Booking API is working Fine!", 
    status: "success",
    timestamp: new Date().toISOString()
  })
})

app.get('/api', (req, res) => {
  res.json({ 
    message: "Hotel Booking API endpoints", 
    status: "success",
    endpoints: ['/api/user', '/api/hotels', '/api/rooms', '/api/bookings']
  })
})

app.use('/api/clerk', clerkWebhooks)
app.use('/api/user', userRouter)
app.use('/api/hotels', hotelRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/bookings', bookingRouter)

// Error handling
app.use((err, req, res, next) => {
  console.error('API Error:', err)
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  })
})

// Main serverless function
export default async function handler(req, res) {
  try {
    // Initialize services
    await connectDB()
    connectCloudinary()
    
    // Handle the request
    return app(req, res)
  } catch (error) {
    console.error('Serverless function error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to initialize server',
      error: error.message 
    })
  }
}
