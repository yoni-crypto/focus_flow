'use client'

import { useState } from 'react'
import { TaskItem } from './task-item'
import type { Database } from '@/lib/supabase/types'

type Task = Database['public']['Tables']['tasks']['Row']

interface TaskListProps {
  tasks: Task[]
  loading: boolean
  onUpdate: (id: string, updates: Partial<Task>) => Promise<{ error: string | null }>
  onDelete: (id: string) => Promise<{ error: string | null }>
}

export function TaskList({ tasks, loading, onUpdate, onDelete }: TaskListProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-800/50 bg-gray-900/30 backdrop-blur-sm p-6">
        <p className="text-sm text-gray-400">Loading tasks...</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-gray-800/50 bg-gray-900/30 backdrop-blur-sm p-12 text-center">
        <p className="text-sm text-gray-400">No tasks found</p>
      </div>
    )
  }

  const pendingTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  return (
    <div className="space-y-4">
      {pendingTasks.length > 0 && (
        <div className="space-y-3">
          {pendingTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={onUpdate}
              onDelete={onDelete}
              draggedTask={draggedTask}
              onDragStart={() => setDraggedTask(task.id)}
              onDragEnd={() => setDraggedTask(null)}
            />
          ))}
        </div>
      )}

      {completedTasks.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-gray-800/50">
          <p className="text-sm font-medium text-gray-400 mb-2">
            Completed ({completedTasks.length})
          </p>
          {completedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={onUpdate}
              onDelete={onDelete}
              draggedTask={draggedTask}
              onDragStart={() => setDraggedTask(task.id)}
              onDragEnd={() => setDraggedTask(null)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
