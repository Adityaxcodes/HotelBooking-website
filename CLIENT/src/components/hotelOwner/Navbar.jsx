import React from 'react'
import { assets } from '../../assets/assets'
import { UserButton } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between">
      <Link to='/' className="flex items-center gap-2">
        <img src={assets.logo} alt="logo" className="h-10 w-auto" />
        {/* Optionally add a site name here */}
      </Link>
      <div>
        <UserButton/>
      </div>
    </nav>
  )
}

export default Navbar
