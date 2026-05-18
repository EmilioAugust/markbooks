import React, { useState, useEffect } from 'react'

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDark(true)
      document.body.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    if (isDark) {
      document.body.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      document.body.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }

  return (
    <button id="themeToggle" className="theme-btn" onClick={toggleTheme}>
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}

export default ThemeToggle