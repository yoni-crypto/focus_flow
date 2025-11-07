'use client'

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="max-w-md text-center">
        <h1 className="mb-2 text-2xl font-semibold">You&apos;re offline</h1>
        <p className="mb-6 text-muted-foreground">
          Please check your internet connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-foreground px-4 py-2 text-background transition-opacity hover:opacity-80"
        >
          Retry
        </button>
      </div>
    </div>
  )
}

