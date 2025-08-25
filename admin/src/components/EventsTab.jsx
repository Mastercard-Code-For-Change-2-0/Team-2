import { useState, useEffect } from 'react'
import { Calendar, Users, MapPin, Clock, Plus } from 'lucide-react'
import CreateEventModal from './CreateEventModal'

function EventsTab({ activeSubTab }) {
  const [events, setEvents] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Mock data - replace with API calls
  const allEvents = [
    {
      id: 1,
      title: 'Tech Career Fair 2024',
      description: 'Annual technology career fair featuring top companies',
      date: '2024-03-15T10:00:00Z',
      location: 'University Convention Center',
      participants: 150,
      maxParticipants: 200,
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Software Engineering Workshop',
      description: 'Hands-on workshop covering modern software development',
      date: '2024-01-20T14:00:00Z',
      location: 'Engineering Building Room 101',
      participants: 75,
      maxParticipants: 100,
      status: 'live'
    },
    {
      id: 3,
      title: 'AI/ML Bootcamp',
      description: 'Intensive bootcamp on artificial intelligence and machine learning',
      date: '2024-01-10T09:00:00Z',
      location: 'Tech Hub Auditorium',
      participants: 200,
      maxParticipants: 200,
      status: 'completed'
    }
  ]

  useEffect(() => {
    // Filter events based on active sub tab
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
      case 'all-events':
      default:
        filteredEvents = allEvents
        break
    }
    
    setEvents(filteredEvents)
  }, [activeSubTab])

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-800 border-green-200'
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTabTitle = () => {
    switch (activeSubTab) {
      case 'live-events': return 'Live Events'
      case 'upcoming-events': return 'Upcoming Events'
      case 'past-events': return 'Past Events'
      case 'all-events': return 'All Events'
      default: return 'All Events'
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{getTabTitle()}</h1>
          <p className="text-gray-600 mt-1">{events.length} events found</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first event.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{event.title}</h3>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
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
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    View Details
                  </button>
                  <button className="px-4 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onEventCreated={() => setShowCreateModal(false)}
        />
      )}
    </div>
  )
}

export default EventsTab