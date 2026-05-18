import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const EditModal = ({ isOpen, onClose, onSave, bookmark, allTags }) => {
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    url: '',
    description: '',
    tags: '',
    favorite: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen && bookmark) {
      setFormData({
        id: bookmark.id,
        title: bookmark.title,
        url: bookmark.url,
        description: bookmark.description || '',
        tags: bookmark.tags ? bookmark.tags.join(', ') : '',
        favorite: bookmark.favorite || false
      })
    }
  }, [isOpen, bookmark])

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
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
    
    const success = await onSave(formData.id, {
      title: formData.title.trim(),
      url: formData.url.trim(),
      description: formData.description.trim(),
      tags: tags,
      favorite: formData.favorite
    })
    
    setIsSubmitting(false)
    
    if (success) {
      onClose()
    }
  }

  if (!isOpen || !bookmark) return null

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>✏️ Edit Bookmark</h3>
          <span className="modal-close" onClick={onClose}>&times;</span>
        </div>
        
        <form id="editForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="editTitle">Title *</label>
            <input 
              type="text" 
              id="editTitle" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="editUrl">URL *</label>
            <input 
              type="url" 
              id="editUrl" 
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="editDescription">Description</label>
            <textarea 
              id="editDescription" 
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="editTags">Tags *</label>
            <input 
              type="text" 
              id="editTags" 
              name="tags"
              list="editTagsDatalist"
              value={formData.tags}
              onChange={handleChange}
            />
            <datalist id="editTagsDatalist">
              {allTags.map(tag => (
                <option key={tag} value={tag} />
              ))}
            </datalist>
            <small className="form-hint">Separate tags with commas. Start typing to see existing tags.</small>
          </div>
          
          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                name="favorite"
                checked={formData.favorite}
                onChange={handleChange}
              /> Add to Favorites ⭐
            </label>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditModal