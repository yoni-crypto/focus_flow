'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'

interface TaskFormProps {
  date: string
  onSubmit: (task: {
    title: string
    priority: 'low' | 'medium' | 'high'
    date: string
    due_time: string | null
    completed: boolean
  }) => Promise<{ error: string | null }>
  onCancel: () => void
  initialTask?: {
    title: string
    priority: 'low' | 'medium' | 'high'
    due_time: string | null
  }
}

export function TaskForm({ date, onSubmit, onCancel, initialTask }: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title || '')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(
    initialTask?.priority || 'medium'
  )
  const [dueTime, setDueTime] = useState(initialTask?.due_time || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setLoading(true)

    const result = await onSubmit({
      title: title.trim(),
      priority,
      date,
      due_time: dueTime || null,
      completed: false,
    })

    if (result.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Task Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
            disabled={loading}
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
              <SelectTrigger id="priority" disabled={loading}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueTime">Due Time (optional)</Label>
            <Input
              id="dueTime"
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Saving...' : initialTask ? 'Update Task' : 'Create Task'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}

