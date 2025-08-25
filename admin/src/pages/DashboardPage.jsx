import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import DashboardOverview from '../components/DashboardOverview'
import EventsTab from '../components/EventsTab'
import ParticipantsTab from '../components/ParticipantsTab'
import VolunteersTab from '../components/VolunteersTab'
import SettingsTab from '../components/SettingsTab'
import { getUser, clearAuth } from '../utils/auth'
import toast from 'react-hot-toast'

function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const navigate = useNavigate()

  const user = getUser()
  
  const handleLogout = () => {
    clearAuth()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />
      case 'live-events':
      case 'upcoming-events':
      case 'past-events':
      case 'all-events':
        return <EventsTab activeSubTab={activeTab} />
      case 'participants':
        return <ParticipantsTab />
      case 'volunteers':
        return <VolunteersTab />
      case 'email-sender':
        navigate('/email-sender')
        return null
      case 'settings':
        return <SettingsTab />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
      />
      <div className="flex-1 overflow-auto">
        {renderActiveTab()}
      </div>
    </div>
  )
}

export default DashboardPage