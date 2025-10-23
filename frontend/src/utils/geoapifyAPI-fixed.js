// Geoapify Places API for live location and nearby hospital detection - FIXED VERSION

// Try to get API key from environment, fallback to hardcoded (for testing)
const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY || 'dc461739b87042228f6be3ee0e2bf02a';

console.log('🔑 API Key loaded:', GEOAPIFY_API_KEY ? `${GEOAPIFY_API_KEY.substring(0, 10)}...` : 'NOT FOUND');

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in meters
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

/**
 * Fetch nearby hospitals using Geoapify Places API
 * @param {number} lat - User's latitude
 * @param {number} lon - User's longitude
 * @param {number} radius - Search radius in meters (default: 5000)
 * @param {number} limit - Maximum number of results (default: 20)
 * @returns {Promise<Object>} Response with facilities array
 */
export const fetchNearbyHospitalsGeoapify = async (lat, lon, radius = 5000, limit = 20) => {
  try {
    console.log('🏥 Starting Geoapify fetch:', { lat, lon, radius, apiKey: GEOAPIFY_API_KEY ? 'Present' : 'MISSING' });

    if (!GEOAPIFY_API_KEY || GEOAPIFY_API_KEY === 'YOUR_API_KEY') {
      console.error('❌ API Key not configured!');
      return {
        success: false,
        error: 'API key not configured. Please add VITE_GEOAPIFY_API_KEY to your .env file',
        facilities: [],
        count: 0
      };
    }

    // Geoapify Places API endpoint - including all medical facilities and pharmacies
    const categories = 'healthcare.hospital,healthcare.clinic,healthcare.pharmacy,healthcare.dentist,healthcare.doctors,commercial.chemist,commercial.pharmacy';
    const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},${radius}&limit=${limit}&apiKey=${GEOAPIFY_API_KEY}`;

    console.log('📡 Fetching from:', url.replace(GEOAPIFY_API_KEY, 'API_KEY_HIDDEN'));

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      
      if (response.status === 401) {
        return {
          success: false,
          error: 'Invalid API key. Please check your Geoapify API key.',
          facilities: [],
          count: 0
        };
      } else if (response.status === 429) {
        return {
          success: false,
          error: 'Rate limit exceeded. Please try again in a moment.',
          facilities: [],
          count: 0
        };
      }
      
      throw new Error(`Geoapify API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📊 API Response:', data);

    // Check if we have features
    if (!data.features || data.features.length === 0) {
      console.warn('⚠️ No hospitals found in this area');
      return {
        success: true,
        count: 0,
        facilities: [],
        message: 'No medical facilities found in this area. Try increasing the search radius.'
      };
    }

    // Transform Geoapify response to our facility format
    const facilities = data.features.map((feature) => {
      const props = feature.properties;
      const coords = feature.geometry.coordinates;
      
      // Calculate distance from user location
      const distance = calculateDistance(lat, lon, coords[1], coords[0]);
      
      // Determine facility type
      let facilityType = 'hospital';
      if (props.categories && props.categories.length > 0) {
        const category = props.categories[0];
        if (category.includes('clinic')) facilityType = 'clinic';
        else if (category.includes('pharmacy') || category.includes('chemist')) facilityType = 'pharmacy';
        else if (category.includes('dentist')) facilityType = 'dentist';
        else if (category.includes('doctors')) facilityType = 'doctors';
      }

      // Build address string
      let address = 'Address not available';
      if (props.address_line1 && props.address_line2) {
        address = `${props.address_line1}, ${props.address_line2}`;
      } else if (props.formatted) {
        address = props.formatted;
      } else if (props.street) {
        address = props.street;
        if (props.city) address += `, ${props.city}`;
      }

      return {
        id: props.place_id || `geoapify_${Date.now()}_${Math.random()}`,
        name: props.name || 'Unnamed Medical Facility',
        type: facilityType,
        latitude: coords[1],
        longitude: coords[0],
        address: address,
        phone: props.contact?.phone || props.phone || 'N/A',
        opening_hours: props.opening_hours || 'N/A',
        website: props.website || props.contact?.website || '',
        distance: Math.round(distance), // Distance in meters
        distanceKm: (distance / 1000).toFixed(2), // Distance in km
        datasource: props.datasource?.raw?.name || 'Geoapify',
        categories: props.categories || [],
      };
    });

    // Sort by distance (closest first)
    facilities.sort((a, b) => a.distance - b.distance);

    console.log(`✅ Successfully found ${facilities.length} medical facilities`);

    return {
      success: true,
      count: facilities.length,
      facilities: facilities,
    };

  } catch (error) {
    console.error('❌ Geoapify API Error:', error);
    
    // User-friendly error messages
    let errorMessage = 'Unable to fetch nearby hospitals. Please check your internet connection.';
    
    if (error.message.includes('401')) {
      errorMessage = 'API key error. Please check your Geoapify API key.';
    } else if (error.message.includes('429')) {
      errorMessage = 'Too many requests. Please try again in a moment.';
    } else if (!navigator.onLine) {
      errorMessage = 'No internet connection. Please check your network.';
    }

    return {
      success: false,
      error: errorMessage,
      facilities: [],
      count: 0
    };
  }
};

/**
 * Geocode a location name to coordinates using Geoapify
 * @param {string} locationName - Location to search (e.g., "New York", "London")
 * @returns {Promise<Object>} Response with coordinates
 */
export const geocodeLocation = async (locationName) => {
  try {
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(locationName)}&limit=1&apiKey=${GEOAPIFY_API_KEY}`;
    
    console.log('🔍 Geocoding:', locationName);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Geocoding failed');
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const coords = data.features[0].geometry.coordinates;
      console.log('✅ Geocoded successfully:', coords);
      return {
        success: true,
        lat: coords[1],
        lon: coords[0],
        name: data.features[0].properties.formatted
      };
    }

    return {
      success: false,
      error: 'Location not found'
    };

  } catch (error) {
    console.error('❌ Geocoding error:', error);
    return {
      success: false,
      error: 'Failed to geocode location'
    };
  }
};

