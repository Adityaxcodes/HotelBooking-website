import mongoose from 'mongoose';
import Booking from './models/Booking.js';
import dotenv from 'dotenv';

dotenv.config();

const fixBookingUser = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.DBURI, {
      dbName: 'hotelsInfo'
    });
    
    console.log('Connected to MongoDB');
    
    const currentUser = 'user_30j6oDIeEXSLkrkcx09I5GGOa5g';
    
    // Update the booking to belong to the current user
    const result = await Booking.updateMany(
      { user: 'user_30WBavJsTglVvgjExCWqMXGX7wY' },
      { $set: { user: currentUser } }
    );
    
    console.log(`Updated ${result.modifiedCount} bookings to current user`);
    
    // Verify the change
    const userBookings = await Booking.find({ user: currentUser });
    console.log(`Current user now has ${userBookings.length} bookings`);
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixBookingUser();
