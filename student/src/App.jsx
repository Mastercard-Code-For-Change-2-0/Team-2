import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import HomePage from './components/HomePage'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import EventsDashboard from './components/events/EventsDashboard'
import RegistrationForm from './components/registration/RegistrationForm'
import ThankYouPage from './components/registration/ThankYouPage'
import ApplicationTracking from './components/tracking/ApplicationTracking'
import Navbar from './components/common/Navbar'
import Chatbot from './components/Chatbot'

function App() {
  const { isAuthenticated } = useSelector(state => state.auth || { isAuthenticated: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/events" element={<EventsDashboard />} />
        <Route path="/register/:eventId" element={<RegistrationForm />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/tracking" element={<ApplicationTracking />} />
      </Routes>
      <Chatbot />
    </div>
  )
}

export default App
