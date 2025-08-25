import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setToken, setUser } from '../slices/authSlice'
import CreateEventModal from '../components/CreateEventModal'
import toast from 'react-hot-toast'

function DashboardPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    // Mock data - no backend needed
    setTimeout(() => {
      const mockEvents = [
        {
          _id: '1',
          title: 'Tech Career Fair 2024',
          description: 'Annual technology career fair featuring top companies',
          date: '2024-03-15T10:00:00Z',
          location: 'University Convention Center',
          status: 'upcoming',
          registeredCount: 45,
          maxParticipants: 200
        },
        {
          _id: '2',
          title: 'Software Engineering Workshop',
          description: 'Hands-on workshop covering modern software development practices',
          date: '2024-04-20T14:00:00Z',
          location: 'Engineering Building Room 101',
          status: 'upcoming',
          registeredCount: 23,
          maxParticipants: 50
        }
      ]
      setEvents(mockEvents)
      setLoading(false)
    }, 500)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    dispatch(setToken(null))
    dispatch(setUser(null))
    toast.success('Logged out successfully')
  }

  const handleEventCreated = (newEvent) => {
    const mockEvent = {
      _id: Date.now().toString(),
      ...newEvent,
      status: 'upcoming',
      registeredCount: 0,
      maxParticipants: newEvent.maxParticipants || 100
    }
    setEvents([mockEvent, ...events])
    setShowCreateModal(false)
    toast.success('Event created successfully!')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'ongoing': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Katalyst Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Events</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm font-medium rounded-md transition-colors"
          >
            Create Event
          </button>
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first outreach event.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm font-medium rounded-md transition-colors"
              >
                Create Event
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div key={event._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                <div className="text-sm text-gray-500 mb-4">
                  <p>📅 {new Date(event.date).toLocaleDateString()}</p>
                  <p>📍 {event.location}</p>
                  <p>👥 {event.registeredCount}/{event.maxParticipants} registered</p>
                </div>
                <Link
                  to={`/events/${event._id}`}
                  className="block w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 text-sm font-medium rounded-md transition-colors"
                >
                  View Leads
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onEventCreated={handleEventCreated}
        />
      )}
    </div>
  )
}

export default DashboardPage