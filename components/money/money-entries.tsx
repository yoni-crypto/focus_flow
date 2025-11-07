'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Edit2 } from 'lucide-react'
import { MoneyForm } from './money-form'
import type { Database } from '@/lib/supabase/types'

type MoneyEntry = Database['public']['Tables']['money_entries']['Row']

interface MoneyEntriesProps {
  entries: MoneyEntry[]
  onUpdate: (id: string, updates: Partial<MoneyEntry>) => Promise<{ error: string | null }>
  onDelete: (id: string) => Promise<{ error: string | null }>
}

export function MoneyEntries({ entries, onUpdate, onDelete }: MoneyEntriesProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const sortedEntries = [...entries].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  async function handleUpdate(id: string, entry: {
    type: 'spend' | 'save'
    amount: number
    category: string | null
    date: string
  }) {
    const result = await onUpdate(id, entry)
    if (!result.error) {
      setEditingId(null)
    }
    return result
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No entries yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Entries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sortedEntries.slice(0, 10).map((entry) => (
            <div key={entry.id}>
              {editingId === entry.id ? (
                <MoneyForm
                  month={entry.date.slice(0, 7)}
                  initialEntry={{
                    type: entry.type,
                    amount: Number(entry.amount),
                    category: entry.category || '',
                    date: entry.date,
                  }}
                  onSubmit={(data) => handleUpdate(entry.id, data)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          entry.type === 'spend' ? 'text-destructive' : 'text-green-600'
                        }`}
                      >
                        {entry.type === 'spend' ? '-' : '+'}${Number(entry.amount).toFixed(2)}
                      </span>
                      {entry.category && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {entry.category}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditingId(entry.id)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDelete(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {sortedEntries.length > 10 && (
            <p className="text-xs text-muted-foreground text-center pt-2">
              +{sortedEntries.length - 10} more entries
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

