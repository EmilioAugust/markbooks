import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Интерцептор для добавления токена к каждому запросу
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Интерцептор для обработки ошибок авторизации
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      // Не делаем редирект здесь, чтобы избежать циклических вызовов
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// API функции
export const authAPI = {
  login: async (username, password) => {
    const formData = new URLSearchParams()
    formData.append('username', username)
    formData.append('password', password)
    
    const response = await api.post('/auth/token', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    return response.data
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/protected')
    return response.data
  }
}

export const bookmarksAPI = {
  getAll: async () => {
    const response = await api.get('/bookmarks/')
    return response.data
  },
  
  search: async (query) => {
    const response = await api.get(`/bookmarks/search?query=${encodeURIComponent(query)}`)
    return response.data
  },
  
  create: async (bookmarkData) => {
    const response = await api.post('/bookmarks/', bookmarkData)
    return response.data
  },
  
  update: async (id, bookmarkData) => {
    const response = await api.put(`/bookmarks/?id=${id}`, bookmarkData)
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/bookmarks/?id=${id}`)
    return response.data
  }
}

export default api