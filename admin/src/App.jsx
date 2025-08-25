import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import EventDetailsPage from './pages/EventDetailsPage'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))

  // Listen for storage changes to update auth state
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'))
    }

    // Listen for storage events (when localStorage changes in other tabs)
    window.addEventListener('storage', handleStorageChange)
    
    // Custom event for same-tab localStorage changes
    window.addEventListener('auth-change', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('auth-change', handleStorageChange)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route
          path="/login"
          element={
            token ?
              <Navigate to="/dashboard" replace /> :
              <LoginPage />
          }
        />
        <Route
          path="/dashboard"
          element={
            token ?
              <DashboardPage /> :
              <Navigate to="/login" replace />
          }
        />
        <Route
          path="/events/:eventId"
          element={
            token ?
              <EventDetailsPage /> :
              <Navigate to="/login" replace />
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  )
}

export default App
