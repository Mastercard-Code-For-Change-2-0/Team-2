import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const EventsDashboard = () => {
  const { isAuthenticated } = useSelector(state => state.auth)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock events data
  useEffect(() => {
    setTimeout(() => {
      setEvents([
        {
          id: 1,
          title: "Digital Literacy Workshop",
          description: "Learn essential digital skills including computer basics, internet safety, and online communication tools.",
          date: "2024-09-15",
          time: "10:00 AM - 4:00 PM",
          location: "Katalyst Community Center",
          category: "Education",
          maxParticipants: 30,
          registeredCount: 18,
          image: "/api/placeholder/400/250"
        },
        {
          id: 2,
          title: "Career Guidance Seminar",
          description: "Expert guidance on career planning, resume building, and interview preparation for students.",
          date: "2024-09-22",
          time: "2:00 PM - 6:00 PM",
          location: "Virtual Event",
          category: "Career Development",
          maxParticipants: 100,
          registeredCount: 67,
          image: "/api/placeholder/400/250"
        },
        {
          id: 3,
          title: "Environmental Awareness Campaign",
          description: "Join us in spreading awareness about environmental conservation and sustainable living practices.",
          date: "2024-09-28",
          time: "9:00 AM - 3:00 PM",
          location: "City Park",
          category: "Environment",
          maxParticipants: 50,
          registeredCount: 23,
          image: "/api/placeholder/400/250"
        },
        {
          id: 4,
          title: "Coding Bootcamp for Beginners",
          description: "Introduction to programming concepts with hands-on practice in HTML, CSS, and JavaScript.",
          date: "2024-10-05",
          time: "10:00 AM - 5:00 PM",
          location: "Tech Hub",
          category: "Technology",
          maxParticipants: 25,
          registeredCount: 15,
          image: "/api/placeholder/400/250"
        },
        {
          id: 5,
          title: "Mental Health Awareness Workshop",
          description: "Understanding mental health, stress management techniques, and building emotional resilience.",
          date: "2024-10-12",
          time: "11:00 AM - 3:00 PM",
          location: "Wellness Center",
          category: "Health & Wellness",
          maxParticipants: 40,
          registeredCount: 31,
          image: "/api/placeholder/400/250"
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getCategoryColor = (category) => {
    const colors = {
      'Education': 'bg-blue-100 text-blue-800',
      'Career Development': 'bg-green-100 text-green-800',
      'Environment': 'bg-emerald-100 text-emerald-800',
      'Technology': 'bg-purple-100 text-purple-800',
      'Health & Wellness': 'bg-pink-100 text-pink-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and register for exciting events organized by Katalyst NGO. 
            Join us in making a positive impact in the community!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="text-white text-center relative z-10">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-sm font-medium opacity-90">Event Preview</div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {event.registeredCount}/{event.maxParticipants} registered
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="font-medium">{new Date(event.date).toLocaleDateString()} | {event.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="font-medium">{event.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="w-full bg-gray-200 rounded-full h-2 mr-4">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(event.registeredCount / event.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                  <Link
                    to={`/register/${event.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No events available</h3>
            <p className="text-gray-600">Check back later for upcoming events!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventsDashboard
