import React, { useState, useEffect } from 'react'

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('')
  const [timeoutId, setTimeoutId] = useState(null)

  useEffect(() => {
    if (timeoutId) clearTimeout(timeoutId)
    
    const newTimeoutId = setTimeout(() => {
      if (query.length > 2 || query.length === 0) {
        onSearch(query)
      }
    }, 500)
    
    setTimeoutId(newTimeoutId)
    
    return () => clearTimeout(newTimeoutId)
  }, [query])

  return (
    <div className="search">
      <input 
        type="text" 
        placeholder="Search bookmarks or tags (minimum 3 characters)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  )
}

export default SearchBar