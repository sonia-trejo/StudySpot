import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import apiService from '../services/api'

const Review = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    location_id: '', // Will be set from URL param or user selection
    rating: 0,
    noiseLevel: '',
    wifiQuality: '',
    outlets: '',
    crowding: '',
    timeVisited: '',
    visitType: '',
    comment: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.location_id) {
      newErrors.location_id = 'Please select a study spot'
    }
    
    if (formData.rating === 0) {
      newErrors.rating = 'Star rating is required'
    }
    
    if (!formData.noiseLevel) {
      newErrors.noiseLevel = 'Noise level is required'
    }
    
    if (!formData.wifiQuality) {
      newErrors.wifiQuality = 'WiFi quality is required'
    }
    
    if (!formData.outlets) {
      newErrors.outlets = 'Outlet availability is required'
    }
    
    if (!formData.crowding) {
      newErrors.crowding = 'Crowding level is required'
    }
    
    if (!formData.timeVisited) {
      newErrors.timeVisited = 'Time visited is required'
    }
    
    if (!formData.visitType) {
      newErrors.visitType = 'Visit type is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleStarRating = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }))
    if (errors.rating) {
      setErrors(prev => ({
        ...prev,
        rating: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      try {
        setIsSubmitting(true)
        
        // Map form data to API format
        const reviewData = {
          location_id: parseInt(formData.location_id),
          rating: formData.rating,
          noise_level: formData.noiseLevel,
          wifi_quality: formData.wifiQuality,
          outlets: formData.outlets,
          crowding: formData.crowding,
          time_visited: formData.timeVisited,
          visit_type: formData.visitType,
          comment: formData.comment || undefined
        }
        
        await apiService.createReview(reviewData)
        setIsSubmitted(true)
        console.log('Review submitted successfully:', reviewData)
      } catch (error) {
        console.error('Error submitting review:', error)
        setErrors({ submit: 'Failed to submit review. Please try again.' })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  if (isSubmitted) {
    return (
      <div className="review-page">
        <h1>Review Submitted!</h1>
        <div className="success-message">
          <p>Thank you for your review! Your feedback helps others find great study spots.</p>
          <div className="success-actions">
            <Link to="/results" className="btn btn-primary">
              Browse Study Spots
            </Link>
            <Link to="/" className="btn btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="review-page">
      <h1>Write a Review</h1>
      <p>Share your experience to help others find the perfect study spot</p>
      
      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label htmlFor="location_id">Study Spot *</label>
          <select
            id="location_id"
            name="location_id"
            value={formData.location_id}
            onChange={(e) => setFormData(prev => ({ ...prev, location_id: e.target.value }))}
            className={errors.location_id ? 'error' : ''}
          >
            <option value="">Select a study spot</option>
            <option value="1">University Library - 3rd Floor</option>
            <option value="2">Student Union Coffee Shop</option>
            <option value="3">Engineering Computer Lab</option>
            <option value="4">Campus Green Space</option>
            <option value="5">Medical Study Lounge</option>
          </select>
          {errors.location_id && <span className="error-message">{errors.location_id}</span>}
        </div>

        <div className="form-group">
          <label>Star Rating *</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star ${star <= formData.rating ? 'filled' : ''}`}
                onClick={() => handleStarRating(star)}
              >
                ⭐
              </button>
            ))}
          </div>
          {errors.rating && <span className="error-message">{errors.rating}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="noiseLevel">Noise Level *</label>
          <select
            id="noiseLevel"
            name="noiseLevel"
            value={formData.noiseLevel}
            onChange={handleChange}
            className={errors.noiseLevel ? 'error' : ''}
          >
            <option value="">Select noise level</option>
            <option value="very-quiet">Very Quiet</option>
            <option value="quiet">Quiet</option>
            <option value="moderate">Moderate</option>
            <option value="loud">Loud</option>
            <option value="very-loud">Very Loud</option>
          </select>
          {errors.noiseLevel && <span className="error-message">{errors.noiseLevel}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="wifiQuality">WiFi Quality *</label>
          <select
            id="wifiQuality"
            name="wifiQuality"
            value={formData.wifiQuality}
            onChange={handleChange}
            className={errors.wifiQuality ? 'error' : ''}
          >
            <option value="">Select WiFi quality</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
            <option value="none">No WiFi</option>
          </select>
          {errors.wifiQuality && <span className="error-message">{errors.wifiQuality}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="outlets">Outlet Availability *</label>
          <select
            id="outlets"
            name="outlets"
            value={formData.outlets}
            onChange={handleChange}
            className={errors.outlets ? 'error' : ''}
          >
            <option value="">Select outlet availability</option>
            <option value="plenty">Plenty of outlets</option>
            <option value="some">Some outlets</option>
            <option value="few">Few outlets</option>
            <option value="none">No outlets</option>
          </select>
          {errors.outlets && <span className="error-message">{errors.outlets}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="crowding">Crowding Level *</label>
          <select
            id="crowding"
            name="crowding"
            value={formData.crowding}
            onChange={handleChange}
            className={errors.crowding ? 'error' : ''}
          >
            <option value="">Select crowding level</option>
            <option value="empty">Empty</option>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="busy">Busy</option>
            <option value="very-busy">Very Busy</option>
          </select>
          {errors.crowding && <span className="error-message">{errors.crowding}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="timeVisited">Time Visited *</label>
          <select
            id="timeVisited"
            name="timeVisited"
            value={formData.timeVisited}
            onChange={handleChange}
            className={errors.timeVisited ? 'error' : ''}
          >
            <option value="">Select time</option>
            <option value="morning">Morning (6AM-12PM)</option>
            <option value="afternoon">Afternoon (12PM-6PM)</option>
            <option value="evening">Evening (6PM-12AM)</option>
            <option value="night">Night (12AM-6AM)</option>
          </select>
          {errors.timeVisited && <span className="error-message">{errors.timeVisited}</span>}
        </div>

        <div className="form-group">
          <label>Visit Type *</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="visitType"
                value="solo"
                checked={formData.visitType === 'solo'}
                onChange={handleChange}
              />
              Solo
            </label>
            <label>
              <input
                type="radio"
                name="visitType"
                value="group"
                checked={formData.visitType === 'group'}
                onChange={handleChange}
              />
              Group
            </label>
            <label>
              <input
                type="radio"
                name="visitType"
                value="both"
                checked={formData.visitType === 'both'}
                onChange={handleChange}
              />
              Both
            </label>
          </div>
          {errors.visitType && <span className="error-message">{errors.visitType}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="comment">Optional Comment</label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows="4"
            placeholder="Share more details about your experience..."
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
          <Link to="/results" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
        
        {errors.submit && <span className="error-message">{errors.submit}</span>}
      </form>
    </div>
  )
}

export default Review
