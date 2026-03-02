import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import UserRegister from '../pages/auth/UserRegister'
import UserLogin from '../pages/auth/UserLogin'
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister'
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin'
import Home from '../pages/general/Home'
import Saved from '../pages/general/Saved'
import UserProfile from '../pages/general/UserProfile'
import CreateFood from '../pages/food-partner/CreateFood'
import Profile from '../pages/food-partner/Profile'

const AppRoutes = () => {
  return (
    <div>
        <Router>
            <Routes>
                <Route path="/user/register" element={<UserRegister />} />
                <Route path="/user/login" element={<UserLogin />} />
                <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
                <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
                <Route path="/" element={<Home />} />
                <Route path="/saved" element={<Saved />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/create-food" element={<CreateFood />} />  
                <Route path="/food-partner/:id" element={<Profile />} />
            </Routes> 
        </Router>
    </div>
  )
}

export default AppRoutes
