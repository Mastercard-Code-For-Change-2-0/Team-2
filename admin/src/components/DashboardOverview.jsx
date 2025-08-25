import { useState, useEffect } from 'react'
import { Plus, Calendar, Users, UserCheck, TrendingUp } from 'lucide-react'
import { eventAPI } from '../services/api'
import CreateEventModal from './CreateEventModal'
import toast from 'react-hot-toast'

function DashboardOverview() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

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

  const stats = [
    {
      title: 'Total Events',
      value: events.length.toString(),
      change: `${events.filter(e => e.status === 'upcoming').length} upcoming`,
      icon: Calendar,
      color: 'blue'
    },
    {
      title: 'Total Participants',
      value: events.reduce((sum, event) => sum + (event.participants || 0), 0).toString(),
      change: `Across ${events.length} events`,
      icon: Users,
      color: 'green'
    },
    {
      title: 'Active Events',
      value: events.filter(e => e.status === 'upcoming').length.toString(),
      change: `${events.filter(e => e.status === 'completed').length} completed`,
      icon: UserCheck,
      color: 'purple'
    },
    {
      title: 'Avg Participation',
      value: events.length > 0 ? Math.round(events.reduce((sum, event) => sum + (event.participants || 0), 0) / events.length).toString() : '0',
      change: 'Per event',
      icon: TrendingUp,
      color: 'orange'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-800'
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatColor = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500'
    }
    return colors[color] || 'bg-gray-500'
  }

  const handleEventCreated = () => {
    fetchEvents() // Refresh the events list
    setShowCreateModal(false)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${getStatColor(stat.color)}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Events</h2>
        </div>
        <div className="p-6">
          {events.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No events created yet</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create Your First Event
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {events.slice(0, 5).map((event) => (
                <div key={event._id || event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()} • {event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{event.participants || 0} participants</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(event.status)}`}>
                        {event.status || 'upcoming'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onEventCreated={handleEventCreated}
        />
      )}
    </div>
  )
}

export default DashboardOverview