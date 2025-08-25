import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getUser } from '../utils/auth'
import toast from 'react-hot-toast'

function EventDetailsPage() {
  const { eventId } = useParams()
  const [event, setEvent] = useState(null)
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  
 const user = getUser()
 console.log(user+"wejgfhgh")
  useEffect(() => {
    fetchEventDetails()
    fetchLeads()
  }, [eventId])

  const fetchEventDetails = async () => {
    // Mock event details
    setTimeout(() => {
      const mockEvent = {
        _id: eventId,
        title: 'Tech Career Fair 2024',
        description: 'Annual technology career fair featuring top companies',
        date: '2024-03-15T10:00:00Z',
        location: 'University Convention Center',
        status: 'upcoming',
        maxParticipants: 200
      }
      setEvent(mockEvent)
    }, 300)
  }

  const fetchLeads = async () => {
    // Mock student leads
    setTimeout(() => {
      const mockLeads = [
        {
          _id: '1',
          name: 'John Smith',
          email: 'john.smith@university.edu',
          phone: '555-0101',
          university: 'State University',
          major: 'Computer Science',
          graduationYear: 2024,
          applicationStatus: 'interested',
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          _id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.j@university.edu',
          phone: '555-0102',
          university: 'State University',
          major: 'Software Engineering',
          graduationYear: 2025,
          applicationStatus: 'applied',
          createdAt: '2024-01-16T14:30:00Z'
        },
        {
          _id: '3',
          name: 'Mike Chen',
          email: 'mike.chen@tech.edu',
          phone: '555-0103',
          university: 'Tech Institute',
          major: 'Information Systems',
          graduationYear: 2024,
          applicationStatus: 'contacted',
          createdAt: '2024-01-17T09:15:00Z'
        }
      ]
      setLeads(mockLeads)
      setLoading(false)
    }, 500)
  }

  const handleExport = async () => {
    setExporting(true)
    
    // Mock CSV export
    setTimeout(() => {
      const csvHeader = 'Name,Email,Phone,University,Major,Graduation Year,Application Status,Applied Date\n'
      const csvData = leads.map(student => 
        `"${student.name}","${student.email}","${student.phone}","${student.university}","${student.major}",${student.graduationYear},"${student.applicationStatus}","${new Date(student.createdAt).toISOString().split('T')[0]}"`
      ).join('\n')
      
      const blob = new Blob([csvHeader + csvData], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${event?.title || 'event'}-leads.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Leads exported successfully!')
      setExporting(false)
    }, 1000)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'interested': return 'bg-blue-100 text-blue-800'
      case 'applied': return 'bg-yellow-100 text-yellow-800'
      case 'contacted': return 'bg-green-100 text-green-800'
      case 'accepted': return 'bg-green-200 text-green-900'
      case 'rejected': return 'bg-red-100 text-red-800'
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
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/dashboard"
                className="mr-4 bg-gray-200 hover:bg-gray-300 text-gray-900 px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
              >
                ← Back
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                {event?.title || 'Event Details'}
              </h1>
            </div>
            <button
              onClick={handleExport}
              disabled={exporting || leads.length === 0}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50"
            >
              {exporting ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Info */}
        {event && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Information</h3>
                <p className="text-gray-600 mb-2">{event.description}</p>
                <p className="text-sm text-gray-500">📅 {new Date(event.date).toLocaleString()}</p>
                <p className="text-sm text-gray-500">📍 {event.location}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Statistics</h3>
                <p className="text-sm text-gray-500">👥 {leads.length} total leads</p>
                <p className="text-sm text-gray-500">📊 Max capacity: {event.maxParticipants}</p>
                <p className="text-sm text-gray-500">📈 Status: {event.status}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Leads</h2>
          <p className="text-gray-600">{leads.length} students interested in this event</p>
        </div>

        {leads.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No leads yet</h3>
              <p className="text-gray-600">Students who show interest in this event will appear here.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {leads.map((student) => (
              <div key={student._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(student.applicationStatus)}`}>
                    {student.applicationStatus}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="mr-2">📧</span>
                    <a href={`mailto:${student.email}`} className="hover:text-indigo-600">
                      {student.email}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">📱</span>
                    <a href={`tel:${student.phone}`} className="hover:text-indigo-600">
                      {student.phone}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🎓</span>
                    {student.major} at {student.university}
                  </div>
                  <div className="text-xs text-gray-500">
                    Graduating: {student.graduationYear}
                  </div>
                  <div className="text-xs text-gray-500">
                    Applied: {new Date(student.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default EventDetailsPage