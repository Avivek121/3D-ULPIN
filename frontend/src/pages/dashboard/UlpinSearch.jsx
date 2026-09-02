import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getProperties,
  saveProperty,
  deleteProperty,
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
} from '../../utils/propertyStore'

const UlpinSearch = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [properties, setProperties] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [showModal, setShowModal] = useState(false)

  // New property registration form state
  const [formData, setFormData] = useState({
    ulpin: '',
    owner: '',
    address: '',
    type: 'Residential',
    area: '',
    surveyNo: '',
    district: '',
    status: 'Registered',
  })

  // Load properties and recent searches from store
  useEffect(() => {
    setProperties(getProperties())
    setRecentSearches(getRecentSearches())
  }, [])

  const handleSearchSubmit = (e) => {
    e?.preventDefault()
    if (query.trim()) {
      const updatedSearches = addRecentSearch(query.trim())
      setRecentSearches(updatedSearches)
    }
  }

  const handleSelectRecent = (term) => {
    setQuery(term)
    addRecentSearch(term)
  }

  const handleClearSearches = () => {
    clearRecentSearches()
    setRecentSearches([])
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    if (!formData.ulpin.trim() || !formData.owner.trim() || !formData.address.trim()) {
      alert('Please fill in ULPIN, Owner Name, and Address.')
      return
    }

    const updated = saveProperty(formData)
    setProperties(updated)
    setShowModal(false)

    // Reset form
    setFormData({
      ulpin: '',
      owner: '',
      address: '',
      type: 'Residential',
      area: '',
      surveyNo: '',
      district: '',
      status: 'Registered',
    })
  }

  const handleAutoGenerateUlpin = () => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000)
    setFormData((prev) => ({
      ...prev,
      ulpin: `ULPIN-MH-${new Date().getFullYear()}-${randomSuffix}`,
    }))
  }

  const handleDelete = (ulpin, e) => {
    e.stopPropagation()
    if (window.confirm(`Are you sure you want to remove property with ULPIN: ${ulpin}?`)) {
      const updated = deleteProperty(ulpin)
      setProperties(updated)
    }
  }

  // Filter properties by search query
  const filteredResults = properties.filter((p) => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (
      p.ulpin?.toLowerCase().includes(q) ||
      p.owner?.toLowerCase().includes(q) ||
      p.address?.toLowerCase().includes(q) ||
      p.surveyNo?.toLowerCase().includes(q)
    )
  })

  const registeredCount = properties.filter((p) => p.status === 'Registered').length
  const pendingCount = properties.filter((p) => p.status === 'Pending').length

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      {/* Header with Title and Register Button */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">ULPIN Search & Registry</h1>
          <p className="mt-1 text-sm text-gray-500">
            Search only registered properties or enter new land parcels into the system
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-3 font-semibold text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:from-blue-700 hover:to-cyan-700 hover:shadow-lg active:scale-95"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Register New Property
        </button>
      </div>

      {/* Search Bar */}
      <div className="mx-auto mb-8 max-w-3xl">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by ULPIN, Owner name, Address, or Survey no..."
            className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-14 pr-32 text-base sm:text-lg shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-24 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              ✕
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700 active:scale-95"
          >
            Search
          </button>
        </form>
      </div>

      {/* Real Stats Row (No random mock numbers) */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl text-blue-600">
            🏠
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Total Registered</p>
            <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl text-emerald-600">
            ✅
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Active / Validated</p>
            <p className="text-2xl font-bold text-gray-900">{registeredCount}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-2xl text-amber-600">
            ⏳
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Pending Review</p>
            <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: Recent Searches */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent Searches
              </h2>
              {recentSearches.length > 0 && (
                <button
                  onClick={handleClearSearches}
                  className="text-xs text-gray-400 hover:text-red-500 transition"
                >
                  Clear
                </button>
              )}
            </div>

            {recentSearches.length === 0 ? (
              <p className="py-6 text-center text-xs text-gray-400">
                No recent searches. Search queries you enter will appear here.
              </p>
            ) : (
              <ul className="space-y-2">
                {recentSearches.map((term, i) => (
                  <li
                    key={i}
                    onClick={() => handleSelectRecent(term)}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 p-3 transition hover:border-blue-200 hover:bg-blue-50/50"
                  >
                    <span className="text-sm font-medium text-blue-600 truncate">{term}</span>
                    <span className="text-xs text-gray-400">Search →</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right: Search / Registered Results */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {query ? 'Matching Properties' : 'Registered Land Parcels'}
              </h2>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                {filteredResults.length} parcel{filteredResults.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Empty state when NO properties registered yet */}
            {properties.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-12 px-4 text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl">
                  📍
                </div>
                <h3 className="text-base font-semibold text-gray-900">No properties registered yet</h3>
                <p className="mt-1 max-w-sm text-sm text-gray-500">
                  Only properties you register or enter will appear here. No random data is generated.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                >
                  ➕ Register Your First Property
                </button>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <p className="text-base font-medium">No registered properties match "{query}"</p>
                <p className="mt-1 text-sm text-gray-400">
                  Make sure you have registered this ULPIN or owner name.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="mt-4 text-sm font-semibold text-blue-600 hover:underline"
                >
                  Register this property now →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredResults.map((result) => (
                  <div
                    key={result.ulpin}
                    onClick={() => navigate(`/dashboard/details?ulpin=${encodeURIComponent(result.ulpin)}`)}
                    className="group cursor-pointer rounded-2xl border border-gray-100 p-5 transition-all duration-200 hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/5 bg-white"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-base font-bold text-blue-600 group-hover:text-blue-700">
                          {result.ulpin}
                        </span>
                        <p className="mt-1 text-sm text-gray-600">{result.address}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            result.status === 'Registered'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {result.status}
                        </span>
                        <button
                          onClick={(e) => handleDelete(result.ulpin, e)}
                          title="Delete Property"
                          className="rounded-lg p-1 text-gray-300 hover:bg-red-50 hover:text-red-500 transition"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500">
                      <span className="flex items-center gap-1.5 font-medium text-gray-700">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {result.owner}
                      </span>
                      {result.area && (
                        <span className="flex items-center gap-1.5">
                          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                          {result.area}
                        </span>
                      )}
                      {result.surveyNo && (
                        <span className="text-gray-400">
                          Survey: <strong className="text-gray-600">{result.surveyNo}</strong>
                        </span>
                      )}
                      <span className="rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                        {result.type}
                      </span>

                      <span className="ml-auto font-medium text-blue-600 hover:text-blue-700">
                        View Details →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modal for registering a real property ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Register New Property</h2>
                <p className="text-xs text-gray-500">
                  Enter real property details to be recorded in the ULPIN registry
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                    ULPIN Number *
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoGenerateUlpin}
                    className="text-xs font-medium text-blue-600 hover:underline"
                  >
                    Generate ULPIN
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={formData.ulpin}
                  onChange={(e) => setFormData({ ...formData, ulpin: e.target.value })}
                  placeholder="e.g. ULPIN-MH-2026-00123"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-mono text-gray-900 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    placeholder="Full owner name"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Property Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:bg-white"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Agricultural">Agricultural</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Property Address / Landmark *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Flat 402, Sunshine Heights, Andheri East, Mumbai"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Area
                  </label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="e.g. 1,200 sq ft"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Survey / Plot No.
                  </label>
                  <input
                    type="text"
                    value={formData.surveyNo}
                    onChange={(e) => setFormData({ ...formData, surveyNo: e.target.value })}
                    placeholder="e.g. Survey 45/A"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:bg-white"
                  >
                    <option value="Registered">Registered</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700"
                >
                  Save & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UlpinSearch
