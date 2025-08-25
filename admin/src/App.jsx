import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import EventDetailsPage from './pages/EventDetailsPage'
import CurrentEvent from './pages/CurrentEvent'
import UpcomingEvents from './pages/UpcomingEvents'
import PastEvents from './pages/PastEvents'
import EmailSender from './pages/EmailSender'

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
        <Route
          path="/event/current/:eventId"
          element={
            token ?
              <CurrentEvent /> :
              <Navigate to="/login" replace />
          }
        />
        <Route
          path="/event/upcoming/:eventId"
          element={
            token ?
              <UpcomingEvents /> :
              <Navigate to="/login" replace />
          }
        />
        <Route
          path="/event/past/:eventId"
          element={
            token ?
              <PastEvents /> :
              <Navigate to="/login" replace />
          }
        />
        <Route
          path="/email-sender"
          element={
            token ?
              <EmailSender /> :
              <Navigate to="/login" replace />
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/emailSender" element={<EmailSender/>} />
      </Routes>
    </div>
  )
}

export default App
