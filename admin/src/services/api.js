import axios from 'axios'
import { apiConnector } from './apiConnector'
import { clearAuth } from '../utils/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend-master-pkfu.onrender.com/api/v1'

console.log('API_BASE_URL:', API_BASE_URL)

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
      clearAuth()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (credentials) => apiConnector("POST", API_BASE_URL + '/auth/loginAdmin', credentials),
  signup: (userData) => apiConnector("POST", API_BASE_URL + '/auth/signupAdmin', userData),
}

export const eventAPI = {
  create: (eventData) => {
    return apiConnector("POST", API_BASE_URL + '/event/createEvent', eventData, {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    })
  },
  getAll: () => {
    return apiConnector("GET", API_BASE_URL + '/event/allevents', null, {
      'Content-Type': 'application/json'
    })
  },
  getById: (eventId) => apiConnector("GET", API_BASE_URL + `/event/getEvent/${eventId}`),
  getStudentsInEvent: (eventId) => apiConnector("GET", API_BASE_URL + '/event/studentsInEvent', { eventId }),
  getLeads: (eventId) => apiConnector("GET", API_BASE_URL + `/event/${eventId}/leads`),
  exportLeads: (eventId) => api.get(`/event/${eventId}/export`, { responseType: 'blob' }),
  updateStatus: (eventId, status) => apiConnector("PUT", API_BASE_URL + `/event/${eventId}/status`, { status }),
}

export default api