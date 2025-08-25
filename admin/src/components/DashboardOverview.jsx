import { useState } from 'react'
import { Plus, Calendar, Users, UserCheck, TrendingUp, BarChart3, Target, Award } from 'lucide-react'
import CreateEventModal from './CreateEventModal'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js'
import { Bar, Pie, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

function DashboardOverview() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Mock data for Katalyst Outreach Analytics - Last 6 Months (Jan-Jun 2024)
  const analyticsData = {
    // Conversion funnel for LAST 6 MONTHS (Jan-Jun 2024)
    conversionFunnel: {
      labels: ['Raw leads', 'Interested', 'Registered', 'Event Attendance'],
      data: [1800, 1260, 900, 630], // Total for 6 months
      colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
    },
    leadSources: {
      labels: ['Social Media', 'University Partnerships', 'Referrals', 'Direct Website', 'Email Campaigns'],
      data: [35, 25, 20, 15, 5], // Percentage breakdown
      colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
    },
    // Top 5 events from LAST 6 MONTHS with their total attendance
    topEvents: [
      { name: 'Tech Career Fair (Mar)', registrations: 320, conversions: 112 },
      { name: 'AI/ML Bootcamp (May)', registrations: 280, conversions: 98 },
      { name: 'Hackathon Series (Apr)', registrations: 250, conversions: 88 },
      { name: 'Leadership Summit (Feb)', registrations: 200, conversions: 70 },
      { name: 'Data Science Workshop (Jun)', registrations: 180, conversions: 63 }
    ],
    // Monthly progression over 6 months
    monthlyTrends: {
      labels: ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024'],
      leads: [250, 280, 320, 300, 350, 300], // Monthly leads (total = 1800)
      conversions: [88, 98, 112, 105, 123, 105] // Monthly event attendance (total = 631)
    }
  }

  const stats = [
    {
      title: 'Total Events',
      value: '12',
      change: '+2 this month',
      icon: Calendar,
      color: 'blue'
    },
    {
      title: 'Active Participants',
      value: '1,234',
      change: '+15% from last month',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Volunteers',
      value: '45',
      change: '+5 new this week',
      icon: UserCheck,
      color: 'purple'
    },
    {
      title: 'Attendance Rate',
      value: '87%',
      change: '+3% improvement',
      icon: TrendingUp,
      color: 'orange'
    }
  ]

  const recentEvents = [
    {
      id: 1,
      title: 'Annual Fest',
      date: '2024-03-15',
      participants: 150,
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Hackathons',
      date: '2024-04-20',
      participants: 75,
      status: 'live'
    },
    {
      id: 3,
      title: 'TechFests',
      date: '2024-02-28',
      participants: 200,
      status: 'completed'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-800'
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatColor = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500'
    }
    return colors[color] || 'bg-gray-500'
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${getStatColor(stat.color)}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Events</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{event.participants} participants</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Katalyst Outreach Analytics */}
      <div className="mt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Katalyst Outreach Analytics</h2>
          <p className="text-gray-600">6-Month Performance Overview (Jan - Jun 2024)</p>
        </div>

        {/* Analytics Stats - Last 6 Months */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads (6 months)</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">1,800</p>
                <p className="text-sm text-green-600 mt-1">300 avg/month</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Event Attendance Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">35%</p>
                <p className="text-sm text-green-600 mt-1">630 total attendees</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events Held</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">15</p>
                <p className="text-sm text-green-600 mt-1">2.5 events/month</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Event Capacity</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">85%</p>
                <p className="text-sm text-green-600 mt-1">High engagement</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-500">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Student Conversion Funnel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">6-Month Conversion Funnel (Jan-Jun 2024)</h3>
            <div className="h-80">
              <Bar
                data={{
                  labels: analyticsData.conversionFunnel.labels,
                  datasets: [{
                    label: 'Count',
                    data: analyticsData.conversionFunnel.data,
                    backgroundColor: analyticsData.conversionFunnel.colors,
                    borderRadius: 8,
                    borderSkipped: false,
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const percentage = context.dataIndex === 0 ? 100 :
                            ((context.parsed.y / analyticsData.conversionFunnel.data[0]) * 100).toFixed(1);
                          return `${context.parsed.y} (${percentage}%)`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: '#f3f4f6'
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Inverted Conversion Funnel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">6-Month Funnel Visualization</h3>
            <div className="h-80 overflow-y-auto">
              <div className="w-full space-y-3">
                {analyticsData.conversionFunnel.labels.map((label, index) => {
                  const value = analyticsData.conversionFunnel.data[index];
                  const maxValue = analyticsData.conversionFunnel.data[0];
                  const widthPercentage = (value / maxValue) * 100;
                  const color = analyticsData.conversionFunnel.colors[index];
                  const conversionRate = index === 0 ? 100 : ((value / analyticsData.conversionFunnel.data[0]) * 100).toFixed(1);

                  return (
                    <div key={index} className="relative">
                      {/* Stage Header with Label and Metrics */}
                      <div className="flex justify-between items-center mb-2 px-2">
                        <span className="text-sm font-semibold text-gray-800">{label}</span>
                        <div className="text-right">
                          <span className="text-sm font-bold text-gray-900">{value}</span>
                          <span className="text-xs text-gray-600 ml-1">({conversionRate}%)</span>
                        </div>
                      </div>

                      {/* Funnel Bar */}
                      <div className="flex justify-center mb-3">
                        <div
                          className="h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 relative"
                          style={{
                            backgroundColor: color,
                            width: `${Math.max(widthPercentage, 25)}%`,
                            maxWidth: '100%'
                          }}
                        >
                          <span className="text-sm font-semibold">{value}</span>

                          {/* Conversion Rate Badge */}
                          <div className="absolute -top-2 -right-2 bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded-full shadow-sm border">
                            {conversionRate}%
                          </div>
                        </div>
                      </div>

                      {/* Arrow Connector */}
                      {index < analyticsData.conversionFunnel.labels.length - 1 && (
                        <div className="flex justify-center mb-2">
                          <div className="flex flex-col items-center">
                            <div className="w-0 h-0 border-l-3 border-r-3 border-t-6 border-transparent border-t-gray-400"></div>
                            <div className="w-px h-2 bg-gray-300"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Conversion Rate Summary */}
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 mb-1">Overall Conversion Rate</p>
                    <p className="text-xl font-bold text-blue-600">
                      {((analyticsData.conversionFunnel.data[analyticsData.conversionFunnel.data.length - 1] / analyticsData.conversionFunnel.data[0]) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {analyticsData.conversionFunnel.data[analyticsData.conversionFunnel.data.length - 1]} applications from {analyticsData.conversionFunnel.data[0]} leads
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lead Source Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Source Distribution (6 Months)</h3>
            <div className="h-80">
              <Pie
                data={{
                  labels: analyticsData.leadSources.labels,
                  datasets: [{
                    data: analyticsData.leadSources.data,
                    backgroundColor: analyticsData.leadSources.colors,
                    borderWidth: 2,
                    borderColor: '#ffffff'
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 20,
                        usePointStyle: true
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.label}: ${context.parsed}%`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Top 5 Events and Monthly Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top 5 Events by Registrations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Events (Jan-Jun 2024)</h3>
            <div className="space-y-4">
              {analyticsData.topEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{event.name}</h4>
                      <p className="text-sm text-gray-600">{event.conversions} Attendees</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{event.registrations}</p>
                    <p className="text-sm text-gray-600">registrations</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends (Jan-Jun 2024)</h3>
            <div className="h-80">
              <Line
                data={{
                  labels: analyticsData.monthlyTrends.labels,
                  datasets: [
                    {
                      label: 'Leads Generated',
                      data: analyticsData.monthlyTrends.leads,
                      borderColor: '#3B82F6',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      tension: 0.4,
                      fill: true
                    },
                    {
                      label: 'Conversions',
                      data: analyticsData.monthlyTrends.conversions,
                      borderColor: '#10B981',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      tension: 0.4,
                      fill: true
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        usePointStyle: true,
                        padding: 20
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: '#f3f4f6'
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      }
                    }
                  },
                  interaction: {
                    intersect: false,
                    mode: 'index'
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onEventCreated={() => setShowCreateModal(false)}
        />
      )}
    </div>
  )
}

export default DashboardOverview