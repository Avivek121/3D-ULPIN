import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { getProperties } from '../../utils/propertyStore'

const UlpinDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [selectedUlpin, setSelectedUlpin] = useState('')

  useEffect(() => {
    const list = getProperties()
    setProperties(list)

    const paramUlpin = searchParams.get('ulpin')
    if (paramUlpin && list.some((p) => p.ulpin === paramUlpin)) {
      setSelectedUlpin(paramUlpin)
    } else if (list.length > 0) {
      setSelectedUlpin(list[0].ulpin)
    }
  }, [searchParams])

  const property = properties.find((p) => p.ulpin === selectedUlpin)

  const handleSelectProperty = (ulpin) => {
    setSelectedUlpin(ulpin)
    setSearchParams({ ulpin })
  }

  if (properties.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
          📋
        </div>
        <h2 className="text-2xl font-bold text-gray-900">No Property Details Available</h2>
        <p className="mt-2 max-w-md text-sm text-gray-500">
          You haven't registered any property yet. Once you register or enter a land parcel, its complete details, cadastral dimensions, and ownership records will appear here.
        </p>
        <button
          onClick={() => navigate('/dashboard/search')}
          className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-blue-700 transition active:scale-95"
        >
          ➕ Go to Register Property
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      {/* Property Selector & Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">ULPIN Property Details</h1>
          <p className="mt-1 text-sm text-gray-500">
            Official cadastral registry records and ownership verification
          </p>
        </div>

        {properties.length > 1 && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-500 uppercase">Select Parcel:</label>
            <select
              value={selectedUlpin}
              onChange={(e) => handleSelectProperty(e.target.value)}
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

      {property && (
        <div className="space-y-6">
          {/* Main Parcel Overview Card */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="inline-block rounded-lg bg-blue-50 px-3 py-1 font-mono text-sm font-bold text-blue-700">
                  {property.ulpin}
                </span>
                <h2 className="mt-2 text-xl sm:text-2xl font-bold text-gray-900">{property.address}</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Registered under:{' '}
                  <strong className="text-gray-800">{property.owner}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${
                    property.status === 'Registered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {property.status}
                </span>
                <button
                  onClick={() => navigate('/dashboard/search')}
                  className="rounded-xl border border-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
                >
                  + Register Another
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Info Cards Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Owner Details */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                👤
              </div>
              <h3 className="font-semibold text-gray-900">Owner Information</h3>
              <div className="mt-3 space-y-2 text-sm">
                <div>
                  <span className="text-xs text-gray-400">Full Name</span>
                  <p className="font-medium text-gray-800">{property.owner}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Ownership Type</span>
                  <p className="font-medium text-gray-800">Primary Title Holder</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Verification</span>
                  <p className="font-medium text-emerald-600">Digital KYC Verified</p>
                </div>
              </div>
            </div>

            {/* Land & Area */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                📐
              </div>
              <h3 className="font-semibold text-gray-900">Area & Land Use</h3>
              <div className="mt-3 space-y-2 text-sm">
                <div>
                  <span className="text-xs text-gray-400">Recorded Area</span>
                  <p className="font-medium text-gray-800">{property.area || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Classification</span>
                  <p className="font-medium text-gray-800">{property.type}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Permitted Use</span>
                  <p className="font-medium text-gray-800">{property.type} Zone</p>
                </div>
              </div>
            </div>

            {/* Location & Cadastral */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                📍
              </div>
              <h3 className="font-semibold text-gray-900">Cadastral Location</h3>
              <div className="mt-3 space-y-2 text-sm">
                <div>
                  <span className="text-xs text-gray-400">Survey / Plot No</span>
                  <p className="font-medium text-gray-800">{property.surveyNo || 'CTS Survey'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Address</span>
                  <p className="font-medium text-gray-800 truncate" title={property.address}>
                    {property.address}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Georeference</span>
                  <p className="font-mono text-xs font-semibold text-violet-600">WGS84 3D Indexed</p>
                </div>
              </div>
            </div>

            {/* Registry Info */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                📜
              </div>
              <h3 className="font-semibold text-gray-900">Registration Status</h3>
              <div className="mt-3 space-y-2 text-sm">
                <div>
                  <span className="text-xs text-gray-400">Current Status</span>
                  <p className="font-medium text-emerald-600">{property.status}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Registered Date</span>
                  <p className="font-medium text-gray-800">
                    {property.createdAt
                      ? new Date(property.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'Recently Added'}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Authority</span>
                  <p className="font-medium text-gray-800">Department of Land Resources</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UlpinDetails
