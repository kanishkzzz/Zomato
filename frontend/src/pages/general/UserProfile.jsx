import React from 'react'
import '../../styles/home.css'
import BottomNav from '../../components/BottomNav'

const UserProfile = () => {
  return (
    <main className="profile-screen">
      <section className="profile-placeholder">
        <h1>User Profile</h1>
        <p>This page is intentionally empty for now. Profile features will be added next.</p>
      </section>

      <BottomNav />
    </main>
  )
}

export default UserProfile
