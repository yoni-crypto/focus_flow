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
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex gap-1 rounded-lg border border-gray-800/50 bg-gray-900/30 p-1 backdrop-blur-sm">
        <Button
          type="button"
          variant={filter === 'all' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onFilterChange('all')}
          className={cn(
            'h-8 px-3 text-sm rounded-md',
            filter === 'all'
              ? 'bg-gray-200 text-black hover:bg-gray-300'
              : 'text-gray-400 hover:text-white hover:bg-transparent'
          )}
        >
          All
        </Button>
        <Button
          type="button"
          variant={filter === 'pending' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onFilterChange('pending')}
          className={cn(
            'h-8 px-3 text-sm rounded-md',
            filter === 'pending'
              ? 'bg-gray-200 text-black hover:bg-gray-300'
              : 'text-gray-400 hover:text-white hover:bg-transparent'
          )}
        >
          Pending
        </Button>
        <Button
          type="button"
          variant={filter === 'completed' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onFilterChange('completed')}
          className={cn(
            'h-8 px-3 text-sm rounded-md',
            filter === 'completed'
              ? 'bg-gray-200 text-black hover:bg-gray-300'
              : 'text-gray-400 hover:text-white hover:bg-transparent'
          )}
        >
          Completed
        </Button>
      </div>

      <Select 
        value={priorityFilter} 
        onValueChange={(value: 'all' | 'low' | 'medium' | 'high') => onPriorityFilterChange(value)}
      >
        <SelectTrigger className="w-[140px] h-8 bg-gray-900/50 border-gray-800 text-white focus:border-gray-700 focus:ring-gray-700 rounded-lg">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-gray-800">
          <SelectItem value="all" className="text-white">All Priorities</SelectItem>
          <SelectItem value="high" className="text-white">High</SelectItem>
          <SelectItem value="medium" className="text-white">Medium</SelectItem>
          <SelectItem value="low" className="text-white">Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
