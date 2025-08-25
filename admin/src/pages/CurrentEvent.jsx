import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, MapPin, Clock, Activity } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export const CurrentEvent = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const event = location.state?.eventData

  // Fallback data if no event data is passed
  const defaultEvent = {
    id: 2,
    title: 'Software Engineering Workshop',
    description: 'Hands-on workshop covering modern software development',
    date: '2024-01-20T14:00:00Z',
    location: 'Engineering Building Room 101',
    participants: 75,
    maxParticipants: 100,
    status: 'live',
    hourlyAttendance: [65, 70, 75, 78, 80, 82, 80, 75],
    technologies: {
      react: 30,
      node: 25,
      python: 15,
      java: 10
    }
  }

  const currentEvent = event || defaultEvent

  // Ensure required data exists
  const hourlyAttendance = currentEvent.hourlyAttendance || [65, 70, 75, 78, 80, 82, 80, 75]
  const technologies = currentEvent.technologies || { react: 30, node: 25, python: 15, java: 10 }

  const hourlyData = {
    labels: ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM'],
    datasets: [{
      label: 'Hourly Attendance',
      data: hourlyAttendance,
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1,
      fill: true
    }]
  }

  const techData = {
    labels: Object.keys(technologies).map(tech => tech.charAt(0).toUpperCase() + tech.slice(1)),
    datasets: [{
      label: 'Technologies Used',
      data: Object.values(technologies),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/dashboard/current')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Events
        </button>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-600 font-medium">LIVE EVENT</span>
        </div>
      </div>

      {/* Event Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{currentEvent.title}</h1>
            <p className="text-gray-600 mb-4">{currentEvent.description}</p>
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Live Now
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-medium">{new Date(currentEvent.date).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-medium">{currentEvent.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Attendance</p>
              <p className="font-medium">{currentEvent.participants}/{currentEvent.maxParticipants}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Activity className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Engagement</p>
              <p className="font-medium">{Math.round((currentEvent.participants / currentEvent.maxParticipants) * 100)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Real-time Attendance Trend</h3>
          <div className="h-64">
            <Line data={hourlyData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Technology Focus Areas</h3>
          <div className="h-64">
            <Bar data={techData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Live Stats */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Live Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{hourlyAttendance[hourlyAttendance.length - 1]}</div>
            <div className="text-sm text-gray-600">Current Attendance</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{Math.max(...hourlyAttendance)}</div>
            <div className="text-sm text-gray-600">Peak Attendance</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{Object.keys(technologies).length}</div>
            <div className="text-sm text-gray-600">Technologies Covered</div>
          </div>
        </div>
      </div>

      {/* Live Controls */}
      <div className="mt-6 flex gap-4">
        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium">
          End Event
        </button>
        <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium">
          Pause Event
        </button>
        <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium">
          Export Live Data
        </button>
      </div>
    </div>
  )
}

export default CurrentEvent