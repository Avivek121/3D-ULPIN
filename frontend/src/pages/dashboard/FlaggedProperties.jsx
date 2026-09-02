import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProperties, saveProperty } from '../../utils/propertyStore'

const FlaggedProperties = () => {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])

  useEffect(() => {
    setProperties(getProperties())
  }, [])

  const flaggedList = properties.filter((p) => p.status === 'Flagged')

  const handleResolveFlag = (ulpin) => {
    const target = properties.find((p) => p.ulpin === ulpin)
    if (target) {
      const updated = saveProperty({ ...target, status: 'Registered' })
      setProperties(updated)
    }
  }

  const handleFlagProperty = (ulpin) => {
    const target = properties.find((p) => p.ulpin === ulpin)
    if (target) {
      const updated = saveProperty({ ...target, status: 'Flagged' })
      setProperties(updated)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      {/* Title */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Flagged & Disputed Properties</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor and resolve encroachment flags, boundary disputes, and unregistered land parcels
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard/search')}
          className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition"
        >
          View All Parcels
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white p-8 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-2xl text-rose-600">
            🚩
          </div>
          <h3 className="text-base font-bold text-gray-900">No Properties Registered Yet</h3>
          <p className="mt-1 max-w-sm text-sm text-gray-500">
            Only real registered parcels entered by you will be monitored for regulatory flags.
          </p>
          <button
            onClick={() => navigate('/dashboard/search')}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Register a Property
          </button>
        </div>
      ) : flaggedList.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-sm">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600">
            ✅
          </div>
          <h3 className="text-base font-bold text-gray-900">All Registered Properties Are Clear</h3>
          <p className="mt-1 max-w-md text-sm text-gray-500">
            None of your {properties.length} registered parcel(s) are currently flagged or under boundary dispute.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {properties.map((p) => (
              <button
                key={p.ulpin}
                onClick={() => handleFlagProperty(p.ulpin)}
                className="rounded-xl border border-rose-200 bg-rose-50/50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
              >
                Flag {p.ulpin} for Review
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {flaggedList.map((item) => (
            <div
              key={item.ulpin}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-rose-100 bg-white p-6 shadow-sm"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-rose-600">{item.ulpin}</span>
                  <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                    Flagged
                  </span>
                </div>
                <h3 className="mt-1 text-base font-bold text-gray-900">{item.address}</h3>
                <p className="text-xs text-gray-500">Owner: {item.owner}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleResolveFlag(item.ulpin)}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
                >
                  ✓ Mark Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FlaggedProperties
