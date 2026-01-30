import React, { useState } from 'react'
import axios from 'axios'
import '../../styles/auth.css'
import { useNavigate } from 'react-router-dom'

const FoodPartnerRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerName: '',
    email: '',
    phone: '',
    restaurantType: '',
    address: '',
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
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3000/api/auth/food-partner/register', {
        name: formData.ownerName,
        businessName: formData.restaurantName,
        email: formData.email,
        phone: formData.phone,
        restaurantType: formData.restaurantType,
        address: formData.address,
        password: formData.password
      }, {
        withCredentials: true
      });

      console.log('Success:', response.data);
      setError('');
      navigate('/create-food'); // Redirect to login after successful registration
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      console.error('Error:', errorMessage);
      setError(errorMessage);
    }
  }

  const restaurantTypes = [
    'Fast Food',
    'Casual Dining',
    'Fine Dining',
    'Cafe',
    'Bakery',
    'Cloud Kitchen',
    'Quick Service',
    'Other'
  ]

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-header">
          <div className="auth-logo">Zomato</div>
          <span className="partner-type-badge">Food Partner</span>
          <h1 className="auth-title">Grow Your Restaurant</h1>
          <p className="auth-subtitle">Partner with us and reach millions of customers</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
          <div className="form-group">
            <label className="form-label">Restaurant Name</label>
            <input
              type="text"
              name="restaurantName"
              value={formData.restaurantName}
              onChange={handleChange}
              placeholder="Your restaurant name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Owner's Full Name</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
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
              placeholder="business@restaurant.com"
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
            <label className="form-label">Restaurant Type</label>
            <select
              name="restaurantType"
              value={formData.restaurantType}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select restaurant type</option>
              {restaurantTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address"
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
              I agree to the <a href="#">Partner Terms</a> and <a href="#">Privacy Policy</a>
            </label>
          </div>

          <button type="submit" className="form-button">Get Started</button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Already a partner?
            <a href="/food-partner/login" className="auth-footer-link">Sign In</a>
          </p>
          <p className="auth-footer-text" style={{ marginTop: 'var(--spacing-lg)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--border-color)' }}>
            Looking to order food?
            <a href="/user/register" className="auth-footer-link">Register as User</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default FoodPartnerRegister
