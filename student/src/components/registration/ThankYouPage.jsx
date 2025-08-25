import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const ThankYouPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { trackingId, eventTitle, registrationData } = location.state || {}

  if (!trackingId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Access</h2>
          <p className="text-gray-600 mb-6">This page can only be accessed after registration</p>
          <button
            onClick={() => navigate('/events')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-blue-600 px-6 py-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">🎉 Congratulations!</h1>
            <p className="text-green-100 text-lg">Your registration was successful! Welcome to Katalyst NGO</p>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            {/* Tracking ID Section */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-3">Your Registration Details</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium text-gray-700">Tracking ID:</span>
                  <span className="font-mono text-lg font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded">
                    {trackingId}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium text-gray-700">Event:</span>
                  <span className="font-semibold text-gray-900">{eventTitle}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="font-medium text-gray-700">Registration Date:</span>
                  <span className="text-gray-900">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-yellow-50 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <svg className="w-6 h-6 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-semibold text-yellow-900">Important Notes</h3>
                </div>
                <ul className="text-yellow-800 text-sm space-y-2">
                  <li>• Save your tracking ID for future reference</li>
                  <li>• Check your email for confirmation details</li>
                  <li>• Arrive 15 minutes before the event starts</li>
                  <li>• Bring a valid ID for verification</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3 className="font-semibold text-green-900">Email Confirmation</h3>
                </div>
                <p className="text-green-800 text-sm">
                  A confirmation email has been sent to <strong>{registrationData?.email}</strong> with event details and instructions.
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Check Your Email</h4>
                    <p className="text-gray-600 text-sm">You'll receive a welcome email with event details and preparation instructions.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Track Your Application</h4>
                    <p className="text-gray-600 text-sm">Use your tracking ID to monitor your registration status and receive updates.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Attend the Event</h4>
                    <p className="text-gray-600 text-sm">Join us on the event day and be part of the positive change!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/tracking"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium text-center transition-colors"
              >
                Track My Application
              </Link>
              <Link
                to="/events"
                className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg font-medium text-center transition-colors"
              >
                Browse More Events
              </Link>
              <button
                onClick={() => window.print()}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Print Confirmation
              </button>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="font-medium text-gray-900">Email Support</p>
              <p className="text-gray-600">support@katalyst.org</p>
            </div>
            
            <div className="text-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <p className="font-medium text-gray-900">Phone Support</p>
              <p className="text-gray-600">+91 98765 43210</p>
            </div>
            
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="font-medium text-gray-900">Visit Us</p>
              <p className="text-gray-600">Katalyst Community Center</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThankYouPage
