import React, { use } from 'react'
import '../../styles/home.css'
import BottomNav from '../../components/BottomNav'
import '../../styles/userProfile.css'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'


export default function userProfile() {
  const id = useParams();
  const [profile, setProfile] = useState({});

  useEffect(() => {
  const getProfile = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/user/${id}`,
        { withCredentials: true }
      );
      const userData = res.data.user || {};
      setProfile(userData);
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };
  getProfile();
  }, [id]);

  return (
    <main className="profile-screen">

      <section className="profile-container">

        <div className="profile-card">

          <img 
            className='profile-image'
            src="https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?q=80&w=687&auto=format&fit=crop"
            alt="profile-placeholder" 
          />

          <div className="profile-content">

            <div className="profile-header">
              <h2>Sophie Bennet</h2>
              <span>✔</span>
            </div>

            <p className="profile-bio">
              I review food and share my honest opinions. Follow me for delicious content and honest reviews! 
            </p>

            <div className="profile-footer">

              <div className="stats">
                <span>🎥 312</span>
                <span>❤️ 48</span>
              </div>

              <button className="follow-btn">
                Follow +
              </button>

            </div>

          </div>

        </div>

      </section>

      <BottomNav />

    </main>
  )
}