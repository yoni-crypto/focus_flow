'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Other',
]

interface MoneyFormProps {
  month: string
  onSubmit: (entry: {
    type: 'spend' | 'save'
    amount: number
    category: string | null
    date: string
  }) => Promise<{ error: string | null }>
  onCancel: () => void
  initialEntry?: {
    type: 'spend' | 'save'
    amount: number
    category: string | null
    date: string
  }
}

export function MoneyForm({
  month,
  onSubmit,
  onCancel,
  initialEntry,
}: MoneyFormProps) {
  const [type, setType] = useState<'spend' | 'save'>(initialEntry?.type || 'spend')
  const [amount, setAmount] = useState(initialEntry?.amount.toString() || '')
  const [category, setCategory] = useState(initialEntry?.category || '')
  const [date, setDate] = useState(
    initialEntry?.date || `${month}-${new Date().getDate().toString().padStart(2, '0')}`
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount')
      return
    }

    setLoading(true)

    const result = await onSubmit({
      type,
      amount: amountNum,
      category: category || null,
      date,
    })

    if (result.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type" className="text-white text-sm font-medium">
            Type
          </Label>
          <Select value={type} onValueChange={(value: 'spend' | 'save') => setType(value)}>
            <SelectTrigger 
              id="type" 
              disabled={loading}
              className="bg-gray-900/50 border-gray-800 text-white focus:border-gray-700 focus:ring-gray-700 h-10 rounded-lg"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-800">
              <SelectItem value="spend" className="text-white">Spend</SelectItem>
              <SelectItem value="save" className="text-white">Save</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount" className="text-white text-sm font-medium">
            Amount
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
            disabled={loading}
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-gray-700 focus:ring-gray-700 h-10 rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category" className="text-white text-sm font-medium">
            Category (optional)
          </Label>
          <Select value={category || undefined} onValueChange={(value) => setCategory(value || '')}>
            <SelectTrigger 
              id="category" 
              disabled={loading}
              className="bg-gray-900/50 border-gray-800 text-white focus:border-gray-700 focus:ring-gray-700 h-10 rounded-lg"
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-800">
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat} className="text-white">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date" className="text-white text-sm font-medium">
            Date
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            disabled={loading}
            className="bg-gray-900/50 border-gray-800 text-white focus:border-gray-700 focus:ring-gray-700 h-10 rounded-lg"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button 
          type="submit" 
          disabled={loading} 
          className="flex-1 bg-gray-200 text-black hover:bg-gray-300 h-10 rounded-lg"
        >
          {loading ? 'Saving...' : initialEntry ? 'Update Entry' : 'Create Entry'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={loading}
          className="bg-gray-900/50 border-gray-800 text-white hover:bg-gray-900 hover:border-gray-700 h-10 rounded-lg"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
