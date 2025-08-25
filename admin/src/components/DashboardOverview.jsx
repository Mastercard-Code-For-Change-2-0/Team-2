import { useState } from 'react'
import { Plus, Calendar, Users, UserCheck, TrendingUp } from 'lucide-react'
import CreateEventModal from './CreateEventModal'

function DashboardOverview() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  const stats = [
    {
      title: 'Total Events',
      value: '12',
      change: '+2 this month',
      icon: Calendar,
      color: 'blue'
    },
    {
      title: 'Active Participants',
      value: '1,234',
      change: '+15% from last month',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Volunteers',
      value: '45',
      change: '+5 new this week',
      icon: UserCheck,
      color: 'purple'
    },
    {
      title: 'Attendance Rate',
      value: '87%',
      change: '+3% improvement',
      icon: TrendingUp,
      color: 'orange'
    }
  ]

  const recentEvents = [
    {
      id: 1,
      title: 'Tech Career Fair 2024',
      date: '2024-03-15',
      participants: 150,
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Software Engineering Workshop',
      date: '2024-04-20',
      participants: 75,
      status: 'live'
    },
    {
      id: 3,
      title: 'AI/ML Bootcamp',
      date: '2024-02-28',
      participants: 200,
      status: 'completed'
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
          <div className="space-y-4">
            {recentEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{event.participants} participants</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onEventCreated={() => setShowCreateModal(false)}
        />
      )}
    </div>
  )
}

export default DashboardOverview