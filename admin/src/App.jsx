import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import EventsTab from './components/EventsTab'
import UpcomingEvents from './pages/UpcomingEvents'
import CurrentEvent from './pages/CurrentEvent'
import PastEvents from './pages/PastEvents'

function App() {
  const { token } = useSelector((state) => state.auth)

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/dashboard" />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={token ? <DashboardPage /> : <Navigate to="/login" />}>
          {/* Default dashboard route shows all events */}
          <Route index element={<EventsTab activeSubTab="all-events" />} />
          
          {/* Upcoming Events Routes */}
          <Route path="upcoming" element={<EventsTab activeSubTab="upcoming-events" />} />
          <Route path="upcoming/:eventId" element={<UpcomingEvents />} />
          
          {/* Current/Live Events Routes */}
          <Route path="current" element={<EventsTab activeSubTab="live-events" />} />
          <Route path="current/:eventId" element={<CurrentEvent />} />
          
          {/* Past Events Routes */}
          <Route path="past" element={<EventsTab activeSubTab="past-events" />} />
          <Route path="past/:eventId" element={<PastEvents />} />
        </Route>
        
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  )
}

export default App