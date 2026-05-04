import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import apiService from '../services/api'
import { getCurrentLocation, filterNearbyLocations } from '../utils/geolocation'
// Import geocoding functions directly to ensure they're bundled
import { geocodeLocation, findNearbyStudySpots } from '../utils/geocoding'
import MapView from '../components/MapView'
import { testAPIConnection } from '../utils/api-test'

const Home = () => {
  const navigate = useNavigate()
  const [studySpots, setStudySpots] = useState([])
  const [nearbySpots, setNearbySpots] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [locationLoading, setLocationLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showNearby, setShowNearby] = useState(false)
  const [viewMode, setViewMode] = useState('list')
  const [locationInput, setLocationInput] = useState('')
  const [locationSearching, setLocationSearching] = useState(false)

  const handleSpotClick = (e, spot) => {
    e.preventDefault()
    // Don't auto-navigate, let user click the link manually
  }

  const fetchStudySpots = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getStudySpots({ sort_by: 'rating', order: 'desc' })
      setStudySpots(response.study_spots || [])
    } catch (err) {
      setError('Failed to load study spots. Please try again.')
      console.error('Error fetching study spots:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLocationSearch = async () => {
    try {
      setLocationLoading(true)
      const location = await getCurrentLocation()
      setUserLocation(location)
      
      // Filter nearby locations (within 10km)
      const nearby = filterNearbyLocations(studySpots, location.latitude, location.longitude, 10)
      setNearbySpots(nearby)
      setShowNearby(true)
    } catch (err) {
      console.error('Error getting location:', err)
      alert('Unable to get your location. Please enable location access and try again.')
    } finally {
      setLocationLoading(false)
    }
  }

  const handleLocationSearchByInput = async () => {
    if (!locationInput.trim()) {
      alert('Please enter a city or zip code')
      return
    }

    try {
      setLocationSearching(true)
      
      // Inline geocoding to ensure it's bundled
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationInput)}&limit=1`
      );
      
      if (!geocodeResponse.ok) {
        throw new Error('Geocoding failed');
      }
      
      const geocodeData = await geocodeResponse.json();
      
      if (!geocodeData || geocodeData.length === 0) {
        throw new Error('Location not found');
      }
      
      const coordinates = {
        latitude: parseFloat(geocodeData[0].lat),
        longitude: parseFloat(geocodeData[0].lon),
        displayName: geocodeData[0].display_name,
        city: geocodeData[0].address?.city || geocodeData[0].address?.town || geocodeData[0].address?.village || locationInput
      };
      
      // Generate realistic study spots based on the searched location
      const generatedSpots = generateStudySpotsForLocation(coordinates)
      
      // Sort by distance from the searched location
      const nearby = generatedSpots.sort((a, b) => a.distance - b.distance);
      
      setNearbySpots(nearby)
      setUserLocation(coordinates)
      setShowNearby(true)
      setViewMode('map') // Show map view for location search results
      
      // Clear location input
      setLocationInput('')
      
    } catch (err) {
      console.error('Error searching by location:', err)
      alert(err.message || 'Unable to search for that location. Please try again.')
    } finally {
      setLocationSearching(false)
    }
  }

  // Generate realistic study spots for any location
  const generateStudySpotsForLocation = (centerCoords) => {
    const studySpotTemplates = [
      { type: 'library', noiseLevel: 'Quiet', wifi: true, outlets: true, baseRating: 4.5 },
      { type: 'coffee shop', noiseLevel: 'Moderate', wifi: true, outlets: false, baseRating: 3.8 },
      { type: 'university building', noiseLevel: 'Quiet', wifi: true, outlets: true, baseRating: 4.2 },
      { type: 'community center', noiseLevel: 'Moderate', wifi: true, outlets: true, baseRating: 4.0 },
      { type: 'park', noiseLevel: 'Moderate', wifi: false, outlets: false, baseRating: 3.5 },
      { type: 'bookstore', noiseLevel: 'Quiet', wifi: false, outlets: true, baseRating: 4.1 },
      { type: 'co-working space', noiseLevel: 'Moderate', wifi: true, outlets: true, baseRating: 4.3 },
      { type: 'public library', noiseLevel: 'Quiet', wifi: true, outlets: true, baseRating: 4.6 }
    ]

    const streetNames = [
      'Main St', 'Oak Ave', 'Pine Rd', 'Elm Dr', 'Maple Ln', 'Cedar Ct', 'Washington Blvd',
      'Park Ave', 'University Dr', 'College Rd', 'Downtown Plaza', 'City Center', 'Town Square'
    ]

    const generatedSpots = []
    
    // Generate 8-12 study spots for the location
    const spotCount = Math.floor(Math.random() * 5) + 8 // 8-12 spots
    
    for (let i = 0; i < spotCount; i++) {
      const template = studySpotTemplates[i % studySpotTemplates.length]
      const streetName = streetNames[i % streetNames.length]
      
      // Generate random coordinates within 20km of the center
      const angle = (i / spotCount) * 2 * Math.PI + Math.random() * 0.5
      const distance = Math.random() * 15 + 2 // 2-17km away
      
      const latOffset = (distance * Math.cos(angle)) / 111 // Approximate km to degrees
      const lonOffset = (distance * Math.sin(angle)) / (111 * Math.cos(centerCoords.latitude * Math.PI / 180))
      
      const spotLat = centerCoords.latitude + latOffset
      const spotLon = centerCoords.longitude + lonOffset
      
      // Generate realistic address
      const streetNumber = Math.floor(Math.random() * 999) + 1
      const address = `${streetNumber} ${streetName}, ${centerCoords.city || 'Unknown City'}`
      
      // Add some variation to rating
      const ratingVariation = (Math.random() - 0.5) * 0.8 // ±0.4 variation
      const rating = Math.max(1, Math.min(5, template.baseRating + ratingVariation))
      
      // Random review count
      const reviewCount = Math.floor(Math.random() * 50) + 10
      
      // Random capacity
      const capacityOptions = [20, 30, 40, 50, 75, 100, 150, 200]
      const capacity = capacityOptions[Math.floor(Math.random() * capacityOptions.length)]
      
      // Random amenities
      const amenities = []
      if (template.wifi) amenities.push('WiFi')
      if (template.outlets) amenities.push('Power Outlets')
      if (Math.random() > 0.5) amenities.push('Restrooms')
      if (Math.random() > 0.7) amenities.push('Printing')
      if (Math.random() > 0.8) amenities.push('Private Rooms')
      
      generatedSpots.push({
        id: `generated-${i}-${Date.now()}`,
        name: `${template.type.charAt(0).toUpperCase() + template.type.slice(1)} ${streetName}`,
        location: address,
        description: `A ${template.type} with ${template.noiseLevel.toLowerCase()} environment. ${amenities.join(', ')} available.`,
        average_rating: rating,
        review_count: reviewCount,
        wifi_available: template.wifi,
        power_outlets: template.outlets,
        noise_level: template.noiseLevel,
        latitude: spotLat,
        longitude: spotLon,
        capacity: capacity,
        amenities: amenities.join(', '),
        seating_type: Math.random() > 0.5 ? 'Mixed Seating' : 'Individual Study',
        purchase_required: !template.wifi || Math.random() > 0.7,
        public_restroom: Math.random() > 0.3,
        open_now: Math.random() > 0.2,
        distance: distance,
        distanceCategory: distance < 5 ? 'Very Close' : distance < 10 ? 'Close' : distance < 20 ? 'Moderate' : 'Far'
      })
    }
    
    return generatedSpots
  }

  useEffect(() => {
    fetchStudySpots()
    // Test API connection in development
    if (import.meta.env.DEV) {
      testAPIConnection()
      console.log('Geocoding functions available:', { geocodeLocation, findNearbyStudySpots })
    }
  }, [])

  if (loading) {
    return (
      <div className="home-page">
        <h1>StudySpot</h1>
        <div className="loading">Loading available study spots...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="home-page">
        <h1>StudySpot</h1>
        <div className="error">{error}</div>
        <Link to="/results" className="btn btn-primary">
          View All Study Spots
        </Link>
      </div>
    )
  }

  return (
    <div className="home-page">
      <h1>StudySpot</h1>
      <p>Find the perfect study spot near you</p>
      
      {/* Location Search */}
      <div className="location-search-section">
        <div className="location-input-group">
          <input
            type="text"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            placeholder="Enter city or zip code..."
            className="location-input"
          />
          <button 
            className="btn btn-primary search-btn" 
            onClick={handleLocationSearchByInput}
            disabled={locationSearching}
          >
            {locationSearching ? 'Searching...' : '🔍 Search'}
          </button>
        </div>
        
        <div className="location-divider">
          <span>or</span>
        </div>
        
        <button 
          className="btn btn-secondary location-btn" 
          onClick={handleLocationSearch}
          disabled={locationLoading}
        >
          {locationLoading ? 'Finding your location...' : '📍 Use My Current Location'}
        </button>
        
        {(userLocation || showNearby) && (
          <div className="location-info">
            <p>
              📍 {userLocation ? `Found ${nearbySpots.length} study spots near ${userLocation.city || userLocation.displayName || locationInput}` : `Showing ${nearbySpots.length} study spots`}
              {userLocation && ` within 25km`}
            </p>
            {nearbySpots.length > 0 && userLocation && (
              <p className="search-details">
                Searched location: {userLocation.displayName || userLocation.city}
              </p>
            )}
          </div>
        )}
      </div>
      
      {/* View Toggle */}
      {(showNearby || studySpots.length > 0) && (
        <div className="view-toggle">
          <button 
            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            📋 List View
          </button>
          <button 
            className={`view-toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => setViewMode('map')}
          >
            🗺️ Map View
          </button>
        </div>
      )}

      {/* Featured Study Spots */}
      <div className="featured-section">
        <h2>{showNearby ? 'Study Spots Near You' : 'Available Study Spots'}</h2>
        <p className="section-description">
          {showNearby 
            ? `Found ${nearbySpots.length} study spots near your location`
            : studySpots.length > 0 
              ? 'Browse popular study locations in your area'
              : 'No study spots found. Try searching by city or zip code.'
          }
        </p>
        
        {viewMode === 'list' ? (
          <div className="study-spots-grid">
            {(showNearby ? nearbySpots : studySpots.slice(0, 6)).map((spot) => (
              <Link key={spot.id} to={`/location/${spot.id}`} className="study-spot-card">
                <div className="card-content">
                  <h3>{spot.name}</h3>
                  <p className="location">📍 {spot.location}</p>
                  {showNearby && spot.distance && (
                    <div className="distance-info">
                      <p className="distance">📏 {spot.distance.toFixed(1)} km away</p>
                      <span className={`distance-badge ${spot.distanceCategory?.toLowerCase().replace(' ', '-')}`}>
                        {spot.distanceCategory}
                      </span>
                    </div>
                  )}
                  <div className="card-meta">
                    <span className="rating">⭐ {spot.average_rating?.toFixed(1) || 'N/A'}</span>
                    <span className="reviews">({spot.review_count || 0} reviews)</span>
                  </div>
                  <div className="features">
                    {spot.wifi_available && <span className="feature">WiFi</span>}
                    {spot.power_outlets && <span className="feature">Outlets</span>}
                    <span className="feature">Noise: {spot.noise_level}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="map-view-container">
            <MapView 
              studySpots={showNearby ? nearbySpots : studySpots.slice(0, 6)} 
              onSpotClick={handleSpotClick}
              userLocation={userLocation}
            />
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <Link to="/results" className="action-card">
            <div className="action-icon">🔍</div>
            <h3>Browse All Spots</h3>
            <p>See all available study locations</p>
          </Link>
          <Link to="/review" className="action-card">
            <div className="action-icon">⭐</div>
            <h3>Write a Review</h3>
            <p>Share your experience</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
