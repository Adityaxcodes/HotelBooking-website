import React, { useState } from 'react'
import Title from '../../components/Title'

const AddRoom = () => {

  const[images, setImages] = useState({
    1:null,
    2:null,
    3:null,
    4:null,
  })
  
  const[inputs, setInputs] = useState({
    roomType : '',
    pricePerNight : 0,
    amenitites : {
      'Free Wifi' : false,
      'Free Breakfast' : false,
      'Room Service' : false,
      "Mountain View" : false,
      'Pool Access' : false
    }
  })
 
  const handleImageChange = (e, key) => {
    const file = e.target.files[0];
    setImages(prev => ({ ...prev, [key]: file }));
  }

  return (
    <form className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-md mt-20">
      <Title title={'Add Room'} subTitle={'Fill the Details Carefully'} align={'left'} font={'playfair'} />
      <p className="font-semibold mb-2 mt-4">Images</p>
      <div className="flex gap-8 mb-6">
        {Object.keys(images).map(key => (
          <div key={key} className="flex flex-col items-center">
            <label htmlFor={`roomImage${key}`} className="mb-2 text-sm font-medium text-gray-700">Image {key}</label>
            <input
              type="file"
              id={`roomImage${key}`}
              accept="image/*"
              onChange={e => handleImageChange(e, key)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {images[key] && (
              <img
                src={URL.createObjectURL(images[key])}
                alt={`Preview ${key}`}
                className="mt-2 h-24 w-24 object-cover rounded-lg border"
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="mb-6">
        <label htmlFor="roomType" className="block mb-2 text-sm font-medium text-gray-700">Room Type</label>
        <select
          id="roomType"
          value={inputs.roomType}
          onChange={e => setInputs({ ...inputs, roomType: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select Room Type</option>
          <option value="Single">Single Bed</option>
          <option value="Double">Double Bed</option>
          <option value="Luxury">Luxury Room</option>
          <option value="Family Suite">Family Suite</option>
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="pricePerNight" className="block mb-2 text-sm font-medium text-gray-700">Price <span className="text-xs text-gray-500">/night</span></label>
        <input
          type="number"
          id="pricePerNight"
          min="0"
          placeholder="0"
          value={inputs.pricePerNight}
          onChange={e => setInputs({ ...inputs, pricePerNight: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="mb-8">
        <label className="block mb-2 text-sm font-medium text-gray-700">Amenities</label>
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(inputs.amenitites).map((amenity) => (
            <label key={amenity} className="flex items-center gap-2 text-gray-700 text-sm">
              <input
                type="checkbox"
                checked={inputs.amenitites[amenity]}
                onChange={e => setInputs({
                  ...inputs,
                  amenitites: {
                    ...inputs.amenitites,
                    [amenity]: e.target.checked
                  }
                })}
                className="accent-indigo-600 h-4 w-4 rounded"
              />
              {amenity}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-indigo-700 transition-colors"
      >
        Add Room
      </button>
    </form>

  ) 
}

export default AddRoom