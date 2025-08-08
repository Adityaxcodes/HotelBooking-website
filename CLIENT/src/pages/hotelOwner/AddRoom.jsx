import React, { useState } from 'react'
import Title from '../../components/Title'
import { useAppContext } from '../../context/AppContext'
import axios from 'axios'
import toast from 'react-hot-toast'

const AddRoom = () => {

  const { getToken, navigate } = useAppContext()
  const [submitting, setSubmitting] = useState(false)

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

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    // Validate required fields
    if (!inputs.roomType || !inputs.pricePerNight || !Object.values(inputs.amenitites).some(v => v) || !Object.values(images).some(img => img)) {
      toast.error('Please complete all fields and upload at least one image')
      setSubmitting(false)
      return
    }
    try {
      const token = await getToken()
      const formData = new FormData()
      formData.append('roomType', inputs.roomType)
      formData.append('pricePerNight', inputs.pricePerNight)
      formData.append('amenitites', JSON.stringify(inputs.amenitites))
      // Append each selected file under 'images' once
      Object.values(images).forEach((file) => {
        if (file) formData.append('images', file)
      })

      const { data } = await axios.post(
        '/api/rooms',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )


      if (data.success) {
        toast.success('Room added successfully')
        // Reset form fields and images on successful addition
        setInputs({
          roomType: '',
          pricePerNight: 0,
          amenitites: {
            'Free Wifi': false,
            'Free Breakfast': false,
            'Room Service': false,
            'Mountain View': false,
            'Pool Access': false
          }
        })
        setImages({ 1: null, 2: null, 3: null, 4: null })
        navigate('/owner')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('createRoom error:', error.stack);
      toast.error(error.message || 'Failed to add room')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <form onSubmit={onSubmitHandler} className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6 sm:p-8">
       <Title title={'Add Room'} subTitle={'Fill the Details Carefully'} align={'left'} font={'playfair'} />
       <p className="font-semibold mb-2 mt-4">Images</p>
       <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between">
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
       </div>
       {/* Room Details Grid */}
       <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
         <div>
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
         <div>
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
        </div>
       </div>
       {/* Amenities Section */}
       <div className="mb-8">
         <label className="block mb-2 text-sm font-medium text-gray-700">Amenities</label>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        disabled={submitting}
        className="w-full bg-indigo-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Adding...' : 'Add Room'}
      </button>
    </form>
    </div>
  )
}
export default AddRoom