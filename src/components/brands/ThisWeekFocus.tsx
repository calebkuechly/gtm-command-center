'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, Check, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface ThisWeekFocusProps {
  brandId: string
  initialFocus: string | null
}

export function ThisWeekFocus({ brandId, initialFocus }: ThisWeekFocusProps) {
  const [focus, setFocus] = useState(initialFocus || '')
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(focus)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/brands/${brandId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thisWeekFocus: editValue }),
      })

      if (!response.ok) throw new Error('Failed to save')

      setFocus(editValue)
      setEditing(false)
      toast.success('Focus updated')
    } catch (error) {
      console.error('Failed to save focus:', error)
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditValue(focus)
    setEditing(false)
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">This Week's Focus</CardTitle>
          {!editing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditing(true)}
              className="h-8 px-2"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {editing ? (
          <div className="space-y-3">
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full h-24 px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              placeholder="What's the #1 priority for this brand this week?"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={saving}
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 mr-1" />
                )}
                Save
              </Button>
            </div>
          </div>
        ) : (
          <p className={`text-sm ${focus ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-400 italic'}`}>
            {focus || 'Click edit to set this week\'s focus...'}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
