import React, { useState } from 'react'
import axios from 'axios'
import '../../styles/auth.css'
import { useNavigate } from 'react-router-dom'

const UserRegister = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    agreeTerms: false
  })

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    

    try{
      const response = await axios.post('http://localhost:3000/api/auth/user/register', formData, {
        withCredentials: true
      });

      console.log('Success:', response.data);
      setError('');
      navigate("/"); // Redirect to home page after successful registration
    }catch(err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      console.error('Error:', errorMessage);
      setError(errorMessage);
    }
      
  }

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-header">
          <div className="auth-logo">Zomato</div>
          <h1 className="auth-title">Create Your Account</h1>
          <p className="auth-subtitle">Join us to discover amazing food experiences</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              className="form-input"
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="terms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="checkbox-input"
            />
            <label htmlFor="terms" className="checkbox-label">
              I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </label>
          </div>

          <button type="submit" className="form-button">Register</button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Already have an account?
            <a href="/user/login" className="auth-footer-link">Sign In</a>
          </p>
          <p className="auth-footer-text" style={{ marginTop: 'var(--spacing-lg)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--border-color)' }}>
            Want to register a restaurant?
            <a href="/food-partner/register" className="auth-footer-link">Register as Food Partner</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserRegister
