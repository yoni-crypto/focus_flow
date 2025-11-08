'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createTask, updateTask, deleteTask } from '@/app/actions/tasks'
import { TaskList } from './task-list'
import { TaskForm } from './task-form'
import { TaskFilters } from './task-filters'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BackgroundImage } from '@/components/ui/background-image'
import { Plus } from 'lucide-react'
import type { Database } from '@/lib/supabase/types'

type Task = Database['public']['Tables']['tasks']['Row']

interface TasksViewProps {
  initialTasks: Task[]
  initialDate: string
}

export function TasksView({ initialTasks, initialDate }: TasksViewProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [showForm, setShowForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState(initialDate)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all')

  useEffect(() => {
    setTasks(initialTasks)
  }, [initialTasks])

  useEffect(() => {
    setSelectedDate(initialDate)
  }, [initialDate])

  function updateDate(newDate: string) {
    setSelectedDate(newDate)
    router.push(`${pathname}?date=${newDate}`)
  }

  async function handleCreateTask(task: {
    title: string
    priority: 'low' | 'medium' | 'high'
    date: string
    due_time: string | null
    completed: boolean
  }) {
    const { data, error } = await createTask({
      ...task,
      date: selectedDate,
    })

    if (error) {
      console.error('Error creating task:', error)
      return { error }
    }

    if (data) {
      setTasks([data, ...tasks])
      setShowForm(false)
      router.refresh()
    }

    return { error: null }
  }

  async function handleUpdateTask(id: string, updates: Partial<Task>) {
    const { data, error } = await updateTask(id, updates)

    if (error) {
      console.error('Error updating task:', error)
      return { error }
    }

    if (data) {
      setTasks(tasks.map((t) => (t.id === id ? data : t)))
      router.refresh()
    }

    return { error: null }
  }

  async function handleDeleteTask(id: string) {
    const { error } = await deleteTask(id)

    if (error) {
      console.error('Error deleting task:', error)
      return { error }
    }

    setTasks(tasks.filter((t) => t.id !== id))
    router.refresh()

    return { error: null }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending' && task.completed) return false
    if (filter === 'completed' && !task.completed) return false
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => updateDate(e.target.value)}
            className="rounded-lg border border-gray-800 bg-gray-900/50 text-white placeholder:text-gray-500 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:border-gray-700"
          />
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-gray-200 text-black hover:bg-gray-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      <TaskFilters
        filter={filter}
        priorityFilter={priorityFilter}
        onFilterChange={setFilter}
        onPriorityFilterChange={setPriorityFilter}
      />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-gray-900/95 border-gray-800 backdrop-blur-xl max-w-md p-0 overflow-hidden relative">
          <BackgroundImage src="/images/tasks-bg.jpg" alt="Tasks background" opacity={20} />
          
          <div className="relative z-10 p-6">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <TaskForm
              date={selectedDate}
              onSubmit={handleCreateTask}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <TaskList
        tasks={filteredTasks}
        loading={false}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />
    </div>
  )
}
