import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate, Outlet } from 'react-router-dom'
import { setToken, setUser } from '../slices/authSlice'
import Sidebar from '../components/Sidebar'
import DashboardOverview from '../components/DashboardOverview'
import EventsTab from '../components/EventsTab'
import ParticipantsTab from '../components/ParticipantsTab'
import VolunteersTab from '../components/VolunteersTab'
import SettingsTab from '../components/SettingsTab'
import toast from 'react-hot-toast'

function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  // Update activeTab based on current route
  useEffect(() => {
    const path = location.pathname

    if (path === '/dashboard' || path === '/dashboard/') {
      setActiveTab('dashboard')
    } else if (path.startsWith('/dashboard/upcoming')) {
      if (path.includes('/dashboard/upcoming/')) {
        // Don't change activeTab when viewing event details
        return
      }
      setActiveTab('upcoming-events')
    } else if (path.startsWith('/dashboard/current')) {
      if (path.includes('/dashboard/current/')) {
        // Don't change activeTab when viewing event details
        return
      }
      setActiveTab('live-events')
    } else if (path.startsWith('/dashboard/past')) {
      if (path.includes('/dashboard/past/')) {
        // Don't change activeTab when viewing event details
        return
      }
      setActiveTab('past-events')
    }
  }, [location.pathname])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    dispatch(setToken(null))
    dispatch(setUser(null))
    toast.success('Logged out successfully')
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)

    // Navigate to appropriate route
    switch (tabId) {
      case 'dashboard':
        navigate('/dashboard')
        break
      case 'live-events':
        navigate('/dashboard/current')
        break
      case 'upcoming-events':
        navigate('/dashboard/upcoming')
        break
      case 'past-events':
        navigate('/dashboard/past')
        break
      case 'all-events':
        navigate('/dashboard')
        break
      case 'participants':
        navigate('/dashboard')
        setActiveTab('participants')
        break
      case 'volunteers':
        navigate('/dashboard')
        setActiveTab('volunteers')
        break
      case 'settings':
        navigate('/dashboard')
        setActiveTab('settings')
        break
      default:
        navigate('/dashboard')
        break
    }
  }

  const renderActiveTab = () => {
    const path = location.pathname

    // If we're on a detail page route, render the Outlet
    if (path.includes('/dashboard/upcoming/') ||
        path.includes('/dashboard/current/') ||
        path.includes('/dashboard/past/')) {
      return <Outlet />
    }

    // Otherwise render based on activeTab
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
        setActiveTab={handleTabChange}
        onLogout={handleLogout}
      />
      <div className="flex-1 overflow-auto">
        {renderActiveTab()}
      </div>
    </div>
  )
}

export default DashboardPage
