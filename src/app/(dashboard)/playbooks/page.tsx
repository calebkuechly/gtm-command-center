'use client'

import { useState, useEffect } from 'react'
import {
  BookOpen, Rocket, Users, Target, TrendingUp, FileText,
  Plus, X, Trash2, Check, ChevronDown, ChevronRight,
  Save, Edit2, ExternalLink, Link as LinkIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlaybookStep {
  id: string
  title: string
  description: string
  tutorialLink: string
  completed: boolean
}

interface Playbook {
  id: string
  title: string
  description: string
  category: string
  icon: string
  color: string
  steps: PlaybookStep[]
  createdAt: string
  isCustom: boolean
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  Rocket,
  Target,
  TrendingUp,
  FileText,
  BookOpen,
}

const colorOptions = [
  { value: 'blue', bg: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'green', bg: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'purple', bg: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  { value: 'orange', bg: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
  { value: 'red', bg: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
  { value: 'cyan', bg: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400' },
]

const defaultPlaybooks: Playbook[] = [
  {
    id: '1',
    title: 'Visionary Onboarding',
    description: 'Step-by-step guide for bringing new visionaries into the portfolio',
    icon: 'Users',
    color: 'blue',
    steps: [
      { id: '1-1', title: 'Initial discovery call', description: 'Understand their vision and goals', tutorialLink: '', completed: false },
      { id: '1-2', title: 'Review their existing content/audience', description: 'Analyze current reach and engagement', tutorialLink: '', completed: false },
      { id: '1-3', title: 'Present partnership structure', description: 'Explain terms and expectations', tutorialLink: '', completed: false },
      { id: '1-4', title: 'Due diligence check', description: 'Background and reputation verification', tutorialLink: '', completed: false },
      { id: '1-5', title: 'Contract negotiation', description: 'Finalize terms and sign agreement', tutorialLink: '', completed: false },
      { id: '1-6', title: 'Kickoff meeting', description: 'Introduce team and set timeline', tutorialLink: '', completed: false },
      { id: '1-7', title: 'Brand ideation session', description: 'Brainstorm product concepts', tutorialLink: '', completed: false },
      { id: '1-8', title: 'Create 90-day roadmap', description: 'Set milestones and deliverables', tutorialLink: '', completed: false },
    ],
    category: 'Onboarding',
    createdAt: new Date().toISOString(),
    isCustom: false,
  },
  {
    id: '2',
    title: 'Brand Launch Checklist',
    description: 'Complete checklist for launching a new brand from ideation to market',
    icon: 'Rocket',
    color: 'green',
    steps: [
      { id: '2-1', title: 'Finalize product formulation', description: '', tutorialLink: '', completed: false },
      { id: '2-2', title: 'Complete branding assets', description: 'Logo, packaging, style guide', tutorialLink: '', completed: false },
      { id: '2-3', title: 'Build Shopify store', description: '', tutorialLink: 'https://help.shopify.com/en/manual/intro-to-shopify', completed: false },
      { id: '2-4', title: 'Set up payment processing', description: '', tutorialLink: '', completed: false },
      { id: '2-5', title: 'Configure email flows', description: 'Welcome, abandoned cart, post-purchase', tutorialLink: '', completed: false },
      { id: '2-6', title: 'Create ad creatives', description: '', tutorialLink: '', completed: false },
      { id: '2-7', title: 'Set up tracking pixels', description: 'Facebook, Google, TikTok', tutorialLink: '', completed: false },
      { id: '2-8', title: 'Test checkout flow', description: '', tutorialLink: '', completed: false },
      { id: '2-9', title: 'Prepare customer service scripts', description: '', tutorialLink: '', completed: false },
      { id: '2-10', title: 'Launch soft test campaign', description: '', tutorialLink: '', completed: false },
    ],
    category: 'Launch',
    createdAt: new Date().toISOString(),
    isCustom: false,
  },
  {
    id: '3',
    title: 'ROAS Optimization',
    description: 'Strategies for improving front-end ROAS across advertising channels',
    icon: 'Target',
    color: 'purple',
    steps: [
      { id: '3-1', title: 'Audit current ad account structure', description: '', tutorialLink: '', completed: false },
      { id: '3-2', title: 'Analyze top performing creatives', description: '', tutorialLink: '', completed: false },
      { id: '3-3', title: 'Review audience targeting', description: '', tutorialLink: '', completed: false },
      { id: '3-4', title: 'Test new creative angles', description: '', tutorialLink: '', completed: false },
      { id: '3-5', title: 'Optimize landing pages', description: '', tutorialLink: '', completed: false },
      { id: '3-6', title: 'Implement retargeting sequences', description: '', tutorialLink: '', completed: false },
    ],
    category: 'Performance',
    createdAt: new Date().toISOString(),
    isCustom: false,
  },
]

const categories = ['All', 'Onboarding', 'Launch', 'Performance', 'Strategy', 'Operations', 'Custom']

export default function PlaybooksPage() {
  const [playbooks, setPlaybooks] = useState<Playbook[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [editingPlaybook, setEditingPlaybook] = useState<Playbook | null>(null)

  // Load playbooks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('gtm-playbooks')
    if (saved) {
      setPlaybooks(JSON.parse(saved))
    } else {
      setPlaybooks(defaultPlaybooks)
      localStorage.setItem('gtm-playbooks', JSON.stringify(defaultPlaybooks))
    }
  }, [])

  // Save to localStorage whenever playbooks change
  const savePlaybooks = (updated: Playbook[]) => {
    setPlaybooks(updated)
    localStorage.setItem('gtm-playbooks', JSON.stringify(updated))
  }

  const filteredPlaybooks = selectedCategory === 'All'
    ? playbooks
    : selectedCategory === 'Custom'
    ? playbooks.filter(p => p.isCustom)
    : playbooks.filter(p => p.category === selectedCategory)

  const handleCreatePlaybook = (newPlaybook: Omit<Playbook, 'id' | 'createdAt' | 'isCustom'>) => {
    const playbook: Playbook = {
      ...newPlaybook,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isCustom: true,
    }
    savePlaybooks([...playbooks, playbook])
    setIsCreateModalOpen(false)
  }

  const handleUpdatePlaybook = (updatedPlaybook: Playbook) => {
    const updated = playbooks.map(p => p.id === updatedPlaybook.id ? updatedPlaybook : p)
    savePlaybooks(updated)
    setEditingPlaybook(null)
    // Update selected playbook if it's the one being edited
    if (selectedPlaybook?.id === updatedPlaybook.id) {
      setSelectedPlaybook(updatedPlaybook)
    }
  }

  const handleDeletePlaybook = (id: string) => {
    savePlaybooks(playbooks.filter(p => p.id !== id))
    setIsViewModalOpen(false)
    setSelectedPlaybook(null)
  }

  const handleToggleStep = (playbookId: string, stepId: string) => {
    const updated = playbooks.map(p => {
      if (p.id === playbookId) {
        return {
          ...p,
          steps: p.steps.map(s =>
            s.id === stepId ? { ...s, completed: !s.completed } : s
          )
        }
      }
      return p
    })
    savePlaybooks(updated)
    if (selectedPlaybook?.id === playbookId) {
      setSelectedPlaybook(updated.find(p => p.id === playbookId) || null)
    }
  }

  const getColorClass = (color: string) => {
    return colorOptions.find(c => c.value === color)?.bg || colorOptions[0].bg
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Playbooks</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Standard operating procedures and best practices
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Create Playbook
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              selectedCategory === category
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Playbooks Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPlaybooks.map((playbook) => {
          const IconComponent = iconMap[playbook.icon] || BookOpen
          const completedSteps = playbook.steps.filter(s => s.completed).length
          const progress = playbook.steps.length > 0 ? (completedSteps / playbook.steps.length) * 100 : 0

          return (
            <div
              key={playbook.id}
              onClick={() => {
                setSelectedPlaybook(playbook)
                setIsViewModalOpen(true)
              }}
              className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-primary-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary-700"
            >
              <div className="flex items-start justify-between">
                <div className={cn('rounded-lg p-2', getColorClass(playbook.color))}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-2">
                  {playbook.isCustom && (
                    <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                      Custom
                    </span>
                  )}
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    {playbook.category}
                  </span>
                </div>
              </div>
              <h3 className="mt-4 font-semibold text-gray-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                {playbook.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                {playbook.description}
              </p>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{completedSteps} / {playbook.steps.length} steps</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-primary-600 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredPlaybooks.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">No playbooks found</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {selectedCategory === 'Custom'
              ? "You haven't created any custom playbooks yet"
              : "No playbooks in this category"}
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Create Playbook
          </button>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <PlaybookFormModal
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreatePlaybook}
          mode="create"
        />
      )}

      {/* Edit Modal */}
      {editingPlaybook && (
        <PlaybookFormModal
          playbook={editingPlaybook}
          onClose={() => setEditingPlaybook(null)}
          onSave={(data) => handleUpdatePlaybook({ ...editingPlaybook, ...data })}
          mode="edit"
        />
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedPlaybook && (
        <ViewPlaybookModal
          playbook={selectedPlaybook}
          onClose={() => {
            setIsViewModalOpen(false)
            setSelectedPlaybook(null)
          }}
          onToggleStep={handleToggleStep}
          onDelete={handleDeletePlaybook}
          onEdit={() => {
            setEditingPlaybook(selectedPlaybook)
          }}
          getColorClass={getColorClass}
        />
      )}
    </div>
  )
}

function PlaybookFormModal({
  playbook,
  onClose,
  onSave,
  mode
}: {
  playbook?: Playbook
  onClose: () => void
  onSave: (playbook: Omit<Playbook, 'id' | 'createdAt' | 'isCustom'>) => void
  mode: 'create' | 'edit'
}) {
  const [title, setTitle] = useState(playbook?.title || '')
  const [description, setDescription] = useState(playbook?.description || '')
  const [category, setCategory] = useState(playbook?.category || 'Custom')
  const [icon, setIcon] = useState(playbook?.icon || 'BookOpen')
  const [color, setColor] = useState(playbook?.color || 'blue')
  const [steps, setSteps] = useState<PlaybookStep[]>(
    playbook?.steps || [{ id: '1', title: '', description: '', tutorialLink: '', completed: false }]
  )

  const addStep = () => {
    setSteps([...steps, { id: Date.now().toString(), title: '', description: '', tutorialLink: '', completed: false }])
  }

  const removeStep = (id: string) => {
    if (steps.length > 1) {
      setSteps(steps.filter(s => s.id !== id))
    }
  }

  const updateStep = (id: string, field: keyof PlaybookStep, value: string | boolean) => {
    setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onSave({
      title,
      description,
      category,
      icon,
      color,
      steps: steps.filter(s => s.title.trim()),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 dark:bg-gray-900">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {mode === 'create' ? 'Create New Playbook' : 'Edit Playbook'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., New Brand Setup Process"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this playbook for?"
              rows={2}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Category & Icon Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="Onboarding">Onboarding</option>
                <option value="Launch">Launch</option>
                <option value="Performance">Performance</option>
                <option value="Strategy">Strategy</option>
                <option value="Operations">Operations</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Icon</label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="BookOpen">Book</option>
                <option value="Users">Users</option>
                <option value="Rocket">Rocket</option>
                <option value="Target">Target</option>
                <option value="TrendingUp">Trending</option>
                <option value="FileText">Document</option>
              </select>
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
            <div className="mt-2 flex gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={cn(
                    'h-8 w-8 rounded-full transition-all',
                    c.bg.split(' ')[0],
                    color === c.value ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-900' : ''
                  )}
                />
              ))}
            </div>
          </div>

          {/* Steps */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Steps</label>
            <div className="mt-2 space-y-4">
              {steps.map((step, index) => (
                <div key={step.id} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                      {index + 1}
                    </span>
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                        placeholder="Step title"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                      <textarea
                        value={step.description}
                        onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                        placeholder="Step description (optional)"
                        rows={2}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="url"
                          value={step.tutorialLink}
                          onChange={(e) => updateStep(step.id, 'tutorialLink', e.target.value)}
                          placeholder="Tutorial link (optional) - e.g., https://example.com/tutorial"
                          className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeStep(step.id)}
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addStep}
              className="mt-3 flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              <Plus className="h-4 w-4" />
              Add Step
            </button>
          </div>

          {/* Actions */}
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
              {mode === 'create' ? 'Create Playbook' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ViewPlaybookModal({
  playbook,
  onClose,
  onToggleStep,
  onDelete,
  onEdit,
  getColorClass,
}: {
  playbook: Playbook
  onClose: () => void
  onToggleStep: (playbookId: string, stepId: string) => void
  onDelete: (id: string) => void
  onEdit: () => void
  getColorClass: (color: string) => string
}) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set())
  const IconComponent = iconMap[playbook.icon] || BookOpen
  const completedSteps = playbook.steps.filter(s => s.completed).length
  const progress = playbook.steps.length > 0 ? (completedSteps / playbook.steps.length) * 100 : 0

  const toggleExpanded = (stepId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedSteps(prev => {
      const next = new Set(prev)
      if (next.has(stepId)) {
        next.delete(stepId)
      } else {
        next.add(stepId)
      }
      return next
    })
  }

  const handleStepClick = (stepId: string) => {
    onToggleStep(playbook.id, stepId)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 dark:bg-gray-900">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={cn('rounded-lg p-3', getColorClass(playbook.color))}>
              <IconComponent className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{playbook.title}</h2>
                {playbook.isCustom && (
                  <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                    Custom
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{playbook.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Edit Playbook"
            >
              <Edit2 className="h-5 w-5" />
            </button>
            <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Progress</span>
            <span className="text-gray-500 dark:text-gray-400">{completedSteps} / {playbook.steps.length} steps completed</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-primary-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps - Expandable Cards */}
        <div className="space-y-3">
          {playbook.steps.map((step, index) => {
            const isExpanded = expandedSteps.has(step.id)
            const hasContent = step.description || step.tutorialLink

            return (
              <div
                key={step.id}
                className={cn(
                  'rounded-lg border transition-all',
                  step.completed
                    ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20'
                    : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                )}
              >
                {/* Step Header */}
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer"
                  onClick={() => handleStepClick(step.id)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStepClick(step.id)
                    }}
                    className={cn(
                      'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors',
                      step.completed
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                    )}
                  >
                    {step.completed ? <Check className="h-4 w-4" /> : index + 1}
                  </button>
                  <span className={cn(
                    'flex-1 font-medium',
                    step.completed
                      ? 'text-gray-500 line-through dark:text-gray-400'
                      : 'text-gray-900 dark:text-white'
                  )}>
                    {step.title}
                  </span>
                  {hasContent && (
                    <button
                      onClick={(e) => toggleExpanded(step.id, e)}
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </button>
                  )}
                </div>

                {/* Expanded Content */}
                {isExpanded && hasContent && (
                  <div className="border-t border-gray-200 px-4 pb-4 pt-3 dark:border-gray-700">
                    <div className="ml-9 space-y-3">
                      {step.description && (
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            Description
                          </p>
                          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                            {step.description}
                          </p>
                        </div>
                      )}
                      {step.tutorialLink && (
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            Tutorial
                          </p>
                          <a
                            href={step.tutorialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1 inline-flex items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100 dark:border-primary-800 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50"
                          >
                            <ExternalLink className="h-4 w-4" />
                            {(() => {
                              try {
                                const url = new URL(step.tutorialLink)
                                return url.hostname.replace('www.', '')
                              } catch {
                                return 'View Tutorial'
                              }
                            })()}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
          {playbook.isCustom ? (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this playbook?')) {
                  onDelete(playbook.id)
                }
              }}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete Playbook
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>

    </div>
  )
}
