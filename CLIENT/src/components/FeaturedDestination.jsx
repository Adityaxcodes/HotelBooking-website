import React from 'react'
import { useNavigate } from 'react-router-dom';
import HotelCard from './HotelCard';
import Title from './Title';
import { roomsDummyData } from '../assets/assets.js';

const FeaturedDestination = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-10 py-16">
      <Title 
        title="Featured Destinations" 
        subTitle="Popular Places" 
        align="center"
        font="playfair"
      />
      <div className="flex justify-center items-center mt-10">
        <div className="flex gap-6 pb-4">
          {roomsDummyData.map((room, index) => (
            <div className="min-w-[300px] flex-shrink-0" key={room._id}>
              <HotelCard room={room} index={index} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-12">
        <button 
          onClick={() => {navigate('/rooms');scrollTo(0,0)}}
          className="bg-indigo-600 text-white px-8 py-3 rounded-full font-medium hover:bg-indigo-700 transition-colors duration-300 flex items-center gap-2"
        >
          View all Destinations
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default FeaturedDestination
