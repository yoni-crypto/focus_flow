'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Database } from '@/lib/supabase/types'

type Task = Database['public']['Tables']['tasks']['Row']

interface TaskItemProps {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => Promise<{ error: string | null }>
  onDelete: (id: string) => Promise<{ error: string | null }>
  draggedTask: string | null
  onDragStart: () => void
  onDragEnd: () => void
}

export function TaskItem({
  task,
  onUpdate,
  onDelete,
  draggedTask,
  onDragStart,
  onDragEnd,
}: TaskItemProps) {
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const [touchStart, setTouchStart] = useState(0)

  const priorityColors = {
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  async function handleToggleComplete() {
    await onUpdate(task.id, { completed: !task.completed })
  }

  async function handleDelete() {
    await onDelete(task.id)
  }

  // Touch swipe handlers for mobile
  function handleTouchStart(e: React.TouchEvent) {
    setTouchStart(e.touches[0].clientX)
    setIsSwiping(true)
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!isSwiping) return

    const currentX = e.touches[0].clientX
    const diff = currentX - touchStart

    // Only allow swiping left (negative)
    if (diff < 0) {
      setSwipeOffset(Math.max(diff, -80))
    }
  }

  function handleTouchEnd() {
    setIsSwiping(false)

    // If swiped more than 50px, show delete action
    if (swipeOffset < -50) {
      handleDelete()
    }

    // Reset swipe position
    setSwipeOffset(0)
  }

  // Drag handlers for desktop
  function handleDragStart(e: React.DragEvent) {
    onDragStart()
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', task.id)
  }

  function handleDragEnd() {
    onDragEnd()
  }

  return (
    <div
      className={cn(
        'relative rounded-lg border border-gray-800/50 bg-gray-900/30 backdrop-blur-sm transition-all duration-200 hover:bg-gray-900/40 hover:border-gray-700/50',
        draggedTask === task.id && 'opacity-50',
        task.completed && 'opacity-60'
      )}
      style={{
        transform: `translateX(${swipeOffset}px)`,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-center gap-3 p-4">
        {/* Drag handle (desktop) */}
        <div className="hidden md:block cursor-move text-gray-500 hover:text-gray-300 transition-colors">
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Checkbox */}
        <button
          onClick={handleToggleComplete}
          className="shrink-0 focus:outline-none focus:ring-2 focus:ring-gray-700 rounded transition-colors"
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.completed ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-gray-500 hover:text-white transition-colors" />
          )}
        </button>

        {/* Task content */}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              'text-sm font-medium text-white',
              task.completed && 'line-through text-gray-500'
            )}
          >
            {task.title}
          </p>
          {task.due_time && (
            <p className="text-xs text-gray-400 mt-1">{task.due_time}</p>
          )}
        </div>

        {/* Priority badge */}
        {task.priority !== 'medium' && (
          <span
            className={cn(
              'shrink-0 rounded-full px-2.5 py-1 text-xs font-medium border',
              priorityColors[task.priority]
            )}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        )}

        {/* Delete button (desktop) */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex h-8 w-8 shrink-0 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Swipe delete indicator (mobile) */}
      {swipeOffset < -30 && (
        <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end pr-4 bg-red-500/10">
          <Trash2 className="h-5 w-5 text-red-400" />
        </div>
      )}
    </div>
  )
}
