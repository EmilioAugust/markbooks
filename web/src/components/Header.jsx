import React, { useState, useRef, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'
import Avatar from './Avatar'

const Header = ({ userName, bookmarkCount, onAddBookmark, onLogout }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const getTimeOfDay = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'morning'
    if (hour < 18) return 'afternoon'
    return 'evening'
  }

  const toggleProfileMenu = (e) => {
    e.stopPropagation()
    setShowProfileMenu(!showProfileMenu)
  }

  return (
    <div className="header">
      <div>
        <h2>Good {getTimeOfDay()}, {userName || 'Alex'} 👋</h2>
        <small>You have <span>{bookmarkCount}</span> bookmarks</small>
      </div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button className="btn" onClick={onAddBookmark}>+ Add Bookmark</button>
        <ThemeToggle />
        <div className="profile" ref={profileRef}>
          <Avatar 
            username={userName} 
            size={36} 
            onClick={toggleProfileMenu}
          />
          <div 
            className="profile-menu" 
            style={{ 
              display: showProfileMenu ? 'block' : 'none',
              position: 'absolute',
              top: '45px',
              right: '0',
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
              padding: '8px',
              width: '120px',
              zIndex: 100
            }}
          >
            <div 
              onClick={onLogout}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Logout
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header