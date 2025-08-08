import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { assets, roomCommonData } from '../assets/assets'
// Use axios instance from context for baseURL
import toast from 'react-hot-toast'
// axios instance uses defaults.baseURL set in AppContext
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'

const RoomDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  // Booking form state
  const { getToken } = useAuth()
  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]
  const [checkInDate, setCheckInDate] = useState(today)
  const [checkOutDate, setCheckOutDate] = useState(tomorrow)
  const [guestsCount, setGuestsCount] = useState(1)
  const [specialRequest, setSpecialRequest] = useState('')
  const [extras, setExtras] = useState({ breakfast: false, transfer: false, spa: false })

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true)
      try {
        // Fetch all rooms and find the specific one
        const { data } = await axios.get('/api/rooms')
        
        if (data.success) {
          const foundRoom = data.rooms.find(room => room._id === id)
          
          if (foundRoom) {
            setRoom(foundRoom)
          } else {
            toast.error('Room not found')
            navigate('/rooms')
          }
        } else {
          toast.error(data.message)
          navigate('/rooms')
        }
      } catch (err) {
        toast.error(err.message || 'Failed to fetch room details')
        navigate('/rooms')
      } finally {
        setLoading(false)
      }
    }
    fetchRoom()
  }, [id, navigate])

  // Calculate pricing
  const calculateNights = () => {
    const diff = new Date(checkOutDate) - new Date(checkInDate)
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0
  }
  const nights = calculateNights()
  const extrasCost = (extras.breakfast ? 25 * nights : 0) + (extras.transfer ? 45 : 0) + (extras.spa ? 30 * nights : 0)
  const subtotal = room ? room.pricePerNight * nights + extrasCost : 0
  const taxes = Math.round(subtotal * 0.12)
  const totalPrice = subtotal + taxes
  // Handle booking submission
  const handleBooking = async () => {
    if (nights <= 0) return toast.error('Check-out date must be after check-in date')
    if (!room?.isAvailable) return
    try {
      const token = await getToken()
      const bookingData = { room: room._id, hotel: room.hotel._id, checkInDate, checkOutDate, guests: guestsCount, specialRequests: specialRequest, extras, totalPrice }
      const { data } = await axios.post('/api/bookings/book', bookingData, { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        toast.success('Booking successful!')
        navigate('/mybookings')
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message || 'Booking failed')
    }
  }


  // Function to get icon for amenity
  const getAmenityIcon = (amenity) => {
    const amenityIconMap = {
      'Free WiFi': assets.freeWifiIcon,
      'Free Breakfast': assets.freeBreakfastIcon,
      'Room Service': assets.roomServiceIcon,
      'Mountain View': assets.mountainIcon,
      'Pool Access': assets.poolIcon,
      'Free Wifi': assets.freeWifiIcon,
      'Wifi': assets.freeWifiIcon,
      'Pool': assets.poolIcon,
      'Breakfast': assets.freeBreakfastIcon,
      'Service': assets.roomServiceIcon,
      'Mountain': assets.mountainIcon,
      'View': assets.mountainIcon
    }
    
    if (amenityIconMap[amenity]) {
      return amenityIconMap[amenity]
    }
    
    const amenityLower = amenity.toLowerCase()
    for (const [key, icon] of Object.entries(amenityIconMap)) {
      if (amenityLower.includes(key.toLowerCase()) || key.toLowerCase().includes(amenityLower)) {
        return icon
      }
    }
    
    return assets.badgeIcon
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading room details...</p>
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏨</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Room not found</h2>
          <p className="text-gray-600 mb-6">The room you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/rooms')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors"
          >
            Back to Rooms
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/rooms')}
            className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Rooms
          </button>
        </div>

        {/* Hotel Information Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl font-bold text-gray-900 font-playfair">{room.hotel.name}</h1>
                <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  room.isAvailable 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {room.isAvailable ? '✓ Available' : '✗ Unavailable'}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg">{room.hotel.address}</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-gray-900">4.8</span>
                    <span className="text-gray-600">(256 reviews)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center lg:text-right">
              <div className="mb-4">
                <span className="text-sm text-gray-500 block">Starting from</span>
                <span className="text-4xl font-bold text-indigo-600">${room.pricePerNight}</span>
                <span className="text-lg text-gray-500">/night</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2 font-playfair">{room.roomType}</div>
            </div>
          </div>
        </div>

        {/* Image Gallery Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 font-playfair">Room Gallery</h2>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Large Image - Left Side */}
            <div className="lg:w-2/3">
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={room.images[selectedImageIndex]}
                  alt={`${room.hotel.name} - ${room.roomType} - Image ${selectedImageIndex + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                
                {/* Image Navigation Arrows */}
                <button 
                  onClick={() => setSelectedImageIndex(prev => 
                    prev === 0 ? room.images.length - 1 : prev - 1
                  )}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button 
                  onClick={() => setSelectedImageIndex(prev => 
                    prev === room.images.length - 1 ? 0 : prev + 1
                  )}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  </button>
                
                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImageIndex + 1} / {room.images.length}
                </div>
              </div>
            </div>

            {/* Thumbnail Images - Right Side */}
            <div className="lg:w-1/3">
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 max-h-[500px] overflow-y-auto">
                {room.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative h-24 lg:h-32 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                      selectedImageIndex === index 
                        ? 'ring-4 ring-indigo-500 ring-opacity-75 shadow-lg' 
                        : 'hover:ring-2 hover:ring-indigo-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {selectedImageIndex === index && (
                      <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                        <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Room Common Features Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What Makes This Place Special</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roomCommonData.map((feature, index) => (
              <div key={index} className="text-center group hover:bg-gray-50 p-4 rounded-2xl transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors duration-300">
                  <img 
                    src={feature.icon} 
                    alt={feature.title}
                    className="w-8 h-8"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-playfair">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Room Details Section - Optimized */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">Room Details</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Amenities - Compact */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Amenities</h3>
              <div className="grid grid-cols-1 gap-2">
                {room.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <img 
                      src={getAmenityIcon(amenity)} 
                      alt={amenity}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700 text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Information - Compact */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Room Info</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Room Type</span>
                  <span className="font-semibold text-gray-900">{room.roomType}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Price per Night</span>
                  <span className="font-semibold text-indigo-600">${room.pricePerNight}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Availability</span>
                  <span className={`font-semibold text-sm ${room.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {room.isAvailable ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>
            </div>

            {/* Check-in/out Times - Compact */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Hotel Policies</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Check-in</span>
                  <span className="font-semibold text-gray-900">3:00 PM</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Check-out</span>
                  <span className="font-semibold text-gray-900">11:00 AM</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Cancellation</span>
                  <span className="font-semibold text-gray-900">Free</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 font-playfair">Book Your Stay</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Check-in Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Check-in Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    min={checkInDate}
                    value={checkInDate}
                    onChange={e => setCheckInDate(e.target.value)}
                  />
                </div>
                {/* Check-out Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Check-out Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    min={checkInDate}
                    value={checkOutDate}
                    onChange={e => setCheckOutDate(e.target.value)}
                  />
                </div>
                {/* Guests */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Guests</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={guestsCount}
                    onChange={e => setGuestsCount(Number(e.target.value))}
                  >
                    {[1,2,3,4].map(n => <option key={n} value={n}>{n} Guest{n>1?'s':''}</option>)}
                    <option value={5}>5+ Guests</option>
                  </select>
                </div>
                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Special Requests</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={specialRequest}
                    onChange={e => setSpecialRequest(e.target.value)}
                  >
                    <option value="">None</option>
                    <option value="early-checkin">Early Check-in</option>
                    <option value="late-checkout">Late Check-out</option>
                    <option value="high-floor">High Floor</option>
                    <option value="quiet-room">Quiet Room</option>
                    <option value="airport-pickup">Airport Pickup</option>
                  </select>
                </div>
              </div>
              {/* Additional Options */}
              <div className="space-y-3 mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={extras.breakfast}
                    onChange={e => setExtras(prev => ({ ...prev, breakfast: e.target.checked }))
                    }
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-3 text-gray-700">Add breakfast (+$25/night)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={extras.transfer}
                    onChange={e => setExtras(prev => ({ ...prev, transfer: e.target.checked }))
                    }
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-3 text-gray-700">Airport transfer (+$45)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={extras.spa}
                    onChange={e => setExtras(prev => ({ ...prev, spa: e.target.checked }))
                    }
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-3 text-gray-700">Spa access (+$30/day)</span>
                </label>
              </div>
            </div>
            {/* Booking Summary */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center"><span className="text-gray-600">Room Type</span><span className="font-semibold text-gray-900">{room.roomType}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600">Price per night</span><span className="font-semibold text-gray-900">${room.pricePerNight}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600">Nights</span><span className="font-semibold text-gray-900">{nights}</span></div>
                <hr className="border-gray-300" />
                <div className="flex justify-between items-center"><span className="text-gray-600">Subtotal</span><span className="font-semibold text-gray-900">${subtotal}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600">Taxes & Fees</span><span className="font-semibold text-gray-900">${taxes}</span></div>
                <hr className="border-gray-300" />
                <div className="flex justify-between items-center text-lg"><span className="font-bold text-gray-900">Total</span><span className="font-bold text-indigo-600">${totalPrice}</span></div>
              </div>
              <button
                onClick={handleBooking}
                disabled={!room.isAvailable || nights <= 0}
                className={`w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${room.isAvailable ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              >{room.isAvailable && nights>0 ? 'Book Now' : 'Unavailable'}</button>
              <p className="text-xs text-gray-500 mt-3 text-center">Free cancellation until 24 hours before check-in</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => navigate('/rooms')}
              className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-full font-semibold hover:bg-indigo-50 transition-colors duration-300"
            >
              Compare Other Rooms
            </button>
            <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-colors duration-300">
              Save to Wishlist
            </button>
            <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-colors duration-300">
              Share Room
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomDetails
