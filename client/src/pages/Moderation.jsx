import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiService from '../services/api'

const Moderation = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const response = await apiService.getReviews()
        setReviews(response.reviews || [])
      } catch (err) {
        console.error('Error fetching reviews:', err)
        setError('Failed to load reviews. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchReviews()
  }, [])

  const handleUpvote = (reviewId) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ))
  }

  const handleDownvote = (reviewId) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, notHelpful: review.notHelpful + 1 }
        : review
    ))
  }

  const handleReport = (reviewId) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, reports: review.reports + 1, status: review.reports + 1 >= 3 ? 'flagged' : review.status }
        : review
    ))
  }

  const handleRemoveReview = (reviewId) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId))
  }

  const handleApproveReview = (reviewId) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, status: 'approved' }
        : review
    ))
  }

  if (loading) {
    return (
      <div className="moderation-page">
        <h1>Review Moderation</h1>
        <div className="loading">Loading reviews...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="moderation-page">
        <h1>Review Moderation</h1>
        <div className="error">{error}</div>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    )
  }

  const activeReviews = reviews.filter(review => review.status !== 'flagged')
  const flaggedReviews = reviews.filter(review => review.status === 'flagged')

  return (
    <div className="moderation-page">
      <h1>Review Moderation</h1>
      <p>Manage and moderate user reviews for study spots</p>

      <div className="moderation-stats">
        <div className="stat-card">
          <h3>Total Reviews</h3>
          <span className="stat-number">{reviews.length}</span>
        </div>
        <div className="stat-card">
          <h3>Active Reviews</h3>
          <span className="stat-number">{activeReviews.length}</span>
        </div>
        <div className="stat-card">
          <h3>Flagged Reviews</h3>
          <span className="stat-number">{flaggedReviews.length}</span>
        </div>
      </div>

      {flaggedReviews.length > 0 && (
        <div className="flagged-section">
          <h2>Flagged Reviews</h2>
          <div className="reviews-list">
            {flaggedReviews.map(review => (
              <div key={review.id} className="review-card flagged">
                <div className="review-header">
                  <div className="review-info">
                    <h4>{review.study_spot_name || review.location_name || 'Unknown Location'}</h4>
                    <div className="review-meta">
                      <span className="rating">{'⭐'.repeat(review.rating || 0)}</span>
                      <span className="author">by {review.user_email || 'Anonymous'}</span>
                      <span className="time">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="review-status">
                    <span className="status-badge flagged">FLAGGED</span>
                    <span className="reports">{review.reports} reports</span>
                  </div>
                </div>
                
                <p className="review-comment">{review.comment}</p>
                
                <div className="review-stats">
                  <span>👍 {review.helpful} helpful</span>
                  <span>👎 {review.notHelpful} not helpful</span>
                </div>
                
                <div className="moderation-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleApproveReview(review.id)}
                  >
                    Approve Review
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleRemoveReview(review.id)}
                  >
                    Remove Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="active-section">
        <h2>Active Reviews</h2>
        <div className="reviews-list">
          {activeReviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="review-info">
                  <h4>{review.study_spot_name || review.location_name || 'Unknown Location'}</h4>
                  <div className="review-meta">
                    <span className="rating">{'⭐'.repeat(review.rating || 0)}</span>
                    <span className="author">by {review.user_email || 'Anonymous'}</span>
                    <span className="time">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="review-status">
                  <span className="status-badge active">ACTIVE</span>
                </div>
              </div>
              
              <p className="review-comment">{review.comment}</p>
              
              <div className="review-stats">
                <span>👍 {review.helpful_count || 0} helpful</span>
                <span>👎 {review.not_helpful_count || 0} not helpful</span>
                {review.reports > 0 && <span>🚩 {review.reports} reports</span>}
              </div>
              
              <div className="moderation-actions">
                <button 
                  className="btn btn-outline"
                  onClick={() => handleUpvote(review.id)}
                >
                  👍 Upvote
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => handleDownvote(review.id)}
                >
                  👎 Downvote
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => handleReport(review.id)}
                >
                  🚩 Report
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleRemoveReview(review.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="moderation-actions">
        <Link to="/results" className="btn btn-secondary">
          Back to Results
        </Link>
        <Link to="/" className="btn btn-secondary">
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default Moderation
