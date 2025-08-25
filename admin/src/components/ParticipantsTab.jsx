import { useState, useRef } from 'react'
import { Upload, Users, Download, Search, Filter, Plus, Mail, Phone, GraduationCap } from 'lucide-react'

function ParticipantsTab() {
  const [participants, setParticipants] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@university.edu',
      phone: '555-0101',
      university: 'State University',
      major: 'Computer Science',
      graduationYear: 2024,
      events: ['Tech Career Fair 2024'],
      status: 'active'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@university.edu',
      phone: '555-0102',
      university: 'State University',
      major: 'Software Engineering',
      graduationYear: 2025,
      events: ['Tech Career Fair 2024', 'AI/ML Bootcamp'],
      status: 'active'
    }
  ])
  
  const [searchTerm, setSearchTerm] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const fileInputRef = useRef(null)

  const handleCSVUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'text/csv') {
      // Here you would parse the CSV file
      console.log('CSV file uploaded:', file.name)
      // Mock adding participants from CSV
      setShowUploadModal(false)
    }
  }

  const filteredParticipants = participants.filter(participant =>
    participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.university.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Participants</h1>
          <p className="text-gray-600 mt-1">{participants.length} total participants</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Upload CSV
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
            <Plus className="w-5 h-5" />
            Add Participant
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search participants..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 flex items-center gap-2 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Participants List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">All Participants</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredParticipants.map((participant) => (
            <div key={participant.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{participant.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {participant.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {participant.phone}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                    <GraduationCap className="w-4 h-4" />
                    {participant.major} at {participant.university}
                  </div>
                  <p className="text-sm text-gray-500">Graduating: {participant.graduationYear}</p>
                  <div className="flex gap-1 mt-2">
                    {participant.events.map((event, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {event}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload CSV Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Upload Participants CSV</h2>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Drag and drop your CSV file here, or click to browse</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Choose File
              </button>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p className="font-medium mb-2">CSV Format Requirements:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Name, Email, Phone, University, Major, Graduation Year</li>
                <li>First row should contain headers</li>
                <li>Maximum file size: 5MB</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ParticipantsTab