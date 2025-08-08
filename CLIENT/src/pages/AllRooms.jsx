import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const AllRooms = () => {
  const { publicRooms, fetchPublicRooms } = useAppContext();
  const [selectedImageIndex, setSelectedImageIndex] = useState({})
  const [filters, setFilters] = useState({
    roomType: '',
    priceRange: '',
    amenities: [],
    availability: ''
  })
  useEffect(() => { fetchPublicRooms() }, [fetchPublicRooms])

  const handleImageSelect = (roomId, imageIndex) => {
    setSelectedImageIndex(prev => ({
      ...prev,
      [roomId]: imageIndex
    }))
  }

  // Filter functions
  const handleFilterChange = (filterType, value) => {
    if (filterType === 'amenities') {
      setFilters(prev => ({
        ...prev,
        amenities: prev.amenities.includes(value)
          ? prev.amenities.filter(a => a !== value)
          : [...prev.amenities, value]
      }))
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: prev[filterType] === value ? '' : value // Allow unchecking by setting to empty string
      }))
    }
  }

  // Handle radio button clicks with toggle functionality
  const handleRadioClick = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? '' : value
    }))
  }

  const clearFilters = () => {
    setFilters({
      roomType: '',
      priceRange: '',
      amenities: [],
      availability: ''
    })
  }

  // Filter room data
  const filteredRooms = publicRooms.filter(room => {
    // Room type filter
    if (filters.roomType && room.roomType !== filters.roomType) {
      return false
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number)
      if (max) {
        if (room.pricePerNight < min || room.pricePerNight > max) return false
      } else {
        if (room.pricePerNight < min) return false
      }
    }

    // Amenities filter
    if (filters.amenities.length > 0) {
      if (!filters.amenities.every(amenity => room.amenities.includes(amenity))) {
        return false
      }
    }

    // Availability filter
    if (filters.availability === 'available' && !room.isAvailable) return false
    if (filters.availability === 'unavailable' && room.isAvailable) return false

    return true
  })

  // Get unique amenities for filter options
  const allAmenities = [...new Set(publicRooms.flatMap(room => room.amenities))]

  // Function to get icon for amenity
  const getAmenityIcon = (amenity) => {
    const amenityIconMap = {
      'Free WiFi': assets.freeWifiIcon,
      'Free Breakfast': assets.freeBreakfastIcon,
      'Room Service': assets.roomServiceIcon,
      'Mountain View': assets.mountainIcon,
      'Pool Access': assets.poolIcon,
      'Free Wifi': assets.freeWifiIcon, // Alternative spelling
      'Wifi': assets.freeWifiIcon,
      'Pool': assets.poolIcon,
      'Breakfast': assets.freeBreakfastIcon,
      'Service': assets.roomServiceIcon,
      'Mountain': assets.mountainIcon,
      'View': assets.mountainIcon
    }
    
    // Try exact match first
    if (amenityIconMap[amenity]) {
      return amenityIconMap[amenity]
    }
    
    // Try partial matches
    const amenityLower = amenity.toLowerCase()
    for (const [key, icon] of Object.entries(amenityIconMap)) {
      if (amenityLower.includes(key.toLowerCase()) || key.toLowerCase().includes(amenityLower)) {
        return icon
      }
    }
    
    // Default icon if no match found
    return assets.badgeIcon
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Premium Hotel Rooms
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover luxury and comfort in our carefully curated selection of hotel rooms. 
            Each space is designed to provide an unforgettable experience with premium amenities and stunning views.
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Hotel Rooms - Left Side */}
          <div className="lg:w-2/3 xl:w-3/4">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredRooms.length} Room{filteredRooms.length !== 1 ? 's' : ''} Found
              </h2>
              <button 
                onClick={clearFilters}
                className="lg:hidden bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
            
            <div className="space-y-8">
              {filteredRooms.length > 0 ? (
                filteredRooms.map((room) => {
                  const currentImageIndex = selectedImageIndex[room._id] || 0
                  return (
                    <div key={room._id} className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
                      <Link to={`/rooms/${room._id}`} className="block">
                        <div className="flex flex-col xl:flex-row">
                          {/* Image Section */}
                          <div className="xl:w-2/5 relative">
                            {/* Main Image */}
                            <div className="relative h-80 xl:h-96 overflow-hidden">
                              <img
                                src={room.images[currentImageIndex]}
                                alt={`${room.hotel.name} - ${room.roomType}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                              {/* Availability Badge */}
                              <div className="absolute top-4 right-4">
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${
                                  room.isAvailable 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-red-500 text-white'
                                }`}>
                                  {room.isAvailable ? '✓ Available' : '✗ Unavailable'}
                                </span>
                              </div>
                              {/* Price Badge */}
                              <div className="absolute top-4 left-4">
                                <div className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg">
                                  <span className="text-lg font-bold">${room.pricePerNight}</span>
                                  <span className="text-sm opacity-90">/night</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Image Thumbnails */}
                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="flex gap-2 justify-center">
                                {room.images.map((img, idx) => (
                                  <button
                                    key={idx}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      handleImageSelect(room._id, idx)
                                    }}
                                    className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                                      currentImageIndex === idx 
                                        ? 'border-white shadow-lg scale-110' 
                                        : 'border-white/50 hover:border-white'
                                    }`}
                                  >
                                    <img
                                      src={img}
                                      alt={`Thumbnail ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="xl:w-3/5 p-8 xl:p-10 flex flex-col justify-between">
                            <div className="space-y-6">
                              {/* Title and Location */}
                              <div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors font-playfair">
                                  {room.roomType}
                                </h3>
                                <h4 className="text-xl font-semibold text-indigo-600 mb-2 font-playfair">
                                  {room.hotel.name}
                                </h4>
                                <p className="text-gray-600 flex items-center">
                                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                  </svg>
                                  {room.hotel.address}
                                </p>
                              </div>

                              {/* Amenities */}
                              <div>
                                <h5 className="text-lg font-semibold text-gray-800 mb-3">Amenities</h5>
                                <div className="flex flex-wrap gap-3">
                                  {room.amenities.map((amenity, idx) => (
                                    <div 
                                      key={idx} 
                                      className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium border border-indigo-100 hover:from-indigo-100 hover:to-purple-100 transition-colors duration-300 flex items-center gap-2"
                                    >
                                      <img 
                                        src={getAmenityIcon(amenity)} 
                                        alt={amenity}
                                        className="w-4 h-4"
                                      />
                                      <span>{amenity}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Action Section */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-100">
                              <div className="text-center sm:text-left">
                                <p className="text-sm text-gray-500 mb-1">Starting from</p>
                                <p className="text-3xl font-bold text-gray-900">
                                  ${room.pricePerNight}
                                  <span className="text-lg text-gray-500 font-normal">/night</span>
                                </p>
                              </div>
                              <div className="flex gap-3">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    // Handle quick booking without navigation
                                  }}
                                  disabled={!room.isAvailable}
                                  className="px-4 py-2 rounded border border-gray-400 font-medium text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                                >
                                  {room.isAvailable ? 'Quick Book' : 'Unavailable'}
                                </button>
                                {!room.isAvailable && (
                                  <button
                                    className="px-4 py-2 rounded border border-gray-400 font-medium text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                                  >
                                    Pay Now
                                  </button>
                                )}
                                <span
                                  className="px-4 py-2 rounded border border-gray-400 font-medium text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                                >
                                  View Details →
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🏨</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No rooms found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters to see more options</p>
                  <button 
                    onClick={clearFilters}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Filter Sidebar - Right Side */}
          <div className="lg:w-1/3 xl:w-1/4">
            <div className="sticky top-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Filters</h2>
                  <button 
                    onClick={clearFilters}
                    className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                {/* Room Type Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Room Type</h3>
                  <div className="space-y-2">
                    {['Double Bed', 'King Suite', 'Single Bed', 'Deluxe Suite', 'Presidential Suite'].map(type => (
                      <label key={type} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="roomType"
                          value={type}
                          checked={filters.roomType === type}
                          onChange={() => {}} // Prevent default onChange behavior
                          onClick={() => handleRadioClick('roomType', type)}
                          className="text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="ml-3 text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Price Range</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Under $300', value: '0-299' },
                      { label: '$300 - $400', value: '300-400' },
                      { label: '$400 - $500', value: '400-500' },
                      { label: 'Above $500', value: '500-999999' }
                    ].map(range => (
                      <label key={range.value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="priceRange"
                          value={range.value}
                          checked={filters.priceRange === range.value}
                          onChange={() => {}} // Prevent default onChange behavior
                          onClick={() => handleRadioClick('priceRange', range.value)}
                          className="text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="ml-3 text-gray-700">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Amenities Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Amenities</h3>
                  <div className="space-y-2">
                    {allAmenities.map(amenity => (
                      <label key={amenity} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.amenities.includes(amenity)}
                          onChange={() => handleFilterChange('amenities', amenity)}
                          className="text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-gray-700 flex items-center gap-2">
                          <img 
                            src={getAmenityIcon(amenity)} 
                            alt={amenity}
                            className="w-4 h-4"
                          />
                          {amenity}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Availability Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Availability</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Available Now', value: 'available' },
                      { label: 'Unavailable', value: 'unavailable' }
                    ].map(status => (
                      <label key={status.value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="availability"
                          value={status.value}
                          checked={filters.availability === status.value}
                          onChange={() => {}} // Prevent default onChange behavior
                          onClick={() => handleRadioClick('availability', status.value)}
                          className="text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="ml-3 text-gray-700">{status.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Filter Summary */}
                {(filters.roomType || filters.priceRange || filters.amenities.length > 0 || filters.availability) && (
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Active Filters:</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {filters.roomType && <div>• Room: {filters.roomType}</div>}
                      {filters.priceRange && <div>• Price: ${filters.priceRange.replace('-', ' - $')}</div>}
                      {filters.amenities.length > 0 && <div>• Amenities: {filters.amenities.length} selected</div>}
                      {filters.availability && <div>• Status: {filters.availability}</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-16 p-8 bg-white rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Need Help Choosing?</h3>
          <p className="text-gray-600 mb-4">Our hospitality experts are here to help you find the perfect room for your stay.</p>
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  )
}

export default AllRooms
