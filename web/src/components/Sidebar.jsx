import React from 'react'
import { getTagColor } from '../utils/helpers'

const Sidebar = ({ 
  allTags, 
  bookmarks, 
  currentFilter, 
  isFavoritesActive,
  onFilterChange, 
  onShowAllBookmarks, 
  onShowFavorites 
}) => {
  const getTagCount = (tag) => {
    return bookmarks.filter(bookmark => 
      bookmark.tags && bookmark.tags.includes(tag)
    ).length
  }

  return (
    <div className="sidebar">
      <div className="logo">
        <div className="logo-icon"><img src="/logo.png" alt="" /></div>
        <div className="logo-text">
          <h3>Nesthive</h3>
          <p>Bookmark Manager</p>
        </div>
      </div>

      <div className="menu">
        <div 
          className={`menu-item ${!isFavoritesActive && currentFilter === 'all' ? 'active' : ''}`}
          onClick={onShowAllBookmarks}
        >
          <div className="icon"></div>
          All Bookmarks
        </div>
        <div 
          className={`menu-item ${isFavoritesActive ? 'active' : ''}`}
          onClick={onShowFavorites}
        >
          <div className="icon"></div>
          Favorites
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <span>TAGS</span>
        </div>

        <div className="tags-list">
          {allTags.length === 0 ? (
            <div style={{ padding: '10px', color: '#8a94a6', fontSize: '12px' }}>
              No tags yet
            </div>
          ) : (
            allTags.map(tag => (
              <div 
                key={tag}
                className="tag"
                style={{ cursor: 'pointer' }}
                onClick={() => onFilterChange(tag)}
              >
                <div className="tag-left">
                  <div 
                    className="dot" 
                    style={{ 
                      background: getTagColor(tag),
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%'
                    }} 
                  />
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </div>
                <span>{getTagCount(tag)}</span>
              </div>
            ))
          )}
        </div>

        <div className="info-card">
          <div className="info-icon">🪹</div>
          <h4>Keep everything in one nest.</h4>
          <p>Add bookmarks and organize</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar