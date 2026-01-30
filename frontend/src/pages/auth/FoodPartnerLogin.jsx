import React, { useState } from 'react'
import '../../styles/auth.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const FoodPartnerLogin = () => {

  const navigate = useNavigate();

  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/auth/food-partner/login', formData, {
        withCredentials: true
      });
      console.log('Login Success:', response.data);
      setError('');
      navigate("/create-food"); // Redirect to create food page after successful login
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      console.error('Error:', errorMessage);
      setError(errorMessage);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-header">
          <div className="auth-logo">Zomato</div>
          <span className="partner-type-badge">Food Partner</span>
          <h1 className="auth-title">Partner Dashboard</h1>
          <p className="auth-subtitle">Access your restaurant management dashboard</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="business@restaurant.com"
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
              placeholder="Enter your password"
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
            <div className="checkbox-group" style={{ marginBottom: 0 }}>
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="checkbox-input"
              />
              <label htmlFor="rememberMe" className="checkbox-label" style={{ marginBottom: 0 }}>
                Remember me
              </label>
            </div>
            <a href="#" style={{ color: 'var(--accent-color)', fontSize: 'var(--font-size-sm)', textDecoration: 'none', fontWeight: 500 }}>
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="form-button">Sign In</button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            New partner?
            <a href="/food-partner/register" className="auth-footer-link">Apply Now</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default FoodPartnerLogin
