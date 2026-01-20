'use client'

import { useState } from 'react'
import { Card, Badge, Button, Progress } from '@/components/ui'
import { useDashboardStore } from '@/store'
import { useUpdatePriority } from '@/hooks'
import {
  getWeekDates,
  getDayName,
  isTodayDate,
  formatDate,
  cn,
} from '@/lib/utils'
import { DayOfWeek } from '@/types'
import {
  CheckCircle2,
  Circle,
  Plus,
  GripVertical,
  Calendar,
  Trash2,
  PartyPopper,
} from 'lucide-react'

const dayOfWeekMap: Record<number, DayOfWeek> = {
  0: 'MONDAY',
  1: 'TUESDAY',
  2: 'WEDNESDAY',
  3: 'THURSDAY',
  4: 'FRIDAY',
}

export function WeeklyPriorities() {
  const { dashboardData } = useDashboardStore()
  const updatePriority = useUpdatePriority()
  const [activeDay, setActiveDay] = useState(new Date().getDay() - 1) // 0 = Monday
  const [newTaskValue, setNewTaskValue] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)

  const weekDates = getWeekDates()
  const priorities = dashboardData?.weeklyFocus.priorities || []

  const getPrioritiesForDay = (dayIndex: number) => {
    const dayName = dayOfWeekMap[dayIndex]
    return priorities.filter((p) => p.dayOfWeek === dayName)
  }

  const completedCount = dashboardData?.weeklyFocus.completedCount || 0
  const totalCount = dashboardData?.weeklyFocus.totalCount || 0
  const weekProgress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const handleTogglePriority = (id: string, completed: boolean) => {
    updatePriority.mutate({ id, data: { completed: !completed } })

    // Check if all tasks are now complete
    if (!completed && completedCount + 1 === totalCount) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }

  const handleAddTask = async () => {
    if (!newTaskValue.trim()) return

    // Would call API to create priority
    console.log('Creating task:', newTaskValue, 'for day:', dayOfWeekMap[activeDay])
    setNewTaskValue('')
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          This Week's Priorities
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{completedCount}/{totalCount} tasks</span>
            <Progress value={weekProgress} className="w-24" />
          </div>
        </div>
      </div>

      {/* Week Progress Celebration */}
      {showConfetti && (
        <div className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-success-50 p-4 dark:bg-success-900/20">
          <PartyPopper className="h-6 w-6 text-success-600" />
          <span className="font-medium text-success-800 dark:text-success-200">
            Amazing! All tasks completed this week!
          </span>
          <PartyPopper className="h-6 w-6 text-success-600" />
        </div>
      )}

      <Card className="overflow-hidden">
        {/* Day Tabs */}
        <div className="flex border-b border-gray-100 dark:border-gray-800 overflow-x-auto">
          {weekDates.map((date, index) => {
            const isToday = isTodayDate(date)
            const dayPriorities = getPrioritiesForDay(index)
            const dayCompleted = dayPriorities.filter((p) => p.completed).length

            return (
              <button
                key={index}
                onClick={() => setActiveDay(index)}
                className={cn(
                  'flex-1 min-w-[120px] px-4 py-3 text-center transition-colors',
                  activeDay === index
                    ? 'border-b-2 border-primary-600 bg-primary-50/50 dark:bg-primary-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
                  isToday && 'bg-primary-50/30 dark:bg-primary-900/10'
                )}
              >
                <p
                  className={cn(
                    'text-sm font-medium',
                    activeDay === index
                      ? 'text-primary-700 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-400'
                  )}
                >
                  {getDayName(date)}
                  {isToday && (
                    <Badge variant="primary" className="ml-2 text-xs">
                      Today
                    </Badge>
                  )}
                </p>
                <p className="text-xs text-gray-500">{formatDate(date, 'MMM d')}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {dayCompleted}/{dayPriorities.length} done
                </p>
              </button>
            )
          })}
        </div>

        {/* Day Content */}
        <div className="p-4">
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDate(weekDates[activeDay], 'EEEE, MMMM d, yyyy')}
            </span>
          </div>

          {/* Tasks List */}
          <div className="space-y-2">
            {getPrioritiesForDay(activeDay).length > 0 ? (
              getPrioritiesForDay(activeDay).map((priority) => (
                <div
                  key={priority.id}
                  className={cn(
                    'group flex items-center gap-3 rounded-lg border p-3 transition-all',
                    priority.completed
                      ? 'border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/30'
                      : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900'
                  )}
                >
                  <GripVertical className="h-4 w-4 cursor-grab text-gray-300 opacity-0 transition-opacity group-hover:opacity-100" />

                  <button
                    onClick={() =>
                      handleTogglePriority(priority.id, priority.completed)
                    }
                    className="flex-shrink-0"
                  >
                    {priority.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-success-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-300 hover:text-primary-400" />
                    )}
                  </button>

                  <div className="flex-1">
                    <span
                      className={cn(
                        'text-sm',
                        priority.completed
                          ? 'text-gray-400 line-through'
                          : 'text-gray-900 dark:text-white'
                      )}
                    >
                      {priority.title}
                    </span>
                    {priority.description && (
                      <p className="mt-1 text-xs text-gray-500">
                        {priority.description}
                      </p>
                    )}
                  </div>

                  <button className="text-gray-400 opacity-0 transition-opacity hover:text-danger-500 group-hover:opacity-100">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-gray-500">
                No tasks scheduled for this day
              </p>
            )}

            {/* Add New Task */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newTaskValue}
                onChange={(e) => setNewTaskValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                placeholder="Add a new task..."
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:placeholder:text-gray-500"
              />
              <Button
                size="sm"
                onClick={handleAddTask}
                disabled={!newTaskValue.trim()}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add
              </Button>
            </div>
          </div>

          {/* Quick Notes */}
          <div className="mt-6 border-t border-gray-100 pt-4 dark:border-gray-800">
            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
                Quick Notes
              </summary>
              <textarea
                placeholder="Add notes for this day..."
                className="mt-2 w-full rounded-lg border border-gray-200 bg-white p-3 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
                rows={3}
              />
            </details>
          </div>
        </div>
      </Card>
    </section>
  )
}
