import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const ApplicationTracking = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const navigate = useNavigate()
  const [trackingId, setTrackingId] = useState('')
  const [applicationData, setApplicationData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Mock application statuses
  const mockApplications = {
    'KAT-1692950400000-ABC123': {
      trackingId: 'KAT-1692950400000-ABC123',
      eventTitle: 'Digital Literacy Workshop',
      applicantName: 'John Doe',
      registrationDate: '2024-08-25',
      currentStatus: 'completed',
      statusHistory: [
        { status: 'registered', date: '2024-08-25', time: '10:30 AM', description: 'Registration submitted successfully' },
        { status: 'started', date: '2024-08-26', time: '09:15 AM', description: 'Application review started' },
        { status: 'completed', date: '2024-08-27', time: '02:45 PM', description: 'Registration confirmed - Welcome to the event!' }
      ]
    },
    'KAT-1692950500000-DEF456': {
      trackingId: 'KAT-1692950500000-DEF456',
      eventTitle: 'Career Guidance Seminar',
      applicantName: 'Jane Smith',
      registrationDate: '2024-08-24',
      currentStatus: 'started',
      statusHistory: [
        { status: 'registered', date: '2024-08-24', time: '03:20 PM', description: 'Registration submitted successfully' },
        { status: 'started', date: '2024-08-25', time: '11:00 AM', description: 'Application under review' }
      ]
    }
  }

  const getStatusStep = (status) => {
    const steps = { 'registered': 0, 'started': 1, 'completed': 2 }
    return steps[status] || 0
  }

  const getStatusColor = (status, isActive = false) => {
    const colors = {
      'registered': isActive ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-800',
      'started': isActive ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-800',
      'completed': isActive ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const handleTrackApplication = (e) => {
    e.preventDefault()
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID')
      return
    }

    setLoading(true)
    setError('')

    // Simulate API call
    setTimeout(() => {
      const foundApplication = mockApplications[trackingId.trim()]
      if (foundApplication) {
        setApplicationData(foundApplication)
        setError('')
      } else {
        setError('Tracking ID not found. Please check and try again.')
        setApplicationData(null)
      }
      setLoading(false)
    }, 1000)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-6">You need to be signed in to track applications</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Application</h1>
          <p className="text-lg text-gray-600">
            Enter your tracking ID to check the status of your event registration
          </p>
        </div>

        {/* Tracking Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleTrackApplication} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter your tracking ID (e.g., KAT-1692950400000-ABC123)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Tracking...' : 'Track Application'}
            </button>
          </form>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Application Status */}
        {applicationData && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Application Status</h2>
            </div>

            <div className="p-6">
              {/* Application Details */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Application Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tracking ID:</span>
                      <span className="font-mono font-medium">{applicationData.trackingId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Event:</span>
                      <span className="font-medium">{applicationData.eventTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Applicant:</span>
                      <span className="font-medium">{applicationData.applicantName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Registration Date:</span>
                      <span className="font-medium">{new Date(applicationData.registrationDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Status</h3>
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(applicationData.currentStatus, true)}`}>
                    {applicationData.currentStatus.charAt(0).toUpperCase() + applicationData.currentStatus.slice(1)}
                  </div>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Application Progress</h3>
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${(getStatusStep(applicationData.currentStatus) / 2) * 100}%` }}
                    ></div>
                  </div>

                  {/* Steps */}
                  <div className="relative flex justify-between">
                    {['registered', 'started', 'completed'].map((status, index) => {
                      const isCompleted = getStatusStep(applicationData.currentStatus) >= index
                      const isCurrent = getStatusStep(applicationData.currentStatus) === index
                      
                      return (
                        <div key={status} className="flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                            isCompleted 
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-500 text-white shadow-lg' 
                              : isCurrent
                              ? 'bg-blue-50 border-blue-300 text-blue-600 animate-pulse'
                              : 'bg-white border-gray-300 text-gray-400'
                          }`}>
                            {isCompleted ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <span className="text-sm font-medium">{index + 1}</span>
                            )}
                          </div>
                          <div className="mt-3 text-center">
                            <div className={`text-sm font-medium ${isCompleted ? 'text-blue-600' : isCurrent ? 'text-blue-500' : 'text-gray-500'}`}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {status === 'registered' && 'Application Submitted'}
                              {status === 'started' && 'Under Review'}
                              {status === 'completed' && 'Confirmed'}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Status History */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status History</h3>
                <div className="space-y-4">
                  {applicationData.statusHistory.map((entry, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          entry.status === 'registered' ? 'bg-blue-100' : 
                          entry.status === 'started' ? 'bg-yellow-100' : 'bg-green-100'
                        }`}>
                          <div className={`w-3 h-3 rounded-full ${
                            entry.status === 'registered' ? 'bg-blue-500' : 
                            entry.status === 'started' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                            {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                          </span>
                          <span className="text-sm text-gray-500 font-medium">{entry.date} at {entry.time}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{entry.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t">
                <button
                  onClick={() => navigate('/events')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Browse More Events
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Print Status
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sample Tracking IDs for Testing */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Sample Tracking IDs for Testing</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded p-3">
              <p className="font-mono text-sm text-blue-600 mb-1">KAT-1692950400000-ABC123</p>
              <p className="text-xs text-gray-600">Digital Literacy Workshop (Completed)</p>
            </div>
            <div className="bg-white rounded p-3">
              <p className="font-mono text-sm text-blue-600 mb-1">KAT-1692950500000-DEF456</p>
              <p className="text-xs text-gray-600">Career Guidance Seminar (In Progress)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicationTracking
