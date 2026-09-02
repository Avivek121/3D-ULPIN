import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProperties } from '../../utils/propertyStore'

const ArVrView = () => {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [selectedProp, setSelectedProp] = useState(null)
  const [activeMode, setActiveMode] = useState('3d')

  useEffect(() => {
    const list = getProperties()
    setProperties(list)
    if (list.length > 0) {
      setSelectedProp(list[0])
    }
  }, [])

  const viewModes = [
    { id: '3d', label: '3D Mesh Model', icon: '🧊' },
    { id: 'ar', label: 'WebXR AR View', icon: '📱' },
    { id: 'vr', label: 'Immersive VR', icon: '🥽' },
    { id: 'walkthrough', label: 'Virtual Walkthrough', icon: '🚶' },
  ]

  if (properties.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
          🥽
        </div>
        <h2 className="text-2xl font-bold text-gray-900">No AR/VR Digital Twin Available</h2>
        <p className="mt-2 max-w-md text-sm text-gray-500">
          AR and VR inspection requires a registered cadastral parcel. Register a property in ULPIN Search to generate a 3D digital twin.
        </p>
        <button
          onClick={() => navigate('/dashboard/search')}
          className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-blue-700 transition active:scale-95"
        >
          ➕ Register a Property
        </button>
      </div>
    )
  }

  const activeParcel = selectedProp || properties[0]

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      {/* Page Title */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">AR / VR Digital Twin Inspector</h1>
          <p className="mt-1 text-sm text-gray-500">
            Spatial immersion for <strong className="font-mono text-blue-600">{activeParcel.ulpin}</strong> ({activeParcel.address})
          </p>
        </div>

        {properties.length > 1 && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-500 uppercase">Select Parcel:</label>
            <select
              value={activeParcel.ulpin}
              onChange={(e) => setSelectedProp(properties.find((p) => p.ulpin === e.target.value))}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 outline-none focus:border-blue-500"
            >
              {properties.map((p) => (
                <option key={p.ulpin} value={p.ulpin}>
                  {p.ulpin} ({p.owner})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Mode Selector */}
      <div className="mb-6 flex flex-wrap gap-2 sm:gap-3">
        {viewModes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setActiveMode(mode.id)}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition ${
              activeMode === mode.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>{mode.icon}</span>
            {mode.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 3D Viewport Area */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="relative h-[480px] bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 flex flex-col items-center justify-center p-6 text-center">
              {/* Cadastral Grid */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(59,130,246,0.3) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* 3D Cube Hologram */}
              <div className="relative mb-6">
                <div className="flex h-28 w-28 items-center justify-center rounded-3xl border-2 border-blue-400/40 bg-blue-500/10 shadow-[0_0_50px_rgba(59,130,246,0.3)] backdrop-blur-md animate-pulse">
                  <span className="text-5xl">🏢</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white">
                {activeMode === 'ar' ? 'WebXR AR Session Ready' : activeMode === 'vr' ? 'VR Headset Stream Ready' : '3D Digital Twin Loaded'}
              </h3>
              <p className="mt-1 max-w-sm text-xs text-gray-400">
                Property: {activeParcel.ulpin} | Owner: {activeParcel.owner}
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => alert(`Launching ${activeMode.toUpperCase()} for ${activeParcel.ulpin}`)}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:from-blue-700 hover:to-cyan-700 transition active:scale-95"
                >
                  🚀 Launch {activeMode.toUpperCase()} View
                </button>
              </div>

              <div className="absolute bottom-4 left-4 rounded-xl border border-white/10 bg-black/50 px-3 py-1.5 text-[10px] text-gray-300 font-mono backdrop-blur-md">
                Renderer: ThreeJS WebGL 2.0 | FPS: 60
              </div>
            </div>
          </div>
        </div>

        {/* Parcel Cadastral Specs */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              Digital Twin Metadata
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-400">ULPIN ID:</span>
                <span className="font-mono font-bold text-blue-600">{activeParcel.ulpin}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-400">Title Owner:</span>
                <span className="font-semibold text-gray-800">{activeParcel.owner}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-400">Land Category:</span>
                <span className="font-semibold text-gray-800">{activeParcel.type}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-400">Survey Plot:</span>
                <span className="font-semibold text-gray-800">{activeParcel.surveyNo || 'CTS Survey'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-400">Area:</span>
                <span className="font-semibold text-gray-800">{activeParcel.area || 'Verified Area'}</span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/dashboard/details?ulpin=${encodeURIComponent(activeParcel.ulpin)}`)}
              className="mt-6 w-full rounded-xl border border-gray-200 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              View Full Cadastral Details →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArVrView
