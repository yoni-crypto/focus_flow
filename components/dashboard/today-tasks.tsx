import { getTasks } from '@/app/actions/tasks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { CheckCircle2, Circle } from 'lucide-react'

export async function TodayTasks() {
  const today = new Date().toISOString().split('T')[0]
  const { data: tasks, error } = await getTasks(today)

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Error loading tasks</p>
        </CardContent>
      </Card>
    )
  }

  // Tasks are already sorted by completed status from the query
  const todayTasks = tasks?.filter((task) => !task.completed) || []
  const completedTasks = tasks?.filter((task) => task.completed) || []

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Today&apos;s Tasks</CardTitle>
        <Link
          href="/dashboard/tasks"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent>
        {todayTasks.length === 0 && completedTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tasks for today</p>
        ) : (
          <div className="space-y-2">
            {todayTasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-2 rounded-lg border border-border p-2"
              >
                <Circle className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  {task.due_time && (
                    <p className="text-xs text-muted-foreground">
                      {task.due_time}
                    </p>
                  )}
                </div>
                {task.priority === 'high' && (
                  <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                    High
                  </span>
                )}
              </div>
            ))}
            {todayTasks.length > 5 && (
              <p className="text-xs text-muted-foreground text-center pt-1">
                +{todayTasks.length - 5} more tasks
              </p>
            )}
            {completedTasks.length > 0 && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">
                  Completed ({completedTasks.length})
                </p>
                {completedTasks.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 text-sm text-muted-foreground line-through"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="truncate">{task.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

