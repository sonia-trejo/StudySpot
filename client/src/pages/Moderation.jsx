import { useState } from 'react'
import { Link } from 'react-router-dom'

const Moderation = () => {
  // Mock review data
  const [reviews, setReviews] = useState([
    {
      id: 1,
      locationName: "University Library - 3rd Floor",
      rating: 5,
      comment: "Perfect for focused studying! Great WiFi and quiet atmosphere.",
      author: "Student A",
      time: "2 hours ago",
      helpful: 12,
      notHelpful: 2,
      reports: 0,
      status: "active"
    },
    {
      id: 2,
      locationName: "Student Union Coffee Shop",
      rating: 2,
      comment: "Too noisy and WiFi was terrible. Couldn't get any work done.",
      author: "Student B",
      time: "4 hours ago",
      helpful: 3,
      notHelpful: 8,
      reports: 1,
      status: "active"
    },
    {
      id: 3,
      locationName: "Engineering Computer Lab",
      rating: 4,
      comment: "Good facilities but can get crowded during peak hours.",
      author: "Student C",
      time: "1 day ago",
      helpful: 15,
      notHelpful: 4,
      reports: 0,
      status: "active"
    },
    {
      id: 4,
      locationName: "Campus Green Space",
      rating: 1,
      comment: "This is a terrible study spot! No outlets and weather is bad. Waste of time!!!",
      author: "Student D",
      time: "2 days ago",
      helpful: 1,
      notHelpful: 12,
      reports: 3,
      status: "flagged"
    },
    {
      id: 5,
      locationName: "Medical Study Lounge",
      rating: 5,
      comment: "Excellent facilities, very quiet, perfect for medical students.",
      author: "Student E",
      time: "3 days ago",
      helpful: 20,
      notHelpful: 1,
      reports: 0,
      status: "active"
    }
  ])

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

  const activeReviews = reviews.filter(review => review.status === 'active')
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
                    <h4>{review.locationName}</h4>
                    <div className="review-meta">
                      <span className="rating">{'⭐'.repeat(review.rating)}</span>
                      <span className="author">by {review.author}</span>
                      <span className="time">{review.time}</span>
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
                  <h4>{review.locationName}</h4>
                  <div className="review-meta">
                    <span className="rating">{'⭐'.repeat(review.rating)}</span>
                    <span className="author">by {review.author}</span>
                    <span className="time">{review.time}</span>
                  </div>
                </div>
                <div className="review-status">
                  <span className="status-badge active">ACTIVE</span>
                </div>
              </div>
              
              <p className="review-comment">{review.comment}</p>
              
              <div className="review-stats">
                <span>👍 {review.helpful} helpful</span>
                <span>👎 {review.notHelpful} not helpful</span>
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
