import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setCurrentUser } from '../utils/propertyStore'
import heroBg from '../assets/hero-bg.webp'

const AdminSignup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [focused, setFocused] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setCurrentUser({
      name: name || (email.includes('@') ? email.split('@')[0] : 'Admin'),
      email: email,
      role: 'admin',
    })
    navigate('/dashboard/authority')
  }

  const handleGoogleSignup = () => {
    setCurrentUser({
      name: 'Admin User',
      email: 'admin@3d-ulpin.gov.in',
      role: 'admin',
    })
    navigate('/dashboard/authority')
  }

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-4"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="card relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl">
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

        <div className="p-8 sm:p-10">
          <div className="mb-6 flex justify-center">
            <div className="admin-icon flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-400/20 border-2 border-emerald-400/40">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
          </div>

          <h1 className="mb-1 text-center text-3xl font-bold text-white">
            Admin Registration
          </h1>
          <p className="mb-8 text-center text-sm text-gray-400">
            Request administrator access to 3D-ULPIN
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <label className={`absolute left-4 transition-all duration-200 ${
                focused === 'name' || name
                  ? '-top-2.5 text-xs text-emerald-400 bg-gray-900/80 px-2 rounded'
                  : 'top-4 text-gray-400 text-sm'
              }`}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused('')}
                required
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-4 text-white outline-none transition-all duration-300 focus:border-emerald-500 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(16,185,129,0.15)]"
              />
            </div>

            <div className="relative">
              <label className={`absolute left-4 transition-all duration-200 ${
                focused === 'email' || email
                  ? '-top-2.5 text-xs text-emerald-400 bg-gray-900/80 px-2 rounded'
                  : 'top-4 text-gray-400 text-sm'
              }`}>Admin Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                required
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-4 text-white outline-none transition-all duration-300 focus:border-emerald-500 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(16,185,129,0.15)]"
              />
            </div>

            <div className="relative">
              <label className={`absolute left-4 transition-all duration-200 ${
                focused === 'password' || password
                  ? '-top-2.5 text-xs text-emerald-400 bg-gray-900/80 px-2 rounded'
                  : 'top-4 text-gray-400 text-sm'
              }`}>Create Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused('')}
                required
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-4 text-white outline-none transition-all duration-300 focus:border-emerald-500 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(16,185,129,0.15)]"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 py-4 text-lg font-semibold text-white transition-all duration-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] active:scale-[0.98]"
            >
              Request Admin Access
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-4">
            <span className="h-px flex-1 bg-white/15" />
            <span className="text-xs text-gray-500">or</span>
            <span className="h-px flex-1 bg-white/15" />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/5 py-3.5 text-sm font-medium text-gray-300 transition-all duration-300 hover:bg-white/10 hover:border-white/25 active:scale-[0.98]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have admin access?{' '}
            <a href="/admin/login" className="font-semibold text-emerald-400 hover:text-emerald-300 transition">
              Login
            </a>
          </p>
          <p className="mt-3 text-center">
            <a href="/" className="text-xs text-gray-500 hover:text-gray-300 transition">
              ← Back to Home
            </a>
          </p>
        </div>
      </div>

      <style>{`
        .card {
          animation: cardIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .admin-icon {
          animation: pulseShield 3s ease-in-out infinite;
        }
        @keyframes pulseShield {
          0%, 100% { box-shadow: 0 0 10px rgba(16,185,129,0.2); }
          50%      { box-shadow: 0 0 30px rgba(16,185,129,0.4), 0 0 60px rgba(16,185,129,0.15); }
        }
      `}</style>
    </div>
  )
}

export default AdminSignup
