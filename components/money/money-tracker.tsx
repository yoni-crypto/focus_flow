'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createMoneyEntry, updateMoneyEntry, deleteMoneyEntry } from '@/app/actions/money'
import { MoneyStats } from './money-stats'
import { MoneyChart } from './money-chart'
import { MoneyEntries } from './money-entries'
import { MoneyForm } from './money-form'
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

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      setEntries(initialEntries)
      setStats(initialStats)
      setSelectedMonth(initialMonth)
      return
    }

    if (selectedMonth !== initialMonth) {
      setSelectedMonth(initialMonth)
    }
    
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
      const entryMonth = data.date.slice(0, 7)
      if (entryMonth === selectedMonth) {
        setEntries([data, ...entries])
        updateStats(data)
        setTimeout(() => {
          router.refresh()
        }, 100)
      } else {
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
      setEntries(entries.map((e) => (e.id === id ? data : e)))
      const oldEntry = entries.find(e => e.id === id)
      if (oldEntry) {
        updateStats(oldEntry, true)
        updateStats(data, false)
      }
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

    setEntries(entries.filter((e) => e.id !== id))
    if (entry) {
      updateStats(entry, true)
    }
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
            className="rounded-lg border border-gray-800 bg-gray-900/50 text-white placeholder:text-gray-500 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:border-gray-700"
          />
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-gray-200 text-black hover:bg-gray-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Entry
        </Button>
      </div>

      <MoneyStats stats={stats} />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-gray-900/95 border-gray-800 backdrop-blur-xl max-w-md p-0 overflow-hidden relative">
          <BackgroundImage src="/images/savings-bg.jpg" alt="Savings background" opacity={20} />
          
          <div className="relative z-10 p-6">
            <DialogHeader>
              <DialogTitle>Create New Entry</DialogTitle>
            </DialogHeader>
            <MoneyForm
              month={selectedMonth}
              onSubmit={handleCreateEntry}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

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
