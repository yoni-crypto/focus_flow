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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-white text-sm font-medium">
          Task Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
          disabled={loading}
          autoFocus
          className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-gray-700 focus:ring-gray-700 h-10 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority" className="text-white text-sm font-medium">
            Priority
          </Label>
          <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
            <SelectTrigger 
              id="priority" 
              disabled={loading}
              className="bg-gray-900/50 border-gray-800 text-white focus:border-gray-700 focus:ring-gray-700 h-10 rounded-lg"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-800">
              <SelectItem value="low" className="text-white">Low</SelectItem>
              <SelectItem value="medium" className="text-white">Medium</SelectItem>
              <SelectItem value="high" className="text-white">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueTime" className="text-white text-sm font-medium">
            Due Time (optional)
          </Label>
          <Input
            id="dueTime"
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            disabled={loading}
            className="bg-gray-900/50 border-gray-800 text-white focus:border-gray-700 focus:ring-gray-700 h-10 rounded-lg"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button 
          type="submit" 
          disabled={loading} 
          className="flex-1 bg-gray-200 text-black hover:bg-gray-300 h-10 rounded-lg"
        >
          {loading ? 'Saving...' : initialTask ? 'Update Task' : 'Create Task'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={loading}
          className="bg-gray-900/50 border-gray-800 text-white hover:bg-gray-900 hover:border-gray-700 h-10 rounded-lg"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
