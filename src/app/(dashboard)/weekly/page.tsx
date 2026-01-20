'use client'

import { useState, useEffect } from 'react'
import { CalendarDays, CheckCircle2, Circle, Clock, Plus, Trash2, GripVertical, Edit2, X, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

interface Priority {
  id: string
  title: string
  dayOfWeek: string
  completed: boolean
  createdAt: string
}

const STORAGE_KEY = 'gtm-weekly-priorities'

// Get current week identifier (year-week number)
function getCurrentWeekId(): string {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7)
  return `${now.getFullYear()}-W${weekNumber}`
}

export default function WeeklyPage() {
  const [priorities, setPriorities] = useState<Priority[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isAddingTo, setIsAddingTo] = useState<string | null>(null)
  const [newPriorityTitle, setNewPriorityTitle] = useState('')
  const [editingPriority, setEditingPriority] = useState<Priority | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [draggedPriority, setDraggedPriority] = useState<Priority | null>(null)
  const [dragOverDay, setDragOverDay] = useState<string | null>(null)
  const [currentWeekId] = useState(getCurrentWeekId())

  // Load priorities from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        // Check if it's the current week's data
        if (data.weekId === currentWeekId) {
          setPriorities(data.priorities || [])
        }
      } catch (e) {
        console.error('Failed to parse stored priorities:', e)
      }
    }
    setIsLoaded(true)
  }, [currentWeekId])

  // Save priorities to localStorage - only after initial load
  useEffect(() => {
    if (!isLoaded) return

    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      weekId: currentWeekId,
      priorities
    }))
  }, [priorities, currentWeekId, isLoaded])

  const prioritiesByDay = DAYS.reduce((acc, day) => {
    acc[day.toUpperCase()] = priorities.filter(
      (p) => p.dayOfWeek === day.toUpperCase()
    )
    return acc
  }, {} as Record<string, Priority[]>)

  const completedCount = priorities.filter(p => p.completed).length
  const totalCount = priorities.length
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const addPriority = (day: string) => {
    if (!newPriorityTitle.trim()) return

    const newPriority: Priority = {
      id: crypto.randomUUID(),
      title: newPriorityTitle.trim(),
      dayOfWeek: day.toUpperCase(),
      completed: false,
      createdAt: new Date().toISOString()
    }

    setPriorities([...priorities, newPriority])
    setNewPriorityTitle('')
    setIsAddingTo(null)
  }

  const togglePriority = (id: string) => {
    setPriorities(priorities.map(p =>
      p.id === id ? { ...p, completed: !p.completed } : p
    ))
  }

  const deletePriority = (id: string) => {
    setPriorities(priorities.filter(p => p.id !== id))
  }

  const startEditing = (priority: Priority) => {
    setEditingPriority(priority)
    setEditTitle(priority.title)
  }

  const saveEdit = () => {
    if (!editingPriority || !editTitle.trim()) return

    setPriorities(priorities.map(p =>
      p.id === editingPriority.id ? { ...p, title: editTitle.trim() } : p
    ))
    setEditingPriority(null)
    setEditTitle('')
  }

  const handleDragStart = (priority: Priority) => {
    setDraggedPriority(priority)
  }

  const handleDragOver = (e: React.DragEvent, day: string) => {
    e.preventDefault()
    setDragOverDay(day)
  }

  const handleDragLeave = () => {
    setDragOverDay(null)
  }

  const handleDrop = (e: React.DragEvent, day: string) => {
    e.preventDefault()
    if (draggedPriority) {
      setPriorities(priorities.map(p =>
        p.id === draggedPriority.id ? { ...p, dayOfWeek: day.toUpperCase() } : p
      ))
    }
    setDraggedPriority(null)
    setDragOverDay(null)
  }

  const resetWeek = () => {
    if (confirm('Are you sure you want to clear all priorities for this week?')) {
      setPriorities([])
    }
  }

  const getTodayName = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long' })
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Weekly Plan</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track your priorities for the week • {currentWeekId}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={resetWeek}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Week
          </button>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Progress</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {completedCount} / {totalCount}
            </p>
          </div>
          <div className="h-12 w-12">
            <svg className="h-12 w-12 -rotate-90 transform">
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={`${progressPercent * 1.256} 125.6`}
                className="text-primary-600"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Weekly Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {DAYS.map((day) => {
          const dayPriorities = prioritiesByDay[day.toUpperCase()] || []
          const isToday = getTodayName() === day
          const isDragOver = dragOverDay === day

          return (
            <div
              key={day}
              onDragOver={(e) => handleDragOver(e, day)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, day)}
              className={cn(
                'rounded-xl border bg-white p-4 shadow-sm transition-all dark:bg-gray-900',
                isToday
                  ? 'border-primary-500 ring-2 ring-primary-500/20'
                  : 'border-gray-200 dark:border-gray-800',
                isDragOver && 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
              )}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className={cn(
                    'h-5 w-5',
                    isToday ? 'text-primary-600' : 'text-gray-400'
                  )} />
                  <h3 className={cn(
                    'font-semibold',
                    isToday ? 'text-primary-600' : 'text-gray-900 dark:text-white'
                  )}>
                    {day}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {isToday && (
                    <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                      Today
                    </span>
                  )}
                  <button
                    onClick={() => setIsAddingTo(day)}
                    className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {/* Add Priority Input */}
                {isAddingTo === day && (
                  <div className="rounded-lg border border-primary-200 bg-primary-50 p-2 dark:border-primary-800 dark:bg-primary-900/20">
                    <input
                      type="text"
                      value={newPriorityTitle}
                      onChange={(e) => setNewPriorityTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') addPriority(day)
                        if (e.key === 'Escape') {
                          setIsAddingTo(null)
                          setNewPriorityTitle('')
                        }
                      }}
                      placeholder="Enter priority..."
                      className="w-full rounded border-0 bg-transparent px-2 py-1 text-sm focus:outline-none focus:ring-0 dark:text-white"
                      autoFocus
                    />
                    <div className="mt-2 flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setIsAddingTo(null)
                          setNewPriorityTitle('')
                        }}
                        className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => addPriority(day)}
                        className="rounded bg-primary-600 px-2 py-1 text-xs text-white hover:bg-primary-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}

                {dayPriorities.length === 0 && isAddingTo !== day ? (
                  <button
                    onClick={() => setIsAddingTo(day)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 py-4 text-sm text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-500 dark:border-gray-700 dark:hover:border-gray-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add priority
                  </button>
                ) : (
                  dayPriorities.map((priority) => (
                    <div
                      key={priority.id}
                      draggable
                      onDragStart={() => handleDragStart(priority)}
                      className={cn(
                        'group flex w-full items-start gap-2 rounded-lg border p-3 text-left transition-colors',
                        priority.completed
                          ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600',
                        draggedPriority?.id === priority.id && 'opacity-50'
                      )}
                    >
                      <GripVertical className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-grab text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-gray-600" />

                      <button
                        onClick={() => togglePriority(priority.id)}
                        className="flex-shrink-0"
                      >
                        {priority.completed ? (
                          <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <Circle className="mt-0.5 h-5 w-5 text-gray-400 hover:text-primary-500" />
                        )}
                      </button>

                      {editingPriority?.id === priority.id ? (
                        <div className="flex flex-1 items-center gap-2">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit()
                              if (e.key === 'Escape') setEditingPriority(null)
                            }}
                            className="flex-1 rounded border border-gray-300 px-2 py-0.5 text-sm focus:border-primary-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            autoFocus
                          />
                          <button
                            onClick={saveEdit}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingPriority(null)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className={cn(
                            'flex-1 text-sm',
                            priority.completed
                              ? 'text-gray-500 line-through dark:text-gray-400'
                              : 'text-gray-700 dark:text-gray-200'
                          )}>
                            {priority.title}
                          </span>

                          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              onClick={() => startEditing(priority)}
                              className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => deletePriority(priority.id)}
                              className="rounded p-1 text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Tips */}
      <div className="mt-8 rounded-xl bg-gradient-to-r from-primary-50 to-blue-50 p-6 dark:from-primary-900/20 dark:to-blue-900/20">
        <h3 className="font-semibold text-gray-900 dark:text-white">Weekly Planning Tips</h3>
        <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600" />
            Focus on no more than 3 key priorities per day
          </li>
          <li className="flex items-start gap-2">
            <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600" />
            Drag and drop priorities between days to reschedule
          </li>
          <li className="flex items-start gap-2">
            <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600" />
            Review and adjust priorities during your Friday weekly review
          </li>
        </ul>
      </div>
    </div>
  )
}
