import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { getCurrentUser, clearCurrentUser } from '../utils/propertyStore'
import heroBg from '../assets/hero-bg.webp'

/* ── Navigation config ── */
const commonLinks = [
  { label: 'ULPIN Search',      icon: '🔍', path: '/dashboard/search' },
  { label: '3D GIS Map',        icon: '🗺️', path: '/dashboard/map' },
  { label: 'Building Explorer', icon: '🏢', path: '/dashboard/buildings' },
  { label: 'ULPIN Details',     icon: '📋', path: '/dashboard/details' },
  { label: 'Registry History',  icon: '📜', path: '/dashboard/history' },
  { label: 'AR/VR View',        icon: '🥽', path: '/dashboard/arvr' },
]

const adminLinks = [
  { label: 'Flagged Properties',   icon: '🚩', path: '/dashboard/flagged' },
  { label: 'Validation',           icon: '✅', path: '/dashboard/validation' },
  { label: 'Authority Dashboard',  icon: '📊', path: '/dashboard/authority' },
]

const DashboardLayout = ({ role = 'user', children }) => {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [user, setUser] = useState(() => getCurrentUser(role))

  useEffect(() => {
    setUser(getCurrentUser(role))
  }, [role])

  const isOpen = isHovered || isPinned
  const isAdmin = role === 'admin'
  const userName = user?.name || (isAdmin ? 'Admin User' : 'User')
  const userEmail = user?.email || (isAdmin ? 'admin@3d-ulpin.gov.in' : 'user@3d-ulpin.gov.in')
  const firstLetter = (userName?.trim()?.[0] || userEmail?.trim()?.[0] || (isAdmin ? 'A' : 'U')).toUpperCase()

  const handleLogout = () => {
    clearCurrentUser()
    navigate('/')
  }

  /* ── Active / inactive link classes ── */
  const linkClasses = ({ isActive }) =>
    [
      'group flex items-center rounded-2xl p-2.5 transition-all duration-200',
      isActive
        ? isAdmin
          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.12)]'
          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.12)]'
        : 'text-gray-400 hover:bg-white/10 hover:text-white border border-transparent',
    ].join(' ')

  /* ── Active indicator bar ── */
  const indicatorClasses = (isActive) =>
    [
      'absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full transition-all duration-300',
      isActive
        ? isAdmin
          ? 'bg-emerald-400'
          : 'bg-blue-400'
        : 'bg-transparent',
    ].join(' ')

  return (
    <div
      className="relative flex h-screen w-screen overflow-hidden bg-gray-950 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Dimmed background overlay */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />

      {/* ── Auto Sliding Sidebar (Slides open on hover, slides back on leave, NO button needed) ── */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative z-50 flex flex-col border-r border-white/15 bg-gray-950/90 shadow-2xl backdrop-blur-2xl transition-all duration-300 ease-in-out shrink-0 ${
          isOpen ? 'w-72' : 'w-20'
        }`}
      >
        {/* Top corner of sidebar: User's First Letter Avatar (In place of 3D-ULPIN) */}
        <div className="flex h-20 items-center border-b border-white/10 px-4 overflow-hidden">
          {/* User first letter avatar circle */}
          <div
            onClick={() => setIsPinned((prev) => !prev)}
            title={isOpen ? 'Click to pin/unpin' : `${userName} (Hover to slide open)`}
            className={`flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-2xl text-lg font-bold text-white shadow-lg ring-2 transition-transform hover:scale-105 active:scale-95 ${
              isAdmin
                ? 'bg-gradient-to-br from-emerald-500 to-teal-400 ring-emerald-400/30 shadow-emerald-500/20'
                : 'bg-gradient-to-br from-blue-500 to-cyan-400 ring-blue-400/30 shadow-blue-500/20'
            }`}
          >
            {firstLetter}
          </div>

          {/* User details: Smoothly slides in when hovered */}
          <div
            className={`ml-3.5 min-w-0 flex-1 transition-all duration-300 ${
              isOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0 pointer-events-none'
            }`}
          >
            <h2 className="truncate text-sm font-bold text-white leading-tight">
              {userName}
            </h2>
            <p className="truncate text-xs text-gray-400">
              {userEmail}
            </p>
            <span
              className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                isAdmin
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}
            >
              {isAdmin ? 'Admin Portal' : 'User Portal'}
            </span>
          </div>
        </div>

        {/* Navigation items placed on the DOWNSIDE of the user */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-2.5 py-4 scrollbar-thin scrollbar-thumb-gray-800">
          <div className="h-4 px-2">
            {isOpen && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 animate-in fade-in duration-200">
                Navigation
              </span>
            )}
          </div>

          {commonLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end
              className={linkClasses}
              title={!isOpen ? link.label : undefined}
            >
              {({ isActive }) => (
                <div className="relative flex w-full items-center gap-3 overflow-hidden">
                  <span className={indicatorClasses(isActive)} />
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xl leading-none">
                    {link.icon}
                  </span>
                  <span
                    className={`truncate text-sm font-semibold transition-all duration-300 ${
                      isOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
                    }`}
                  >
                    {link.label}
                  </span>
                </div>
              )}
            </NavLink>
          ))}

          {/* Admin Links if Admin */}
          {isAdmin && (
            <>
              <div className="my-3 border-t border-white/10" />
              <div className="h-4 px-2">
                {isOpen && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/80 animate-in fade-in duration-200">
                    Administration
                  </span>
                )}
              </div>

              {adminLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end
                  className={linkClasses}
                  title={!isOpen ? link.label : undefined}
                >
                  {({ isActive }) => (
                    <div className="relative flex w-full items-center gap-3 overflow-hidden">
                      <span className={indicatorClasses(isActive)} />
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xl leading-none">
                        {link.icon}
                      </span>
                      <span
                        className={`truncate text-sm font-semibold transition-all duration-300 ${
                          isOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
                        }`}
                      >
                        {link.label}
                      </span>
                    </div>
                  )}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* Sidebar Footer: Single Logout Button */}
        <div className="border-t border-white/10 p-3">
          <button
            onClick={handleLogout}
            title={!isOpen ? 'Logout' : undefined}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-gray-300 transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/15 hover:text-red-400 active:scale-98 overflow-hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span
              className={`truncate transition-all duration-300 ${
                isOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* Top Header Bar (Clean, NO sliding button on the left) */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-gray-950/70 px-6 backdrop-blur-xl">
          {/* Left: Clean 3D-ULPIN title - NO sliding button */}
          <div className="flex items-center gap-3">
            <h1 className="text-base sm:text-lg font-bold tracking-wider text-white">
              3D-ULPIN
            </h1>

            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                isAdmin
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
              }`}
            >
              {isAdmin ? 'Admin' : 'User'}
            </span>
          </div>

          {/* Right: User identification badge (No duplicate logout button) */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-bold text-white">{userName}</p>
              <p className="text-[10px] text-gray-400">{userEmail}</p>
            </div>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white shadow-md ring-1 ring-white/20 ${
                isAdmin
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-br from-blue-500 to-cyan-400'
              }`}
              title={userName}
            >
              {firstLetter}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
