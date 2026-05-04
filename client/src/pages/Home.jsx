import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiService from '../services/api'

const Home = () => {
  const [studySpots, setStudySpots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
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
      
      {/* Featured Study Spots */}
      <div className="featured-section">
        <h2>Available Study Spots</h2>
        <p className="section-description">Browse popular study locations in your area</p>
        
        <div className="study-spots-grid">
          {studySpots.slice(0, 6).map((spot) => (
            <Link key={spot.id} to={`/location/${spot.id}`} className="study-spot-card">
              <div className="card-content">
                <h3>{spot.name}</h3>
                <p className="location">📍 {spot.location}</p>
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
