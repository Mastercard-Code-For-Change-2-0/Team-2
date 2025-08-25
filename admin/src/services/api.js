import axios from 'axios'

const API_BASE_URL = 'http://localhost:4000/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
}

export const eventAPI = {
  create: (eventData) => api.post('/events/create', eventData),
  getAll: () => api.get('/events/all'),
  getById: (eventId) => api.get(`/events/${eventId}`),
  getLeads: (eventId) => api.get(`/events/${eventId}/leads`),
  exportLeads: (eventId) => api.get(`/events/${eventId}/export`, { responseType: 'blob' }),
  updateStatus: (eventId, status) => api.put(`/events/${eventId}/status`, { status }),
}

export default api