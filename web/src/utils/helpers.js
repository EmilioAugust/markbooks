// Нормализация тегов
export const normalizeTags = (tags) => {
  if (!tags) return []
  
  let result = []
  let tagsString = tags
  
  if (typeof tagsString === 'string') {
    let parsed = tagsString
    let maxIterations = 5
    let iteration = 0
    
    while (typeof parsed === 'string' && iteration < maxIterations) {
      try {
        parsed = JSON.parse(parsed)
        iteration++
      } catch(e) {
        break
      }
    }
    
    if (Array.isArray(parsed)) {
      result = parsed
    } 
    else if (typeof parsed === 'string' && parsed.includes(',')) {
      result = parsed.split(',').map(t => t.trim().toLowerCase())
    }
    else if (typeof parsed === 'string' && parsed) {
      result = [parsed.toLowerCase()]
    }
    else if (Array.isArray(tagsString)) {
      result = tagsString
    }
  }
  else if (Array.isArray(tagsString)) {
    result = tagsString
  }
  
  result = result.map(tag => {
    if (typeof tag === 'string') {
      return tag.replace(/[{}"\\]/g, '').trim().toLowerCase()
    }
    return String(tag).replace(/[{}"\\]/g, '').trim().toLowerCase()
  }).filter(tag => tag && tag !== '')
  
  return result
}

// Функция для обрезки текста с троеточием
export const truncateText = (text, maxLength = 52) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Функция для обрезки URL (сохраняем протокол)
export const truncateUrl = (url, maxLength = 52) => {
  if (!url) return ''
  
  // Убираем протокол для отображения, если нужно сэкономить место
  let displayUrl = url
  try {
    const urlObj = new URL(url)
    displayUrl = urlObj.hostname + urlObj.pathname
  } catch(e) {
    displayUrl = url
  }
  
  if (displayUrl.length <= maxLength) return displayUrl
  return displayUrl.substring(0, maxLength) + '...'
}

// Получение времени дня
export const getTimeOfDay = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

// Сортировка данных
export const sortBookmarks = (items, sortType) => {
  const sorted = [...items]
  
  if (sortType === 'az') {
    sorted.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sortType === 'za') {
    sorted.sort((a, b) => b.title.localeCompare(a.title))
  } else if (sortType === 'favorite') {
    sorted.sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0))
  } else if (sortType === 'recent') {
    sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }
  
  return sorted
}

// Цвета для тегов (расширенная палитра)
export const getTagColor = (tag) => {
  const colors = {
    // Основные цвета
    'design': '#7b5cff',
    'productivity': '#22c55e',
    'inspiration': '#f59e0b',
    'dev': '#4aa3ff',
    'resources': '#ec4899',
    
    // Дополнительные цвета для популярных тегов
    'github': '#6e5494',
    'youtube': '#ff0000',
    'react': '#61dafb',
    'javascript': '#f7df1e',
    'python': '#3776ab',
    'css': '#264de4',
    'html': '#e34c26',
    'tutorial': '#16a34a',
    'article': '#3b82f6',
    'video': '#dc2626',
    'music': '#8b5cf6',
    'news': '#f97316',
    'blog': '#ec4899',
    'documentation': '#06b6d4',
    'tool': '#6b7280',
    'api': '#10b981',
    'database': '#3b82f6',
    'framework': '#8b5cf6',
    'library': '#d946ef'
  }
  
  return colors[tag.toLowerCase()] || '#8a94a6'
}

// Получить цвет фона для бейджа (для темной темы)
export const getBadgeBackgroundColor = (tag, isDarkMode = false) => {
  if (isDarkMode) {
    const darkColors = {
      'design': '#2d2b4e',
      'productivity': '#14532d',
      'inspiration': '#451a03',
      'dev': '#1e3a5f',
      'resources': '#4a2d44',
      'github': '#2d1b3d',
      'youtube': '#4a0404',
      'react': '#0a2b3a',
      'javascript': '#422006',
      'python': '#1a2e3d',
      'css': '#0c1b3d',
      'html': '#3d1a0c',
      'tutorial': '#0a3d2a',
      'article': '#0f2d5f',
      'video': '#5f0f0f'
    }
    return darkColors[tag.toLowerCase()] || '#2f313a'
  }
  return undefined
}

// Получить цвет текста для бейджа
export const getBadgeTextColor = (tag, isDarkMode = false) => {
  if (isDarkMode) {
    const darkTextColors = {
      'design': '#b39ddb',
      'productivity': '#86efac',
      'inspiration': '#ffb347',
      'dev': '#7ab7ff',
      'resources': '#fba6d1',
      'github': '#c084fc',
      'youtube': '#ff6b6b',
      'react': '#7dd3fc',
      'javascript': '#fde047',
      'python': '#94a3b8'
    }
    return darkTextColors[tag.toLowerCase()] || '#e5e7eb'
  }
  return undefined
}