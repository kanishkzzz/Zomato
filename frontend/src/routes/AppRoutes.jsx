import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
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

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token')
    if (!token) {
      return <Navigate to="/user/login" />
    }
    return children
  }
  
  return (
    <div>
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/user/register" element={<UserRegister />} />
                <Route path="/user/login" element={<UserLogin />} />
                <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
                <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
                {/* redirect default */}
                <Route path="/" element={<Navigate to="/user/login" />} />
                
                {/* Protected Routes */}
                <Route path="/home" element= {
                  <ProtectedRoute>
                    <Home /> 
                  </ProtectedRoute>
                }/>

                <Route path="/saved" element={
                  <ProtectedRoute>
                    <Saved />
                  </ProtectedRoute>
                } />

                <Route path="/profile" element={
                  <ProtectedRoute>
                    <UserProfile />
                    </ProtectedRoute>
                } />

                <Route path="/create-food" element={
                  <ProtectedRoute>
                  <CreateFood />
                  </ProtectedRoute>
                } />  

                <Route path="/food-partner/:id" element={
                  <ProtectedRoute>
                  <Profile />
                  </ProtectedRoute>
                } />

            </Routes> 
        </Router>
    </div>
  )
}

export default AppRoutes
