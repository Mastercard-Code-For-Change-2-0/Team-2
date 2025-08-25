import { useState, useEffect } from 'react'
import { Calendar, Users, MapPin, Clock, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CreateEventModal from './CreateEventModal'

function EventsTab({ activeSubTab }) {
  const [events, setEvents] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const navigate = useNavigate()

  // Mock data with additional analytics data
  const allEvents = [
    {
      id: 1,
      title: 'Tech Career Fair 2024',
      description: 'Annual technology career fair featuring top companies',
      date: '2024-03-15T10:00:00Z',
      location: 'University Convention Center',
      participants: 150,
      maxParticipants: 200,
      status: 'upcoming',
      registrationTrend: [20, 35, 45, 60, 85, 110, 150],
      participantTypes: {
        students: 90,
        professionals: 45,
        others: 15
      }
    },
    {
      id: 2,
      title: 'Software Engineering Workshop',
      description: 'Hands-on workshop covering modern software development',
      date: '2024-01-20T14:00:00Z',
      location: 'Engineering Building Room 101',
      participants: 75,
      maxParticipants: 100,
      status: 'live',
      hourlyAttendance: [65, 70, 75, 78, 80, 82, 80, 75],
      technologies: {
        react: 30,
        node: 25,
        python: 15,
        java: 10
      }
    },
    {
      id: 3,
      title: 'AI/ML Bootcamp',
      description: 'Intensive bootcamp on artificial intelligence and machine learning',
      date: '2024-01-10T09:00:00Z',
      location: 'Tech Hub Auditorium',
      participants: 200,
      maxParticipants: 200,
      status: 'completed',
      satisfactionRates: {
        excellent: 70,
        good: 40,
        average: 15,
        poor: 5
      },
      sessionAttendance: [120, 125, 130, 128, 115],
      participantTypes: {
        students: 120,
        professionals: 60,
        others: 20
      }
    }
  ]

  useEffect(() => {
    let filteredEvents = allEvents
    
    switch (activeSubTab) {
      case 'live-events':
        filteredEvents = allEvents.filter(event => event.status === 'live')
        break
      case 'upcoming-events':
        filteredEvents = allEvents.filter(event => event.status === 'upcoming')
        break
      case 'past-events':
        filteredEvents = allEvents.filter(event => event.status === 'completed')
        break
      default:
        break
    }
    
    setEvents(filteredEvents)
  }, [activeSubTab])

  const handleViewDetails = (event) => {
    // Updated navigation to match App.jsx routes
    switch (event.status) {
      case 'live':
        navigate(`/dashboard/current/${event.id}`, { state: { eventData: event } })
        break
      case 'upcoming':
        navigate(`/dashboard/upcoming/${event.id}`, { state: { eventData: event } })
        break
      case 'completed':
        navigate(`/dashboard/past/${event.id}`, { state: { eventData: event } })
        break
      default:
        break
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-800 border-green-200'
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-1">{events.length} events found</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(event.status)}`}>
                {event.status}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">{event.description}</p>
            <div className="space-y-2 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {new Date(event.date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {event.location}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {event.participants}/{event.maxParticipants} participants
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleViewDetails(event)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onEventCreated={(newEvent) => {
            setEvents([...events, newEvent])
            setShowCreateModal(false)
          }}
        />
      )}
    </div>
  )
}

export default EventsTab