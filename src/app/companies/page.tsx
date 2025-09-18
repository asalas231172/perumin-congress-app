'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Users, Building, ExternalLink } from 'lucide-react'

interface Company {
  id: string
  name: string
  industry?: string
  description?: string
  website?: string
  headquarters?: string
  projects?: string
  keyPersonnel?: string
  contacts: any[]
  _count: {
    contacts: number
  }
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    description: '',
    website: '',
    headquarters: '',
    projects: '',
    keyPersonnel: ''
  })

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies')
      const data = await response.json()
      setCompanies(data)
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingCompany ? `/api/companies/${editingCompany.id}` : '/api/companies'
      const method = editingCompany ? 'PUT' : 'POST'

      const projects = formData.projects.split('\n').filter(p => p.trim())
      const keyPersonnel = formData.keyPersonnel.split('\n').filter(p => p.trim())

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          projects: projects.length > 0 ? projects : null,
          keyPersonnel: keyPersonnel.length > 0 ? keyPersonnel : null
        })
      })

      if (response.ok) {
        fetchCompanies()
        setShowForm(false)
        setEditingCompany(null)
        setFormData({
          name: '',
          industry: '',
          description: '',
          website: '',
          headquarters: '',
          projects: '',
          keyPersonnel: ''
        })
      }
    } catch (error) {
      console.error('Error saving company:', error)
    }
  }

  const handleEdit = (company: Company) => {
    setEditingCompany(company)
    const projects = company.projects ? JSON.parse(company.projects).join('\n') : ''
    const keyPersonnel = company.keyPersonnel ? JSON.parse(company.keyPersonnel).join('\n') : ''
    
    setFormData({
      name: company.name,
      industry: company.industry || '',
      description: company.description || '',
      website: company.website || '',
      headquarters: company.headquarters || '',
      projects,
      keyPersonnel
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this company?')) {
      try {
        const response = await fetch(`/api/companies/${id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          fetchCompanies()
        }
      } catch (error) {
        console.error('Error deleting company:', error)
      }
    }
  }

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Company
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Company Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingCompany ? 'Edit Company' : 'Add New Company'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Mining, Technology, Construction"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="https://company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Headquarters</label>
                  <input
                    type="text"
                    value={formData.headquarters}
                    onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="City, Country"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the company..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Projects (one per line)</label>
                <textarea
                  value={formData.projects}
                  onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Project 1\nProject 2\nProject 3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Personnel (one per line)</label>
                <textarea
                  value={formData.keyPersonnel}
                  onChange={(e) => setFormData({ ...formData, keyPersonnel: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="CEO Name\nCTO Name\nProject Manager Name"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  {editingCompany ? 'Update' : 'Create'} Company
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingCompany(null)
                    setFormData({
                      name: '',
                      industry: '',
                      description: '',
                      website: '',
                      headquarters: '',
                      projects: '',
                      keyPersonnel: ''
                    })
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCompanies.map(company => (
          <div key={company.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                {company.industry && (
                  <p className="text-sm text-blue-600 font-medium mb-2">{company.industry}</p>
                )}
                {company.headquarters && (
                  <p className="text-sm text-gray-600 mb-2">📍 {company.headquarters}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(company)}
                  className="text-blue-600 hover:text-blue-800 p-1"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(company.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {company.description && (
              <p className="text-sm text-gray-700 mb-4">{company.description}</p>
            )}

            {company.projects && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Key Projects:</h4>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  {JSON.parse(company.projects).map((project: string, index: number) => (
                    <li key={index}>{project}</li>
                  ))}
                </ul>
              </div>
            )}

            {company.keyPersonnel && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Key Personnel:</h4>
                <div className="flex flex-wrap gap-1">
                  {JSON.parse(company.keyPersonnel).map((person: string, index: number) => (
                    <span key={index} className="inline-block px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded">
                      {person}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>{company._count.contacts} contact{company._count.contacts !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No companies found</p>
          <p className="text-gray-400 text-sm mt-2">
            {searchTerm ? 'Try adjusting your search terms' : 'Add your first company to get started'}
          </p>
        </div>
      )}
    </div>
  )
}