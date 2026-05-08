import React from 'react'
import { NavLink } from 'react-router-dom'

const BottomNav = () => {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <NavLink to="/saved" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <i className="ri-bookmark-line nav-icon" aria-hidden="true" />
        <span>Saved</span>
      </NavLink>

      <NavLink to="/home" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <i className="ri-home-5-line nav-icon" aria-hidden="true" />
        <span>Home</span>
      </NavLink>

      <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <i className="ri-user-3-line nav-icon" aria-hidden="true" />
        <span>Profile</span>
      </NavLink>
    </nav>
  )
}

export default BottomNav
