import mongoose from 'mongoose';
import Booking from './models/Booking.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const checkBookingsAndUsers = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.DBURI, {
      dbName: 'hotelsInfo'
    });
    
    console.log('Connected to MongoDB');
    
    // Get all users
    const users = await User.find({});
    console.log('=== USERS ===');
    users.forEach((user, index) => {
      console.log(`User ${index + 1}: ${user._id} (${user.email})`);
    });
    
    // Get all bookings
    const bookings = await Booking.find({});
    console.log('\n=== BOOKINGS ===');
    bookings.forEach((booking, index) => {
      console.log(`Booking ${index + 1}: ID=${booking._id}, User=${booking.user}, Total=${booking.totalPrice}`);
    });
    
    // Check if current user has any bookings
    const currentUser = 'user_30j6oDIeEXSLkrkcx09I5GGOa5g';
    const currentUserBookings = await Booking.find({ user: currentUser });
    console.log(`\n=== BOOKINGS FOR CURRENT USER (${currentUser}) ===`);
    console.log(`Found ${currentUserBookings.length} bookings`);
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkBookingsAndUsers();
