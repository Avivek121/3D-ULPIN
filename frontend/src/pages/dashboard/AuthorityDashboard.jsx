import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProperties, getHistoryEvents } from '../../utils/propertyStore'

const AuthorityDashboard = () => {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [history, setHistory] = useState([])

  useEffect(() => {
    setProperties(getProperties())
    setHistory(getHistoryEvents())
  }, [])

  const totalProps = properties.length
  const registeredCount = properties.filter((p) => p.status === 'Registered').length
  const flaggedCount = properties.filter((p) => p.status === 'Flagged').length
  const pendingCount = properties.filter((p) => p.status === 'Pending').length

  const stats = [
    {
      label: 'Total Registered Properties',
      value: totalProps,
      icon: '🏘️',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      label: 'Active / Validated',
      value: registeredCount,
      icon: '✅',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      label: 'Flagged / Disputed',
      value: flaggedCount,
      icon: '🚩',
      color: 'from-rose-500 to-red-600',
    },
    {
      label: 'Pending Validation',
      value: pendingCount,
      icon: '⏳',
      color: 'from-amber-500 to-orange-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      {/* Title */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Authority Control Center</h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time cadastral metrics based on your registered registry records
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard/search')}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 transition"
        >
          ➕ Register New Parcel
        </button>
      </div>

      {/* Real Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {item.label}
              </span>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-lg text-white shadow-sm`}>
                {item.icon}
              </div>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Real Registered Parcels List */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="mb-4 flex items-center justify-between text-base font-bold text-gray-900">
              <span>Managed Properties</span>
              <span className="text-xs font-normal text-gray-400">
                {totalProps} total recorded
              </span>
            </h2>

            {totalProps === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm font-medium text-gray-700">No properties in system yet</p>
                <p className="mt-1 text-xs text-gray-400 max-w-sm">
                  Register land parcels to monitor authority verification, cadastral maps, and mutation ledgers.
                </p>
                <button
                  onClick={() => navigate('/dashboard/search')}
                  className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Register Land Parcel
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {properties.map((p) => (
                  <div key={p.ulpin} className="flex flex-wrap items-center justify-between gap-4 py-4">
                    <div>
                      <p className="font-mono text-sm font-bold text-emerald-600">{p.ulpin}</p>
                      <p className="text-xs text-gray-500">{p.address}</p>
                      <p className="text-xs text-gray-400">Owner: {p.owner}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        p.status === 'Registered'
                          ? 'bg-emerald-50 text-emerald-700'
                          : p.status === 'Flagged'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Real Activity Stream */}
        <div className="lg:col-span-1">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-gray-900">Registry Activity Log</h2>

            {history.length === 0 ? (
              <p className="py-8 text-center text-xs text-gray-400">
                No activity logged yet. Registering a parcel logs real-time entries here.
              </p>
            ) : (
              <div className="space-y-4">
                {history.slice(0, 6).map((item) => (
                  <div key={item.id} className="flex items-start gap-3 rounded-xl border border-gray-50 p-3 bg-gray-50/50">
                    <span className="text-base">📝</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-gray-900 truncate">{item.type}</p>
                      <p className="text-xs text-gray-500 truncate">{item.description}</p>
                      <p className="mt-1 font-mono text-[10px] text-gray-400">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthorityDashboard
