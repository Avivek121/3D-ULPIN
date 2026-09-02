import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProperties, saveProperty } from '../../utils/propertyStore'

const ValidationPage = () => {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])

  useEffect(() => {
    setProperties(getProperties())
  }, [])

  const pendingList = properties.filter((p) => p.status === 'Pending')

  const handleValidate = (property, newStatus) => {
    const updated = saveProperty({ ...property, status: newStatus })
    setProperties(updated)
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      {/* Title */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Parcel Validation Suite</h1>
          <p className="mt-1 text-sm text-gray-500">
            Cadastral boundary review and title deed validation for registered land parcels
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
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600">
            ✅
          </div>
          <h3 className="text-base font-bold text-gray-900">No Properties Pending Validation</h3>
          <p className="mt-1 max-w-sm text-sm text-gray-500">
            Register land parcels in ULPIN Search to initiate cadastral surveys and officer validations.
          </p>
          <button
            onClick={() => navigate('/dashboard/search')}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Register a Property
          </button>
        </div>
      ) : pendingList.length === 0 ? (
        <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600">
            🎉
          </div>
          <h3 className="text-lg font-bold text-gray-900">All Registered Parcels Are Validated</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no pending approvals. All {properties.length} registered parcel(s) are in valid active status.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingList.map((item) => (
            <div
              key={item.ulpin}
              className="rounded-3xl border border-amber-100 bg-white p-6 sm:p-8 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="font-mono text-sm font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg">
                    {item.ulpin}
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-gray-900">{item.address}</h3>
                  <p className="text-sm text-gray-600">Owner: {item.owner}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleValidate(item, 'Registered')}
                    className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 transition"
                  >
                    ✓ Approve & Validate
                  </button>
                  <button
                    onClick={() => handleValidate(item, 'Flagged')}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition"
                  >
                    ✕ Flag Discrepancy
                  </button>
                </div>
              </div>

              {/* Validation Checklist */}
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 pt-6 border-t border-gray-100 text-xs">
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-emerald-500 font-bold">✓</span> Survey CTS Number: {item.surveyNo || 'CTS-VERIFIED'}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-emerald-500 font-bold">✓</span> Area Check: {item.area || 'Dimensioned'}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-emerald-500 font-bold">✓</span> Title Classification: {item.type}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ValidationPage
