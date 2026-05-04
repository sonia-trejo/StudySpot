import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import apiService from '../services/api'

const Location = () => {
  const { id } = useParams()
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await apiService.getStudySpot(id)
        setLocation(data)
      } catch (err) {
        setError('Failed to load location details. Please try again.')
        console.error('Error fetching location:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchLocation()
    }
  }, [id])

  if (loading) {
    return (
      <div className="location-page">
        <h1>Loading...</h1>
        <div className="loading">Loading location details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="location-page">
        <h1>Error</h1>
        <div className="error">{error}</div>
        <Link to="/results" className="btn btn-primary">
          Back to Results
        </Link>
      </div>
    )
  }

  if (!location) {
    return (
      <div className="location-page">
        <h1>Location Not Found</h1>
        <p>The study spot you're looking for doesn't exist.</p>
        <Link to="/results" className="btn btn-primary">
          Back to Results
        </Link>
      </div>
    )
  }

  // Mock peak hour data
  const peakHours = [
    { hour: '8AM', occupancy: 20 },
    { hour: '10AM', occupancy: 45 },
    { hour: '12PM', occupancy: 80 },
    { hour: '2PM', occupancy: 65 },
    { hour: '4PM', occupancy: 50 },
    { hour: '6PM', occupancy: 35 },
    { hour: '8PM', occupancy: 25 }
  ]

  const totalReviews = location.review_count || 0
  const averageRating = location.average_rating || 0
  const ratingBreakdown = location.rating_breakdown || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

  return (
    <div className="location-page">
      <div className="location-header">
        <h1>{location.name}</h1>
        <div className="location-meta">
          <span className="rating">⭐ {averageRating.toFixed(1)}</span>
          <span className="total-reviews">({totalReviews} reviews)</span>
        </div>
      </div>

      {/* Move Write Review button to top */}
      <div className="location-actions-top">
        <Link to={`/review?location_id=${location.id}`} className="btn btn-primary btn-large">
          Write a Review
        </Link>
      </div>

      {/* Enhanced main information section - more prominent */}
      <div className="location-main-info">
        <div className="main-info-card">
          <div className="main-info-header">
            <h2>📚 Study Spot Details</h2>
            <p className="main-info-subtitle">Everything you need to know about this location</p>
          </div>
          
          <div className="info-grid-enhanced">
            <div className="info-item-enhanced">
              <div className="info-icon-large">📍</div>
              <div className="info-content">
                <h3>Location</h3>
                <p className="info-value">{location.location}</p>
              </div>
            </div>
            
            <div className="info-item-enhanced">
              <div className="info-icon-large">⏰</div>
              <div className="info-content">
                <h3>Hours</h3>
                <p className="info-value">Open 24/7</p>
              </div>
            </div>
            
            <div className="info-item-enhanced">
              <div className="info-icon-large">👥</div>
              <div className="info-content">
                <h3>Capacity</h3>
                <p className="info-value">{location.capacity} people</p>
              </div>
            </div>
            
            <div className="info-item-enhanced">
              <div className="info-icon-large">🔇</div>
              <div className="info-content">
                <h3>Noise Level</h3>
                <p className="info-value">{location.noise_level}</p>
              </div>
            </div>
            
            <div className="info-item-enhanced">
              <div className="info-icon-large">💻</div>
              <div className="info-content">
                <h3>WiFi</h3>
                <p className="info-value">{location.wifi_available ? '✅ Available' : '❌ Not Available'}</p>
              </div>
            </div>
            
            <div className="info-item-enhanced">
              <div className="info-icon-large">🔌</div>
              <div className="info-content">
                <h3>Outlets</h3>
                <p className="info-value">{location.power_outlets ? '✅ Available' : '❌ Not Available'}</p>
              </div>
            </div>
          </div>
          
          {location.amenities && (
            <div className="amenities-section-enhanced">
              <h3>🎯 Additional Amenities</h3>
              <p className="amenities-text">{location.amenities}</p>
            </div>
          )}
          
          {location.description && (
            <div className="description-section-enhanced">
              <h3>📝 About This Location</h3>
              <p className="description-text">{location.description}</p>
            </div>
          )}
        </div>
      </div>

      <div className="location-details">
        <div className="location-info">
          <div className="info-section">
            <h3>Description</h3>
            <p>{location.description}</p>
          </div>
        </div>

        <div className="reviews-section">
          <h2>Reviews</h2>
          
          <div className="rating-overview">
            <div className="rating-summary">
              <div className="average-rating">
                <span className="rating-number">{averageRating.toFixed(1)}</span>
                <span className="rating-stars">⭐⭐⭐⭐⭐</span>
                <span className="total-reviews">{totalReviews} reviews</span>
              </div>
              
              <div className="rating-breakdown">
                {Object.entries(ratingBreakdown).reverse().map(([rating, count]) => (
                  <div key={rating} className="rating-bar">
                    <span>{rating} ⭐</span>
                    <div className="bar-container">
                      <div 
                        className="bar-fill" 
                        style={{ width: totalReviews > 0 ? `${(count / totalReviews) * 100}%` : '0%' }}
                      ></div>
                    </div>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="written-reviews">
            {location.reviews && location.reviews.length > 0 ? (
              location.reviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="review-rating">
                      {'⭐'.repeat(review.rating)}
                    </div>
                    <div className="review-meta">
                      <span>{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <div className="review-actions">
                    <button className="btn btn-outline">👍 Helpful</button>
                    <button className="btn btn-outline">🚩 Report</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No reviews yet. Be the first to write a review!</p>
            )}
          </div>

          <div className="peak-hours">
            <h3>Peak Hours</h3>
            <div className="peak-chart">
              {peakHours.map((hour, index) => (
                <div key={index} className="hour-bar">
                  <div className="hour-label">{hour.hour}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ height: `${hour.occupancy}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="location-actions-bottom">
        <Link to="/results" className="btn btn-secondary">
          Back to Results
        </Link>
      </div>
    </div>
  )
}

export default Location
