'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Users, Calendar, Clock, Building2, Plus, CalendarPlus, X } from 'lucide-react'

interface Meeting {
  id: string
  title: string
  startTime: string
  endTime: string
  location: string
  participants: {
    contact: {
      name: string
      company?: {
        name: string
      }
    }
  }[]
}

interface Contact {
  id: string
  name: string
  company?: {
    name: string
  }
}

interface DashboardStats {
  totalContacts: number
  totalMeetings: number
  todaysMeetings: number
  totalCompanies: number
  upcomingMeetings: Meeting[]
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalContacts: 0,
    totalMeetings: 0,
    todaysMeetings: 0,
    totalCompanies: 0,
    upcomingMeetings: []
  })
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showMeetingForm, setShowMeetingForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    meetingType: 'BOOTH_MEETING',
    startTime: '',
    endTime: '',
    location: '',
    keyTopics: '',
    actionItems: '',
    participantIds: [] as string[]
  })

  useEffect(() => {
    fetchDashboardStats()
    fetchContacts()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard')
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats')
      }
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts')
      const data = await response.json()
      setContacts(data)
    } catch (error) {
      console.error('Error fetching contacts:', error)
    }
  }

  const handleMeetingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const keyTopics = formData.keyTopics.split('\n').filter((topic: string) => topic.trim())
      const actionItems = formData.actionItems.split('\n').filter((item: string) => item.trim())

      const meetingData = {
        title: formData.title,
        description: formData.description,
        meetingType: formData.meetingType,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        keyTopics,
        actionItems,
        participants: formData.participantIds.map((id: string) => ({ contactId: id }))
      }

      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meetingData)
      })

      if (response.ok) {
        setFormData({
          title: '',
          description: '',
          meetingType: 'BOOTH_MEETING',
          startTime: '',
          endTime: '',
          location: '',
          keyTopics: '',
          actionItems: '',
          participantIds: []
        })
        setShowMeetingForm(false)
        fetchDashboardStats()
        alert('Meeting scheduled successfully!')
      } else {
        throw new Error('Failed to create meeting')
      }
    } catch (error) {
      console.error('Error creating meeting:', error)
      alert('Error creating meeting. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-700">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Perumin Congress Dashboard</h1>
          <p className="text-gray-600">Welcome to your mining industry contact management system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalContacts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Meetings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMeetings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Meetings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todaysMeetings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Companies</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCompanies}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Today's Meetings</h2>
            </div>
            {stats.upcomingMeetings.length === 0 ? (
              <div className="p-6 text-center">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No meetings scheduled for today</p>
                <button
                  onClick={() => setShowMeetingForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule a Meeting
                </button>
              </div>
            ) : (
              <div className="p-6">
                {stats.upcomingMeetings.map((meeting) => (
                  <div key={meeting.id} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{meeting.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(meeting.startTime).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })} - {new Date(meeting.endTime).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                      {meeting.location && (
                        <p className="text-xs text-gray-500 mt-1">{meeting.location}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                <Link 
                  href="/contacts" 
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Users className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Manage Contacts</h3>
                    <p className="text-sm text-gray-600">View and edit your contacts</p>
                  </div>
                </Link>
                
                <button
                  onClick={() => setShowMeetingForm(true)}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <CalendarPlus className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Schedule Meeting</h3>
                    <p className="text-sm text-gray-600">Create a new meeting</p>
                  </div>
                </button>
                
                <Link 
                  href="/meetings" 
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Calendar className="h-6 w-6 text-orange-600 mr-3" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">View All Meetings</h3>
                    <p className="text-sm text-gray-600">See all scheduled meetings</p>
                  </div>
                </Link>
                
                <Link 
                  href="/companies" 
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Building2 className="h-6 w-6 text-purple-600 mr-3" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Company Profiles</h3>
                    <p className="text-sm text-gray-600">Manage company information</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meeting Form Modal */}
      {showMeetingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Schedule New Meeting</h2>
              <button
                onClick={() => setShowMeetingForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleMeetingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter meeting title"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter meeting description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Type</label>
                  <select
                    value={formData.meetingType}
                    onChange={(e) => setFormData({ ...formData, meetingType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="BREAKFAST">Breakfast</option>
                    <option value="LUNCH">Lunch</option>
                    <option value="DINNER">Dinner</option>
                    <option value="BOOTH_MEETING">Booth Meeting</option>
                    <option value="INTERNAL_MEETING">Internal Meeting</option>
                    <option value="PRESENTATION">Presentation</option>
                    <option value="NETWORKING">Networking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <select
                    value={formData.location.includes("-") ? formData.location : ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Location or Enter Custom</option>
                    <optgroup label="Perumin Congress Venues">
                      <option value="Perumin Congress - Main Exhibition Hall">Perumin Congress - Main Exhibition Hall</option>
                      <option value="Perumin Congress - Conference Room A">Perumin Congress - Conference Room A</option>
                      <option value="Perumin Congress - Conference Room B">Perumin Congress - Conference Room B</option>
                      <option value="Perumin Congress - VIP Meeting Room">Perumin Congress - VIP Meeting Room</option>
                      <option value="Perumin Congress - Exhibition Booth Area">Perumin Congress - Exhibition Booth Area</option>
                      <option value="Perumin Congress - Networking Lounge">Perumin Congress - Networking Lounge</option>
                    </optgroup>
                    <optgroup label="Top Restaurants in Arequipa">
                      <option value="CIRQA Restaurant - CIRQA Relais & Châteaux Hotel">CIRQA Restaurant - CIRQA Relais & Châteaux Hotel</option>
                      <option value="Chicha por Gastón Acurio - Santa Catalina 210">Chicha por Gastón Acurio - Santa Catalina 210</option>
                      <option value="Zig Zag Restaurant - San Francisco 309">Zig Zag Restaurant - San Francisco 309</option>
                      <option value="Sol de Mayo - Jerusalén 207">Sol de Mayo - Jerusalén 207</option>
                    </optgroup>
                    <optgroup label="Top Hotels in Arequipa">
                      <option value="CIRQA Relais & Châteaux - Melgar 108">CIRQA Relais & Châteaux - Melgar 108 (Luxury Boutique)</option>
                      <option value="Casa Andina Premium Arequipa - Ugarte 403">Casa Andina Premium Arequipa - Ugarte 403</option>
                      <option value="Wyndham Costa del Sol Arequipa - Bolognesi 121">Wyndham Costa del Sol Arequipa - Bolognesi 121</option>
                      <option value="Sonesta Hotel Arequipa - Av. Bolognesi 130">Sonesta Hotel Arequipa - Av. Bolognesi 130</option>
                    </optgroup>
                  </select>
                  <input
                    type="text"
                    placeholder="Or enter custom location"
                    value={formData.location.includes("-") ? "" : formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Key Topics (one per line)</label>
                  <textarea
                    value={formData.keyTopics}
                    onChange={(e) => setFormData({ ...formData, keyTopics: e.target.value })}
                    rows={3}
                    placeholder="Enter key topics to discuss..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Action Items (one per line)</label>
                  <textarea
                    value={formData.actionItems}
                    onChange={(e) => setFormData({ ...formData, actionItems: e.target.value })}
                    rows={3}
                    placeholder="Enter action items..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Participants</label>
                  <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
                    {contacts.map(contact => (
                      <label key={contact.id} className="flex items-center space-x-2 mb-2">
                        <input
                          type="checkbox"
                          checked={formData.participantIds.includes(contact.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                participantIds: [...formData.participantIds, contact.id]
                              })
                            } else {
                              setFormData({
                                ...formData,
                                participantIds: formData.participantIds.filter(id => id !== contact.id)
                              })
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">
                          {contact.name}
                          {contact.company && (
                            <span className="text-gray-500 ml-1">({contact.company.name})</span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowMeetingForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Schedule Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}