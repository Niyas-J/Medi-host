import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom icons for different facility types
const hospitalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const clinicIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const pharmacyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Component to recenter map when location changes
function ChangeView({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

const MapView = ({ userLocation, facilities, onFacilitySelect, selectedFacility }) => {
  const [mapStyle, setMapStyle] = React.useState('satellite') // 'satellite' or 'street'

  const getIcon = (type) => {
    switch (type) {
      case 'hospital':
        return hospitalIcon
      case 'clinic':
        return clinicIcon
      case 'pharmacy':
        return pharmacyIcon
      default:
        return hospitalIcon
    }
  }

  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-2xl relative">
      <MapContainer
        center={userLocation || [51.505, -0.09]}
        zoom={13}
        className="h-full w-full"
      >
        <ChangeView center={userLocation || [51.505, -0.09]} zoom={13} />
        
        {/* Conditional Tile Layers based on map style */}
        {mapStyle === 'satellite' ? (
          <>
            {/* Satellite View with High-Resolution Imagery */}
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
            {/* Labels overlay for better navigation */}
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          </>
        ) : (
          /* Street View (OpenStreetMap) */
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        )}
        
        {/* User location marker */}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-bold text-purple-600">📍 Your Location</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Facility markers */}
        {facilities.map((facility) => (
          <Marker
            key={facility.id}
            position={[facility.latitude, facility.longitude]}
            icon={getIcon(facility.type)}
            eventHandlers={{
              click: () => {
                onFacilitySelect(facility)
              },
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg mb-2">{facility.name}</h3>
                <div className="space-y-1 text-sm">
                  <p className="flex items-center gap-2">
                    <span className="font-semibold">Type:</span>
                    <span className="capitalize bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      {facility.type}
                    </span>
                  </p>
                  {facility.address && (
                    <p><span className="font-semibold">📍</span> {facility.address}</p>
                  )}
                  {facility.phone !== 'N/A' && (
                    <p><span className="font-semibold">📞</span> {facility.phone}</p>
                  )}
                  {facility.opening_hours !== 'N/A' && (
                    <p><span className="font-semibold">🕒</span> {facility.opening_hours}</p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Style Toggle Button */}
      <div className="absolute top-4 right-4 z-[1000]">
        <button
          onClick={() => setMapStyle(mapStyle === 'satellite' ? 'street' : 'satellite')}
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2"
          title={mapStyle === 'satellite' ? 'Switch to Street View' : 'Switch to Satellite View'}
        >
          {mapStyle === 'satellite' ? (
            <>
              🗺️ <span className="hidden sm:inline">Street View</span>
            </>
          ) : (
            <>
              🛰️ <span className="hidden sm:inline">Satellite View</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default MapView

