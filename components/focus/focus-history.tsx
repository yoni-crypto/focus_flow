import { getFocusSessions } from '@/app/actions/focus'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Flame } from 'lucide-react'

export async function FocusHistory() {
  const { data: sessions, error } = await getFocusSessions(10)

  if (error || !sessions || sessions.length === 0) {
    return (
      <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <Clock className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No sessions yet</p>
            <p className="text-xs text-gray-500 mt-1">Start your first focus session to see it here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Recent Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sessions.map((session) => {
            const sessionDate = new Date(session.created_at)
            const isToday = sessionDate.toDateString() === new Date().toDateString()
            
            return (
              <div
                key={session.id}
                className="group flex items-center justify-between rounded-lg border border-gray-800/50 bg-gray-900/20 p-3 hover:bg-gray-900/40 hover:border-gray-700/50 transition-all duration-200"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 shrink-0">
                    <Clock className="h-3.5 w-3.5 text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {isToday ? 'Today' : sessionDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {sessionDate.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-base font-bold text-white">
                    {session.duration_minutes || 0}
                    <span className="text-xs font-normal text-gray-400 ml-1">min</span>
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
