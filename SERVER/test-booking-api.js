import mongoose from 'mongoose';
import Booking from './models/Booking.js';
import Room from './models/Rooms.js';
import Hotel from './models/Hotel.js';
import dotenv from 'dotenv';

dotenv.config();

const testBookingAPI = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.DBURI, {
      dbName: 'hotelsInfo'
    });
    
    console.log('Connected to MongoDB');
    
    const user = 'user_30j6oDIeEXSLkrkcx09I5GGOa5g';
    console.log('Fetching bookings for user:', user);
    
    const bookings = await Booking.find({user})
      .populate({
        path: 'room',
        model: 'Room'
      })
      .populate({
        path: 'hotel',
        model: 'Hotel'
      })
      .sort({createdAt : -1});
      
    console.log('Found bookings:', bookings.length);
    
    if (bookings.length > 0) {
      console.log('\n=== BOOKING API RESPONSE SIMULATION ===');
      const apiResponse = {
        success: true,
        bookings: bookings.map(booking => ({
          _id: booking._id,
          checkInDate: booking.checkInDate,
          checkOutDate: booking.checkOutDate,
          totalPrice: booking.totalPrice,
          guests: booking.guests,
          status: booking.status,
          isPaid: booking.isPaid,
          room: booking.room,
          hotel: booking.hotel,
          createdAt: booking.createdAt
        }))
      };
      
      console.log(JSON.stringify(apiResponse, null, 2));
    }
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testBookingAPI();
