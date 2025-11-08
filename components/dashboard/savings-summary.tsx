import { getMoneyStats } from '@/app/actions/money'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { TrendingUp, TrendingDown, ArrowRight, DollarSign, Wallet, PiggyBank } from 'lucide-react'
import { BackgroundImage } from '@/components/ui/background-image'

export async function SavingsSummary() {
  const { data: stats, error } = await getMoneyStats()

  if (error || !stats) {
    return (
      <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Savings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400">Error loading savings</p>
        </CardContent>
      </Card>
    )
  }

  const net = stats.totalSaved - stats.totalSpent
  const isPositive = net >= 0

  return (
    <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm relative overflow-hidden">
      <BackgroundImage src="/images/savings-bg.jpg" alt="Savings background" opacity={20} />
      
      <div className="relative z-10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30">
              <PiggyBank className="h-4 w-4 text-green-400" />
            </div>
            <CardTitle className="text-lg font-semibold text-white">Savings</CardTitle>
          </div>
          <Link
            href="/dashboard/money"
            className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1 group"
          >
            View
            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <div className="p-2 rounded-lg bg-white/10 border border-white/20">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <span className="text-3xl font-bold text-white">
                  ETB {Math.abs(net).toFixed(2)}
                </span>
                {isPositive ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
              </div>
              <p className="text-xs text-gray-400 ml-11">
                {isPositive ? 'Net savings' : 'Net spending'} this month
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-800/50">
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <p className="text-xs text-gray-400">Saved</p>
                </div>
                <p className="text-xl font-bold text-green-400">
                  ETB {stats.totalSaved.toFixed(2)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="h-4 w-4 text-red-400" />
                  <p className="text-xs text-gray-400">Spent</p>
                </div>
                <p className="text-xl font-bold text-red-400">
                  ETB {stats.totalSpent.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
