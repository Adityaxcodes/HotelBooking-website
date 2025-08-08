import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Listroom = () => {
  const { getToken } = useAppContext()
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = await getToken()
        const { data } = await axios.get('/api/rooms/owner', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (data.success) {
          setRooms(data.rooms)
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message || 'Failed to fetch rooms')
      }
    }
    fetchRooms()
  }, [getToken])

  // Toggle room availability
  const toggleAvailability = async (roomId) => {
    try {
      const token = await getToken()
      const { data } = await axios.post(
        '/api/rooms/toggle-availability',
        { roomId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        // Update local state
        setRooms(prev => prev.map(room =>
          room._id === roomId ? { ...room, isAvailable: !room.isAvailable } : room
        ))
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update availability')
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-20">
      <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Facility</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Price / Night</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {rooms.map((room) => (
              <tr key={room._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  {room.images && room.images[0] && (
                    <img
                      src={room.images[0]}
                      alt={room.roomType}
                      className="h-12 w-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{room.roomType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{room.amenities && room.amenities.join(', ')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${room.pricePerNight}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="px-4 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200 hover:bg-indigo-200 transition-colors">Edit</button>
                  <button className="ml-2 px-4 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition-colors">Delete</button>
                  <button
                    onClick={() => toggleAvailability(room._id)}
                    className={`ml-2 px-4 py-1 rounded-full text-xs font-semibold transition-colors ${
                      room.isAvailable
                        ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'
                        : 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200'
                    }`}>
                    {room.isAvailable ? 'Available' : 'Unavailable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Listroom
