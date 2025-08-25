import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, MapPin, Calendar, TrendingUp, Link, QrCode, Mail, Download, Settings, Eye, Copy, Check, X } from 'lucide-react'
import QRCode from 'react-qr-code'
import toast from 'react-hot-toast'
import { eventAPI } from '../services/api'
import emailjs from 'emailjs-com'
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
    
    // State for modals and functionality
    const [showQRModal, setShowQRModal] = useState(false)
    const [showEmailModal, setShowEmailModal] = useState(false)
    const [showRegistrationsModal, setShowRegistrationsModal] = useState(false)
    const [registrationLink, setRegistrationLink] = useState('')
    const [copied, setCopied] = useState(false)
    const [registeredUsers, setRegisteredUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [emailList, setEmailList] = useState([''])
    const [emailSubject, setEmailSubject] = useState('Event Registration - ')
    const [emailMessage, setEmailMessage] = useState('We are excited to invite you to register for our upcoming event!')

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

    // Generate registration link
    useEffect(() => {
        const baseUrl = window.location.origin
        const eventId = currentEvent._id || currentEvent.id
        const link = `${baseUrl}/student/register/${eventId}`
        setRegistrationLink(link)
        setEmailSubject(`Event Registration - ${currentEvent.title}`)
    }, [currentEvent])

    // Fetch registered users
    const fetchRegisteredUsers = async () => {
        setLoading(true)
        try {
            const eventId = currentEvent._id || currentEvent.id
            const response = await eventAPI.getStudentsInEvent(eventId)
            if (response.data.success) {
                setRegisteredUsers(response.data.event.studentsEnrolled || [])
            }
        } catch (error) {
            console.error('Failed to fetch registered users:', error)
            toast.error('Failed to fetch registered users')
            // Mock data for demo
            setRegisteredUsers([
                { _id: '1', name: 'John Doe', email: 'john@example.com', college: 'MIT', year: '3rd Year', fieldOfStudy: 'Computer Science' },
                { _id: '2', name: 'Jane Smith', email: 'jane@example.com', college: 'Stanford', year: '2nd Year', fieldOfStudy: 'Engineering' },
                { _id: '3', name: 'Mike Johnson', email: 'mike@example.com', college: 'Harvard', year: '4th Year', fieldOfStudy: 'Business' }
            ])
        } finally {
            setLoading(false)
        }
    }

    // Copy registration link
    const copyRegistrationLink = () => {
        navigator.clipboard.writeText(registrationLink)
        setCopied(true)
        toast.success('Registration link copied!')
        setTimeout(() => setCopied(false), 2000)
    }

    // Export registered users to CSV
    const exportRegisteredUsers = () => {
        if (registeredUsers.length === 0) {
            toast.error('No registered users to export')
            return
        }

        const csvContent = [
            ['Name', 'Email', 'College', 'Year', 'Field of Study'],
            ...registeredUsers.map(user => [
                user.name || 'N/A',
                user.email || 'N/A',
                user.college || 'N/A',
                user.year || 'N/A',
                user.fieldOfStudy || 'N/A'
            ])
        ].map(row => row.join(',')).join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${currentEvent.title}_registered_users.csv`
        a.click()
        window.URL.revokeObjectURL(url)
        toast.success('Registered users exported successfully!')
    }

    // Send registration emails
    const sendRegistrationEmails = async () => {
        setLoading(true)
        const validEmails = emailList.filter(email => email.trim() !== '')
        
        if (validEmails.length === 0) {
            toast.error('Please add at least one email address')
            setLoading(false)
            return
        }

        const emailPromises = validEmails.map(async (email, index) => {
            const templateParams = {
                to_email: email,
                to_name: `Participant ${index + 1}`,
                from_name: 'Event Team',
                subject: emailSubject,
                message: `${emailMessage}\n\nEvent: ${currentEvent.title}\nDate: ${new Date(currentEvent.date).toLocaleDateString()}\nLocation: ${currentEvent.location}\n\nRegister here: ${registrationLink}`,
            }

            try {
                await emailjs.send(
                    "service_2xa9ne7",
                    "template_p9yg4z8",
                    templateParams,
                    "43kNclRsXhWyuRHvv"
                )
                return { email, status: 'success' }
            } catch (error) {
                console.error(`Failed to send email to ${email}:`, error)
                return { email, status: 'failed' }
            }
        })

        try {
            const results = await Promise.all(emailPromises)
            const successCount = results.filter(r => r.status === 'success').length
            const failedCount = results.filter(r => r.status === 'failed').length
            
            if (successCount > 0) {
                toast.success(`Successfully sent ${successCount} registration emails!`)
            }
            if (failedCount > 0) {
                toast.error(`Failed to send ${failedCount} emails`)
            }
            setShowEmailModal(false)
        } catch (error) {
            toast.error('Error sending emails')
        } finally {
            setLoading(false)
        }
    }

    // Add email to list
    const addEmailToList = () => {
        setEmailList([...emailList, ''])
    }

    // Update email in list
    const updateEmailInList = (index, value) => {
        const newList = [...emailList]
        newList[index] = value
        setEmailList(newList)
    }

    // Remove email from list
    const removeEmailFromList = (index) => {
        const newList = emailList.filter((_, i) => i !== index)
        setEmailList(newList.length === 0 ? [''] : newList)
    }

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

            {/* Registration Management */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Registration Management</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Registration Link */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Registration Link</h4>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={registrationLink}
                                readOnly
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                            />
                            <button
                                onClick={copyRegistrationLink}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowQRModal(true)}
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                            >
                                <QrCode className="w-4 h-4" />
                                Generate QR Code
                            </button>
                            <button
                                onClick={() => setShowEmailModal(true)}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                            >
                                <Mail className="w-4 h-4" />
                                Send Emails
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Quick Actions</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => {
                                    fetchRegisteredUsers()
                                    setShowRegistrationsModal(true)
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                            >
                                <Eye className="w-4 h-4" />
                                View Registrations
                            </button>
                            <button
                                onClick={exportRegisteredUsers}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Export Leads
                            </button>
                            <button
                                onClick={() => navigate(`/events/${currentEvent._id || currentEvent.id}`)}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                            >
                                <Settings className="w-4 h-4" />
                                Manage Event
                            </button>
                            <button
                                onClick={() => window.open(registrationLink, '_blank')}
                                className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                            >
                                <Link className="w-4 h-4" />
                                Preview
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* QR Code Modal */}
            {showQRModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold">Registration QR Code</h3>
                                <button
                                    onClick={() => setShowQRModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 text-center">
                            <div className="bg-white p-4 rounded-lg inline-block">
                                <QRCode value={registrationLink} size={200} />
                            </div>
                            <p className="text-sm text-gray-600 mt-4">
                                Scan this QR code to register for the event
                            </p>
                            <button
                                onClick={() => {
                                    const canvas = document.querySelector('#qr-code canvas')
                                    if (canvas) {
                                        const link = document.createElement('a')
                                        link.download = `${currentEvent.title}_QR_Code.png`
                                        link.href = canvas.toDataURL()
                                        link.click()
                                    }
                                }}
                                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                            >
                                Download QR Code
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Email Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold">Send Registration Emails</h3>
                                <button
                                    onClick={() => setShowEmailModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                <textarea
                                    value={emailMessage}
                                    onChange={(e) => setEmailMessage(e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Event details and registration link will be automatically added.
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Recipients</label>
                                {emailList.map((email, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => updateEmailInList(index, e.target.value)}
                                            placeholder="Enter email address"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={() => removeEmailFromList(index)}
                                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={addEmailToList}
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    + Add another email
                                </button>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={sendRegistrationEmails}
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="w-4 h-4" />
                                            Send Emails
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowEmailModal(false)}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Registrations Modal */}
            {showRegistrationsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold">Registered Participants ({registeredUsers.length})</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={exportRegisteredUsers}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Export CSV
                                    </button>
                                    <button
                                        onClick={() => setShowRegistrationsModal(false)}
                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p>Loading registered users...</p>
                                </div>
                            ) : registeredUsers.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p>No registrations yet</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-900">College</th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-900">Year</th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-900">Field of Study</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {registeredUsers.map((user, index) => (
                                                <tr key={user._id || index} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4">{user.name || 'N/A'}</td>
                                                    <td className="py-3 px-4">{user.email || 'N/A'}</td>
                                                    <td className="py-3 px-4">{user.college || 'N/A'}</td>
                                                    <td className="py-3 px-4">{user.year || 'N/A'}</td>
                                                    <td className="py-3 px-4">{user.fieldOfStudy || 'N/A'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UpcomingEvents