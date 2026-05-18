import React, { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import SearchBar from '../components/SearchBar'
import BookmarkCard from '../components/BookmarkCard'
import BookmarkModal from '../components/BookmarkModal'
import EditModal from '../components/EditModal'
import { bookmarksAPI, authAPI } from '../services/api'
import { normalizeTags, sortBookmarks, getTimeOfDay } from '../utils/helpers'

const Dashboard = () => {
  const [bookmarks, setBookmarks] = useState([])
  const [filteredBookmarks, setFilteredBookmarks] = useState([])
  const [allTags, setAllTags] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [currentFilter, setCurrentFilter] = useState('all')
  const [currentSort, setCurrentSort] = useState('recent')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState(null)
  const [loading, setLoading] = useState(true)

  // Загрузка данных
  const loadBookmarks = async () => {
    try {
      const data = await bookmarksAPI.getAll()
      const processedBookmarks = data.map(bookmark => ({
        id: bookmark.id,
        title: bookmark.title || 'Untitled',
        url: bookmark.url || '',
        description: bookmark.description || '',
        tags: normalizeTags(bookmark.tags),
        favorite: bookmark.favorite || false,
        created_at: bookmark.created_at || new Date().toISOString(),
        icon_url: bookmark.icon_url || null
      }))
      setBookmarks(processedBookmarks)
      
      // Сбор уникальных тегов
      const tags = new Set()
      processedBookmarks.forEach(bookmark => {
        if (bookmark.tags && Array.isArray(bookmark.tags)) {
          bookmark.tags.forEach(tag => {
            if (tag && typeof tag === 'string' && tag !== '') {
              tags.add(tag.toLowerCase())
            }
          })
        }
      })
      setAllTags(Array.from(tags).sort())
      
      return processedBookmarks
    } catch (error) {
      console.error('Error loading bookmarks:', error)
      toast.error('Failed to load bookmarks')
      return []
    }
  }

  const loadUser = async () => {
    try {
      const user = await authAPI.getCurrentUser()
      setCurrentUser(user)
    } catch (error) {
      console.error('Error loading user:', error)
    }
  }

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      await loadUser()
      await loadBookmarks()
      setLoading(false)
    }
    init()
  }, [])

  // Фильтрация и сортировка
  useEffect(() => {
    let filtered = [...bookmarks]
    
    if (showFavoritesOnly) {
      filtered = filtered.filter(item => item.favorite === true)
    }
    
    if (currentFilter !== 'all') {
      filtered = filtered.filter(item => 
        item.tags && item.tags.includes(currentFilter)
      )
    }
    
    filtered = sortBookmarks(filtered, currentSort)
    setFilteredBookmarks(filtered)
  }, [bookmarks, currentFilter, currentSort, showFavoritesOnly])

  // Обработчики
  const handleSearch = async (query) => {
    if (query.length === 0) {
      await loadBookmarks()
    } else if (query.length > 2) {
      try {
        const results = await bookmarksAPI.search(query)
        const processedResults = results.map(bookmark => ({
          id: bookmark.id,
          title: bookmark.title,
          url: bookmark.url,
          description: bookmark.description,
          tags: normalizeTags(bookmark.tags),
          favorite: bookmark.favorite || false,
          created_at: bookmark.created_at
        }))
        setBookmarks(processedResults)
      } catch (error) {
        console.error('Search error:', error)
      }
    }
  }

  const handleCreateBookmark = async (bookmarkData) => {
    try {
      await bookmarksAPI.create(bookmarkData)
      toast.success('Bookmark created successfully!')
      await loadBookmarks()
      return true
    } catch (error) {
      console.error('Create error:', error)
      toast.error('Failed to create bookmark')
      return false
    }
  }

  const handleUpdateBookmark = async (id, bookmarkData) => {
    try {
      await bookmarksAPI.update(id, bookmarkData)
      toast.success('Bookmark updated successfully!')
      await loadBookmarks() // Перезагружаем - иконка обновится автоматически
      return true
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update bookmark')
      return false
    }
  }

  const handleDeleteBookmark = async (id) => {
    if (window.confirm('Are you sure you want to delete this bookmark?')) {
      try {
        await bookmarksAPI.delete(id)
        toast.success('Bookmark deleted successfully!')
        await loadBookmarks()
      } catch (error) {
        console.error('Delete error:', error)
        toast.error('Failed to delete bookmark')
      }
    }
  }

  const handleToggleFavorite = async (id) => {
    const bookmark = bookmarks.find(b => b.id === id)
    if (bookmark) {
      await handleUpdateBookmark(id, {
        url: bookmark.url,
        title: bookmark.title,
        description: bookmark.description,
        tags: bookmark.tags,
        favorite: !bookmark.favorite
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    toast.success('Logged out successfully!')
    setTimeout(() => {
      window.location.href = '/login'
    }, 1000)
  }

  const handleSort = () => {
    const sortOrder = ['recent', 'az', 'za', 'favorite']
    const currentIndex = sortOrder.indexOf(currentSort)
    const nextIndex = (currentIndex + 1) % sortOrder.length
    setCurrentSort(sortOrder[nextIndex])
  }

  const getSortButtonText = () => {
    switch(currentSort) {
      case 'recent': return 'Sort by: Recent'
      case 'az': return 'Sort by: A-Z'
      case 'za': return 'Sort by: Z-A'
      case 'favorite': return 'Sort by: Favorite ⭐'
      default: return 'Sort by: Recent'
    }
  }

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>
  }

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <Toaster position="bottom-right" />
      
      <Sidebar 
        allTags={allTags}
        bookmarks={bookmarks}
        currentFilter={currentFilter}
        isFavoritesActive={showFavoritesOnly}
        onFilterChange={(tag) => {
            setCurrentFilter(tag)
            setShowFavoritesOnly(false)
        }}
        onShowAllBookmarks={() => {
            setCurrentFilter('all')
            setShowFavoritesOnly(false)
        }}
        onShowFavorites={() => {
            setShowFavoritesOnly(true)
            setCurrentFilter('all')
        }}
        />
      
      <div className="main">
        <Header 
          userName={currentUser?.username || 'User'}
          bookmarkCount={bookmarks.length}
          onAddBookmark={() => setIsAddModalOpen(true)}
          onLogout={handleLogout}
        />
        
        <SearchBar onSearch={handleSearch} />
        
        <div className="filters">
          <div className="sort" onClick={handleSort}>
            {getSortButtonText()}
          </div>
        </div>
        
        <div className="grid">
          {filteredBookmarks.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
              {showFavoritesOnly 
                ? 'No favorite bookmarks yet. Click the star ⭐ on any bookmark to add it to favorites!' 
                : 'No bookmarks found. Click "+ Add Bookmark" to create one!'}
            </div>
          ) : (
            filteredBookmarks.map(bookmark => (
              <BookmarkCard 
                key={bookmark.id}
                bookmark={bookmark}
                onToggleFavorite={handleToggleFavorite}
                onEdit={(id) => {
                  const bookmarkToEdit = bookmarks.find(b => b.id === id)
                  setEditingBookmark(bookmarkToEdit)
                  setIsEditModalOpen(true)
                }}
                onDelete={handleDeleteBookmark}
              />
            ))
          )}
        </div>
        
        <div className="footer">
          “The best way to predict the future is to invent it.” — Alan Kay
        </div>
      </div>
      
      <BookmarkModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreateBookmark}
        allTags={allTags}
      />
      
      <EditModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingBookmark(null)
        }}
        onSave={handleUpdateBookmark}
        bookmark={editingBookmark}
        allTags={allTags}
      />
    </div>
  )
}

export default Dashboard