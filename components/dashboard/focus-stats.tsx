import { getFocusStats } from '@/app/actions/focus'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Flame, Timer } from 'lucide-react'

export async function FocusStats() {
  const { data: stats, error } = await getFocusStats()

  if (error || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Focus</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Error loading focus stats</p>
        </CardContent>
      </Card>
    )
  }

  const hours = Math.floor(stats.totalMinutes / 60)
  const minutes = stats.totalMinutes % 60

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Focus</CardTitle>
        <Link
          href="/dashboard/focus"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-semibold">{stats.streak}</p>
                <p className="text-xs text-muted-foreground">Day streak</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-semibold">{stats.totalSessions}</p>
                <p className="text-xs text-muted-foreground">Sessions</p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground mb-1">Total focus time</p>
            <p className="text-lg font-semibold">
              {hours > 0 && `${hours}h `}
              {minutes > 0 && `${minutes}m`}
              {stats.totalMinutes === 0 && '0m'}
            </p>
          </div>

          {stats.todaySessions > 0 && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {stats.todaySessions} session{stats.todaySessions !== 1 ? 's' : ''} today
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

