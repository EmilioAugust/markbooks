import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const BookmarkModal = ({ isOpen, onClose, onSave, allTags }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    tags: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        url: '',
        description: '',
        tags: ''
      })
    }
  }, [isOpen])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title')
      return
    }
    
    if (!formData.url.trim()) {
      toast.error('Please enter a URL')
      return
    }
    
    try {
      new URL(formData.url)
    } catch {
      toast.error('Please enter a valid URL (e.g., https://example.com)')
      return
    }
    
    let tags = ['resources']
    if (formData.tags.trim()) {
      tags = formData.tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag)
      if (tags.length === 0) tags = ['resources']
    }
    
    setIsSubmitting(true)
    
    const success = await onSave({
      title: formData.title.trim(),
      url: formData.url.trim(),
      description: formData.description.trim(),
      tags: tags,
      favorite: false
    })
    
    setIsSubmitting(false)
    
    if (success) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>➕ Add New Bookmark</h3>
          <span className="modal-close" onClick={onClose}>&times;</span>
        </div>
        
        <form id="bookmarkForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="bookmarkTitle">Title *</label>
            <input 
              type="text" 
              id="bookmarkTitle" 
              name="title"
              placeholder="e.g., GitHub - Development platform" 
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="bookmarkUrl">URL *</label>
            <input 
              type="url" 
              id="bookmarkUrl" 
              name="url"
              placeholder="https://github.com" 
              value={formData.url}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="bookmarkDescription">Description</label>
            <textarea 
              id="bookmarkDescription" 
              name="description"
              rows="3" 
              placeholder="Brief description of this bookmark..."
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="bookmarkTags">Tags *</label>
            <input 
              type="text" 
              id="bookmarkTags" 
              name="tags"
              placeholder="design, development, productivity" 
              list="tagsDatalist"
              value={formData.tags}
              onChange={handleChange}
            />
            <datalist id="tagsDatalist">
              {allTags.map(tag => (
                <option key={tag} value={tag} />
              ))}
            </datalist>
            <small className="form-hint">Separate tags with commas. Start typing to see existing tags.</small>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Bookmark'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookmarkModal