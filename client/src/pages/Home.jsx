import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiService from '../services/api'
import { getCurrentLocation, filterNearbyLocations } from '../utils/geolocation'

const Home = () => {
  const [studySpots, setStudySpots] = useState([])
  const [nearbySpots, setNearbySpots] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [locationLoading, setLocationLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showNearby, setShowNearby] = useState(false)

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

  useEffect(() => {
    fetchStudySpots()
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
        <button 
          className="btn btn-primary location-btn" 
          onClick={handleLocationSearch}
          disabled={locationLoading}
        >
          {locationLoading ? 'Finding your location...' : '📍 Find Study Spots Near Me'}
        </button>
        {userLocation && (
          <p className="location-info">
            📍 Location found! Showing spots within 10km
          </p>
        )}
      </div>
      
      {/* Featured Study Spots */}
      <div className="featured-section">
        <h2>{showNearby ? 'Study Spots Near You' : 'Available Study Spots'}</h2>
        <p className="section-description">
          {showNearby 
            ? `Found ${nearbySpots.length} study spots near your location`
            : 'Browse popular study locations in your area'
          }
        </p>
        
        <div className="study-spots-grid">
          {(showNearby ? nearbySpots : studySpots.slice(0, 6)).map((spot) => (
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
                  <span className="feature">{spot.noise_level}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {studySpots.length > 6 && (
          <div className="view-all-section">
            <Link to="/results" className="btn btn-primary btn-large">
              View All Study Spots ({studySpots.length} total)
            </Link>
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
