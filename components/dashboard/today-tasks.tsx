import { getTasks } from '@/app/actions/tasks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react'
import { BackgroundImage } from '@/components/ui/background-image'

export async function TodayTasks() {
  const today = new Date().toISOString().split('T')[0]
  const { data: tasks, error } = await getTasks(today)

  if (error) {
    return (
      <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Today&apos;s Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400">Error loading tasks</p>
        </CardContent>
      </Card>
    )
  }

  const todayTasks = tasks?.filter((task) => !task.completed) || []
  const completedTasks = tasks?.filter((task) => task.completed) || []

  return (
    <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm relative overflow-hidden">
      <BackgroundImage src="/images/tasks-bg.jpg" alt="Tasks background" opacity={20} />
      
      <div className="relative z-10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold text-white">Today&apos;s Tasks</CardTitle>
          <Link
            href="/dashboard/tasks"
            className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1 group"
          >
            View all
            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </CardHeader>
        <CardContent>
          {todayTasks.length === 0 && completedTasks.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-400">No tasks for today</p>
              <Link
                href="/dashboard/tasks"
                className="inline-block mt-3 text-sm text-white hover:text-gray-300 transition-colors"
              >
                Create your first task →
              </Link>
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 rounded-lg border border-gray-800/50 bg-gray-900/20 p-3 hover:bg-gray-900/40 hover:border-gray-700/50 transition-all duration-200 group"
                >
                  <Circle className="mt-0.5 h-4 w-4 text-gray-500 group-hover:text-white transition-colors shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{task.title}</p>
                    {task.due_time && (
                      <p className="text-xs text-gray-400 mt-1">
                        {task.due_time}
                      </p>
                    )}
                  </div>
                  {task.priority === 'high' && (
                    <span className="rounded-full bg-red-500/20 border border-red-500/30 px-2 py-0.5 text-xs text-red-400 shrink-0">
                      High
                    </span>
                  )}
                </div>
              ))}
              {completedTasks.length > 0 && (
                <div className="pt-4 border-t border-gray-800/50">
                  <p className="text-xs text-gray-500 mb-2">
                    Completed ({completedTasks.length})
                  </p>
                  <div className="space-y-1.5">
                    {completedTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-2 text-sm text-gray-500 line-through"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="truncate">{task.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  )
}
