import React, { useState } from 'react'
import axios from 'axios'

const EmergencyButton = ({ userLocation }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleEmergency = async () => {
    if (!userLocation) {
      alert('⚠️ Location not available. Please enable location services.')
      return
    }

    setIsLoading(true)

    try {
      const userName = localStorage.getItem('userName') || 'Unknown User'
      const userPhone = localStorage.getItem('userPhone') || 'N/A'

      const emergencyData = {
        latitude: userLocation[0],
        longitude: userLocation[1],
        message: 'EMERGENCY ALERT: Immediate assistance needed!',
        user_info: `Name: ${userName}, Phone: ${userPhone}`
      }

      const response = await axios.post('/api/emergency', emergencyData)

      if (response.data.success) {
        alert('🚨 Emergency alert sent successfully! Help is on the way.')
        setShowConfirm(false)
      }
    } catch (error) {
      alert('❌ Failed to send emergency alert. Please call emergency services directly.')
      console.error('Emergency alert error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-red-500 to-red-600 text-white w-16 h-16 md:w-20 md:h-20 rounded-full shadow-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center text-2xl md:text-3xl font-bold z-40 pulse-animation hover:scale-110"
        title="Emergency SOS"
      >
        🚨
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 slide-in">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🚨</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Emergency Alert</h2>
              <p className="text-gray-600">
                Are you sure you want to send an emergency alert? This will notify emergency services of your location.
              </p>
            </div>

            {userLocation && (
              <div className="mb-6 p-4 bg-red-50 rounded-xl text-sm">
                <p className="text-gray-700">
                  <span className="font-semibold">Your Location:</span>
                </p>
                <p className="text-gray-600">
                  Lat: {userLocation[0].toFixed(6)}, Lon: {userLocation[1].toFixed(6)}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isLoading}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEmergency}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {isLoading ? 'Sending...' : 'Send Alert'}
              </button>
            </div>

            <p className="text-center text-xs text-gray-500 mt-4">
              💡 For immediate help, always call your local emergency number
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default EmergencyButton

