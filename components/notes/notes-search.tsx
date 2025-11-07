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
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search notes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-9"
      />
    </form>
  )
}

