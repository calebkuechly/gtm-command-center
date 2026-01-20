'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface Note {
  id: string
  content: string
  createdAt: string
  user?: {
    name?: string | null
    email?: string | null
  }
}

interface NotesSectionProps {
  entityType: 'BRAND' | 'VISIONARY' | 'PRIORITY'
  entityId: string
}

export function NotesSection({ entityType, entityId }: NotesSectionProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [newNote, setNewNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchNotes = async () => {
    try {
      const response = await fetch(
        `/api/notes?entityType=${entityType}&entityId=${entityId}`
      )
      const data = await response.json()
      setNotes(data)
    } catch (error) {
      console.error('Failed to fetch notes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [entityType, entityId])

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType,
          entityId,
          content: newNote.trim(),
        }),
      })

      if (!response.ok) throw new Error('Failed to create note')

      const note = await response.json()
      setNotes([note, ...notes])
      setNewNote('')
      toast.success('Note added')
    } catch (error) {
      console.error('Failed to add note:', error)
      toast.error('Failed to add note')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    setDeletingId(noteId)
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete note')

      setNotes(notes.filter(n => n.id !== noteId))
      toast.success('Note deleted')
    } catch (error) {
      console.error('Failed to delete note:', error)
      toast.error('Failed to delete note')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Notes</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add note form */}
        <form onSubmit={handleAddNote} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a quick note..."
              className="flex-1 px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-violet-500"
              disabled={submitting}
            />
            <Button type="submit" size="sm" disabled={submitting || !newNote.trim()}>
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </Button>
          </div>
        </form>

        {/* Notes list */}
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-4">No notes yet</p>
        ) : (
          <AnimatePresence mode="popLayout">
            <ul className="space-y-2 max-h-[300px] overflow-y-auto">
              {notes.map((note) => (
                <motion.li
                  key={note.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group flex items-start gap-2 p-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      {note.content}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">
                      {format(new Date(note.createdAt), 'MMM d, h:mm a')}
                      {note.user?.name && ` · ${note.user.name}`}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    disabled={deletingId === note.id}
                    className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-500 transition-opacity"
                  >
                    {deletingId === note.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </motion.li>
              ))}
            </ul>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  )
}
