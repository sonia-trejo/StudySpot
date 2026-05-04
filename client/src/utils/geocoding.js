// Geocoding utility for converting city/zip to coordinates
export const geocodeLocation = async (locationQuery) => {
  try {
    // Using OpenStreetMap Nominatim API (free, no API key needed)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}&limit=1`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding failed');
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        displayName: result.display_name,
        city: result.address?.city || result.address?.town || result.address?.village || locationQuery
      };
    }
    
    throw new Error('Location not found');
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error('Unable to find location. Please try a different city or zip code.', { cause: error });
  }
};

// Calculate distance between two coordinates (in km)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Find study spots within radius of a location
export const findNearbyStudySpots = (studySpots, centerLat, centerLon, radiusKm = 25) => {
  return studySpots
    .map(spot => {
      if (!spot.latitude || !spot.longitude) return null;
      
      const distance = calculateDistance(
        centerLat, centerLon, 
        spot.latitude, spot.longitude
      );
      
      return {
        ...spot,
        distance: distance
      };
    })
    .filter(spot => spot && spot.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
};
