'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MoneyStatsProps {
  stats: {
    totalSpent: number
    totalSaved: number
    net: number
  }
}

export function MoneyStats({ stats }: MoneyStatsProps) {
  const isPositive = stats.net >= 0

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-semibold text-destructive">
              ${stats.totalSpent.toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Saved</p>
            <p className="text-2xl font-semibold text-green-600">
              ${stats.totalSaved.toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Net</p>
              <p className={`text-2xl font-semibold ${isPositive ? 'text-green-600' : 'text-destructive'}`}>
                ${Math.abs(stats.net).toFixed(2)}
              </p>
            </div>
            {isPositive ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-destructive" />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

