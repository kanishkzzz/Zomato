import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../../styles/auth.css'

const UserLogin = () => {

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
      const response = await axios.post('http://localhost:3000/api/auth/user/login', formData, {
        withCredentials: true
      });
      console.log('Login Success:', response.data);
      setError('');
      navigate("/"); // Redirect to home page after successful login

    } catch(err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      console.error('Login Error:', errorMessage);
      setError(errorMessage);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-header">
          <div className="auth-logo">Zomato</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account to continue</p>
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
              placeholder="you@example.com"
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
            Don't have an account?
            <a href="/user/register" className="auth-footer-link">Create Account</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserLogin
