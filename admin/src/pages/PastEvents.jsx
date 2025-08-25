import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, MapPin, Clock, CheckCircle, BarChart3, Star } from 'lucide-react'
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
import { Line, Bar, Pie } from 'react-chartjs-2'

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

export const PastEvents = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const event = location.state?.eventData

  // Fallback data if no event data is passed
  const defaultEvent = {
    id: 3,
    title: 'AI/ML Bootcamp',
    description: 'Intensive bootcamp on artificial intelligence and machine learning',
    date: '2024-01-10T09:00:00Z',
    location: 'Tech Hub Auditorium',
    participants: 200,
    maxParticipants: 200,
    status: 'completed',
    satisfactionRates: {
      excellent: 70,
      good: 40,
      average: 15,
      poor: 5
    },
    sessionAttendance: [120, 125, 130, 128, 115],
    participantTypes: {
      students: 120,
      professionals: 60,
      others: 20
    }
  }

  const currentEvent = event || defaultEvent

  // Ensure required data exists
  const satisfactionRates = currentEvent.satisfactionRates || { excellent: 70, good: 40, average: 15, poor: 5 }
  const sessionAttendance = currentEvent.sessionAttendance || [120, 125, 130, 128, 115]
  const participantTypes = currentEvent.participantTypes || { students: 120, professionals: 60, others: 20 }

  const satisfactionData = {
    labels: ['Excellent', 'Good', 'Average', 'Poor'],
    datasets: [{
      label: 'Participant Satisfaction',
      data: Object.values(satisfactionRates),
      backgroundColor: [
        'rgba(34, 197, 94, 0.6)',
        'rgba(59, 130, 246, 0.6)',
        'rgba(245, 158, 11, 0.6)',
        'rgba(239, 68, 68, 0.6)',
      ],
      borderColor: [
        'rgba(34, 197, 94, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(239, 68, 68, 1)',
      ],
      borderWidth: 2,
    }]
  }

  const attendanceData = {
    labels: ['Session 1', 'Session 2', 'Session 3', 'Session 4', 'Session 5'],
    datasets: [{
      label: 'Session Attendance',
      data: sessionAttendance,
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      tension: 0.1,
      fill: true
    }]
  }

  const participantData = {
    labels: ['Students', 'Professionals', 'Others'],
    datasets: [{
      data: [
        participantTypes.students,
        participantTypes.professionals,
        participantTypes.others
      ],
      backgroundColor: [
        'rgba(239, 68, 68, 0.6)',
        'rgba(59, 130, 246, 0.6)',
        'rgba(245, 158, 11, 0.6)',
      ],
      borderColor: [
        'rgba(239, 68, 68, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(245, 158, 11, 1)',
      ],
      borderWidth: 2,
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

  // Calculate metrics
  const totalSatisfaction = Object.values(satisfactionRates).reduce((a, b) => a + b, 0)
  const averageAttendance = Math.round(sessionAttendance.reduce((a, b) => a + b, 0) / sessionAttendance.length)
  const satisfactionScore = Math.round(
    (satisfactionRates.excellent * 4 + satisfactionRates.good * 3 + satisfactionRates.average * 2 + satisfactionRates.poor * 1) / totalSatisfaction
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-600 font-medium">COMPLETED EVENT</span>
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
            Completed
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Event Date</p>
              <p className="font-medium">{new Date(currentEvent.date).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Venue</p>
              <p className="font-medium">{currentEvent.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Attendance</p>
              <p className="font-medium">{currentEvent.participants}/{currentEvent.maxParticipants}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Star className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Satisfaction</p>
              <p className="font-medium">{satisfactionScore}/4 ★</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Participant Satisfaction</h3>
          <div className="h-64">
            <Bar data={satisfactionData} options={chartOptions} />
          </div>
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="text-sm text-green-800">
              <strong>Overall Rating:</strong> {satisfactionScore}/4 stars ({Math.round((satisfactionRates.excellent + satisfactionRates.good) / totalSatisfaction * 100)}% positive feedback)
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Session Attendance Trend</h3>
          <div className="h-64">
            <Line data={attendanceData} options={chartOptions} />
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>Average Attendance:</strong> {averageAttendance} participants per session
            </div>
          </div>
        </div>
      </div>

      {/* Participant Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Participant Distribution</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64">
            <Pie data={participantData} options={chartOptions} />
          </div>
          <div className="flex flex-col justify-center">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="font-medium">Students</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600">{participantTypes.students}</div>
                  <div className="text-sm text-gray-600">{Math.round(participantTypes.students / currentEvent.participants * 100)}%</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="font-medium">Professionals</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600">{participantTypes.professionals}</div>
                  <div className="text-sm text-gray-600">{Math.round(participantTypes.professionals / currentEvent.participants * 100)}%</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="font-medium">Others</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-yellow-600">{participantTypes.others}</div>
                  <div className="text-sm text-gray-600">{Math.round(participantTypes.others / currentEvent.participants * 100)}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Event Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{currentEvent.participants}</div>
            <div className="text-sm text-gray-600">Total Attendees</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{averageAttendance}</div>
            <div className="text-sm text-gray-600">Avg. Session Attendance</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{Math.round((satisfactionRates.excellent + satisfactionRates.good) / totalSatisfaction * 100)}%</div>
            <div className="text-sm text-gray-600">Positive Feedback</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{sessionAttendance.length}</div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
          Generate Report
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium">
          Export Analytics
        </button>
        <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium">
          View Feedback
        </button>
      </div>
    </div>
  )
}

export default PastEvents