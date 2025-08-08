import mongoose from 'mongoose';
import Booking from './models/Booking.js';
import Room from './models/Rooms.js';
import Hotel from './models/Hotel.js';
import dotenv from 'dotenv';

dotenv.config();

const checkReferences = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.DBURI, {
      dbName: 'hotelsInfo'
    });
    
    console.log('Connected to MongoDB');
    
    // Get the booking with populated fields
    const booking = await Booking.findOne().populate('room hotel');
    console.log('=== BOOKING WITH POPULATED FIELDS ===');
    console.log('Booking ID:', booking._id);
    console.log('Room populated:', booking.room ? 'YES' : 'NO');
    console.log('Hotel populated:', booking.hotel ? 'YES' : 'NO');
    
    if (booking.room) {
      console.log('Room details:', {
        id: booking.room._id,
        roomType: booking.room.roomType,
        price: booking.room.pricePerNight
      });
    }
    
    if (booking.hotel) {
      console.log('Hotel details:', {
        id: booking.hotel._id,
        name: booking.hotel.name,
        city: booking.hotel.city
      });
    }
    
    // Check if room exists separately
    const room = await Room.findById(booking.room || '6894bf66df58e5d009281066');
    console.log('\n=== ROOM CHECK ===');
    console.log('Room exists:', room ? 'YES' : 'NO');
    
    // Check if hotel exists separately
    const hotel = await Hotel.findById(booking.hotel || '6894bdd5df58e5d009281054');
    console.log('\n=== HOTEL CHECK ===');
    console.log('Hotel exists:', hotel ? 'YES' : 'NO');
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkReferences();
