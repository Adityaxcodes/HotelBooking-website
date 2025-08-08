import Booking from '../models/Booking.js';
import Room from '../models/Rooms.js';
import Hotel from '../models/Hotel.js';
import transporter from '../configs/Nodemailer.js';


const checkAvailability = async ({checkInDate, checkOutDate,room})=>{
    try{
        const bookings = await Booking.find({
            room,
            checkInDate: { $lte: checkOutDate },
            checkOutDate: { $gte: checkInDate }
        })
        const isAvailable = bookings.length ===0;
        return isAvailable
    }catch(error){
        console.error(error.message)
    }
}

export const checkAvailabilityAPI = async(req, res) =>{
    try{
        const {room, checkInDate, checkOutDate} = req.body;
        const isAvailable = await checkAvailability({checkInDate, checkOutDate, room})
        res.status(200).json({ success: true, isAvailable })
    } catch (error) {
        console.error('checkAvailabilityAPI error:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export const createBooking = async(req, res)=>{
    try{
        const {room, checkInDate, checkOutDate, guests} = req.body;
        const user = req.user._id;
        
        console.log('Creating booking with data:', { room, checkInDate, checkOutDate, guests, user });

        const isAvailable = await checkAvailability({
            room, checkInDate, checkOutDate
        })

        if (!isAvailable) {
            return res.status(400).json({ success: false, message: "Room is not available" });
        }

        const roomData = await Room.findById(room).populate('hotel');
        // Calculate number of nights
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        let totalPrice = nights * roomData.pricePerNight;

        // Create new booking
        const newBooking = await Booking.create({
            room: roomData._id,
            hotel: roomData.hotel._id,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            totalPrice,
            guests,
            status: 'pending',
            paymentMethod: req.body.paymentMethod || 'card',
            isPaid: false,
            user: user
        });

        console.log('Booking created successfully:', newBooking._id);
        
        // Verify the booking was saved
        const verifyBooking = await Booking.findById(newBooking._id);
        console.log('Booking verification after save:', verifyBooking ? 'Found' : 'Not found');

        // Send initial response including booking
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking: newBooking
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: req.user.email,
            subject: 'Hotel Booking Details',
            html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>Hello ${req.user.name || 'Guest'},</h2>
                <p>Thank you for your booking!</p>
                <p><strong>Booking ID:</strong> ${newBooking._id}</p>
                <p><strong>Hotel:</strong> ${roomData.hotel.name}</p>
                <p><strong>Location:</strong> ${roomData.hotel.location}</p>
                <p><strong>Check-in:</strong> ${checkIn.toDateString()}</p>
                <p><strong>Check-out:</strong> ${checkOut.toDateString()}</p>
                <br>
                <p>We look forward to hosting you!</p>
            </div>
            `
        }

        // Send confirmation email (errors logged but not sent to client)
        try {
            await transporter.sendMail(mailOptions)
        } catch (emailError) {
            console.error('Email send error:', emailError)
        }
    } catch (error) {
        console.error('createBooking error:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export const getUserBookings = async(req, res)=>{
    try{
        const user = req.user._id;
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
            .sort({createdAt : -1})
        console.log('Found bookings:', bookings.length);
        console.log('Bookings data:', bookings);
        
        res.status(200).json({ success: true, bookings })
    } catch (error) {
        console.error('getUserBookings error:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export const getHotelBookings = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ owner: req.auth.userId });
        if (!hotel) {
            return res.status(404).json({ success: false, message: 'No Hotel Found' });
        }
        const bookings = await Booking.find({ hotel: hotel._id })
            .populate('room hotel user')
            .sort({ createdAt: -1 });

        const totalBookings = bookings.length;
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

        res.status(200).json({ success: true, dashboardData: { totalBookings, totalRevenue, bookings } });
    } catch (error) {
        console.error('getHotelBookings error:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user._id;
        
        console.log('Cancelling booking:', bookingId, 'for user:', userId);
        
        // Find the booking and ensure it belongs to the user
        const booking = await Booking.findOne({ _id: bookingId, user: userId });
        
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        
        // Check if booking can be cancelled (only pending bookings can be cancelled)
        if (booking.status !== 'pending') {
            return res.status(400).json({ 
                success: false, 
                message: `Cannot cancel booking with status: ${booking.status}` 
            });
        }
        
        // Check if cancellation is within allowed time (24 hours before check-in)
        const checkInDate = new Date(booking.checkInDate);
        const now = new Date();
        const timeDiff = checkInDate.getTime() - now.getTime();
        const hoursUntilCheckIn = timeDiff / (1000 * 60 * 60);
        
        if (hoursUntilCheckIn < 24) {
            return res.status(400).json({ 
                success: false, 
                message: 'Cannot cancel booking less than 24 hours before check-in' 
            });
        }
        
        // Update booking status to cancelled
        booking.status = 'cancelled';
        await booking.save();
        
        console.log('Booking cancelled successfully:', bookingId);
        
        res.status(200).json({ 
            success: true, 
            message: 'Booking cancelled successfully',
            booking: booking
        });
        
    } catch (error) {
        console.error('cancelBooking error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// "scripts": {
//   "clear-db": "node --experimental-modules scripts/clearDb.js"
// }