import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { authAPI } from '../services/api'

const Login = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('login')
  const [isLoading, setIsLoading] = useState(false)
  const [loginData, setLoginData] = useState({ username: '', password: '' })
  const [registerData, setRegisterData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!loginData.username || !loginData.password) {
      toast.error('Please fill in all fields')
      return
    }
    
    setIsLoading(true)
    
    try {
      const data = await authAPI.login(loginData.username, loginData.password)
      localStorage.setItem('access_token', data.access_token)
      toast.success('Login successful! Redirecting...')
      
      // Принудительный редирект через замену текущего URL
      setTimeout(() => {
        window.location.href = '/'
      }, 500)
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.response?.data?.detail || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    
    const { username, email, password, confirmPassword } = registerData
    
    if (!username || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }
    
    setIsLoading(true)
    
    try {
      await authAPI.register({ username, email, password })
      toast.success('Registration successful! Please login.')
      setActiveTab('login')
      setRegisterData({ username: '', email: '', password: '', confirmPassword: '' })
      setLoginData({ username: '', password: '' })
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error.response?.data?.detail || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      margin: 0,
      width: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'auto'
    }}>
      <Toaster position="top-right" />
      
      <div className="container" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="logo" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="logo-icon" style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #6c7bff, #8e7bff)',
            borderRadius: '16px',
            margin: '0 auto 16px'
          }}></div>
          <h1 style={{ color: 'white', fontSize: '32px', marginBottom: '8px' }}>LinkNest</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>Bookmark Manager</p>
        </div>

        <div className="card" style={{
          background: 'white',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <div className="tabs" style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '30px',
            borderBottom: '2px solid #f0f0f0'
          }}>
            <div 
              className={`tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '12px',
                cursor: 'pointer',
                color: activeTab === 'login' ? '#6c7bff' : '#8a94a6',
                fontWeight: 500,
                borderBottom: activeTab === 'login' ? '2px solid #6c7bff' : '2px solid transparent',
                marginBottom: '-2px',
                transition: 'all 0.3s'
              }}
            >
              Login
            </div>
            <div 
              className={`tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '12px',
                cursor: 'pointer',
                color: activeTab === 'register' ? '#6c7bff' : '#8a94a6',
                fontWeight: 500,
                borderBottom: activeTab === 'register' ? '2px solid #6c7bff' : '2px solid transparent',
                marginBottom: '-2px',
                transition: 'all 0.3s'
              }}
            >
              Register
            </div>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontSize: '14px', fontWeight: 500 }}>
                  Username
                </label>
                <input 
                  type="text" 
                  placeholder="Enter your username"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e6e9ef',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontSize: '14px', fontWeight: 500 }}>
                  Password
                </label>
                <input 
                  type="password" 
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e6e9ef',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
              <button 
                type="submit" 
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #6c7bff, #8e7bff)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                  transition: 'all 0.3s'
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login →'}
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontSize: '14px', fontWeight: 500 }}>
                  Username
                </label>
                <input 
                  type="text" 
                  placeholder="Choose a username"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e6e9ef',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontSize: '14px', fontWeight: 500 }}>
                  Email
                </label>
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e6e9ef',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontSize: '14px', fontWeight: 500 }}>
                  Password
                </label>
                <input 
                  type="password" 
                  placeholder="Create a password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e6e9ef',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </div>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontSize: '14px', fontWeight: 500 }}>
                  Confirm Password
                </label>
                <input 
                  type="password" 
                  placeholder="Confirm your password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e6e9ef',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </div>
              <button 
                type="submit" 
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #6c7bff, #8e7bff)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                  transition: 'all 0.3s'
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login