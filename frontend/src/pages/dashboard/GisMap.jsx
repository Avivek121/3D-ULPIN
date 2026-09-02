import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProperties } from '../../utils/propertyStore'

const GisMap = () => {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [selectedParcel, setSelectedParcel] = useState(null)
  const [layers, setLayers] = useState({
    buildings: true,
    parcels: true,
    roads: false,
    terrain: true,
    satellite: false,
    zoning: true,
  })

  useEffect(() => {
    const list = getProperties()
    setProperties(list)
    if (list.length > 0) {
      setSelectedParcel(list[0])
    }
  }, [])

  const toggleLayer = (key) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const layerIcons = {
    buildings: '🏢',
    parcels: '📐',
    roads: '🛣️',
    terrain: '⛰️',
    satellite: '🛰️',
    zoning: '🗺️',
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col lg:flex-row overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      {/* Map Interactive Area */}
      <div className="relative flex-1 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 overflow-hidden">
        {/* Animated Cadastral Grid */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(59,130,246,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Floating Top Header */}
        <div className="absolute top-4 left-4 z-10">
          <div className="rounded-2xl border border-white/10 bg-gray-900/80 px-4 py-2.5 backdrop-blur-xl shadow-lg">
            <h1 className="flex items-center gap-2 text-sm font-bold text-white">
              <span className="text-blue-400">🗺️</span> 3D GIS Cadastral Viewer
            </h1>
          </div>
        </div>

        {/* Center: Real Registered Properties or Empty State */}
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center p-6 text-center">
          {properties.length === 0 ? (
            <div className="max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-white backdrop-blur-xl">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20 text-3xl">
                📍
              </div>
              <h2 className="text-lg font-bold">No Registered Parcels on Map</h2>
              <p className="mt-2 text-xs text-gray-400">
                You have not registered any properties yet. Once registered, parcels will be georeferenced and projected in 3D GIS coordinates here.
              </p>
              <button
                onClick={() => navigate('/dashboard/search')}
                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg hover:bg-blue-700 transition active:scale-95"
              >
                ➕ Register Land Parcel
              </button>
            </div>
          ) : (
            <div className="w-full max-w-2xl space-y-4">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-6 text-left text-white backdrop-blur-xl shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                      Selected 3D Parcel
                    </span>
                    <h2 className="text-xl font-bold font-mono text-white">
                      {selectedParcel?.ulpin || properties[0].ulpin}
                    </h2>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                    {selectedParcel?.status || 'Active'}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400">Owner:</span>
                    <p className="font-semibold text-gray-200">{selectedParcel?.owner || properties[0].owner}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Address:</span>
                    <p className="font-semibold text-gray-200 truncate">{selectedParcel?.address || properties[0].address}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Survey No:</span>
                    <p className="font-semibold text-gray-200">{selectedParcel?.surveyNo || 'CTS Survey'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Recorded Area:</span>
                    <p className="font-semibold text-gray-200">{selectedParcel?.area || 'Standard'}</p>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => navigate(`/dashboard/details?ulpin=${encodeURIComponent(selectedParcel?.ulpin || properties[0].ulpin)}`)}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
                  >
                    View Cadastral Record →
                  </button>
                </div>
              </div>

              {/* Parcel selector chips */}
              {properties.length > 1 && (
                <div className="flex flex-wrap justify-center gap-2">
                  {properties.map((p) => (
                    <button
                      key={p.ulpin}
                      onClick={() => setSelectedParcel(p)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-mono font-medium transition ${
                        (selectedParcel?.ulpin || properties[0].ulpin) === p.ulpin
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      📍 {p.ulpin}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Coordinates Bar */}
        <div className="absolute bottom-4 left-4 rounded-xl border border-white/10 bg-black/60 px-4 py-2 text-[11px] text-gray-300 font-mono backdrop-blur-md">
          CRS: EPSG:4326 | WGS84 3D | Mesh: Ready
        </div>
      </div>

      {/* Layer Controls Side Panel */}
      <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-gray-100 bg-white p-5 overflow-y-auto">
        <h2 className="mb-4 text-sm font-bold text-gray-900 uppercase tracking-wider">
          GIS Layers
        </h2>

        <div className="space-y-2.5">
          {Object.entries(layers).map(([key, enabled]) => (
            <label
              key={key}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-2.5 transition text-xs font-semibold ${
                enabled ? 'border-blue-200 bg-blue-50/50 text-blue-900' : 'border-gray-100 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={enabled}
                onChange={() => toggleLayer(key)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-base">{layerIcons[key]}</span>
              <span className="capitalize">{key}</span>
            </label>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="mb-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
            Registered Parcels ({properties.length})
          </h3>
          {properties.length === 0 ? (
            <p className="text-xs text-gray-400">None registered yet.</p>
          ) : (
            <div className="space-y-2 max-h-44 overflow-y-auto">
              {properties.map((p) => (
                <div
                  key={p.ulpin}
                  onClick={() => setSelectedParcel(p)}
                  className="cursor-pointer rounded-lg border border-gray-100 p-2 text-xs hover:border-blue-300 hover:bg-blue-50/30 transition"
                >
                  <p className="font-mono font-bold text-blue-600">{p.ulpin}</p>
                  <p className="text-gray-500 truncate">{p.owner}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GisMap
