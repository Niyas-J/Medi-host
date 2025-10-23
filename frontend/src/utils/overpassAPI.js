// Direct Overpass API calls from frontend (no backend needed)

export const fetchNearbyFacilitiesDirectly = async (lat, lon, radius = 10000) => {
  try {
    const overpassUrl = "https://overpass-api.de/api/interpreter";
    
    const query = `
      [out:json][timeout:30];
      (
        node["amenity"="hospital"](around:${radius},${lat},${lon});
        node["amenity"="clinic"](around:${radius},${lat},${lon});
        node["amenity"="pharmacy"](around:${radius},${lat},${lon});
        node["amenity"="doctors"](around:${radius},${lat},${lon});
        node["amenity"="dentist"](around:${radius},${lat},${lon});
        node["healthcare"="hospital"](around:${radius},${lat},${lon});
        node["healthcare"="clinic"](around:${radius},${lat},${lon});
        node["healthcare"="doctor"](around:${radius},${lat},${lon});
        node["healthcare"="dentist"](around:${radius},${lat},${lon});
        node["healthcare"="pharmacy"](around:${radius},${lat},${lon});
        way["amenity"="hospital"](around:${radius},${lat},${lon});
        way["amenity"="clinic"](around:${radius},${lat},${lon});
        way["amenity"="pharmacy"](around:${radius},${lat},${lon});
        way["amenity"="doctors"](around:${radius},${lat},${lon});
        way["amenity"="dentist"](around:${radius},${lat},${lon});
        way["healthcare"="hospital"](around:${radius},${lat},${lon});
        way["healthcare"="clinic"](around:${radius},${lat},${lon});
        way["healthcare"="doctor"](around:${radius},${lat},${lon});
      );
      out center;
    `;

    const response = await fetch(overpassUrl, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Overpass API');
    }

    const data = await response.json();
    const facilities = [];

    for (const element of data.elements || []) {
      // Get coordinates
      let facilityLat, facilityLon;
      
      if (element.type === 'node') {
        facilityLat = element.lat;
        facilityLon = element.lon;
      } else if (element.type === 'way' && element.center) {
        facilityLat = element.center.lat;
        facilityLon = element.center.lon;
      } else {
        continue;
      }

      const tags = element.tags || {};
      
      // Determine facility type from tags
      const facilityType = tags.amenity || tags.healthcare || 'unknown';
      
      const facility = {
        id: element.id,
        name: tags.name || 'Unnamed Facility',
        type: facilityType,
        latitude: facilityLat,
        longitude: facilityLon,
        address: `${tags['addr:street'] || ''} ${tags['addr:housenumber'] || ''}`.trim() || 'Address not available',
        phone: tags.phone || tags['contact:phone'] || 'N/A',
        opening_hours: tags.opening_hours || 'N/A',
        website: tags.website || tags['contact:website'] || '',
      };
      
      facilities.push(facility);
    }

    return {
      success: true,
      count: facilities.length,
      facilities: facilities,
    };
  } catch (error) {
    console.error('Overpass API Error:', error);
    return {
      success: false,
      error: error.message,
      facilities: [],
    };
  }
};

