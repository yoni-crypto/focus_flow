'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Edit2 } from 'lucide-react'
import { MoneyForm } from './money-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BackgroundImage } from '@/components/ui/background-image'
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
      <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm relative overflow-hidden">
        <BackgroundImage src="/images/savings-bg.jpg" alt="Savings background" opacity={20} />
        <div className="relative z-10">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center">
              <p className="text-sm text-gray-400">No entries yet</p>
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm relative overflow-hidden">
        <BackgroundImage src="/images/savings-bg.jpg" alt="Savings background" opacity={20} />
        <div className="relative z-10">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="space-y-2">
            {sortedEntries.slice(0, 10).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-lg border border-gray-800/50 bg-gray-900/20 p-3 hover:bg-gray-900/40 hover:border-gray-700/50 transition-all duration-200 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${
                        entry.type === 'spend' ? 'text-red-400' : 'text-green-400'
                      }`}
                    >
                      {entry.type === 'spend' ? '-' : '+'}${Number(entry.amount).toFixed(2)}
                    </span>
                    {entry.category && (
                      <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-0.5 rounded border border-gray-700/50">
                        {entry.category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
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
                    className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-900/50"
                    onClick={() => setEditingId(entry.id)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                    onClick={() => onDelete(entry.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {sortedEntries.length > 10 && (
              <p className="text-xs text-gray-500 text-center pt-2">
                +{sortedEntries.length - 10} more entries
              </p>
            )}
          </div>
        </CardContent>
        </div>
      </Card>

      {/* Edit Modal */}
      {editingId && (
        <Dialog open={!!editingId} onOpenChange={(open) => !open && setEditingId(null)}>
          <DialogContent className="bg-gray-900/95 border-gray-800 backdrop-blur-xl max-w-md p-0 overflow-hidden relative">
            <BackgroundImage src="/images/savings-bg.jpg" alt="Savings background" opacity={20} />
            <div className="relative z-10 p-6">
              <DialogHeader>
                <DialogTitle>Edit Entry</DialogTitle>
              </DialogHeader>
              <MoneyForm
                month={sortedEntries.find(e => e.id === editingId)?.date.slice(0, 7) || ''}
                initialEntry={{
                  type: sortedEntries.find(e => e.id === editingId)?.type || 'spend',
                  amount: Number(sortedEntries.find(e => e.id === editingId)?.amount || 0),
                  category: sortedEntries.find(e => e.id === editingId)?.category || '',
                  date: sortedEntries.find(e => e.id === editingId)?.date || '',
                }}
                onSubmit={(data) => handleUpdate(editingId, data)}
                onCancel={() => setEditingId(null)}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
