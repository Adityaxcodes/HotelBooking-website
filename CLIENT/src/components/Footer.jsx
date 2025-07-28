import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Footer = () => {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
    { name: 'Help', path: '/help' }
  ];

  const socialLinks = [
    { icon: assets.facebookIcon, name: 'Facebook', link: '#', gradient: 'from-blue-500 to-blue-600' },
    { icon: assets.instagramIcon, name: 'Instagram', link: '#', gradient: 'from-pink-500 to-purple-600' },
    { icon: assets.linkendinIcon, name: 'LinkedIn', link: '#', gradient: 'from-blue-600 to-blue-700' },
    { icon: assets.twitterIcon, name: 'Twitter', link: '#', gradient: 'from-blue-400 to-blue-500' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-10 py-16">
        {/* Logo and Description */}
        <div className="flex flex-col items-center mb-12">
          <img src={assets.logo} alt="Logo" className="h-12 mb-6 brightness-0 invert" />
          <p className="text-gray-400 max-w-md text-center">
            Experience luxury and comfort in our handpicked selection of premium accommodations worldwide.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {quickLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="font-medium text-gray-400 hover:text-white transition-colors duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6 mb-12">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3 rounded-full bg-gradient-to-r ${social.gradient} shadow-lg hover:shadow-xl hover:scale-110 transform transition-all duration-300 group relative`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img 
                src={social.icon} 
                alt={social.name} 
                className="w-5 h-5 brightness-0 invert relative z-10" 
              />
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-800 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>© 2024 QuickStay. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors duration-300">
              Privacy Policy
                </a>
            <a href="#" className="hover:text-white transition-colors duration-300">
              Terms of Service
                </a>
            </div>
        </div>
            </div>
        </footer>
  )
}

export default Footer
