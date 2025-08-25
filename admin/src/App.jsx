import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import EventDetailsPage from './pages/EventDetailsPage'

function App() {
  const { token } = useSelector((state) => state.auth)

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
