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
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [authData, setAuthData] = useState({ email: '', password: '' })

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

  const handleButtonSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field] === value ? '' : value
    }))
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Show authentication prompt before submitting
      setShowAuthPrompt(true)
    }
  }

  const handleAuthSubmit = async () => {
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
      setShowAuthPrompt(false)
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
          <label>Noise Level *</label>
          <div className="button-group">
            {[
              { value: 'very-quiet', label: 'Very Quiet', icon: '🤫' },
              { value: 'quiet', label: 'Quiet', icon: '🔇' },
              { value: 'moderate', label: 'Moderate', icon: '🔉' },
              { value: 'loud', label: 'Loud', icon: '🔊' },
              { value: 'very-loud', label: 'Very Loud', icon: '📢' }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                className={`btn-option ${formData.noiseLevel === option.value ? 'selected' : ''}`}
                onClick={() => handleButtonSelect('noiseLevel', option.value)}
              >
                <span className="option-icon">{option.icon}</span>
                <span className="option-label">{option.label}</span>
              </button>
            ))}
          </div>
          {errors.noiseLevel && <span className="error-message">{errors.noiseLevel}</span>}
        </div>

        <div className="form-group">
          <label>WiFi Quality *</label>
          <div className="button-group">
            {[
              { value: 'excellent', label: 'Excellent', icon: '🚀' },
              { value: 'good', label: 'Good', icon: '👍' },
              { value: 'fair', label: 'Fair', icon: '👌' },
              { value: 'poor', label: 'Poor', icon: '👎' },
              { value: 'none', label: 'No WiFi', icon: '❌' }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                className={`btn-option ${formData.wifiQuality === option.value ? 'selected' : ''}`}
                onClick={() => handleButtonSelect('wifiQuality', option.value)}
              >
                <span className="option-icon">{option.icon}</span>
                <span className="option-label">{option.label}</span>
              </button>
            ))}
          </div>
          {errors.wifiQuality && <span className="error-message">{errors.wifiQuality}</span>}
        </div>

        <div className="form-group">
          <label>Outlet Availability *</label>
          <div className="button-group">
            {[
              { value: 'plenty', label: 'Plenty', icon: '🔌🔌🔌' },
              { value: 'some', label: 'Some', icon: '🔌🔌' },
              { value: 'few', label: 'Few', icon: '🔌' },
              { value: 'none', label: 'None', icon: '❌' }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                className={`btn-option ${formData.outlets === option.value ? 'selected' : ''}`}
                onClick={() => handleButtonSelect('outlets', option.value)}
              >
                <span className="option-icon">{option.icon}</span>
                <span className="option-label">{option.label}</span>
              </button>
            ))}
          </div>
          {errors.outlets && <span className="error-message">{errors.outlets}</span>}
        </div>

        <div className="form-group">
          <label>Crowding Level *</label>
          <div className="button-group">
            {[
              { value: 'empty', label: 'Empty', icon: '🏜️' },
              { value: 'low', label: 'Low', icon: '👤' },
              { value: 'moderate', label: 'Moderate', icon: '👥' },
              { value: 'busy', label: 'Busy', icon: '👥👥' },
              { value: 'very-busy', label: 'Very Busy', icon: '👥👥👥' }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                className={`btn-option ${formData.crowding === option.value ? 'selected' : ''}`}
                onClick={() => handleButtonSelect('crowding', option.value)}
              >
                <span className="option-icon">{option.icon}</span>
                <span className="option-label">{option.label}</span>
              </button>
            ))}
          </div>
          {errors.crowding && <span className="error-message">{errors.crowding}</span>}
        </div>

        <div className="form-group">
          <label>Time Visited *</label>
          <div className="button-group">
            {[
              { value: 'morning', label: 'Morning', icon: '🌅', sublabel: '6AM-12PM' },
              { value: 'afternoon', label: 'Afternoon', icon: '☀️', sublabel: '12PM-6PM' },
              { value: 'evening', label: 'Evening', icon: '🌆', sublabel: '6PM-12AM' },
              { value: 'night', label: 'Night', icon: '🌙', sublabel: '12AM-6AM' }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                className={`btn-option ${formData.timeVisited === option.value ? 'selected' : ''}`}
                onClick={() => handleButtonSelect('timeVisited', option.value)}
              >
                <span className="option-icon">{option.icon}</span>
                <div className="option-text">
                  <span className="option-label">{option.label}</span>
                  <span className="option-sublabel">{option.sublabel}</span>
                </div>
              </button>
            ))}
          </div>
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

      {/* Authentication Prompt Modal */}
      {showAuthPrompt && (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <div className="auth-modal-header">
              <h2>Sign In to Submit Review</h2>
              <button 
                type="button" 
                className="close-btn" 
                onClick={() => setShowAuthPrompt(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="auth-modal-body">
              <p>Please sign in to submit your review. Your feedback helps other students find great study spots!</p>
              
              <div className="auth-form">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={authData.email}
                    onChange={(e) => setAuthData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@example.com"
                    className="auth-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={authData.password}
                    onChange={(e) => setAuthData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password"
                    className="auth-input"
                  />
                </div>
              </div>
            </div>
            
            <div className="auth-modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowAuthPrompt(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={handleAuthSubmit}
                disabled={!authData.email || !authData.password || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Sign In & Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Review
