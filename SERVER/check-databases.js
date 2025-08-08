import mongoose from 'mongoose';
import Booking from './models/Booking.js';
import dotenv from 'dotenv';

dotenv.config();

const checkDatabases = async () => {
  try {
    console.log('=== CHECKING hotelsInfo DATABASE ===');
    await mongoose.connect(process.env.DBURI, {
      dbName: 'hotelsInfo'
    });
    
    const bookings1 = await Booking.find({});
    console.log('Bookings in hotelsInfo:', bookings1.length);
    await mongoose.disconnect();
    
    console.log('\n=== CHECKING Hotels-Info DATABASE ===');
    await mongoose.connect(process.env.DBURI, {
      dbName: 'Hotels-Info'
    });
    
    const bookings2 = await Booking.find({});
    console.log('Bookings in Hotels-Info:', bookings2.length);
    await mongoose.disconnect();
    
    console.log('\n=== CHECKING DEFAULT DATABASE ===');
    await mongoose.connect(process.env.DBURI);
    
    const bookings3 = await Booking.find({});
    console.log('Bookings in default database:', bookings3.length);
    console.log('Default database name:', mongoose.connection.db.databaseName);
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkDatabases();
