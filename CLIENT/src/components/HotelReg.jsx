import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import { assets, cities } from '../assets/assets'
import { useAppContext } from '../context/AppContext.jsx'
import toast from 'react-hot-toast'
const HotelReg = () => {
  const { showHotelReg, setShowHotelReg, setisOwner, navigate, fetchUser, fetchRooms } = useAppContext();
  const { getToken } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validate form fields
    if (!name || !phone || !address || !city) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      const token = await getToken();
      console.log('Token for hotel registration:', token ? 'Token received' : 'No token');
      
      if (!token) {
        toast.error('Authentication required. Please log in again.');
        return;
      }
      
      const endpoint = '/api/hotels';
      console.log('Posting hotel registration to:', axios.defaults.baseURL + endpoint);
      const { data } = await axios.post(
        endpoint,
        { name, contact: phone, address, city },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('Hotel registration response:', data);
      
      // Handle both successful registration and already registered cases
      if (data.success) {
        // Determine owner status: use backend-updated role or default to true for already registered
        let isHotelOwner = false;
        if (data.updatedRole) {
          isHotelOwner = data.updatedRole === 'hotelOwner';
          console.log(`Updated role from response: ${data.updatedRole}`);
        } else if (data.message === 'Hotel Already Registered') {
          // Assume user is already a hotel owner
          isHotelOwner = true;
          console.log('Hotel already registered - assuming owner status');
        } else {
          // For new registrations, should be true
          isHotelOwner = true;
          console.log('New hotel registration - setting owner status to true');
        }
        setisOwner(isHotelOwner);
        setShowHotelReg(false);
        toast.success(data.message);
        // Refresh user data and rooms
        console.log('Fetching updated user data...');
        await fetchUser(true);
        console.log('Fetching rooms for hotel owner...');
        await fetchRooms();
        navigate('/owner');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Hotel registration error:', error);
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.message;
        if (status === 401) {
          toast.error('Authentication failed. Please log in again.');
        } else if (status === 400) {
          toast.error(`Validation error: ${message}`);
        } else {
          toast.error(`Error: ${message}`);
        }
      } else {
        toast.error('Network error. Please try again.');
      }
    }
  };

  if (!showHotelReg) return null;
  return (
    <div onClick={() => setShowHotelReg(false)} className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl overflow-hidden flex w-full max-w-3xl shadow-2xl">
        {/* Image half */}
        <div className="w-1/2 hidden md:block">
          <img src={assets.regImage} alt="Register" className="h-full w-full object-cover" />
        </div>
        {/* Form half */}
        <div className="w-full md:w-1/2 p-8 relative flex flex-col justify-center">
          <button type="button" className="absolute top-4 right-4" onClick={() => setShowHotelReg(false)}>
            <img src={assets.closeIcon} alt="Close" className="h-6 w-6" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Register Your Hotel</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
              <input id="name" type="text" placeholder="Enter hotel name" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input id="phone" type="tel" placeholder="Enter phone number" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input id="address" type="text" placeholder="Enter address" value={address} onChange={e => setAddress(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select name="city" id="city" value={city} onChange={e => setCity(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option value="">Select a city</option>
                {cities.map(c => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
            <div>
              <button type="submit" className="w-full bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition-colors">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HotelReg;