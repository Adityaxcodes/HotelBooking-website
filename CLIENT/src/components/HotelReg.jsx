import React, { useState } from 'react'
import { assets, cities } from '../assets/assets'

const HotelReg = () => {
  const [open, setOpen] = useState(true)
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl overflow-hidden flex w-full max-w-3xl shadow-2xl">
        {/* Left: Image half */}
        <div className="w-1/2 hidden md:block">
          <img
            src={assets.regImage}
            alt="Register"
            className="h-full w-full object-cover"
          />
        </div>
        {/* Right: Form half */}
        <div className="w-full md:w-1/2 p-8 relative flex flex-col justify-center">
          {/* Close button */}
          <button
            type="button"
            className="absolute top-4 right-4"
            onClick={() => setOpen(false)}
          >
            <img src={assets.closeIcon} alt="Close" className="h-6 w-6" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Register Your Hotel</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
              <input id="name" type="text" placeholder="Enter hotel name" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input id="phone" type="tel" placeholder="Enter phone number" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input id="address" type="text" placeholder="Enter address" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select name="city" id="city" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option value="">Select a city</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div>
              <button type="submit" className="w-full bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition-colors">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default HotelReg
