import React from 'react'

const FacilityList = ({ facilities, onBookAppointment, onShowOnMap, filter, setFilter }) => {
  const filteredFacilities = filter === 'all'
    ? facilities
    : facilities.filter(f => f.type === filter)

  const getTypeIcon = (type) => {
    switch (type) {
      case 'hospital':
        return '🏥'
      case 'clinic':
        return '🏪'
      case 'pharmacy':
        return '💊'
      default:
        return '🏥'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'hospital':
        return 'bg-red-100 text-red-800'
      case 'clinic':
        return 'bg-blue-100 text-blue-800'
      case 'pharmacy':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Nearby Facilities
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({filteredFacilities.length} found)
          </span>
        </h2>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          {['all', 'hospital', 'clinic', 'pharmacy'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                filter === type
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type === 'all' ? '🌐 All' : `${getTypeIcon(type)} ${type.charAt(0).toUpperCase() + type.slice(1)}`}
            </button>
          ))}
        </div>
      </div>

      {/* Facility cards */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {filteredFacilities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No facilities found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or location</p>
          </div>
        ) : (
          filteredFacilities.map((facility) => (
            <div
              key={facility.id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                    {getTypeIcon(facility.type)}
                    {facility.name}
                  </h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(facility.type)}`}>
                    {facility.type.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                {facility.address && facility.address.trim() && (
                  <p className="flex items-start gap-2">
                    <span className="text-base">📍</span>
                    <span>{facility.address}</span>
                  </p>
                )}
                {facility.phone !== 'N/A' && (
                  <p className="flex items-center gap-2">
                    <span className="text-base">📞</span>
                    <span className="font-medium">{facility.phone}</span>
                  </p>
                )}
                {facility.opening_hours !== 'N/A' && (
                  <p className="flex items-center gap-2">
                    <span className="text-base">🕒</span>
                    <span>{facility.opening_hours}</span>
                  </p>
                )}
                {facility.website && (
                  <p className="flex items-center gap-2">
                    <span className="text-base">🌐</span>
                    <a 
                      href={facility.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onBookAppointment(facility)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  📅 Book
                </button>
                <button
                  onClick={() => onShowOnMap(facility)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  🗺️ Show on Map
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default FacilityList

