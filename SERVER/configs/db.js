import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

let isConnected = false

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection')
    return
  }

  try {
    // Support both DBURI and MONGO_URI environment variables
    const dbUri = process.env.DBURI || process.env.MONGO_URI;
    if (!dbUri) {
      console.error('Database connection string is not set. Please define DBURI or MONGO_URI.');
      throw new Error('Database connection string not found');
    }

    console.log('Connecting to MongoDB...');
    
    const options = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }

    await mongoose.connect(dbUri, options)
    isConnected = true
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    isConnected = false
    throw error
  }
}

export default connectDB