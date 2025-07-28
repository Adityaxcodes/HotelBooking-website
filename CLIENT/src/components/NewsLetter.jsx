import React from 'react'
import Title from './Title'

const NewsLetter = () => {
  return (
    <div className="container mx-auto px-10 py-16 bg-indigo-50">
      <div className="max-w-4xl mx-auto text-center">
        <Title 
          title="Subscribe to Our Newsletter" 
          subTitle="Stay Updated with Our Latest Offers"
          align="center"
        />
        
        <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
          Join our newsletter and be the first to know about exclusive deals, seasonal offers, 
          and travel tips. Get inspired for your next adventure!
        </p>

        <div className="mt-10">
          <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-grow px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:border-indigo-500 transition-colors duration-300"
            />
            <button 
              type="submit"
              className="bg-indigo-600 text-white px-8 py-4 rounded-full font-medium hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              Subscribe Now
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-500">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {/* Feature 1 */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-full shadow-md mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 12 .375a2.625 2.625 0 0 0 0 4.5Z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Personalized Offers</h3>
            <p className="text-gray-600 text-center">Get deals tailored to your preferences</p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-full shadow-md mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Early Access</h3>
            <p className="text-gray-600 text-center">Be first to know about new properties</p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-full shadow-md mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Travel Tips</h3>
            <p className="text-gray-600 text-center">Expert advice for your trips</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsLetter
