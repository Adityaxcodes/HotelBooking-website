import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { userBookingsDummyData, assets } from '../assets/assets'

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch user bookings
    setTimeout(() => {
      setBookings(userBookingsDummyData)
      setFilteredBookings(userBookingsDummyData)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter bookings based on status
  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
    
    if (filter === 'all') {
      setFilteredBookings(bookings)
    } else if (filter === 'upcoming') {
      const upcoming = bookings.filter(booking => 
        new Date(booking.checkInDate) > new Date() && booking.status !== 'cancelled'
      )
      setFilteredBookings(upcoming)
    } else if (filter === 'past') {
      const past = bookings.filter(booking => 
        new Date(booking.checkOutDate) < new Date()
      )
      setFilteredBookings(past)
    } else if (filter === 'cancelled') {
      const cancelled = bookings.filter(booking => booking.status === 'cancelled')
      setFilteredBookings(cancelled)
    } else {
      const statusFiltered = bookings.filter(booking => booking.status === filter)
      setFilteredBookings(statusFiltered)
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  // Calculate number of nights
  const calculateNights = (checkIn, checkOut) => {
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
    return nights
  }

  // Get status badge styling
  const getStatusBadge = (status, isPaid) => {
    if (status === 'cancelled') {
      return 'bg-red-100 text-red-800 border border-red-200'
    }
    if (status === 'confirmed') {
      return 'bg-green-100 text-green-800 border border-green-200'
    }
    if (status === 'pending') {
      return isPaid ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 'bg-orange-100 text-orange-800 border border-orange-200'
    }
    return 'bg-gray-100 text-gray-800 border border-gray-200'
  }

  // Get payment status styling
  const getPaymentBadge = (isPaid) => {
    return isPaid 
      ? 'bg-green-100 text-green-800 border border-green-200'
      : 'bg-red-100 text-red-800 border border-red-200'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 font-playfair">My Bookings</h1>
          <p className="text-lg text-gray-600">Manage and track all your hotel reservations</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => new Date(b.checkInDate) > new Date() && b.status !== 'cancelled').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Past Stays</p>
                <p className="text-2xl font-bold text-blue-600">
                  {bookings.filter(b => new Date(b.checkOutDate) < new Date()).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${bookings.reduce((total, booking) => total + booking.totalPrice, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Bookings', count: bookings.length },
              { key: 'upcoming', label: 'Upcoming', count: bookings.filter(b => new Date(b.checkInDate) > new Date() && b.status !== 'cancelled').length },
              { key: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
              { key: 'confirmed', label: 'Confirmed', count: bookings.filter(b => b.status === 'confirmed').length },
              { key: 'past', label: 'Past', count: bookings.filter(b => new Date(b.checkOutDate) < new Date()).length },
              { key: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => handleFilterChange(filter.key)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                  activeFilter === filter.key
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 font-playfair">No bookings found</h3>
            <p className="text-gray-600 mb-6">You don't have any bookings matching the selected filter.</p>
            <Link 
              to="/rooms"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Book a Room
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <div className="flex flex-col lg:flex-row">
                  {/* Image Section */}
                  <div className="lg:w-1/3 relative">
                    <img
                      src={booking.room.images[0]}
                      alt={`${booking.hotel.name} - ${booking.room.roomType}`}
                      className="w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(booking.status, booking.isPaid)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentBadge(booking.isPaid)}`}>
                        {booking.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="lg:w-2/3 p-8 lg:p-10">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                      {/* Booking Details */}
                      <div className="flex-1">
                        <div className="mb-6">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2 font-playfair">
                            {booking.hotel.name}
                          </h3>
                          <p className="text-lg font-semibold text-indigo-600 mb-2 font-playfair">
                            {booking.room.roomType}
                          </p>
                          <div className="flex items-center text-gray-600 mb-4">
                            <svg className="w-5 h-5 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span>{booking.hotel.address}</span>
                          </div>
                        </div>

                        {/* Check-in/out Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="bg-gray-50 rounded-2xl p-4">
                            <div className="flex items-center mb-2">
                              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                              </svg>
                              <span className="text-sm font-medium text-gray-600">Check-in</span>
                            </div>
                            <p className="font-semibold text-gray-900">{formatDate(booking.checkInDate)}</p>
                            <p className="text-sm text-gray-500">From 3:00 PM</p>
                          </div>

                          <div className="bg-gray-50 rounded-2xl p-4">
                            <div className="flex items-center mb-2">
                              <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              <span className="text-sm font-medium text-gray-600">Check-out</span>
                            </div>
                            <p className="font-semibold text-gray-900">{formatDate(booking.checkOutDate)}</p>
                            <p className="text-sm text-gray-500">By 11:00 AM</p>
                          </div>
                        </div>

                        {/* Booking Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Nights</p>
                            <p className="font-semibold text-gray-900">{calculateNights(booking.checkInDate, booking.checkOutDate)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Guests</p>
                            <p className="font-semibold text-gray-900">{booking.guests}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Payment</p>
                            <p className="font-semibold text-gray-900">{booking.paymentMethod}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Booking ID</p>
                            <p className="font-semibold text-gray-900 text-xs">{booking._id.slice(-8).toUpperCase()}</p>
                          </div>
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="lg:text-right">
                        <div className="mb-6">
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="text-3xl font-bold text-indigo-600">${booking.totalPrice}</p>
                        </div>

                        <div className="space-y-3">
                          <Link
                            to={`/rooms/${booking.room._id}`}
                            className="block w-full px-6 py-3 bg-indigo-600 text-white text-center font-semibold rounded-full hover:bg-indigo-700 transition-colors duration-300"
                          >
                            View Room Details
                          </Link>
                          
                          {/* Pay Now button for unpaid bookings */}
                          {!booking.isPaid && booking.status === 'pending' && (
                            <button className="block w-full px-6 py-3 bg-green-600 text-white text-center font-semibold rounded-full hover:bg-green-700 transition-colors duration-300">
                              Pay Now
                            </button>
                          )}
                          
                          {booking.status === 'pending' && (
                            <button className="block w-full px-6 py-3 border-2 border-gray-300 text-gray-700 text-center font-semibold rounded-full hover:bg-gray-50 transition-colors duration-300">
                              Cancel Booking
                            </button>
                          )}
                          
                          {new Date(booking.checkOutDate) < new Date() && (
                            <button className="block w-full px-6 py-3 border-2 border-indigo-600 text-indigo-600 text-center font-semibold rounded-full hover:bg-indigo-50 transition-colors duration-300">
                              Write Review
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookings