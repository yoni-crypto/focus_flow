'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.spend.length === 0 ? (
          <p className="text-sm text-muted-foreground">No spending data</p>
        ) : (
          <div className="space-y-4">
            {chartData.spend.map((item) => (
              <div key={item.category} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-muted-foreground">${item.amount.toFixed(2)}</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-foreground transition-all"
                    style={{ width: `${(item.amount / maxAmount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

