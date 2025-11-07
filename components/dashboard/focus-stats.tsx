import { getFocusStats } from '@/app/actions/focus'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Flame, Timer, ArrowRight, Zap } from 'lucide-react'
import { BackgroundImage } from '@/components/ui/background-image'

export async function FocusStats() {
  const { data: stats, error } = await getFocusStats()

  if (error || !stats) {
    return (
      <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Focus</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400">Error loading focus stats</p>
        </CardContent>
      </Card>
    )
  }

  const hours = Math.floor(stats.totalMinutes / 60)
  const minutes = stats.totalMinutes % 60

  return (
    <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm relative overflow-hidden">
      {/* Background Image */}
      <BackgroundImage src="/images/focus-bg.jpg" alt="Focus background" opacity={20} />
      
      <div className="relative z-10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-500/20 border border-orange-500/30">
              <Zap className="h-4 w-4 text-orange-400" />
            </div>
            <CardTitle className="text-lg font-semibold text-white">Focus</CardTitle>
          </div>
          <Link
            href="/dashboard/focus"
            className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1 group"
          >
            View
            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-orange-500/20 border border-orange-500/30 backdrop-blur-sm">
                  <Flame className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{stats.streak}</p>
                  <p className="text-xs text-gray-400">Day streak</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/30 backdrop-blur-sm">
                  <Timer className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{stats.totalSessions}</p>
                  <p className="text-xs text-gray-400">Sessions</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800/50">
              <p className="text-xs text-gray-400 mb-2">Total focus time</p>
              <p className="text-2xl font-bold text-white">
                {hours > 0 && `${hours}h `}
                {minutes > 0 && `${minutes}m`}
                {stats.totalMinutes === 0 && '0m'}
              </p>
            </div>

            {stats.todaySessions > 0 && (
              <div className="pt-3 border-t border-gray-800/50">
                <p className="text-xs text-gray-500">
                  {stats.todaySessions} session{stats.todaySessions !== 1 ? 's' : ''} today
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
