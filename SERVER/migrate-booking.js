import mongoose from 'mongoose';
import Booking from './models/Booking.js';
import Room from './models/Rooms.js';
import Hotel from './models/Hotel.js';
import dotenv from 'dotenv';

dotenv.config();

const moveBookingToCorrectDatabase = async () => {
  try {
    console.log('=== CONNECTING TO SOURCE DATABASE (hotelsInfo) ===');
    await mongoose.connect(process.env.DBURI, {
      dbName: 'hotelsInfo'
    });
    
    // Get the booking from source database
    const sourceBooking = await Booking.findOne({});
    const sourceRoom = await Room.findById(sourceBooking.room);
    const sourceHotel = await Hotel.findById(sourceBooking.hotel);
    
    console.log('Found booking in source:', sourceBooking._id);
    console.log('Found room in source:', sourceRoom._id);
    console.log('Found hotel in source:', sourceHotel._id);
    
    await mongoose.disconnect();
    
    console.log('\n=== CONNECTING TO TARGET DATABASE (Hotels-Info) ===');
    await mongoose.connect(process.env.DBURI, {
      dbName: 'Hotels-Info'
    });
    
    // Check if hotel exists in target, if not create it
    let targetHotel = await Hotel.findById(sourceHotel._id);
    if (!targetHotel) {
      targetHotel = new Hotel(sourceHotel.toObject());
      await targetHotel.save();
      console.log('Created hotel in target database');
    }
    
    // Check if room exists in target, if not create it
    let targetRoom = await Room.findById(sourceRoom._id);
    if (!targetRoom) {
      targetRoom = new Room(sourceRoom.toObject());
      await targetRoom.save();
      console.log('Created room in target database');
    }
    
    // Check if booking exists in target, if not create it
    let targetBooking = await Booking.findById(sourceBooking._id);
    if (!targetBooking) {
      targetBooking = new Booking(sourceBooking.toObject());
      await targetBooking.save();
      console.log('Created booking in target database');
    }
    
    console.log('Migration completed!');
    
    // Verify
    const bookings = await Booking.find({});
    console.log('Bookings in target database:', bookings.length);
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

moveBookingToCorrectDatabase();
