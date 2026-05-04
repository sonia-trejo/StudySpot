import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import apiService from '../services/api'
import { getCurrentLocation, filterNearbyLocations } from '../utils/geolocation'
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
      
      // Search for study spots by location
      const response = await apiService.getStudySpots({ search: locationInput })
      setNearbySpots(response.study_spots || [])
      setShowNearby(true)
      setViewMode('map') // Show map view for location search results
      
      // Clear location input
      setLocationInput('')
      
    } catch (err) {
      console.error('Error searching by location:', err)
      alert('Unable to search for that location. Please try again.')
    } finally {
      setLocationSearching(false)
    }
  }

  // Recommended study spots when no real data is available
  const getRecommendedSpots = () => {
    return [
      {
        id: 'rec-1',
        name: 'University Library',
        location: 'Main Campus Building',
        average_rating: 4.5,
        review_count: 127,
        wifi_available: true,
        power_outlets: true,
        noise_level: 'quiet'
      },
      {
        id: 'rec-2',
        name: 'Student Union Coffee Shop',
        location: 'Campus Center',
        average_rating: 3.8,
        review_count: 89,
        wifi_available: true,
        power_outlets: true,
        noise_level: 'moderate'
      },
      {
        id: 'rec-3',
        name: 'Engineering Computer Lab',
        location: 'Tech Building',
        average_rating: 4.2,
        review_count: 156,
        wifi_available: true,
        power_outlets: true,
        noise_level: 'quiet'
      },
      {
        id: 'rec-4',
        name: 'Campus Green Space',
        location: 'Outdoor Area',
        average_rating: 3.5,
        review_count: 64,
        wifi_available: false,
        power_outlets: false,
        noise_level: 'moderate'
      },
      {
        id: 'rec-5',
        name: 'Medical Study Lounge',
        location: 'Health Sciences Building',
        average_rating: 4.7,
        review_count: 203,
        wifi_available: true,
        power_outlets: true,
        noise_level: 'quiet'
      },
      {
        id: 'rec-6',
        name: '24/7 Study Hall',
        location: 'Student Services Building',
        average_rating: 4.0,
        review_count: 98,
        wifi_available: true,
        power_outlets: true,
        noise_level: 'moderate'
      }
    ]
  }

  useEffect(() => {
    fetchStudySpots()
    // Test API connection in development
    if (import.meta.env.DEV) {
      testAPIConnection()
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
          <p className="location-info">
            📍 {userLocation ? 'Location found!' : `Showing ${nearbySpots.length} study spots`}
            {userLocation && ' Showing spots within 10km'}
          </p>
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
              : 'No study spots found in your area. Here are some recommended options:'
          }
        </p>
        
        {viewMode === 'list' ? (
          <div className="study-spots-grid">
            {(showNearby ? nearbySpots : studySpots.length > 0 ? studySpots.slice(0, 6) : getRecommendedSpots()).map((spot) => (
              <Link key={spot.id} to={`/location/${spot.id}`} className="study-spot-card">
                <div className="card-content">
                  <h3>{spot.name}</h3>
                  <p className="location">📍 {spot.location}</p>
                  {showNearby && spot.distance && (
                    <p className="distance">📏 {spot.distance.toFixed(1)} km away</p>
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
