'use client'

import { useState, useEffect } from 'react'
import {
  FolderOpen, FileText, Link as LinkIcon, Video, Plus, X, Edit2,
  Trash2, Save, ExternalLink, Search, ArrowLeft,
  Megaphone, Code, Users, DollarSign, Briefcase, Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Resource {
  id: string
  title: string
  description: string
  url: string
  type: 'document' | 'spreadsheet' | 'video' | 'link' | 'folder'
  department: string
  createdAt: string
}

interface Department {
  id: string
  name: string
  icon: string
  color: string
  bgColor: string
  description: string
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Megaphone,
  Code,
  Users,
  DollarSign,
  Briefcase,
  Settings,
  FolderOpen,
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  document: FileText,
  spreadsheet: FileText,
  video: Video,
  link: LinkIcon,
  folder: FolderOpen,
}

const typeLabels: Record<string, string> = {
  document: 'Document',
  spreadsheet: 'Spreadsheet',
  video: 'Video',
  link: 'Link',
  folder: 'Folder',
}

const defaultDepartments: Department[] = [
  { id: 'marketing', name: 'Marketing', icon: 'Megaphone', color: 'text-pink-600', bgColor: 'bg-pink-100 dark:bg-pink-900/30', description: 'Ad platforms, creatives, and brand assets' },
  { id: 'sales', name: 'Sales', icon: 'DollarSign', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30', description: 'CRM, pitch decks, and sales tools' },
  { id: 'operations', name: 'Operations', icon: 'Settings', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30', description: 'E-commerce, fulfillment, and SOPs' },
  { id: 'product', name: 'Product', icon: 'Code', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30', description: 'Roadmaps, specs, and development' },
  { id: 'finance', name: 'Finance', icon: 'Briefcase', color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', description: 'Accounting, models, and reports' },
  { id: 'hr', name: 'HR & Team', icon: 'Users', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30', description: 'Team directory, policies, and comms' },
  { id: 'general', name: 'General', icon: 'FolderOpen', color: 'text-gray-600', bgColor: 'bg-gray-100 dark:bg-gray-800', description: 'Miscellaneous resources' },
]

const defaultResources: Resource[] = [
  // Marketing
  { id: '1', title: 'Ad Creative Library', description: 'Collection of high-performing ad creatives across all brands', url: 'https://drive.google.com/drive/folders/example', type: 'folder', department: 'marketing', createdAt: new Date().toISOString() },
  { id: '2', title: 'Facebook Ads Manager', description: 'Meta Business Suite for managing Facebook & Instagram ads', url: 'https://business.facebook.com/adsmanager', type: 'link', department: 'marketing', createdAt: new Date().toISOString() },
  { id: '3', title: 'Brand Guidelines Template', description: 'Template for creating brand style guides', url: 'https://docs.google.com/document/d/example', type: 'document', department: 'marketing', createdAt: new Date().toISOString() },
  { id: '14', title: 'TikTok Ads Manager', description: 'TikTok advertising platform', url: 'https://ads.tiktok.com', type: 'link', department: 'marketing', createdAt: new Date().toISOString() },
  { id: '15', title: 'Google Ads', description: 'Google advertising platform', url: 'https://ads.google.com', type: 'link', department: 'marketing', createdAt: new Date().toISOString() },
  // Sales
  { id: '4', title: 'Visionary Interview Guide', description: 'Questions and evaluation criteria for discovery calls', url: 'https://docs.google.com/document/d/example', type: 'document', department: 'sales', createdAt: new Date().toISOString() },
  { id: '5', title: 'CRM Dashboard', description: 'HubSpot CRM for managing visionary pipeline', url: 'https://app.hubspot.com', type: 'link', department: 'sales', createdAt: new Date().toISOString() },
  { id: '16', title: 'Partnership Deck', description: 'Slide deck for visionary partnerships', url: 'https://docs.google.com/presentation/d/example', type: 'document', department: 'sales', createdAt: new Date().toISOString() },
  // Operations
  { id: '6', title: 'Shopify Admin', description: 'Main Shopify dashboard for store management', url: 'https://admin.shopify.com', type: 'link', department: 'operations', createdAt: new Date().toISOString() },
  { id: '7', title: 'Klaviyo', description: 'Email marketing and automation platform', url: 'https://www.klaviyo.com/dashboard', type: 'link', department: 'operations', createdAt: new Date().toISOString() },
  { id: '8', title: 'Fulfillment SOP', description: 'Standard operating procedures for order fulfillment', url: 'https://notion.so/example', type: 'document', department: 'operations', createdAt: new Date().toISOString() },
  // Finance
  { id: '9', title: 'Financial Model Template', description: 'P&L and forecasting model for brand performance', url: 'https://docs.google.com/spreadsheets/d/example', type: 'spreadsheet', department: 'finance', createdAt: new Date().toISOString() },
  { id: '10', title: 'QuickBooks', description: 'Accounting and bookkeeping', url: 'https://quickbooks.intuit.com', type: 'link', department: 'finance', createdAt: new Date().toISOString() },
  // Product
  { id: '11', title: 'Product Roadmap', description: 'Current product development roadmap', url: 'https://notion.so/roadmap', type: 'document', department: 'product', createdAt: new Date().toISOString() },
  // HR
  { id: '12', title: 'Team Directory', description: 'Contact info and roles for all team members', url: 'https://notion.so/team', type: 'document', department: 'hr', createdAt: new Date().toISOString() },
  { id: '13', title: 'Slack Workspace', description: 'Team communication', url: 'https://slack.com', type: 'link', department: 'hr', createdAt: new Date().toISOString() },
]

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [departments] = useState<Department[]>(defaultDepartments)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('gtm-resources')
    if (saved) {
      setResources(JSON.parse(saved))
    } else {
      setResources(defaultResources)
      localStorage.setItem('gtm-resources', JSON.stringify(defaultResources))
    }
  }, [])

  const saveResources = (updated: Resource[]) => {
    setResources(updated)
    localStorage.setItem('gtm-resources', JSON.stringify(updated))
  }

  const handleCreateResource = (resource: Omit<Resource, 'id' | 'createdAt'>) => {
    const newResource: Resource = {
      ...resource,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    saveResources([...resources, newResource])
    setIsCreateModalOpen(false)
  }

  const handleUpdateResource = (updated: Resource) => {
    saveResources(resources.map(r => r.id === updated.id ? updated : r))
    setEditingResource(null)
  }

  const handleDeleteResource = (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      saveResources(resources.filter(r => r.id !== id))
    }
  }

  const getResourceCount = (deptId: string) => resources.filter(r => r.department === deptId).length

  const filteredResources = selectedDepartment
    ? resources.filter(r => {
        const matchesDept = r.department === selectedDepartment.id
        const matchesSearch = !searchQuery ||
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesDept && matchesSearch
      })
    : []

  // Department Grid View
  if (!selectedDepartment) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resources</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Quick access to tools, templates, and documents by department
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {departments.map(dept => {
            const IconComponent = iconMap[dept.icon] || FolderOpen
            const count = getResourceCount(dept.id)

            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartment(dept)}
                className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 text-left transition-all hover:border-primary-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary-700"
              >
                <div className={cn('inline-flex rounded-xl p-3', dept.bgColor)}>
                  <IconComponent className={cn('h-7 w-7', dept.color)} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                  {dept.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {dept.description}
                </p>
                <div className="mt-auto pt-4">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {count} resource{count !== 1 ? 's' : ''}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // Department Detail View
  const IconComponent = iconMap[selectedDepartment.icon] || FolderOpen

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => {
            setSelectedDepartment(null)
            setSearchQuery('')
          }}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Departments
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={cn('rounded-xl p-3', selectedDepartment.bgColor)}>
              <IconComponent className={cn('h-8 w-8', selectedDepartment.color)} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedDepartment.name}
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {selectedDepartment.description}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            Add Resource
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${selectedDepartment.name.toLowerCase()} resources...`}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
            {searchQuery ? 'No resources found' : 'No resources yet'}
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {searchQuery
              ? `No resources match "${searchQuery}"`
              : `Add your first ${selectedDepartment.name.toLowerCase()} resource`}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" />
              Add Resource
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map(resource => {
            const TypeIcon = typeIcons[resource.type] || LinkIcon

            return (
              <div
                key={resource.id}
                className="group relative rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-primary-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary-700"
              >
                {/* Edit/Delete buttons */}
                <div className="absolute right-3 top-3 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => setEditingResource(resource)}
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteResource(resource.id)}
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Type badge */}
                <div className="mb-3 flex items-center gap-2">
                  <TypeIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {typeLabels[resource.type]}
                  </span>
                </div>

                {/* Content */}
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <h3 className="font-semibold text-gray-900 hover:text-primary-600 dark:text-white dark:hover:text-primary-400">
                    {resource.title}
                    <ExternalLink className="ml-1.5 inline h-3.5 w-3.5 opacity-50" />
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                    {resource.description}
                  </p>
                </a>

                {/* URL preview */}
                <p className="mt-3 truncate text-xs text-gray-400 dark:text-gray-500">
                  {(() => {
                    try {
                      return new URL(resource.url).hostname.replace('www.', '')
                    } catch {
                      return resource.url
                    }
                  })()}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || editingResource) && (
        <ResourceFormModal
          resource={editingResource}
          departments={departments}
          defaultDepartment={selectedDepartment.id}
          onClose={() => {
            setIsCreateModalOpen(false)
            setEditingResource(null)
          }}
          onSave={(data) => {
            if (editingResource) {
              handleUpdateResource({ ...editingResource, ...data })
            } else {
              handleCreateResource(data)
            }
          }}
        />
      )}
    </div>
  )
}

function ResourceFormModal({
  resource,
  departments,
  defaultDepartment,
  onClose,
  onSave,
}: {
  resource?: Resource | null
  departments: Department[]
  defaultDepartment?: string | null
  onClose: () => void
  onSave: (data: Omit<Resource, 'id' | 'createdAt'>) => void
}) {
  const [title, setTitle] = useState(resource?.title || '')
  const [description, setDescription] = useState(resource?.description || '')
  const [url, setUrl] = useState(resource?.url || '')
  const [type, setType] = useState<Resource['type']>(resource?.type || 'link')
  const [department, setDepartment] = useState(resource?.department || defaultDepartment || 'general')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !url.trim()) return

    onSave({ title, description, url, type, department })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white p-6 dark:bg-gray-900">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {resource ? 'Edit Resource' : 'Add Resource'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Facebook Ads Manager"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this resource"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Resource['type'])}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="link">Link / Tool</option>
                <option value="document">Document</option>
                <option value="spreadsheet">Spreadsheet</option>
                <option value="video">Video</option>
                <option value="folder">Folder</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              <Save className="h-4 w-4" />
              {resource ? 'Save Changes' : 'Add Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
