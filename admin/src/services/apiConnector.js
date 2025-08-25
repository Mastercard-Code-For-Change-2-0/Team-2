import axios from "axios";

export const axiosInstance = axios.create({});

// Temporarily disable auth for testing - remove this when backend auth is ready
const BYPASS_AUTH = true;

// Add token to all requests (only if not bypassing auth)
axiosInstance.interceptors.request.use((config) => {
  if (!BYPASS_AUTH) {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Handle auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !BYPASS_AUTH) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const apiConnector = (method, url, bodyData, headers = {}, params) => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};