import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const connectDB = async () => {
  try {
    // Support both DBURI and MONGO_URI environment variables
    const dbUri = process.env.DBURI || process.env.MONGO_URI;
    if (!dbUri) {
      console.error('Database connection string is not set. Please define DBURI or MONGO_URI.');
      process.exit(1);
    }
    console.log('Connecting to MongoDB with URI:', dbUri);
    await mongoose.connect(dbUri, {
      dbName: 'hotelsInfo' // Changed to match the database with the bookings
    })
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

export default connectDB