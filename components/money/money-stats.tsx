'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Wallet, PiggyBank, DollarSign } from 'lucide-react'
import { BackgroundImage } from '@/components/ui/background-image'
import { cn } from '@/lib/utils'

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
      <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm relative overflow-hidden">
        <BackgroundImage src="/images/savings-bg.jpg" alt="Savings background" opacity={20} />
        <CardContent className="pt-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-500/20 border border-red-500/30">
              <Wallet className="h-5 w-5 text-red-400" />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-400">Total Spent</p>
              <p className="text-2xl font-bold text-red-400">
                ${stats.totalSpent.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm relative overflow-hidden">
        <BackgroundImage src="/images/savings-bg.jpg" alt="Savings background" opacity={20} />
        <CardContent className="pt-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-green-500/20 border border-green-500/30">
              <PiggyBank className="h-5 w-5 text-green-400" />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-400">Total Saved</p>
              <p className="text-2xl font-bold text-green-400">
                ${stats.totalSaved.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm relative overflow-hidden">
        <BackgroundImage src="/images/savings-bg.jpg" alt="Savings background" opacity={20} />
        <CardContent className="pt-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2.5 rounded-lg border",
                isPositive 
                  ? "bg-green-500/20 border-green-500/30"
                  : "bg-red-500/20 border-red-500/30"
              )}>
                <DollarSign className={cn(
                  "h-5 w-5",
                  isPositive ? "text-green-400" : "text-red-400"
                )} />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400">Net</p>
                <p className={cn(
                  "text-2xl font-bold",
                  isPositive ? "text-green-400" : "text-red-400"
                )}>
                  ${Math.abs(stats.net).toFixed(2)}
                </p>
              </div>
            </div>
            {isPositive ? (
              <TrendingUp className="h-6 w-6 text-green-400" />
            ) : (
              <TrendingDown className="h-6 w-6 text-red-400" />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
