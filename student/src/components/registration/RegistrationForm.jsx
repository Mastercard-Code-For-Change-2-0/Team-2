import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

const RegistrationForm = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector(state => state.auth)
  
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    year: '',
    fieldOfStudy: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    dietaryRestrictions: '',
    previousExperience: '',
    motivation: ''
  })
  const [errors, setErrors] = useState({})

  // Mock event data fetch
  useEffect(() => {
    const events = [
      {
        id: 1,
        title: "Digital Literacy Workshop",
        description: "Master the digital world with our comprehensive workshop covering computer fundamentals, internet navigation, digital communication, and online safety. Perfect for beginners looking to enhance their digital skills in today's technology-driven world.",
        fullDescription: "In this hands-on workshop, participants will learn essential computer skills including basic operations, file management, internet browsing, email communication, and social media safety. We'll cover digital citizenship, online privacy, and how to identify and avoid digital scams. The workshop includes practical exercises using popular software applications and platforms that are essential for academic and professional success.",
        date: "2024-09-15",
        time: "10:00 AM - 4:00 PM",
        location: "Katalyst Community Center",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Education",
        instructor: "Tech Experts Team",
        duration: "6 hours",
        prerequisites: "None - Beginner friendly"
      },
      {
        id: 2,
        title: "Career Guidance Seminar",
        description: "Unlock your career potential with expert guidance on professional development, resume building, interview skills, and career planning strategies for students and young professionals.",
        fullDescription: "This comprehensive seminar provides students with essential career development tools and strategies. Learn how to craft compelling resumes, master interview techniques, develop professional networking skills, and create effective career plans. Industry experts will share insights on current job market trends, in-demand skills, and how to stand out in competitive fields. Interactive sessions include mock interviews, resume reviews, and personalized career counseling.",
        date: "2024-09-22",
        time: "2:00 PM - 6:00 PM",
        location: "Virtual Event",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Career Development",
        instructor: "Career Counseling Professionals",
        duration: "4 hours",
        prerequisites: "Open to all students"
      },
      {
        id: 3,
        title: "Environmental Awareness Campaign",
        description: "Join our mission to create environmental awareness and promote sustainable living practices. Learn about climate change, conservation, and how you can make a positive impact on our planet.",
        fullDescription: "Be part of the solution in our environmental awareness campaign focused on climate action and sustainability. This event combines educational workshops on environmental science, hands-on activities like tree planting and waste management, and community outreach programs. Participants will learn about renewable energy, water conservation, sustainable agriculture, and how individual actions contribute to global environmental health. The campaign includes interactive exhibits, expert talks, and practical demonstrations of eco-friendly practices.",
        date: "2024-09-28",
        time: "9:00 AM - 3:00 PM",
        location: "City Park",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Environment",
        instructor: "Environmental Scientists",
        duration: "6 hours",
        prerequisites: "Passion for environmental conservation"
      },
      {
        id: 4,
        title: "Coding Bootcamp for Beginners",
        description: "Start your programming journey with our beginner-friendly coding bootcamp covering HTML, CSS, JavaScript fundamentals, and basic web development concepts.",
        fullDescription: "Dive into the world of programming with our intensive coding bootcamp designed for complete beginners. Learn the building blocks of web development including HTML for structure, CSS for styling, and JavaScript for interactivity. The bootcamp covers programming fundamentals, problem-solving techniques, and best practices in software development. Hands-on projects include building responsive websites, interactive web applications, and understanding version control with Git. Perfect for students interested in technology careers or anyone wanting to learn valuable digital skills.",
        date: "2024-10-05",
        time: "10:00 AM - 5:00 PM",
        location: "Tech Hub",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Technology",
        instructor: "Software Development Team",
        duration: "7 hours",
        prerequisites: "Basic computer skills"
      },
      {
        id: 5,
        title: "Mental Health Awareness Workshop",
        description: "Prioritize your mental wellbeing with our comprehensive workshop on mental health awareness, stress management, emotional resilience, and self-care strategies.",
        fullDescription: "Mental health is just as important as physical health. This workshop provides essential knowledge and practical tools for maintaining good mental health and supporting others. Topics include understanding common mental health challenges, recognizing warning signs, stress management techniques, mindfulness practices, and building emotional resilience. Interactive sessions cover coping strategies, communication skills, and creating supportive environments. Mental health professionals will provide guidance on when and how to seek help, available resources, and breaking the stigma around mental health discussions.",
        date: "2024-10-12",
        time: "11:00 AM - 3:00 PM",
        location: "Wellness Center",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Health & Wellness",
        instructor: "Mental Health Professionals",
        duration: "4 hours",
        prerequisites: "Open to everyone"
      }
    ]
    
    setTimeout(() => {
      const foundEvent = events.find(e => e.id === parseInt(eventId))
      setEvent(foundEvent)
      setLoading(false)
      
      // Pre-fill user data if authenticated
      if (isAuthenticated && user) {
        setFormData(prev => ({
          ...prev,
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || ''
        }))
      }
    }, 500)
  }, [eventId, isAuthenticated, user])

  const validateForm = () => {
    const newErrors = {}
    const requiredFields = ['name', 'email', 'phone', 'college', 'year', 'fieldOfStudy']
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      }
    })

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      const trackingId = `KAT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      toast.success('🎉 Congratulations! Registration successful!')
      navigate('/thank-you', { 
        state: { 
          trackingId, 
          eventTitle: event.title,
          registrationData: formData
        } 
      })
      setSubmitting(false)
    }, 2000)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist</p>
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Event Image Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="relative h-64 md:h-80 lg:h-96">
            <img 
              src={event.image} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center mb-2">
                <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-medium mr-3">
                  {event.category}
                </span>
                <span className="text-sm opacity-90">{event.duration}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
              <p className="text-lg opacity-90 max-w-3xl">{event.description}</p>
            </div>
          </div>
        </div>

        {/* Event Details Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Details</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Event</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{event.fullDescription}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span><strong>Instructor:</strong> {event.instructor}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span><strong>Prerequisites:</strong> {event.prerequisites}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h3>
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Date & Time</p>
                      <p className="text-gray-600">{new Date(event.date).toLocaleDateString()} | {event.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Location</p>
                      <p className="text-gray-600">{event.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Duration</p>
                      <p className="text-gray-600">{event.duration}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Register for This Event</h2>
            <p className="text-blue-100">Fill out the form below to secure your spot</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
                
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="Enter your email"
                  />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
                
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="Enter your phone number"
                  />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
                
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your address"
                  />
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">College/University *</label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.college ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="Enter your college/university"
                  />
                  {errors.college && <p className="text-red-500 text-sm mt-1">{errors.college}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study *</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.year ? 'border-red-300' : 'border-gray-300'}`}
                  >
                    <option value="">Select year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Post Graduate">Post Graduate</option>
                  </select>
                  {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study *</label>
                  <select
                    name="fieldOfStudy"
                    value={formData.fieldOfStudy}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fieldOfStudy ? 'border-red-300' : 'border-gray-300'}`}
                  >
                    <option value="">Select your field of study</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Business Administration">Business Administration</option>
                    <option value="Management">Management</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Accounting">Accounting</option>
                    <option value="Economics">Economics</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Chemical Engineering">Chemical Engineering</option>
                    <option value="Biomedical Engineering">Biomedical Engineering</option>
                    <option value="Environmental Engineering">Environmental Engineering</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Nursing">Nursing</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Dentistry">Dentistry</option>
                    <option value="Psychology">Psychology</option>
                    <option value="Sociology">Sociology</option>
                    <option value="Political Science">Political Science</option>
                    <option value="International Relations">International Relations</option>
                    <option value="English Literature">English Literature</option>
                    <option value="History">History</option>
                    <option value="Philosophy">Philosophy</option>
                    <option value="Art and Design">Art and Design</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Environmental Science">Environmental Science</option>
                    <option value="Education">Education</option>
                    <option value="Law">Law</option>
                    <option value="Journalism">Journalism</option>
                    <option value="Communications">Communications</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.fieldOfStudy && <p className="text-red-500 text-sm mt-1">{errors.fieldOfStudy}</p>}
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter emergency contact name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter emergency contact phone"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Restrictions/Allergies</label>
                  <textarea
                    name="dietaryRestrictions"
                    value={formData.dietaryRestrictions}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Please mention any dietary restrictions or allergies"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Previous Experience (if any)</label>
                  <textarea
                    name="previousExperience"
                    value={formData.previousExperience}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any relevant previous experience or skills"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Why do you want to attend this event?</label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about your motivation and what you hope to gain from this event"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/events')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors disabled:opacity-50"
              >
                {submitting ? 'Registering...' : 'Register for Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegistrationForm
