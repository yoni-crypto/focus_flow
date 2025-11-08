'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BackgroundImage } from '@/components/ui/background-image'
import type { Database } from '@/lib/supabase/types'

type MoneyEntry = Database['public']['Tables']['money_entries']['Row']

interface MoneyChartProps {
  entries: MoneyEntry[]
}

export function MoneyChart({ entries }: MoneyChartProps) {
  const chartData = useMemo(() => {
    const spendByCategory = new Map<string, number>()
    const saveByCategory = new Map<string, number>()

    entries.forEach((entry) => {
      const category = entry.category || 'Uncategorized'
      if (entry.type === 'spend') {
        spendByCategory.set(
          category,
          (spendByCategory.get(category) || 0) + Number(entry.amount)
        )
      } else {
        saveByCategory.set(
          category,
          (saveByCategory.get(category) || 0) + Number(entry.amount)
        )
      }
    })

    return {
      spend: Array.from(spendByCategory.entries()).map(([category, amount]) => ({
        category,
        amount,
      })),
      save: Array.from(saveByCategory.entries()).map(([category, amount]) => ({
        category,
        amount,
      })),
    }
  }, [entries])

  const maxAmount = Math.max(
    ...chartData.spend.map((d) => d.amount),
    ...chartData.save.map((d) => d.amount),
    1
  )

  return (
    <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm relative overflow-hidden">
      <BackgroundImage src="/images/savings-bg.jpg" alt="Savings background" opacity={20} />
      <div className="relative z-10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.spend.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-400">No spending data</p>
            </div>
          ) : (
            <div className="space-y-4">
              {chartData.spend.map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-white">{item.category}</span>
                    <span className="text-gray-400">ETB {item.amount.toFixed(2)}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-800/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 transition-all duration-500"
                      style={{ width: `${(item.amount / maxAmount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  )
}
