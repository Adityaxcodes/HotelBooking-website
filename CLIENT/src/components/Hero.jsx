import React from 'react'
import { assets } from '../assets/assets.js'; // Ensure the correct path to assets

const HomePage = () => {
  return (
    <div className="bg-cover bg-center h-screen bg-hero-image flex flex-col items-start justify-center text-white pl-4 md:pl-[5vw] pt-32 md:pt-48">
      <p className="text-lg mb-6 bg-slate-500 rounded-full p-2 max-w-xs md:max-w-md">The Ultimate Hotel Experience</p>
      <h1 className="text-4xl md:text-6xl font-bold mb-6 font-playfair max-w-xs md:max-w-[60vw]">Discover Your Perfect Gateway Destination</h1>
      <p className="text-base max-w-xs md:max-w-md mb-6">Unparalleled luxury and comfort await at the world's most exclusive hotels and resorts. Start your journey today.</p>

      <form className='bg-white text-gray-500 rounded-lg px-6 py-4 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto'>
        <div>
          <div className='flex items-center gap-2'>
            <img src={assets.calenderIcon} alt="Calender" className='h-4'/>
            <label htmlFor="destinationInput">Destination</label>
          </div>
          <datalist id='destinations'>
            {assets.cities && assets.cities.map((city, index) => (
              <option key={index} value={city} />
            ))}
          </datalist>
          <input list='destinations' id="destinationInput" type="text" className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" placeholder="Type here" required />
        </div>

        <div>
          <div className='flex items-center gap-2'>
            <svg className="w-4 h-4 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 10h16M8 14h8m-4-7V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
            </svg>
            <label htmlFor="checkIn">Check in</label>
          </div>
          <input id="checkIn" type="date" className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
        </div>

        <div>
          <div className='flex items-center gap-2'>
            <svg className="w-4 h-4 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 10h16M8 14h8m-4-7V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
            </svg>
            <label htmlFor="checkOut">Check out</label>
          </div>
          <input id="checkOut" type="date" className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
        </div>

        <div className='flex md:flex-col max-md:gap-2 max-md:items-center'>
          <label htmlFor="guests">Guests</label>
          <input min={1} max={4} id="guests" type="number" className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none max-w-16" placeholder="0" />
        </div>

        <button className='flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1'>
          <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
          </svg>
          <span>Search</span>
        </button>
      </form>
    </div>
  )
}

export default HomePage
