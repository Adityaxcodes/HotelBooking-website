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

// Debug: Check if environment variables are loaded
console.log('PORT:', process.env.PORT)
console.log('DBURI:', process.env.DBURI)

const PORT = process.env.PORT || 3000

const app = express()
app.use(cors())

// Middleware 
app.use(express.json())
app.use(clerkMiddleware())

app.use('/api/clerk', clerkWebhooks)
app.get('/', (req, res)=> res.send("API is working Fine!"))
// Mount routers for API endpoints
app.use('/api/user', userRouter)
app.use('/api/hotels', hotelRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/bookings', bookingRouter)

const startServer = async () => {
  try {
    await connectDB()
    await connectCloudinary()
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