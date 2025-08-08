import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './configs/db.js'
import clerkWebhooks from './controllers/clerkWebhooks.js'
import {clerkMiddleware} from '@clerk/express'
import userRouter from './routes/userRoutes.js'
import hotelRouter from './routes/hotelRoutes.js'
import connectCloudinary from './configs/cloudinary.js'
import roomRouter from './routes/roomRoutes.js'
import bookingRouter from './routes/bookingRoutes.js'

dotenv.config()

const app = express()

// Middleware 
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://your-frontend-domain.vercel.app' // Add your frontend domain here
  ],
  credentials: true
}))

app.use(express.json())
app.use(clerkMiddleware())

// Initialize database and cloudinary
let isConnected = false

const initializeServices = async () => {
  if (!isConnected) {
    try {
      await connectDB()
      await connectCloudinary()
      isConnected = true
      console.log('Services initialized successfully')
    } catch (error) {
      console.error('Failed to initialize services:', error)
      throw error
    }
  }
}

// Routes
app.use('/api/clerk', clerkWebhooks)
app.get('/', (req, res) => res.json({ message: "Hotel Booking API is working Fine!", status: "success" }))
app.get('/api', (req, res) => res.json({ message: "Hotel Booking API endpoints", status: "success" }))

// Mount routers for API endpoints
app.use('/api/user', userRouter)
app.use('/api/hotels', hotelRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/bookings', bookingRouter)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// For Vercel serverless functions
export default async (req, res) => {
  try {
    await initializeServices()
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

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000
  
  const startServer = async () => {
    try {
      await initializeServices()
      app.listen(PORT, () => {
        console.log(`Server running on PORT ${PORT}`)
        console.log(`Server URL: http://localhost:${PORT}`)
      })
    } catch (error) {
      console.error('Failed to start server:', error)
      process.exit(1)
    }
  }
  
  startServer()
}
