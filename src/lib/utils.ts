import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, startOfWeek, endOfWeek, addDays, isToday, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Number formatting
export function formatCurrency(value: number, compact = false): string {
  if (compact && Math.abs(value) >= 1000000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)
  }

  if (compact && Math.abs(value) >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`
}

export function formatPercentage(value: number, showSign = false): string {
  const formatted = `${value.toFixed(1)}%`
  if (showSign && value > 0) return `+${formatted}`
  return formatted
}

// Date utilities
export function getWeekDates(date: Date = new Date()): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 }) // Monday
  return Array.from({ length: 5 }, (_, i) => addDays(start, i))
}

export function getWeekStartDate(date: Date = new Date()): Date {
  return startOfWeek(date, { weekStartsOn: 1 })
}

export function formatDate(date: Date | string, formatStr = 'MMM d, yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, formatStr)
}

export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(d, 'MMM d')
}

export function getDayName(date: Date): string {
  return format(date, 'EEEE')
}

export function isTodayDate(date: Date): boolean {
  return isToday(date)
}

// Status utilities
export function getStatusColor(status: 'ON_TRACK' | 'NEEDS_ATTENTION' | 'CRITICAL'): string {
  switch (status) {
    case 'ON_TRACK':
      return 'text-success-500'
    case 'NEEDS_ATTENTION':
      return 'text-warning-500'
    case 'CRITICAL':
      return 'text-danger-500'
    default:
      return 'text-gray-500'
  }
}

export function getStatusBgColor(status: 'ON_TRACK' | 'NEEDS_ATTENTION' | 'CRITICAL'): string {
  switch (status) {
    case 'ON_TRACK':
      return 'bg-success-100 dark:bg-success-900/30'
    case 'NEEDS_ATTENTION':
      return 'bg-warning-100 dark:bg-warning-900/30'
    case 'CRITICAL':
      return 'bg-danger-100 dark:bg-danger-900/30'
    default:
      return 'bg-gray-100 dark:bg-gray-800'
  }
}

export function getStatusEmoji(status: 'ON_TRACK' | 'NEEDS_ATTENTION' | 'CRITICAL'): string {
  switch (status) {
    case 'ON_TRACK':
      return '🟢'
    case 'NEEDS_ATTENTION':
      return '🟡'
    case 'CRITICAL':
      return '🔴'
    default:
      return '⚪'
  }
}

export function getStageColor(stage: string): string {
  const colors: Record<string, string> = {
    IDEATION: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    TESTING: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    LAUNCH: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    SCALE: 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300',
    PORTFOLIO: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
    HOUSE: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  }
  return colors[stage] || colors.IDEATION
}

// Trend calculation
export function calculateTrendChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

export function getTrendDirection(change: number): 'up' | 'down' | 'flat' {
  if (change > 1) return 'up'
  if (change < -1) return 'down'
  return 'flat'
}

// Debounce utility
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle utility
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

// Keyboard shortcut display
export function formatShortcut(key: string, modifiers?: string[]): string {
  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0

  const modMap: Record<string, string> = {
    ctrl: isMac ? '⌃' : 'Ctrl',
    cmd: isMac ? '⌘' : 'Ctrl',
    shift: isMac ? '⇧' : 'Shift',
    alt: isMac ? '⌥' : 'Alt',
  }

  const parts = modifiers?.map(m => modMap[m] || m) || []
  parts.push(key.toUpperCase())

  return isMac ? parts.join('') : parts.join('+')
}

// Local storage helpers
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.error('Failed to save to localStorage')
  }
}

// Calculate health score (0-100)
export function calculateHealthScore(
  current: number,
  target: number,
  isHigherBetter = true
): number {
  if (target === 0) return 50
  const ratio = current / target
  if (isHigherBetter) {
    return Math.min(100, Math.max(0, ratio * 100))
  }
  return Math.min(100, Math.max(0, (2 - ratio) * 50))
}
