import React from 'react'
import { testimonials } from '../assets/assets'
import Title from './Title'
import { assets } from '../assets/assets'

const Testimonials = () => {
  const totalStars = 5; // Total number of stars to display

  return (
    <div className="container mx-auto px-10 py-16">
      <Title 
        title="What Our Guests Say" 
        subTitle="Guest Reviews"
        align="center"
      />
      
      <div className="flex justify-center items-stretch gap-8 mt-12 overflow-x-auto pb-4">
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial.id} 
            className="bg-white rounded-2xl p-6 shadow-lg min-w-[350px] max-w-[350px] flex flex-col relative z-10 mt-10"
          >
            {/* Profile Image - Floating */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-20">
              <img 
                src={testimonial.image} 
                alt={testimonial.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-xl"
              />
            </div>

            {/* Rating Stars */}
            <div className="flex gap-1 mb-4 mt-8">
              {[...Array(totalStars)].map((_, index) => (
                <img 
                  key={index}
                  src={index < testimonial.rating ? assets.starIconFilled : assets.starIconOutlined}
                  alt="star"
                  className="w-5 h-5"
                />
              ))}
            </div>

            {/* Review Text */}
            <p className="text-gray-600 flex-grow">
              "{testimonial.review}"
            </p>

            {/* User Info */}
            <div className="flex flex-col items-center gap-1 mt-6 pt-6 border-t border-gray-100">
              <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
              <p className="text-sm text-gray-500">{testimonial.address}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Testimonials
