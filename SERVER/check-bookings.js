import mongoose from 'mongoose';
import Booking from './models/Booking.js';
import dotenv from 'dotenv';

dotenv.config();

const checkBookings = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.DBURI, {
      dbName: 'hotelsInfo'
    });
    
    console.log('Connected to MongoDB');
    
    const bookings = await Booking.find({});
    console.log('Total bookings in database:', bookings.length);
    
    if (bookings.length > 0) {
      console.log('Sample booking:', JSON.stringify(bookings[0], null, 2));
    } else {
      console.log('No bookings found in database');
    }
    
    // Also check the database name
    console.log('Connected to database:', mongoose.connection.db.databaseName);
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkBookings();
