'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface TaskFiltersProps {
  filter: 'all' | 'pending' | 'completed'
  priorityFilter: 'all' | 'low' | 'medium' | 'high'
  onFilterChange: (filter: 'all' | 'pending' | 'completed') => void
  onPriorityFilterChange: (priority: 'all' | 'low' | 'medium' | 'high') => void
}

export function TaskFilters({
  filter,
  priorityFilter,
  onFilterChange,
  onPriorityFilterChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex gap-1 rounded-lg border border-border p-1">
        <Button
          type="button"
          variant={filter === 'all' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onFilterChange('all')}
          className={cn('h-8')}
        >
          All
        </Button>
        <Button
          type="button"
          variant={filter === 'pending' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onFilterChange('pending')}
          className={cn('h-8')}
        >
          Pending
        </Button>
        <Button
          type="button"
          variant={filter === 'completed' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onFilterChange('completed')}
          className={cn('h-8')}
        >
          Completed
        </Button>
      </div>

      <Select value={priorityFilter} onValueChange={(value: 'all' | 'low' | 'medium' | 'high') => onPriorityFilterChange(value)}>
        <SelectTrigger className="w-[140px] h-8">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

