import { ResetPasswordForm } from '@/components/auth/reset-password-form'

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen bg-black">
      {/* Left Section - Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"
          style={{
            backgroundImage: 'url(/auth-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <h1 className="text-7xl font-bold tracking-tight mb-4">FOCUS</h1>
          <p className="text-xl text-gray-300 max-w-md">
            Reset your password and get back on track
          </p>
        </div>
      </div>

      {/* Right Section - Reset Password Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-black">
        <div className="w-full max-w-md space-y-8">
          {/* Logo/Title */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              Reset <span className="inline-block border-2 border-white px-2 py-1">Password</span>
            </h1>
            <p className="text-gray-400 text-sm mt-4">
              Enter your email to receive a password reset link
            </p>
          </div>

          <ResetPasswordForm />
        </div>
      </div>
    </div>
  )
}
