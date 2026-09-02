import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHistoryEvents, getProperties } from '../../utils/propertyStore'

const RegistryHistory = () => {
  const navigate = useNavigate()
  const [historyEvents, setHistoryEvents] = useState([])
  const [viewMode, setViewMode] = useState('timeline')

  useEffect(() => {
    // Load real history events
    const events = getHistoryEvents()
    // If no explicit events but properties exist, synthesize history from user's registered properties
    if (events.length === 0) {
      const props = getProperties()
      const generated = props.map((p) => ({
        id: p.id || p.ulpin,
        ulpin: p.ulpin,
        type: 'Registration',
        description: `Property registered under ${p.owner}`,
        registrationNo: `REG/${p.ulpin}/${new Date().getFullYear()}`,
        date: p.createdAt
          ? new Date(p.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          : 'Recent',
        authority: 'Sub-Registrar Office',
        status: p.status || 'Completed',
      }))
      setHistoryEvents(generated)
    } else {
      setHistoryEvents(events)
    }
  }, [])

  if (historyEvents.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
          📜
        </div>
        <h2 className="text-2xl font-bold text-gray-900">No Registry History Records</h2>
        <p className="mt-2 max-w-md text-sm text-gray-500">
          No transactions, deeds, or mutations have been recorded yet. Register your properties in ULPIN Search to generate historical audit trails.
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

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      {/* Page Title & View Toggle */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Registry History & Ledger</h1>
          <p className="mt-1 text-sm text-gray-500">
            Official immutable timeline of deed registrations and ownership transfers
          </p>
        </div>

        <div className="flex items-center rounded-xl bg-white p-1 shadow-sm border border-gray-100">
          <button
            onClick={() => setViewMode('timeline')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
              viewMode === 'timeline' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
              viewMode === 'table' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Ledger Table
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'timeline' ? (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
          <div className="relative pl-6 sm:pl-8 border-l-2 border-blue-100 space-y-8">
            {historyEvents.map((evt) => (
              <div key={evt.id} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 ring-4 ring-blue-50" />

                <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 transition hover:border-blue-200 hover:bg-white hover:shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                      {evt.ulpin || 'REGISTRY'}
                    </span>
                    <span className="text-xs font-medium text-gray-400">{evt.date}</span>
                  </div>

                  <h3 className="mt-2 text-base font-bold text-gray-900">{evt.type}</h3>
                  <p className="mt-1 text-sm text-gray-600">{evt.description}</p>

                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500 pt-3 border-t border-gray-200/60">
                    <span>
                      Reg No: <strong className="text-gray-700">{evt.registrationNo}</strong>
                    </span>
                    <span>
                      Authority: <strong className="text-gray-700">{evt.authority}</strong>
                    </span>
                    <span className="ml-auto font-semibold text-emerald-600">
                      ✓ {evt.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">ULPIN</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Registration No</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {historyEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-gray-50/80 transition">
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">{evt.date}</td>
                    <td className="whitespace-nowrap px-6 py-4 font-mono text-xs font-bold text-blue-600">
                      {evt.ulpin}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">{evt.type}</td>
                    <td className="px-6 py-4 text-gray-600">{evt.description}</td>
                    <td className="whitespace-nowrap px-6 py-4 font-mono text-xs text-gray-500">
                      {evt.registrationNo}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        {evt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default RegistryHistory
