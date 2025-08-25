import { useState } from 'react'
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  UserCheck, 
  Settings, 
  LogOut,
  Plus,
  Clock,
  CheckCircle,
  List
} from 'lucide-react'

function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const [eventsExpanded, setEventsExpanded] = useState(false)

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      hasSubmenu: false
    },
    {
      id: 'events',
      label: 'Events',
      icon: Calendar,
      hasSubmenu: true,
      submenu: [
        { id: 'live-events', label: 'Live Events', icon: CheckCircle },
        { id: 'upcoming-events', label: 'Upcoming', icon: Clock },
        { id: 'past-events', label: 'Past Events', icon: List },
        { id: 'all-events', label: 'All Events', icon: Calendar }
      ]
    },
    {
      id: 'participants',
      label: 'Participants',
      icon: Users,
      hasSubmenu: false
    },
    {
      id: 'volunteers',
      label: 'Volunteers',
      icon: UserCheck,
      hasSubmenu: false
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      hasSubmenu: false
    }
  ]

  const handleMenuClick = (itemId) => {
    if (itemId === 'events') {
      setEventsExpanded(!eventsExpanded)
    } else {
      setActiveTab(itemId)
      if (itemId !== 'events') {
        setEventsExpanded(false)
      }
    }
  }

  return (
    <div className="w-64 bg-white h-screen shadow-lg border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Katalyst Admin</h1>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id || 
            (item.hasSubmenu && item.submenu?.some(sub => sub.id === activeTab))
          
          return (
            <div key={item.id}>
              <button
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left transition-all duration-200 relative ${
                  isActive 
                    ? 'text-blue-600 bg-blue-50 border-r-3 border-blue-600' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                style={{
                  borderTopLeftRadius: isActive ? '20px' : '0',
                  borderBottomLeftRadius: isActive ? '20px' : '0',
                  marginRight: isActive ? '8px' : '0'
                }}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
                {item.hasSubmenu && (
                  <div className={`ml-auto transition-transform duration-200 ${
                    eventsExpanded ? 'rotate-90' : ''
                  }`}>
                    ▶
                  </div>
                )}
              </button>
              
              {item.hasSubmenu && eventsExpanded && (
                <div className="bg-gray-50 border-l-2 border-blue-200 ml-6">
                  {item.submenu.map((subItem) => {
                    const SubIcon = subItem.icon
                    const isSubActive = activeTab === subItem.id
                    
                    return (
                      <button
                        key={subItem.id}
                        onClick={() => setActiveTab(subItem.id)}
                        className={`w-full flex items-center px-6 py-2 text-left text-sm transition-colors ${
                          isSubActive 
                            ? 'text-blue-600 bg-blue-100' 
                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        <SubIcon className="w-4 h-4 mr-3" />
                        {subItem.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
        
        <button
          onClick={onLogout}
          className="w-full flex items-center px-6 py-3 text-left text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors mt-4"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </nav>
    </div>
  )
}

export default Sidebar