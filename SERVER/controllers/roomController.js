import { Message } from 'svix/dist/api/message.js';
import Hotel from '../models/Hotel.js'
import User from '../models/User.js'
import { v2 as cloudinary } from 'cloudinary';
import Room from '../models/Rooms.js';

export const createRoom = async(req, res)=>{
    try{
        const { roomType, pricePerNight, amenitites } = req.body;
        const hotel = await Hotel.findOne({owner:req.auth.userId})

        if(!hotel){
            return res.json({success : false, message : 'No Hotel found'})
        }

        // Upload each image and get secure URL
        const uploadImages = req.files.map(file =>
            cloudinary.uploader.upload(file.path).then(response => response.secure_url)
        )

        const images = await Promise.all(uploadImages)
        // Parse the amenities JSON and convert to an array of enabled amenity names
        let amenitiesArr = []
        try {
          const parsed = JSON.parse(amenitites)
          amenitiesArr = Object.entries(parsed)
            .filter(([key, value]) => value === true)
            .map(([key]) => key)
        } catch (err) {
          return res.status(400).json({ success: false, message: 'Invalid amenities format' })
        }
        // Create new room document
        const newRoom = await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: amenitiesArr,
            images
        })
        // Return success with created room
        res.status(201).json({ success: true, message: 'Room added successfully', room: newRoom })
    }catch(error){
        res.json({success:false, message: error.message})
    }
}
// Controller to get all rooms for the authenticated user's hotel
// export const getRooms = async (req, res) => {
//     try {
//         const hotel = await Hotel.findOne({ owner: req.auth.userId });
//         if (!hotel) {
//             return res.json({ success: false, message: 'No Hotel found' });
//         }
//         const rooms = await Room.find({ hotel: hotel._id });
//         res.json({ success: true, rooms });
//     } catch (error) {
//         res.json({ success: false, message: error.message });
//     }
// }

export const getRooms = async (req, res)=>{
    try{
        const rooms = await Room.find({isAvailable : true}).populate({
            path : 'hotel', 
            populate : {
                path : 'owner',
                select : 'image'
            }
        }).sort({createdAt :-1})
        res.json({success:true, rooms});
    }catch(error){
        res.json({success : false, message : error.message})
    }
}

export const getOwnerRooms = async (req, res)=>{
    try{
        const hotelData = await Hotel.findOne({owner : req.auth.userId})
        if(!hotelData){
            return res.json({success : false, message : 'No Hotel found'})
        }
        const rooms = await Room.find({hotel : hotelData._id.toString()}).populate('hotel');
        res.json({success:true, rooms})
    }catch(error){
        res.json({success : false, message : error.message})
    }
}

export const toggleRoomAvailability = async (req, res)=>{
    try{
        const {roomId} = req.body
        const roomData = await Room.findById(roomId)
        roomData.isAvailable = !roomData.isAvailable
        await roomData.save()
        res.json({success : true, message : 'Room availability Updated'})
    }catch(error){
        res.json({success : false, message : error.message})
    }
}