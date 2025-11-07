'use client'

import { useState } from 'react'
import { resetPassword } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export function ResetPasswordForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await resetPassword(email)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-center">
          <p className="text-sm text-green-400">
            Check your email for a password reset link.
          </p>
        </div>
        <Link href="/auth/login">
          <Button 
            variant="outline" 
            className="w-full h-12 bg-gray-900/50 border-gray-800 text-white hover:bg-gray-900 hover:border-gray-700 rounded-lg font-medium"
          >
            Back to sign in
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-gray-700 focus:ring-gray-700 h-12 rounded-lg"
          />
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full h-12 bg-gray-200 text-black hover:bg-gray-300 font-medium rounded-lg transition-colors" 
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-400">
        Remember your password?{' '}
        <Link
          href="/auth/login"
          className="text-white hover:underline font-medium"
        >
          Sign in here
        </Link>
      </p>
    </div>
  )
}
