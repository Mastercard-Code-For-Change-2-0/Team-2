import { useState, useEffect } from 'react'
import { X, Calendar, MapPin, Target, FileText } from 'lucide-react'
import { apiConnector } from '../services/apiConnector'
import { getUser } from '../utils/auth'
import toast from 'react-hot-toast'

function CreateEventModal({ onClose, onEventCreated }) {
  const [eventId, setEventId] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    date: '',
    time: '',
    targetAudience: 'All',
    detailedDescription: '',
    location: '',
    mapLink: '',
  })
  const [loading, setLoading] = useState(false)

  // Generate unique event ID on component mount
  useEffect(() => {
    const generateEventId = () => {
      const prefix = 'EVT'
      const timestamp = Date.now().toString().slice(-6)
      const random = Math.random().toString(36).substring(2, 6).toUpperCase()
      return `${prefix}-${timestamp}-${random}`
    }
    setEventId(generateEventId())
  }, [])

  const targetAudienceOptions = [
    { value: 'All', label: 'All Students', description: 'Open to all students' },
    { value: 'STEM', label: 'STEM Students', description: 'Science, Technology, Engineering, Math' },
    { value: 'Business', label: 'Business Students', description: 'Business and Management students' },
    { value: 'Arts', label: 'Arts & Humanities', description: 'Arts, Literature, and Humanities' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    if (!formData.title || !formData.description || !formData.type || !formData.date || !formData.time || !formData.location || !formData.detailedDescription) {
      toast.error('Please fill in all required fields')
      setLoading(false)
      return
    }

    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        date: formData.date,
        time: formData.time,
        detailedDescription: formData.detailedDescription,
        location: formData.location,
        mapLink: formData.mapLink,
        targetAudience: formData.targetAudience,
        // createdBy: getUser()?.id || '68ac0364905de151de6ce6f9',
        createdBy: getUser()?.id ,
      }

      const token = localStorage.getItem('token')
      console.log("token: ", token)
      console.log("eventData: ", eventData)

      const response = await apiConnector(
        'POST',
        `${import.meta.env.VITE_API_BASE_URL}/event/createEvent`,
        eventData,
        {
          Authorization: `Bearer ${token}`,
        }
      )

      console.log('API Response:', response)

      if (response.data.success) {
        toast.success('Event created successfully!')
        onEventCreated && onEventCreated()
        onClose()
      } else {
        toast.error(response.data.message || 'Failed to create event')
      }
    } catch (error) {
      console.error('Error creating event:', error)
      toast.error('Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl z-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
              <p className="text-sm text-gray-600 mt-1">
                Event ID: <span className="font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">{eventId}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              type="button"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Event Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter event title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Type
                </label>
                <input
                  type="text"
                  placeholder="e.g., Workshop, Seminar, Career Fair"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Short Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Brief description of the event"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Target Audience */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Target className="w-4 h-4 inline mr-2" />
                  Target Audience *
                </label>
                <div className="space-y-3">
                  {targetAudienceOptions.map((option) => (
                    <label key={option.value} className="flex items-start space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="targetAudience"
                        value={option.value}
                        checked={formData.targetAudience === option.value}
                        onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                        className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Detailed Description
                </label>
                <textarea
                  rows={5}
                  placeholder="Provide detailed information about the event, agenda, speakers, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  value={formData.detailedDescription}
                  onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Event venue or online link"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              {/* Map Link */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Map Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="Google Maps link or other map service"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.mapLink}
                  onChange={(e) => setFormData({ ...formData, mapLink: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                'Create Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateEventModal