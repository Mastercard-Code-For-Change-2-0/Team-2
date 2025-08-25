import { useState, useEffect } from 'react'
import { Calendar, Users, MapPin, Clock, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { eventAPI } from '../services/api'
import CreateEventModal from './CreateEventModal'
import toast from 'react-hot-toast'

function EventsTab({ activeSubTab }) {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await eventAPI.getAll()
      console.log('Events API Response:', response)
      if (response.data.success) {
        const eventsData = response.data.events || []
        // Add status based on date
        const eventsWithStatus = eventsData.map(event => {
          const eventDate = new Date(event.date)
          const now = new Date()
          const status = eventDate > now ? 'upcoming' : 'completed'
          return {
            ...event,
            status,
            participants: event.studentsEnrolled?.length || 0
          }
        })
        setEvents(eventsWithStatus)
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
      toast.error('Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter(event => {
    switch (activeSubTab) {
      case 'live-events':
        return event.status === 'live' || event.status === 'ongoing'
      case 'upcoming-events':
        return event.status === 'upcoming'
      case 'past-events':
        return event.status === 'completed'
      case 'all-events':
      default:
        return true
    }
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': 
      case 'ongoing': 
        return 'bg-green-100 text-green-800 border-green-200'
      case 'upcoming': 
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': 
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default: 
        return 'bg-gray-100 text-gray-800 border-gray-200'
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

  const handleEventCreated = () => {
    fetchEvents() // Refresh the events list
    setShowCreateModal(false)
  }

  const handleViewDetails = (event) => {
    const eventData = {
      ...event,
      maxParticipants: event.participants + 50, // Add some mock data for demo
    }
    
    if (event.status === 'upcoming') {
      navigate(`/event/upcoming/${event._id}`, { state: { eventData } })
    } else if (event.status === 'completed') {
      navigate(`/event/past/${event._id}`, { state: { eventData } })
    } else if (event.status === 'live') {
      navigate(`/event/current/${event._id}`, { state: { eventData } })
    } else {
      // Default to upcoming for new events
      navigate(`/event/upcoming/${event._id}`, { state: { eventData } })
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading events...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{getTabTitle()}</h1>
          <p className="text-gray-600 mt-1">{filteredEvents.length} events found</p>
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
      {filteredEvents.length === 0 ? (
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
          {filteredEvents.map((event) => (
            <div key={event._id || event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{event.title}</h3>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(event.status || 'upcoming')}`}>
                    {event.status || 'upcoming'}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString()} {event.time && `at ${event.time}`}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {event.participants || 0} registered
                  </div>
                  {event.type && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {event.type}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleViewDetails(event)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
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
          onEventCreated={handleEventCreated}
        />
      )}
    </div>
  )
}

export default EventsTab