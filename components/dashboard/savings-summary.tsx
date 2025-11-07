import { getMoneyStats } from '@/app/actions/money'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { TrendingUp, TrendingDown } from 'lucide-react'

export async function SavingsSummary() {
  const { data: stats, error } = await getMoneyStats()

  if (error || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Savings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Error loading savings</p>
        </CardContent>
      </Card>
    )
  }

  const net = stats.totalSaved - stats.totalSpent
  const isPositive = net >= 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Savings</CardTitle>
        <Link
          href="/dashboard/money"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold">
                ${Math.abs(net).toFixed(2)}
              </span>
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isPositive ? 'Net savings' : 'Net spending'} this month
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground">Saved</p>
              <p className="text-lg font-semibold text-green-600">
                ${stats.totalSaved.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Spent</p>
              <p className="text-lg font-semibold text-destructive">
                ${stats.totalSpent.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

