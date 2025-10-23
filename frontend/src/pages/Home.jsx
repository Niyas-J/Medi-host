import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import MapView from '../components/MapView'
import FacilityList from '../components/FacilityList'
import AppointmentForm from '../components/AppointmentForm'
import EmergencyButton from '../components/EmergencyButton'
import { fetchNearbyHospitalsGeoapify, geocodeLocation } from '../utils/geoapifyAPI'

const Home = () => {
  const [userLocation, setUserLocation] = useState(null)
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedFacility, setSelectedFacility] = useState(null)
  const [showAppointmentForm, setShowAppointmentForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [searchLocation, setSearchLocation] = useState('')
  const [searchRadius, setSearchRadius] = useState(10000) // 10km default

  useEffect(() => {
    getUserLocation()
  }, [])

  const getUserLocation = () => {
    setLoading(true)
    setError('')

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation([latitude, longitude])
        fetchNearbyFacilities(latitude, longitude, searchRadius)
      },
      (error) => {
        setError('Unable to retrieve your location. Please enable location services.')
        setLoading(false)
        console.error('Geolocation error:', error)
      }
    )
  }

  const fetchNearbyFacilities = async (lat, lon, radius = 10000) => {
    setLoading(true)
    setError('')

    try {
      // Use Geoapify Places API for live location and nearby hospitals
      console.log('🏥 Fetching facilities using Geoapify API:', { lat, lon, radius })
      const response = await fetchNearbyHospitalsGeoapify(lat, lon, radius, 20)
      
      if (response.success) {
        console.log('✅ Found facilities:', response.facilities.length)
        setFacilities(response.facilities)
        
        // Show info message if no facilities found
        if (response.facilities.length === 0) {
          setError(response.message || 'No medical facilities found in this area. Try increasing the search radius.')
        }
      } else {
        // Show user-friendly error from Geoapify API
        setError(response.error || 'Unable to fetch nearby hospitals.')
      }
    } catch (err) {
      setError('Unable to fetch nearby hospitals. Please check your internet connection.')
      console.error('❌ Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleBookAppointment = (facility) => {
    setSelectedFacility(facility)
    setShowAppointmentForm(true)
  }

  const handleShowOnMap = (facility) => {
    setSelectedFacility(facility)
    setUserLocation([facility.latitude, facility.longitude])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearchLocation = async (e) => {
    e.preventDefault()
    if (!searchLocation.trim()) return

    setLoading(true)

    try {
      // Use Geoapify Geocoding API
      console.log('🔍 Searching location:', searchLocation)
      const response = await geocodeLocation(searchLocation)

      if (response.success) {
        console.log('✅ Location found:', response.name)
        setUserLocation([response.lat, response.lon])
        await fetchNearbyFacilities(response.lat, response.lon, searchRadius)
      } else {
        alert('Location not found. Please try a different search.')
        setLoading(false)
      }
    } catch (error) {
      console.error('❌ Geocoding error:', error)
      alert('Failed to search location. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-4xl font-bold flex items-center justify-center md:justify-start gap-2">
                🏥 Medi-Host
              </h1>
              <p className="text-blue-100 text-sm md:text-base mt-1">
                Find Nearby Medical Facilities
              </p>
            </div>
            <Link
              to="/admin"
              className="bg-white text-blue-600 px-6 py-2 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-md"
            >
              🧑‍💼 Admin Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6 space-y-4">
          <form onSubmit={handleSearchLocation} className="flex gap-2">
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="🔍 Search location (e.g., New York, London...)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
            >
              Search
            </button>
            <button
              type="button"
              onClick={getUserLocation}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md"
              title="Use my current location"
            >
              📍
            </button>
          </form>

          {/* Radius Slider */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">
                Search Radius: {(searchRadius / 1000).toFixed(1)} km
              </label>
              <span className="text-xs text-gray-500">
                {facilities.length} facilities found
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500">1km</span>
              <input
                type="range"
                min="1000"
                max="20000"
                step="1000"
                value={searchRadius}
                onChange={(e) => {
                  const newRadius = parseInt(e.target.value)
                  setSearchRadius(newRadius)
                  if (userLocation) {
                    fetchNearbyFacilities(userLocation[0], userLocation[1], newRadius)
                  }
                }}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-xs text-gray-500">20km</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
            <p className="font-semibold">⚠️ {error}</p>
            <button
              onClick={getUserLocation}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-gray-600 font-semibold">Searching for nearby facilities...</p>
          </div>
        )}

        {/* Main Content */}
        {!loading && userLocation && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Map Section */}
            <div className="h-[400px] md:h-[600px] lg:h-[700px]">
              <MapView
                userLocation={userLocation}
                facilities={facilities}
                onFacilitySelect={setSelectedFacility}
                selectedFacility={selectedFacility}
                searchRadius={searchRadius}
              />
            </div>

            {/* Facility List Section */}
            <div>
              <FacilityList
                facilities={facilities}
                onBookAppointment={handleBookAppointment}
                onShowOnMap={handleShowOnMap}
                filter={filter}
                setFilter={setFilter}
              />
            </div>
          </div>
        )}
      </div>

      {/* Appointment Form Modal */}
      {showAppointmentForm && (
        <AppointmentForm
          facility={selectedFacility}
          onClose={() => setShowAppointmentForm(false)}
          onSuccess={() => {
            console.log('Appointment booked successfully')
          }}
        />
      )}

      {/* Emergency Button */}
      <EmergencyButton userLocation={userLocation} />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">
            Medi-Host - Built with ❤️ using React, Flask, and OpenStreetMap
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Emergency services: 911 (US) | 112 (EU) | 999 (UK)
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home

