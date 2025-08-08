import express from 'express';
import {
  checkAvailabilityAPI,
  createBooking,
  getUserBookings,
  getHotelBookings,
  cancelBooking
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const bookingRouter = express.Router();


// Check room availability
bookingRouter.post('/check-availability', protect, checkAvailabilityAPI);

// Create a new booking
bookingRouter.post('/book', protect, createBooking);

// Get bookings for the logged-in user
bookingRouter.get('/user', protect, getUserBookings);

// Get bookings for the hotel owner
bookingRouter.get('/hotel', protect, getHotelBookings);

// Cancel a booking
bookingRouter.patch('/cancel/:bookingId', protect, cancelBooking);

export default bookingRouter;
