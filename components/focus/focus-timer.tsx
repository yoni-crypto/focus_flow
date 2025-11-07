'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createFocusSession, updateFocusSession } from '@/app/actions/focus'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Pause, RotateCcw, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BackgroundImage } from '@/components/ui/background-image'

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

  const modeColors = {
    focus: 'from-orange-500/20 to-red-500/20 border-orange-500/30',
    shortBreak: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    longBreak: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
  }

  return (
    <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm relative overflow-hidden min-h-[600px]">
      {/* Background Image */}
      <BackgroundImage src="/images/focus-bg.jpg" alt="Focus background" opacity={15} />
      
      <div className="relative z-10 p-8 lg:p-12">
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Mode Selector */}
          <div className="flex gap-2 rounded-xl border border-gray-800/50 bg-gray-900/30 p-1.5 backdrop-blur-sm">
            <Button
              variant={mode === 'focus' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => switchMode('focus')}
              disabled={isRunning}
              className={cn(
                'h-9 px-4 rounded-lg transition-all duration-200',
                mode === 'focus'
                  ? 'bg-gray-200 text-black hover:bg-gray-300'
                  : 'text-gray-400 hover:text-white hover:bg-transparent'
              )}
            >
              <Zap className="h-4 w-4 mr-2" />
              Focus
            </Button>
            <Button
              variant={mode === 'shortBreak' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => switchMode('shortBreak')}
              disabled={isRunning}
              className={cn(
                'h-9 px-4 rounded-lg transition-all duration-200',
                mode === 'shortBreak'
                  ? 'bg-gray-200 text-black hover:bg-gray-300'
                  : 'text-gray-400 hover:text-white hover:bg-transparent'
              )}
            >
              Short Break
            </Button>
            <Button
              variant={mode === 'longBreak' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => switchMode('longBreak')}
              disabled={isRunning}
              className={cn(
                'h-9 px-4 rounded-lg transition-all duration-200',
                mode === 'longBreak'
                  ? 'bg-gray-200 text-black hover:bg-gray-300'
                  : 'text-gray-400 hover:text-white hover:bg-transparent'
              )}
            >
              Long Break
            </Button>
          </div>

          {/* Timer Display */}
          <div className="flex flex-col items-center justify-center space-y-6 w-full">
            <div className={cn(
              'text-8xl md:text-9xl font-bold tracking-tight font-mono text-white',
              seconds === 0 && 'text-red-500',
              isRunning && 'animate-pulse'
            )}>
              {formatTime(seconds)}
            </div>
            
            <div className="text-center space-y-3 w-full max-w-md">
              <p className="text-lg font-medium text-gray-300 capitalize">
                {mode === 'focus' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
              </p>
              
              {/* Progress Bar */}
              {progress > 0 && (
                <div className="space-y-2">
                  <div className="h-2 w-full bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                    <div 
                      className={cn(
                        'h-full transition-all duration-1000 rounded-full',
                        mode === 'focus' && 'bg-gradient-to-r from-orange-500 to-red-500',
                        mode === 'shortBreak' && 'bg-gradient-to-r from-blue-500 to-cyan-500',
                        mode === 'longBreak' && 'bg-gradient-to-r from-green-500 to-emerald-500'
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400">
                    {Math.round(progress)}% complete
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3 pt-4">
            {!isRunning ? (
              <Button
                size="lg"
                onClick={handleStart}
                className="gap-2 bg-gray-200 text-black hover:bg-gray-300 h-12 px-8 rounded-lg font-medium"
              >
                <Play className="h-5 w-5" />
                Start
              </Button>
            ) : (
              <Button
                size="lg"
                variant="outline"
                onClick={handlePause}
                className="gap-2 bg-gray-900/50 border-gray-800 text-white hover:bg-gray-900 hover:border-gray-700 h-12 px-8 rounded-lg font-medium"
              >
                <Pause className="h-5 w-5" />
                Pause
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              onClick={handleReset}
              className="gap-2 bg-gray-900/50 border-gray-800 text-white hover:bg-gray-900 hover:border-gray-700 h-12 px-8 rounded-lg font-medium"
            >
              <RotateCcw className="h-5 w-5" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
