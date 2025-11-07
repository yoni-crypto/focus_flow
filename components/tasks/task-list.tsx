'use client'

import { useState } from 'react'
import { TaskItem } from './task-item'
import { Card } from '@/components/ui/card'
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
      <Card className="p-6">
        <p className="text-sm text-muted-foreground">Loading tasks...</p>
      </Card>
    )
  }

  if (tasks.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-sm text-muted-foreground">No tasks found</p>
      </Card>
    )
  }

  const pendingTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  return (
    <div className="space-y-4">
      {pendingTasks.length > 0 && (
        <div className="space-y-2">
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
        <div className="space-y-2 pt-4 border-t border-border">
          <p className="text-sm font-medium text-muted-foreground mb-2">
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

