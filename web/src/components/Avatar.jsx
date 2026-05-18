import React from 'react'

const Avatar = ({ username, size = 36, onClick }) => {
  const getAvatarLetter = () => {
    if (!username) return '?'
    return username.charAt(0).toUpperCase()
  }

  const getAvatarColor = () => {
    if (!username) return '#985BE8'
    
    const colors = [
      '#985BE8', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
      '#EC4899', '#06B6D4', '#8B5CF6', '#14B8A6', '#F97316',
      '#6366F1', '#A855F7', '#EC4899', '#F43F5E'
    ]
    
    let sum = 0
    for (let i = 0; i < username.length; i++) {
      sum += username.charCodeAt(i)
    }
    
    return colors[sum % colors.length]
  }

  const avatarColor = getAvatarColor()
  const avatarLetter = getAvatarLetter()

  return (
    <div
      className="avatar"
      onClick={onClick}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}dd)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontWeight: 'bold',
        fontSize: `${size * 0.5}px`,
        color: 'white',
        textTransform: 'uppercase',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
      onMouseEnter={(e) => {
        if (e.currentTarget.style) {
          e.currentTarget.style.transform = 'scale(1.05)'
        }
      }}
      onMouseLeave={(e) => {
        if (e.currentTarget.style) {
          e.currentTarget.style.transform = 'scale(1)'
        }
      }}
    >
      {avatarLetter}
    </div>
  )
}

export default Avatar