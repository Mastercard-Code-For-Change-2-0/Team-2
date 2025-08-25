import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, MapPin, Calendar, TrendingUp } from 'lucide-react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
)

export const UpcomingEvents = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const event = location.state?.eventData

    // Fallback data if no event data is passed
    const defaultEvent = {
        id: 1,
        title: 'Tech Career Fair 2024',
        description: 'Annual technology career fair featuring top companies',
        date: '2024-03-15T10:00:00Z',
        location: 'University Convention Center',
        participants: 150,
        maxParticipants: 200,
        status: 'upcoming',
        registrationTrend: [20, 35, 45, 60, 85, 110, 150],
        participantTypes: {
            students: 90,
            professionals: 45,
            others: 15
        }
    }

    const currentEvent = event || defaultEvent

    // Ensure required data exists
    const registrationTrend = currentEvent.registrationTrend || [20, 35, 45, 60, 85, 110, 150]
    const participantTypes = currentEvent.participantTypes || { students: 90, professionals: 45, others: 15 }

    const registrationData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
        datasets: [{
            label: 'Registration Trend',
            data: registrationTrend,
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
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

    const daysUntilEvent = Math.ceil((new Date(currentEvent.date) - new Date()) / (1000 * 60 * 60 * 24))

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-blue-600 font-medium">UPCOMING EVENT</span>
                </div>
            </div>

            {/* Event Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{currentEvent.title}</h1>
                        <p className="text-gray-600 mb-4">{currentEvent.description}</p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {daysUntilEvent > 0 ? `${daysUntilEvent} days to go` : 'Starting soon'}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
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
                            <p className="text-sm text-gray-600">Registrations</p>
                            <p className="font-medium">{currentEvent.participants}/{currentEvent.maxParticipants}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="text-sm text-gray-600">Capacity</p>
                            <p className="font-medium">{Math.round((currentEvent.participants / currentEvent.maxParticipants) * 100)}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-4">Registration Growth</h3>
                    <div className="h-64">
                        <Bar data={registrationData} options={chartOptions} />
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm text-blue-800">
                            <strong>Weekly Growth:</strong> +{registrationTrend[registrationTrend.length - 1] - registrationTrend[registrationTrend.length - 2]} new registrations
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-4">Expected Participant Distribution</h3>
                    <div className="h-64">
                        <Pie data={participantData} options={chartOptions} />
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                        <div className="p-2 bg-red-50 rounded">
                            <div className="font-semibold text-red-800">{participantTypes.students}</div>
                            <div className="text-red-600">Students</div>
                        </div>
                        <div className="p-2 bg-blue-50 rounded">
                            <div className="font-semibold text-blue-800">{participantTypes.professionals}</div>
                            <div className="text-blue-600">Professionals</div>
                        </div>
                        <div className="p-2 bg-yellow-50 rounded">
                            <div className="font-semibold text-yellow-800">{participantTypes.others}</div>
                            <div className="text-yellow-600">Others</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Registration Summary */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Registration Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{currentEvent.participants}</div>
                        <div className="text-sm text-gray-600">Total Registered</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{currentEvent.maxParticipants - currentEvent.participants}</div>
                        <div className="text-sm text-gray-600">Spots Available</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{Math.round((registrationTrend[registrationTrend.length - 1] - registrationTrend[0]) / registrationTrend.length * 7)}</div>
                        <div className="text-sm text-gray-600">Avg. Weekly Growth</div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
                    Manage Event
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium">
                    View Registrations
                </button>
                <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium">
                    Export Data
                </button>
            </div>
        </div>
    )
}

export default UpcomingEvents