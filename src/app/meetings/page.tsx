'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, Users, Trash2 } from 'lucide-react'

interface Meeting {
  id: string
  title: string
  description?: string
  startTime: string
  endTime: string
  location?: string
  meetingType: string
  status: string
  participants: {
    contact: {
      name: string
      company?: {
        name: string
      }
    }
  }[]
}

const meetingTypeLabels = {
  BREAKFAST: 'Breakfast',
  LUNCH: 'Lunch', 
  DINNER: 'Dinner',
  BOOTH_MEETING: 'Booth Meeting',
  INTERNAL_MEETING: 'Internal Meeting',
  PRESENTATION: 'Presentation',
  NETWORKING: 'Networking'
}

const statusColors = {
  SCHEDULED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
  RESCHEDULED: 'bg-yellow-100 text-yellow-800'
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    fetchMeetings()
  }, [selectedDate, selectedStatus])

  const fetchMeetings = async () => {
    try {
      let url = '/api/meetings?'
      if (selectedDate) url += `date=${selectedDate}&`
      if (selectedStatus) url += `status=${selectedStatus}&`
      
      const response = await fetch(url)
      const data = await response.json()
      setMeetings(data)
    } catch (error) {
      console.error('Error fetching meetings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this meeting?')) {
      try {
        const response = await fetch(`/api/meetings/${id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          fetchMeetings()
        }
      } catch (error) {
        console.error('Error deleting meeting:', error)
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
        <p className="text-gray-600">Schedule new meetings from the dashboard</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="RESCHEDULED">Rescheduled</option>
          </select>
        </div>
        {(selectedDate || selectedStatus) && (
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedDate('')
                setSelectedStatus('')
              }}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {meetings.map(meeting => (
          <div key={meeting.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{meeting.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[meeting.status as keyof typeof statusColors]}`}>
                    {meeting.status.replace('_', ' ')}
                  </span>
                </div>
                
                {meeting.description && (
                  <p className="text-gray-600 mb-3">{meeting.description}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(meeting.startTime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</span>
                  </div>
                  {meeting.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{meeting.location}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-4 text-sm">
                  <span className="text-gray-600">
                    Type: <span className="font-medium">{meetingTypeLabels[meeting.meetingType as keyof typeof meetingTypeLabels]}</span>
                  </span>
                  
                  {meeting.participants.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        {meeting.participants.length} participant{meeting.participants.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>

                {meeting.participants.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Participants:</h4>
                    <div className="flex flex-wrap gap-2">
                      {meeting.participants.map((participant, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-sm text-gray-700">
                          {participant.contact.name}
                          {participant.contact.company && (
                            <span className="ml-1 text-gray-500">({participant.contact.company.name})</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => handleDelete(meeting.id)}
                className="text-red-600 hover:text-red-800 p-1 ml-4"
                title="Delete meeting"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {meetings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No meetings found</p>
          <p className="text-gray-400 text-sm mt-2">
            {selectedDate || selectedStatus ? 'Try adjusting your filters' : 'Schedule your first meeting from the dashboard'}
          </p>
        </div>
      )}
    </div>
  )
}