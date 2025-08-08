import dotenv from 'dotenv'
import connectDB from '../configs/db.js'
import User from '../models/User.js'
import Room from '../models/Rooms.js'
import Hotel from '../models/Hotel.js'
import Booking from '../models/Booking.js'

dotenv.config()

const clearCollections = async () => {
  try {
    await connectDB()
    await Promise.all([
      User.deleteMany(),
      Room.deleteMany(),
      Hotel.deleteMany(),
      Booking.deleteMany(),
    ])
    console.log('✅ All collections cleared: users, rooms, hotels, bookings')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error clearing collections:', err)
    process.exit(1)
  }
}

clearCollections()
