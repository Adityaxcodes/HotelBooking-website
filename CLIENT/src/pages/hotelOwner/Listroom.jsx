import React from 'react'
import { roomsDummyData } from '../../assets/assets'

const Listroom = () => {
  return (
    <div>
      <div className="col-span-2 overflow-x-auto bg-white rounded-2xl shadow-md mt-20">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Facility</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Price / Night</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {roomsDummyData.map((room, idx) => (
              <tr key={room._id || idx} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{room.roomType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{room.amenities && room.amenities.join(', ')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${room.pricePerNight}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="px-4 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200 hover:bg-indigo-200 transition-colors">Edit</button>
                  <button className="ml-2 px-4 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition-colors">Delete</button>
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
