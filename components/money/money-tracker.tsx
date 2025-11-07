'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createMoneyEntry, updateMoneyEntry, deleteMoneyEntry } from '@/app/actions/money'
import { MoneyStats } from './money-stats'
import { MoneyChart } from './money-chart'
import { MoneyEntries } from './money-entries'
import { MoneyForm } from './money-form'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import type { Database } from '@/lib/supabase/types'

type MoneyEntry = Database['public']['Tables']['money_entries']['Row']

interface MoneyTrackerProps {
  initialEntries: MoneyEntry[]
  initialStats: {
    totalSpent: number
    totalSaved: number
    net: number
  }
  initialMonth: string
}

export function MoneyTracker({
  initialEntries,
  initialStats,
  initialMonth,
}: MoneyTrackerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [entries, setEntries] = useState<MoneyEntry[]>(initialEntries)
  const [stats, setStats] = useState(initialStats)
  const [selectedMonth, setSelectedMonth] = useState(initialMonth)
  const [showForm, setShowForm] = useState(false)
  const isInitialMount = useRef(true)

  // Update from server when month changes or when server data changes
  useEffect(() => {
    // On initial mount, just initialize
    if (isInitialMount.current) {
      isInitialMount.current = false
      setEntries(initialEntries)
      setStats(initialStats)
      setSelectedMonth(initialMonth)
      return
    }

    // Always update from server when initialEntries/initialStats change
    // This ensures we get the latest data after refresh
    if (selectedMonth !== initialMonth) {
      // Month changed in URL
      setSelectedMonth(initialMonth)
    }
    
    // Always sync with server data (server is source of truth)
    setEntries(initialEntries)
    setStats(initialStats)
  }, [initialEntries, initialStats, initialMonth, selectedMonth])

  function updateMonth(newMonth: string) {
    setSelectedMonth(newMonth)
    router.push(`${pathname}?month=${newMonth}`)
  }

  async function handleCreateEntry(entry: {
    type: 'spend' | 'save'
    amount: number
    category: string | null
    date: string
  }) {
    const { data, error } = await createMoneyEntry(entry)

    if (error) {
      console.error('Error creating entry:', error)
      return { error }
    }

    if (data) {
      setShowForm(false)
      // Only add to state if the entry's month matches the selected month
      const entryMonth = data.date.slice(0, 7)
      if (entryMonth === selectedMonth) {
        // Optimistically update UI immediately
        setEntries([data, ...entries])
        updateStats(data)
        // Refresh after a short delay to ensure DB commit is complete
        setTimeout(() => {
          router.refresh()
        }, 100)
      } else {
        // Entry is in different month, just refresh to update stats
        router.refresh()
      }
    }

    return { error: null }
  }

  async function handleUpdateEntry(id: string, updates: Partial<MoneyEntry>) {
    const { data, error } = await updateMoneyEntry(id, updates)

    if (error) {
      console.error('Error updating entry:', error)
      return { error }
    }

    if (data) {
      // Optimistically update UI
      setEntries(entries.map((e) => (e.id === id ? data : e)))
      // Update stats if amount or type changed
      const oldEntry = entries.find(e => e.id === id)
      if (oldEntry) {
        // Remove old entry's stats
        updateStats(oldEntry, true)
        // Add new entry's stats
        updateStats(data, false)
      }
      // Refresh to sync with server
      router.refresh()
    }

    return { error: null }
  }

  async function handleDeleteEntry(id: string) {
    const entry = entries.find((e) => e.id === id)
    const { error } = await deleteMoneyEntry(id)

    if (error) {
      console.error('Error deleting entry:', error)
      return { error }
    }

    // Optimistically update UI
    setEntries(entries.filter((e) => e.id !== id))
    if (entry) {
      updateStats(entry, true)
    }
    // Refresh to sync with server
    router.refresh()

    return { error: null }
  }

  function updateStats(entry: MoneyEntry, isDelete = false) {
    const multiplier = isDelete ? -1 : 1
    setStats((prev) => {
      if (entry.type === 'spend') {
        return {
          ...prev,
          totalSpent: prev.totalSpent + entry.amount * multiplier,
          net: prev.net - entry.amount * multiplier,
        }
      } else {
        return {
          ...prev,
          totalSaved: prev.totalSaved + entry.amount * multiplier,
          net: prev.net + entry.amount * multiplier,
        }
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => updateMonth(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Entry
        </Button>
      </div>

      <MoneyStats stats={stats} />

      {showForm && (
        <MoneyForm
          month={selectedMonth}
          onSubmit={handleCreateEntry}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <MoneyChart entries={entries} />
        <MoneyEntries
          entries={entries}
          onUpdate={handleUpdateEntry}
          onDelete={handleDeleteEntry}
        />
      </div>
    </div>
  )
}

