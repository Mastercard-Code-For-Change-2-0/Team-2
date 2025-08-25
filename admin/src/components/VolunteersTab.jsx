import { useState } from 'react'
import { UserCheck, Plus, Mail, Phone, Calendar, MapPin, Send } from 'lucide-react'

function VolunteersTab() {
  const [volunteers, setVolunteers] = useState([
    {
      id: 1,
      name: 'Alice Cooper',
      email: 'alice.cooper@email.com',
      phone: '555-0201',
      assignedEvents: ['Tech Career Fair 2024'],
      status: 'active',
      joinDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Bob Wilson',
      email: 'bob.wilson@email.com',
      phone: '555-0202',
      assignedEvents: ['Software Engineering Workshop', 'AI/ML Bootcamp'],
      status: 'active',
      joinDate: '2024-01-10'
    }
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedVolunteer, setSelectedVolunteer] = useState(null)
  const [newVolunteer, setNewVolunteer] = useState({
    name: '',
    email: '',
    phone: ''
  })

  const events = [
    'Tech Career Fair 2024',
    'Software Engineering Workshop',
    'AI/ML Bootcamp',
    'Data Science Seminar'
  ]

  const handleCreateVolunteer = (e) => {
    e.preventDefault()
    const volunteer = {
      id: volunteers.length + 1,
      ...newVolunteer,
      assignedEvents: [],
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0]
    }
    setVolunteers([...volunteers, volunteer])
    setNewVolunteer({ name: '', email: '', phone: '' })
    setShowCreateModal(false)
  }

  const handleAssignToEvent = (volunteerId, eventName) => {
    setVolunteers(volunteers.map(volunteer => {
      if (volunteer.id === volunteerId) {
        return {
          ...volunteer,
          assignedEvents: [...volunteer.assignedEvents, eventName]
        }
      }
      return volunteer
    }))
  }

  const sendVolunteerLink = (volunteer, eventName) => {
    // Mock sending email with volunteer management link
    console.log(`Sending volunteer link to ${volunteer.email} for event: ${eventName}`)
    alert(`Volunteer management link sent to ${volunteer.email}`)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Volunteers</h1>
          <p className="text-gray-600 mt-1">{volunteers.length} active volunteers</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Volunteer
        </button>
      </div>

      {/* Volunteers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {volunteers.map((volunteer) => (
          <div key={volunteer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{volunteer.name}</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {volunteer.status}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {volunteer.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {volunteer.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Joined: {new Date(volunteer.joinDate).toLocaleDateString()}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Assigned Events:</p>
                {volunteer.assignedEvents.length > 0 ? (
                  <div className="space-y-1">
                    {volunteer.assignedEvents.map((event, index) => (
                      <div key={index} className="flex items-center justify-between bg-blue-50 p-2 rounded-lg">
                        <span className="text-sm text-blue-800">{event}</span>
                        <button
                          onClick={() => sendVolunteerLink(volunteer, event)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                          title="Send management link"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No events assigned</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedVolunteer(volunteer)
                    setShowAssignModal(true)
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Assign Event
                </button>
                <button className="px-4 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Volunteer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Add New Volunteer</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVolunteer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newVolunteer.name}
                  onChange={(e) => setNewVolunteer({ ...newVolunteer, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newVolunteer.email}
                  onChange={(e) => setNewVolunteer({ ...newVolunteer, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newVolunteer.phone}
                  onChange={(e) => setNewVolunteer({ ...newVolunteer, phone: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Add Volunteer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Event Modal */}
      {showAssignModal && selectedVolunteer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Assign Event</h2>
              <button onClick={() => setShowAssignModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Assign <strong>{selectedVolunteer.name}</strong> to an event:
            </p>

            <div className="space-y-2">
              {events.filter(event => !selectedVolunteer.assignedEvents.includes(event)).map((event) => (
                <button
                  key={event}
                  onClick={() => {
                    handleAssignToEvent(selectedVolunteer.id, event)
                    setShowAssignModal(false)
                    setSelectedVolunteer(null)
                  }}
                  className="w-full text-left p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    {event}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VolunteersTab