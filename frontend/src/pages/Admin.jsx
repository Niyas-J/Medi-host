import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Admin = () => {
  const [appointments, setAppointments] = useState([])
  const [emergencies, setEmergencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('appointments')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [appointmentsRes, emergenciesRes] = await Promise.all([
        axios.get('/api/admin/appointments'),
        axios.get('/api/admin/emergencies')
      ])

      if (appointmentsRes.data.success) {
        setAppointments(appointmentsRes.data.appointments)
      }

      if (emergenciesRes.data.success) {
        setEmergencies(emergenciesRes.data.alerts)
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString()
    } catch {
      return dateString
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-4xl font-bold flex items-center justify-center md:justify-start gap-2">
                🧑‍💼 Admin Dashboard
              </h1>
              <p className="text-purple-100 text-sm md:text-base mt-1">
                Manage Appointments & Emergency Alerts
              </p>
            </div>
            <Link
              to="/"
              className="bg-white text-purple-600 px-6 py-2 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-md"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Appointments</p>
                <p className="text-4xl font-bold mt-2">{appointments.length}</p>
              </div>
              <div className="text-5xl opacity-50">📅</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Emergency Alerts</p>
                <p className="text-4xl font-bold mt-2">{emergencies.length}</p>
              </div>
              <div className="text-5xl opacity-50">🚨</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                activeTab === 'appointments'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              📅 Appointments ({appointments.length})
            </button>
            <button
              onClick={() => setActiveTab('emergencies')}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                activeTab === 'emergencies'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              🚨 Emergencies ({emergencies.length})
            </button>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
                <p className="text-gray-600 font-semibold">Loading data...</p>
              </div>
            ) : (
              <>
                {/* Appointments Tab */}
                {activeTab === 'appointments' && (
                  <div className="space-y-4">
                    {appointments.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No appointments yet</p>
                      </div>
                    ) : (
                      appointments.map((apt) => (
                        <div
                          key={apt.id}
                          className="border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-lg transition-all bg-gradient-to-br from-white to-blue-50"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="font-bold text-lg text-gray-800 mb-2">
                                👤 {apt.name}
                              </h3>
                              <div className="space-y-2 text-sm">
                                <p className="text-gray-600">
                                  <span className="font-semibold">📞 Phone:</span> {apt.phone}
                                </p>
                                <p className="text-gray-600">
                                  <span className="font-semibold">🏥 Facility:</span> {apt.facility_name}
                                </p>
                                <p className="text-gray-600">
                                  <span className="font-semibold">📅 Date:</span> {apt.date}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-700 mb-2">Reason:</p>
                              <p className="text-gray-600 text-sm bg-white p-3 rounded-lg">
                                {apt.reason}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                Booked: {formatDate(apt.created_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Emergencies Tab */}
                {activeTab === 'emergencies' && (
                  <div className="space-y-4">
                    {emergencies.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No emergency alerts</p>
                      </div>
                    ) : (
                      emergencies.map((alert) => (
                        <div
                          key={alert.id}
                          className="border-2 border-red-200 rounded-xl p-4 md:p-6 bg-gradient-to-br from-red-50 to-white hover:shadow-lg transition-all"
                        >
                          <div className="flex items-start gap-4">
                            <div className="text-4xl">🚨</div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-red-700 mb-2">
                                Emergency Alert #{alert.id}
                              </h3>
                              <div className="space-y-2 text-sm">
                                <p className="text-gray-700">
                                  <span className="font-semibold">📍 Location:</span>{' '}
                                  Lat: {alert.latitude.toFixed(6)}, Lon: {alert.longitude.toFixed(6)}
                                </p>
                                <p className="text-gray-700">
                                  <span className="font-semibold">💬 Message:</span> {alert.message}
                                </p>
                                {alert.user_info && (
                                  <p className="text-gray-700">
                                    <span className="font-semibold">👤 User Info:</span> {alert.user_info}
                                  </p>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                  ⏰ {formatDate(alert.created_at)}
                                </p>
                              </div>
                              <a
                                href={`https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-3 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-all"
                              >
                                🗺️ View on Google Maps
                              </a>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}

            {/* Refresh Button */}
            <div className="mt-6 text-center">
              <button
                onClick={fetchData}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
              >
                🔄 Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin

