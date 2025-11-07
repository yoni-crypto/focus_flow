'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createFocusSession, updateFocusSession } from '@/app/actions/focus'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Pause, Square, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

const POMODORO_DURATION = 25 * 60 // 25 minutes in seconds
const SHORT_BREAK = 5 * 60 // 5 minutes in seconds
const LONG_BREAK = 15 * 60 // 15 minutes in seconds

type TimerMode = 'focus' | 'shortBreak' | 'longBreak'

export function FocusTimer() {
  const router = useRouter()
  const [seconds, setSeconds] = useState(POMODORO_DURATION)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<TimerMode>('focus')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)

  // Format time display
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  // Timer logic
  useEffect(() => {
    if (!isRunning || seconds === 0) return

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          handleTimerComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, seconds])

  // Start timer
  const handleStart = useCallback(async () => {
    if (!isRunning && sessionId === null) {
      // Create new session
      const startTime = new Date()
      const { data, error } = await createFocusSession({
        start: startTime.toISOString(),
        end_time: null,
        duration_minutes: null,
      })

      if (data && !error) {
        setSessionId(data.id)
        setSessionStartTime(startTime)
      }
    }
    setIsRunning(true)
  }, [isRunning, sessionId])

  // Pause timer
  const handlePause = useCallback(() => {
    setIsRunning(false)
  }, [])

  // Reset timer
  const handleReset = useCallback(async () => {
    setIsRunning(false)
    setSeconds(getDurationForMode(mode))

    // If there's an active session, cancel it
    if (sessionId) {
      await updateFocusSession(sessionId, {
        end_time: new Date().toISOString(),
        duration_minutes: 0,
      })
      setSessionId(null)
      setSessionStartTime(null)
    }
  }, [mode, sessionId])

  // Switch mode
  const switchMode = useCallback(async (newMode: TimerMode) => {
    // Save current session if running
    if (sessionId && sessionStartTime) {
      const duration = Math.floor(
        (new Date().getTime() - sessionStartTime.getTime()) / (1000 * 60)
      )
      await updateFocusSession(sessionId, {
        end_time: new Date().toISOString(),
        duration_minutes: duration,
      })
      router.refresh()
    }

    setMode(newMode)
    setSeconds(getDurationForMode(newMode))
    setIsRunning(false)
    setSessionId(null)
    setSessionStartTime(null)
  }, [sessionId, sessionStartTime, router])

  // Timer complete
  const handleTimerComplete = useCallback(async () => {
    if (sessionId && sessionStartTime) {
      const duration = Math.floor(
        (new Date().getTime() - sessionStartTime.getTime()) / (1000 * 60)
      )
      await updateFocusSession(sessionId, {
        end_time: new Date().toISOString(),
        duration_minutes: duration,
      })
      router.refresh()
    }

    // Auto-switch to break after focus
    if (mode === 'focus') {
      setTimeout(() => {
        switchMode('shortBreak')
      }, 1000)
    } else {
      // Return to focus after break
      setTimeout(() => {
        switchMode('focus')
      }, 1000)
    }
  }, [sessionId, sessionStartTime, mode, router, switchMode])

  function getDurationForMode(mode: TimerMode): number {
    switch (mode) {
      case 'focus':
        return POMODORO_DURATION
      case 'shortBreak':
        return SHORT_BREAK
      case 'longBreak':
        return LONG_BREAK
    }
  }

  const totalDuration = getDurationForMode(mode)
  const progress = totalDuration > 0 ? ((totalDuration - seconds) / totalDuration) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Timer Display */}
      <Card className="overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-8">
            {/* Mode Selector */}
            <div className="flex gap-2 rounded-lg border border-border p-1">
              <Button
                variant={mode === 'focus' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => switchMode('focus')}
                disabled={isRunning}
              >
                Focus
              </Button>
              <Button
                variant={mode === 'shortBreak' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => switchMode('shortBreak')}
                disabled={isRunning}
              >
                Short Break
              </Button>
              <Button
                variant={mode === 'longBreak' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => switchMode('longBreak')}
                disabled={isRunning}
              >
                Long Break
              </Button>
            </div>

            {/* Timer Display */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className={cn(
                'text-7xl md:text-8xl font-semibold tracking-tight font-mono',
                seconds === 0 && 'text-destructive',
                isRunning && 'animate-pulse'
              )}>
                {formatTime(seconds)}
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium capitalize">
                  {mode === 'focus' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                </p>
                {progress > 0 && (
                  <div className="flex items-center gap-2 justify-center">
                    <div className="h-1 w-32 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-foreground transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(progress)}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              {!isRunning ? (
                <Button
                  size="lg"
                  onClick={handleStart}
                  className="gap-2"
                >
                  <Play className="h-5 w-5" />
                  Start
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handlePause}
                  className="gap-2"
                >
                  <Pause className="h-5 w-5" />
                  Pause
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw className="h-5 w-5" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Info */}
      {sessionId && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Session</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Session started at {sessionStartTime?.toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

