'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface NotesSearchProps {
  onSearch: (query: string) => void
  initialQuery: string
}

export function NotesSearch({ onSearch, initialQuery }: NotesSearchProps) {
  const [query, setQuery] = useState(initialQuery)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="search"
        placeholder="Search notes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-9 bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-gray-700 focus:ring-gray-700 h-10 rounded-lg"
      />
    </form>
  )
}
