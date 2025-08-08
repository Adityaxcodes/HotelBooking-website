import React from 'react'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {

    const sidebarLinks = [
        {name : 'Dashboard', path : '/Owner', icon : assets.dashboardIcon},
        {name : 'Add Room', path : '/Owner/add-room', icon : assets.addIcon},
        {name : 'List Room', path : '/Owner/list-room', icon : assets.listIcon}
    ]
    
  return (
    <aside className="w-64 bg-white shadow-md h-full py-8 px-4 flex flex-col gap-4 mt-16">
      {sidebarLinks.map(link => (
        <NavLink
          to={link.path}
          key={link.name}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-medium text-gray-800 ${
              isActive ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'hover:bg-gray-50'
            }`
          }
          end
        >
          <img src={link.icon} alt={link.name} className="h-6 w-6" />
          <span>{link.name}</span>
        </NavLink>
      ))}
    </aside>
  )
}

export default Sidebar
