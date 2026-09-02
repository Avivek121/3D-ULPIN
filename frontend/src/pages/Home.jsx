import React, { useState } from 'react'
import heroBg from '../assets/hero-bg.webp'

const Home = () => {
  const [showOptions, setShowOptions] = useState(false)

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Animated 3D scan points falling from top */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="scan-dot"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Animated scan grid lines */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="scan-line" />
      </div>

      {/* Animated drone */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="drone">
          <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="15" y1="18" x2="40" y2="18" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="65" y1="18" x2="40" y2="18" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="25" y1="22" x2="40" y2="22" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="55" y1="22" x2="40" y2="22" stroke="#cbd5e1" strokeWidth="1.5" />
            <ellipse cx="40" cy="20" rx="12" ry="6" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
            <circle cx="40" cy="24" r="2" fill="#3b82f6" className="drone-light" />
            <ellipse cx="10" cy="16" rx="10" ry="3" fill="rgba(148,163,184,0.3)" className="rotor" />
            <ellipse cx="70" cy="16" rx="10" ry="3" fill="rgba(148,163,184,0.3)" className="rotor" />
            <ellipse cx="22" cy="22" rx="8" ry="2.5" fill="rgba(148,163,184,0.25)" className="rotor rotor-rear" />
            <ellipse cx="58" cy="22" rx="8" ry="2.5" fill="rgba(148,163,184,0.25)" className="rotor rotor-rear" />
            <line x1="30" y1="26" x2="28" y2="32" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="50" y1="26" x2="52" y2="32" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="25" y1="32" x2="32" y2="32" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="48" y1="32" x2="55" y2="32" stroke="#94a3b8" strokeWidth="1.5" />
          </svg>
          <div className="lidar-beam" />
        </div>
      </div>

      {/* Dark overlay + content */}
      <div className="relative z-30 flex h-full w-full flex-col items-center justify-center bg-black/40 px-4 text-center text-white">
        <h1 className="hero-title mb-4 text-5xl font-bold tracking-tight md:text-7xl">
          3D-ULPIN
        </h1>
        <p className="hero-subtitle mb-8 max-w-2xl text-lg text-gray-200 md:text-xl">
          Unique Land Parcel Identification Number — Smart Urban Planning with 3D Visualization
        </p>

        {/* Step 1: Continue button */}
        {!showOptions && (
          <div className="hero-buttons">
            <button
              onClick={() => setShowOptions(true)}
              className="rounded-lg bg-blue-600 px-10 py-3 text-lg font-semibold transition hover:bg-blue-700 hover:scale-105 active:scale-95"
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Login options */}
        {showOptions && (
          <div className="options-panel flex flex-col items-center gap-6">
            <p className="text-lg text-gray-300">Choose how to continue</p>

            <a
              href="/login"
              className="min-w-[260px] rounded-xl bg-blue-600 px-8 py-4 text-center text-lg font-semibold transition hover:bg-blue-700 hover:scale-105 active:scale-95"
            >
              🔑 User Login
            </a>

            <div className="flex items-center gap-3">
              <span className="h-px w-16 bg-gray-500" />
              <span className="text-sm text-gray-400">or</span>
              <span className="h-px w-16 bg-gray-500" />
            </div>

            <a
              href="/admin/login"
              className="min-w-[260px] rounded-xl bg-emerald-600 px-8 py-4 text-center text-lg font-semibold transition hover:bg-emerald-700 hover:scale-105 active:scale-95"
            >
              🛡️ Admin Login
            </a>

            <button
              onClick={() => setShowOptions(false)}
              className="mt-2 text-sm text-gray-400 underline transition hover:text-white"
            >
              ← Back
            </button>
          </div>
        )}
      </div>

      <style>{`
        /* ── 3D Scan Dots ── */
        .scan-dot {
          position: absolute;
          top: -10px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #3b82f6;
          box-shadow: 0 0 6px 2px rgba(59,130,246,0.6);
          animation: fall linear infinite;
          opacity: 0;
        }

        @keyframes fall {
          0%   { transform: translateY(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(100vh); opacity: 0; }
        }

        /* ── Horizontal scan line ── */
        .scan-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #3b82f6, transparent);
          box-shadow: 0 0 15px 3px rgba(59,130,246,0.4);
          animation: scanDown 4s ease-in-out infinite;
        }

        @keyframes scanDown {
          0%   { top: 0; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        /* ── Drone flight ── */
        .drone {
          position: absolute;
          top: 12%;
          animation: droneFly 10s ease-in-out infinite;
        }

        @keyframes droneFly {
          0%   { left: -100px; top: 12%; }
          25%  { left: 30%;    top: 8%;  }
          50%  { left: 55%;    top: 15%; }
          75%  { left: 75%;    top: 10%; }
          100% { left: 110%;   top: 12%; }
        }

        /* ── Rotor spin ── */
        .rotor {
          animation: spin 0.15s linear infinite;
          transform-origin: center;
        }
        .rotor-rear {
          animation-direction: reverse;
        }

        @keyframes spin {
          0%   { opacity: 0.2; }
          50%  { opacity: 0.5; }
          100% { opacity: 0.2; }
        }

        /* ── Drone camera light blink ── */
        .drone-light {
          animation: blink 1s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.3; }
        }

        /* ── LiDAR beam ── */
        .lidar-beam {
          position: absolute;
          top: 32px;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 60px;
          background: linear-gradient(to bottom, #3b82f6, transparent);
          opacity: 0.7;
          animation: lidarPulse 1.5s ease-in-out infinite;
        }

        @keyframes lidarPulse {
          0%, 100% { height: 40px; opacity: 0.5; }
          50%      { height: 80px; opacity: 0.9; }
        }

        /* ── Hero content fade-in ── */
        .hero-title {
          animation: fadeUp 1s ease-out both;
        }
        .hero-subtitle {
          animation: fadeUp 1s ease-out 0.3s both;
        }
        .hero-buttons {
          animation: fadeUp 1s ease-out 0.6s both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Options panel slide-in ── */
        .options-panel {
          animation: slideUp 0.5s ease-out both;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}

export default Home