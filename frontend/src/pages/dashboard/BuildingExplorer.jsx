import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProperties } from '../../utils/propertyStore'
import bgBlueprint from '../../assets/bg-blueprint.png'

const BuildingExplorer = () => {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [selectedProp, setSelectedProp] = useState(null)
  const [selectedFloor, setSelectedFloor] = useState(3)

  useEffect(() => {
    const list = getProperties()
    setProperties(list)
    if (list.length > 0) {
      setSelectedProp(list[0])
    }
  }, [])

  const floors = [
    { number: 5, label: 'Floor 5', units: 2, color: 'bg-blue-400' },
    { number: 4, label: 'Floor 4', units: 4, color: 'bg-emerald-400' },
    { number: 3, label: 'Floor 3', units: 4, color: 'bg-emerald-400' },
    { number: 2, label: 'Floor 2', units: 4, color: 'bg-emerald-400' },
    { number: 1, label: 'Floor 1', units: 4, color: 'bg-amber-400' },
    { number: 0, label: 'Ground Floor', units: 2, color: 'bg-orange-400' },
  ]

  const selectedFloorData = floors.find((f) => f.number === selectedFloor)

  if (properties.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
          🏢
        </div>
        <h2 className="text-2xl font-bold text-gray-900">No Building Records Available</h2>
        <p className="mt-2 max-w-md text-sm text-gray-500">
          Vertical building inspection requires at least one registered property. Register a parcel to inspect vertical space divisions and 3D floor units.
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

  const activeBuilding = selectedProp || properties[0]

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      {/* Title */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Vertical Building Explorer</h1>
          <p className="mt-1 text-sm text-gray-500">
            3D floor-by-floor vertical parcel breakdown and unit ownership rights
          </p>
        </div>

        {properties.length > 1 && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-500 uppercase">Select Building:</label>
            <select
              value={activeBuilding.ulpin}
              onChange={(e) => setSelectedProp(properties.find((p) => p.ulpin === e.target.value))}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 outline-none focus:border-blue-500"
            >
              {properties.map((p) => (
                <option key={p.ulpin} value={p.ulpin}>
                  {p.ulpin} - {p.address}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Building Header Card with Blueprint Background */}
      <div
        className="relative mb-8 overflow-hidden rounded-3xl bg-cover bg-center p-6 sm:p-8 text-white shadow-xl"
        style={{ backgroundImage: `url(${bgBlueprint})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-slate-900/85 to-indigo-900/90 backdrop-blur-[1px]" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="rounded-lg bg-white/20 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider">
              {activeBuilding.ulpin}
            </span>
            <h2 className="mt-2 text-xl sm:text-2xl font-bold">{activeBuilding.address}</h2>
            <p className="text-sm text-blue-100 mt-1">Title Holder: {activeBuilding.owner}</p>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-2xl font-bold">5</p>
              <p className="text-xs text-blue-200">Stories</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{activeBuilding.area || 'Recorded'}</p>
              <p className="text-xs text-blue-200">Parcel Area</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Floor Selection */}
        <div className="lg:col-span-4">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
              Vertical Cross-Section
            </h3>
            <div className="space-y-2">
              {floors.map((floor) => (
                <button
                  key={floor.number}
                  onClick={() => setSelectedFloor(floor.number)}
                  className={`flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition ${
                    selectedFloor === floor.number
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                      : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className={`h-3 w-3 rounded-full ${floor.color}`} />
                    {floor.label}
                  </span>
                  <span className="text-xs text-gray-400">{floor.units} Units</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Floor Units Breakdown */}
        <div className="lg:col-span-8">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedFloorData?.label} Units</h3>
                <p className="text-xs text-gray-500">
                  Sub-divided 3D volumetric rights linked to {activeBuilding.ulpin}
                </p>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                {selectedFloorData?.units} Registered Units
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[...Array(selectedFloorData?.units || 2)].map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-gray-100 p-4 bg-gray-50/50 hover:bg-white hover:border-blue-200 transition shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-600">
                      Unit {selectedFloor}0{idx + 1}
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      Registered
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {idx === 0 ? activeBuilding.owner : `Co-Owner Unit ${idx + 1}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Type: {activeBuilding.type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuildingExplorer
