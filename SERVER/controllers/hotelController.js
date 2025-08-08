// import { User } from '@clerk/express'
import Hotel from '../models/Hotel.js'
import User from '../models/User.js'

export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body
    console.log('registerHotel called with body:', { name, address, contact, city });
    
    // Get owner from authenticated user
    const owner = req.user._id
    console.log('registerHotel owner ID:', owner);
    
    // Check if all required fields are provided
    if (!name || !address || !contact || !city) {
      return res.status(400).json({
        success: false,
        message: 'All fields (name, address, contact, city) are required'
      })
    }
    
    const hotel = await Hotel.findOne({owner})
    if(hotel){
        console.log('Hotel already exists for owner:', owner);
        // Return success with already registered message and current user role
        const user = await User.findById(owner);
        return res.json({
            success: true, 
            message: 'Hotel Already Registered',
            data: hotel,
            updatedRole: user?.role || 'hotelOwner'
        })
    }
    // Create new hotel
    const newHotel = new Hotel({
      name,
      address,
      contact,
      owner,
      city
    })

    console.log('Creating new hotel with data:', { name, address, contact, owner, city });

    // Save to database
    const savedHotel = await newHotel.save()
    console.log('Hotel saved successfully:', savedHotel._id);
    
    // Verify the hotel was actually saved
    const verifyHotel = await Hotel.findById(savedHotel._id);
    console.log('Hotel verification after save:', verifyHotel ? 'Found' : 'Not found');
    
    // Update user role to hotelOwner
    const updatedUser = await User.findByIdAndUpdate(owner, {role : 'hotelOwner'}, { new: true });
    console.log('User role updated to hotelOwner:', owner, 'New role:', updatedUser?.role);

    res.status(201).json({
      success: true,
      message: 'Hotel registered successfully',
      data: savedHotel,
      updatedRole: updatedUser?.role // include the new user role
    })
    
  } catch (error) {
    console.error('Hotel registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to register hotel',
      error: error.message
    })
  }
}
