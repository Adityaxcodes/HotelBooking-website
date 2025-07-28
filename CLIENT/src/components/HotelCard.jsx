import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const HotelCard = ({room, index}) => {
  return (
    <Link to={'/rooms/' + room._id} onClick={() => scrollTo(0, 0)} key={room._id} className="block bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">
      {/* Best Seller Tag */}
      {index % 2 !== 0 && (
        <div className="absolute top-4 right-4 bg-slate-700 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md z-10">
          Best Seller
        </div>
      )}
      
      {/* Image Section */}
      <img src={room.images[0]} alt="" className="w-full h-48 object-cover" />

      {/* Info Section */}
      <div className="p-4">
        <p className="text-2xl font-bold text-gray-800 font-playfair">{room.hotel.name}</p>
        <div className="flex items-center mt-2">
          <img src={assets.starIconFilled} alt="Star" className="h-4 w-4 mr-1" />
          <span className="text-sm text-gray-600">4.5</span> {/* Example rating */}
        </div>
        <div className="flex items-center mt-2 text-gray-600">
          <img src={assets.locationIcon} alt="Location" className="h-4 w-4 mr-1" />
          <span className="text-sm">{room.hotel.address}</span>
        </div>
      </div>

      {/* Price and Action Section */}
      <div className="p-4 border-t border-gray-200 flex justify-between items-center">
        <p className="text-lg font-bold text-gray-800">${room.pricePerNight}</p>
        <button className="bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition-colors duration-300">Book Now</button>
      </div>
    </Link>
  )
}

export default HotelCard
