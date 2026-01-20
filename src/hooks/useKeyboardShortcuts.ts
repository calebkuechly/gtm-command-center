import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDashboardStore } from '@/store'

interface ShortcutConfig {
  key: string
  ctrl?: boolean
  cmd?: boolean
  shift?: boolean
  alt?: boolean
  action: () => void
  description: string
}

const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0

export function useKeyboardShortcuts() {
  const router = useRouter()
  const { setCommandPaletteOpen, toggleSidebar } = useDashboardStore()

  const shortcuts: ShortcutConfig[] = [
    // Global navigation
    {
      key: 'k',
      cmd: true,
      action: () => setCommandPaletteOpen(true),
      description: 'Open command palette',
    },
    {
      key: '/',
      action: () => {
        // Show shortcuts help - could open a modal
        console.log('Show shortcuts')
      },
      description: 'Show keyboard shortcuts',
    },
    {
      key: 'd',
      cmd: true,
      action: () => router.push('/'),
      description: 'Go to dashboard',
    },
    {
      key: 'p',
      cmd: true,
      action: () => router.push('/pipeline'),
      description: 'Go to pipeline',
    },
    {
      key: 'b',
      cmd: true,
      action: () => router.push('/brands'),
      description: 'Go to brands',
    },
    {
      key: 'w',
      cmd: true,
      action: () => router.push('/weekly'),
      description: 'Go to weekly planning',
    },
    // UI controls
    {
      key: '\\',
      cmd: true,
      action: toggleSidebar,
      description: 'Toggle sidebar',
    },
    // Quick actions
    {
      key: 'n',
      action: () => {
        // Context-aware new action
        setCommandPaletteOpen(true)
      },
      description: 'New item',
    },
    {
      key: 'Escape',
      action: () => setCommandPaletteOpen(false),
      description: 'Close modal/dialog',
    },
  ]

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Only handle Escape in inputs
        if (event.key === 'Escape') {
          target.blur()
        }
        return
      }

      const matchingShortcut = shortcuts.find((shortcut) => {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatches = shortcut.ctrl ? (isMac ? event.metaKey : event.ctrlKey) : true
        const cmdMatches = shortcut.cmd ? (isMac ? event.metaKey : event.ctrlKey) : true
        const shiftMatches = shortcut.shift ? event.shiftKey : !event.shiftKey
        const altMatches = shortcut.alt ? event.altKey : !event.altKey

        // For shortcuts without modifiers, make sure no modifiers are pressed
        if (!shortcut.ctrl && !shortcut.cmd && !shortcut.shift && !shortcut.alt) {
          return keyMatches && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey
        }

        return keyMatches && ctrlMatches && cmdMatches && shiftMatches && altMatches
      })

      if (matchingShortcut) {
        event.preventDefault()
        matchingShortcut.action()
      }
    },
    [shortcuts]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return shortcuts
}

export function useListKeyboardNavigation(
  items: { id: string }[],
  selectedId: string | null,
  onSelect: (id: string) => void,
  onEnter?: (id: string) => void
) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!items.length) return

      const currentIndex = selectedId
        ? items.findIndex((item) => item.id === selectedId)
        : -1

      switch (event.key) {
        case 'j':
        case 'ArrowDown': {
          event.preventDefault()
          const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
          onSelect(items[nextIndex].id)
          break
        }
        case 'k':
        case 'ArrowUp': {
          event.preventDefault()
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
          onSelect(items[prevIndex].id)
          break
        }
        case 'Enter': {
          if (selectedId && onEnter) {
            event.preventDefault()
            onEnter(selectedId)
          }
          break
        }
      }
    },
    [items, selectedId, onSelect, onEnter]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
