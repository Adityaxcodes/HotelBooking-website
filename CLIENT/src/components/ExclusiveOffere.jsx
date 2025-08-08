import React from 'react'
import { exclusiveOffers } from '../assets/assets'
import Title from './Title'
import { useNavigate } from 'react-router-dom'

const ExclusiveOffers = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-10 py-16 bg-gray-50">
      <div className="flex justify-between items-center mb-12">
        <div className="max-w-2xl">
          <Title 
            title="Exclusive Offers" 
            subTitle="Special Deals Just For You"
            align="left"
          />
        </div>
        <button 
          onClick={() => {navigate('/offers'); scrollTo(0,0)}}
          className="bg-white text-indigo-600 px-6 py-3 rounded-full font-medium border-2 border-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 flex items-center gap-2"
        >
          View All Offers
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {exclusiveOffers.map((offer) => (
          <div key={offer._id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* Image Section */}
            <div className="relative">
              <img 
                src={offer.image} 
                alt={offer.title} 
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {offer.priceOff}% OFF
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-playfair">
                {offer.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {offer.description}
              </p>
              
              {/* Footer Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                  Expires {offer.expiryDate}
                </div>
                <button className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors duration-300">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExclusiveOffers
