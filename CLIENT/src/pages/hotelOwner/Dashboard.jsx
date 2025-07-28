import React from 'react'
import { assets, dashboardDummyData } from '../../assets/assets'

const Dashboard = () => {
  return (
    <div className="p-4 md:p-8 mt-20">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Total Bookings Card */}
        <div className="flex items-center bg-white rounded-2xl shadow-md p-6 gap-6">
          <div className="bg-indigo-100 p-4 rounded-full">
            <img src={assets.totalBookingIcon} alt="Total bookings" className="h-10 w-10" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{dashboardDummyData.totalBookings}</p>
          </div>
        </div>
        {/* Total Revenue Card */}
        <div className="flex items-center bg-white rounded-2xl shadow-md p-6 gap-6">
          <div className="bg-green-100 p-4 rounded-full">
            <img src={assets.totalRevenueIcon} alt="Total Revenue" className="h-10 w-10" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">${dashboardDummyData.totalRevenue}</p>
          </div>
        </div>

        {/* Bookings table  */}
        <h2 className="col-span-2 text-xl font-semibold mt-10 mb-4 text-gray-800">Recent Bookings</h2>
        <div className="col-span-2 overflow-x-auto bg-white rounded-2xl shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">User Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Room Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Total Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Payment Status</th>
                </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
                {dashboardDummyData.bookings.map((item, index)=>(
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.user.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.room.roomType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${item.totalPrice}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            className={`px-4 py-1 rounded-full text-xs font-semibold shadow transition-colors duration-200
                              ${item.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}
                            disabled
                          >
                            {item.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid'}
                          </button>
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
