import mongoose from 'mongoose';
import Booking from './models/Booking.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const fixBookings = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.DBURI, {
      dbName: 'hotelsInfo'
    });
    
    console.log('Connected to MongoDB');
    
    // Get all users
    const users = await User.find({});
    console.log('Total users:', users.length);
    
    if (users.length > 0) {
      console.log('First user ID:', users[0]._id);
      
      // Get bookings without user field
      const bookingsWithoutUser = await Booking.find({ user: { $exists: false } });
      console.log('Bookings without user field:', bookingsWithoutUser.length);
      
      if (bookingsWithoutUser.length > 0) {
        // Update these bookings to include the first user
        const result = await Booking.updateMany(
          { user: { $exists: false } },
          { $set: { user: users[0]._id } }
        );
        console.log('Updated bookings:', result.modifiedCount);
      }
    }
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixBookings();
