import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import apiService from '../services/api'

const StudySpotDetail = () => {
  const { id } = useParams()
  const [studySpot, setStudySpot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStudySpot = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await apiService.getStudySpot(id)
        setStudySpot(data)
      } catch (err) {
        setError('Failed to load study spot details. Please try again.')
        console.error('Error fetching study spot:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchStudySpot()
    }
  }, [id])

  if (loading) {
    return (
      <div className="study-spot-detail">
        <h1>Loading...</h1>
        <div className="loading">Loading study spot details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="study-spot-detail">
        <h1>Error</h1>
        <div className="error">{error}</div>
        <Link to="/results" className="btn btn-primary">
          Back to Results
        </Link>
      </div>
    )
  }

  if (!studySpot) {
    return (
      <div className="study-spot-detail">
        <h1>Study Spot Not Found</h1>
        <p>The study spot you're looking for doesn't exist.</p>
        <Link to="/results" className="btn btn-primary">
          Back to Results
        </Link>
      </div>
    )
  }

  const getNoiseLevelBadge = (level) => {
    const badges = {
      quiet: { class: 'badge-quiet', text: 'Quiet' },
      moderate: { class: 'badge-moderate', text: 'Moderate' },
      loud: { class: 'badge-loud', text: 'Loud' }
    }
    return badges[level] || badges.moderate
  }

  return (
    <div className="study-spot-detail-page">
      <div className="detail-header">
        <h1>{studySpot.name}</h1>
        <div className="header-meta">
          <span className={`noise-badge ${getNoiseLevelBadge(studySpot.noise_level).class}`}>
            {getNoiseLevelBadge(studySpot.noise_level).text}
          </span>
          <span className="rating">⭐ {studySpot.average_rating?.toFixed(1) || 'N/A'}</span>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-section">
          <h2>Location</h2>
          <p>📍 {studySpot.location}</p>
        </div>

        <div className="detail-section">
          <h2>Description</h2>
          <p>{studySpot.description || 'No description available'}</p>
        </div>

        <div className="detail-grid">
          <div className="detail-section">
            <h2>Capacity</h2>
            <p>{studySpot.capacity || 'N/A'}</p>
          </div>

          <div className="detail-section">
            <h2>Seating Type</h2>
            <p>{studySpot.seating_type || 'N/A'}</p>
          </div>
        </div>

        <div className="detail-section">
          <h2>Amenities</h2>
          <div className="amenities-detail">
            <div className="amenity-icons">
              {studySpot.wifi_available && <span className="amenity-icon">📶 WiFi</span>}
              {studySpot.power_outlets && <span className="amenity-icon">🔌 Power Outlets</span>}
              {studySpot.public_restroom && <span className="amenity-icon">🚽 Restroom</span>}
            </div>
            <p>{studySpot.amenities || 'No additional amenities listed'}</p>
          </div>
        </div>

        <div className="detail-section">
          <h2>Additional Details</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Noise Level:</span>
              <span className="detail-value">{studySpot.noise_level || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Purchase Required:</span>
              <span className="detail-value">{studySpot.purchase_required ? 'Yes' : 'No'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Open Now:</span>
              <span className="detail-value">{studySpot.open_now ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-actions">
        <Link to="/results" className="btn btn-secondary">
          ← Back to Results
        </Link>
        <Link to="/review" className="btn btn-primary">
          Write a Review
        </Link>
      </div>
    </div>
  )
}

export default StudySpotDetail
