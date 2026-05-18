import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { 
  getTagColor, 
  getBadgeBackgroundColor, 
  getBadgeTextColor,
  truncateText,
  truncateUrl 
} from '../utils/helpers'

const defaultIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23985BE8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20'%3E%3C/path%3E%3Cpath d='M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'%3E%3C/path%3E%3C/svg%3E"

const BookmarkCard = ({ bookmark, onToggleFavorite, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  
  const isDarkMode = document.body.classList.contains('dark')

  const handleMenuClick = (e) => {
    e.stopPropagation()
    const rect = e.target.getBoundingClientRect()
    setMenuPosition({
      top: rect.bottom + 5,
      left: rect.right - 150
    })
    setShowMenu(!showMenu)
  }

  const handleCardClick = (e) => {
    if (e.target.classList.contains('card-menu-btn') || 
        e.target.classList.contains('favorite-btn') ||
        e.target.closest('.card-menu-btn') ||
        e.target.closest('.favorite-btn')) {
      return
    }
    
    if (bookmark.url && bookmark.url !== '') {
      let url = bookmark.url.trim()
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url
      }
      window.open(url, '_blank')
    } else {
      toast.error('No URL provided for this bookmark')
    }
  }

  const escapeHtml = (text) => {
    if (!text) return ''
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  const getTagStyle = (tag) => {
    const color = getTagColor(tag)
    const bgColor = getBadgeBackgroundColor(tag, isDarkMode)
    const textColor = getBadgeTextColor(tag, isDarkMode)
    
    const baseStyle = {
      fontFamily: "'Google Sans Flex', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: '12px',
      fontWeight: 500,
      padding: '5px 10px',
      borderRadius: '20px',
      display: 'inline-block'
    }
    
    if (isDarkMode && bgColor) {
      return {
        ...baseStyle,
        backgroundColor: bgColor,
        color: textColor
      }
    }
    
    return {
      ...baseStyle,
      backgroundColor: `${color}20`,
      color: color
    }
  }

  // Обрезаем URL и описание
  const truncatedUrl = truncateUrl(bookmark.url, 52)
  const truncatedDescription = bookmark.description ? truncateText(bookmark.description, 52) : ''

  return (
    <>
      <div 
        className="card" 
        style={{ 
          position: 'relative', 
          cursor: 'pointer',
          fontFamily: "'Google Sans Flex', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        }}
        onClick={handleCardClick}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', minHeight: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, paddingRight: '30px' }}>
            {/* Иконка сайта */}
            {bookmark.icon_url && (
              <img 
                src={bookmark.icon_url || defaultIcon} 
                alt=""
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '3px',
                  flexShrink: 0
                }}
                onError={(e) => {
                  e.target.src = defaultIcon
                }}
              />
            )}
            <h4 style={{ 
              marginBottom: '0', 
              fontSize: '16px', 
              flex: 1,
              fontFamily: "'Google Sans Flex', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontWeight: 500,
              wordBreak: 'break-word'
            }}>
              {escapeHtml(bookmark.title)}
            </h4>
          </div>
          <button 
            className="card-menu-btn" 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              fontSize: '20px', 
              color: '#8a94a6', 
              padding: '0 4px',
              position: 'absolute',
              top: '16px',
              right: '16px',
              zIndex: 10,
              fontFamily: "'Google Sans Flex', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            }}
            onClick={handleMenuClick}
          >
            ⋯
          </button>
        </div>
        <small 
          style={{ 
            color: '#8a94a6', 
            fontSize: '12px', 
            display: 'block', 
            marginBottom: '8px',
            fontFamily: "'Google Sans Flex', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            wordBreak: 'break-all',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
          title={bookmark.url} // Показываем полный URL при наведении
        >
          {escapeHtml(truncatedUrl)}
        </small>
        {bookmark.description && (
          <small 
            style={{ 
              color: '#6b7280', 
              fontSize: '11px', 
              display: 'block', 
              marginBottom: '12px',
              fontFamily: "'Google Sans Flex', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              lineHeight: '1.4',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
            title={bookmark.description} // Показываем полное описание при наведении
          >
            {escapeHtml(truncatedDescription)}
          </small>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {bookmark.tags && bookmark.tags.length > 0 ? (
              bookmark.tags.map(tag => (
                <span 
                  key={tag} 
                  className="badge"
                  style={getTagStyle(tag)}
                >
                  {escapeHtml(tag.charAt(0).toUpperCase() + tag.slice(1))}
                </span>
              ))
            ) : (
              <span className="badge resources" style={getTagStyle('resources')}>
                Resources
              </span>
            )}
          </div>
          <button 
            className="favorite-btn" 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              fontSize: '22px', 
              padding: 0,
              transition: 'all 0.2s',
              lineHeight: 1,
              color: bookmark.favorite ? '#fbbf24' : '#d1d5db',
              zIndex: 10,
              fontFamily: "'Google Sans Flex', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            }}
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite(bookmark.id)
            }}
          >
            {bookmark.favorite ? '★' : '☆'}
          </button>
        </div>
      </div>

      {/* Меню карточки */}
      {showMenu && (
        <>
          <div 
            className="card-menu"
            style={{
              position: 'fixed',
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              background: isDarkMode ? '#2f313a' : 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              padding: '8px 0',
              minWidth: '150px',
              zIndex: 1000,
              animation: 'fadeIn 0.2s ease',
              fontFamily: "'Google Sans Flex', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            }}
          >
            <div 
              style={{ 
                padding: '8px 16px', 
                cursor: 'pointer', 
                fontSize: '14px',
                color: isDarkMode ? '#e5e7eb' : '#4a5568',
                fontFamily: "'Google Sans Flex', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
              }}
              onClick={() => {
                onEdit(bookmark.id)
                setShowMenu(false)
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = isDarkMode ? '#3b3d4a' : '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              ✏️ Edit
            </div>
            <div 
              style={{ 
                padding: '8px 16px', 
                cursor: 'pointer', 
                fontSize: '14px', 
                color: '#ef4444',
                fontFamily: "'Google Sans Flex', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
              }}
              onClick={() => {
                onDelete(bookmark.id)
                setShowMenu(false)
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              🗑️ Delete
            </div>
          </div>
          <div 
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
            onClick={() => setShowMenu(false)}
          />
        </>
      )}
    </>
  )
}

export default BookmarkCard