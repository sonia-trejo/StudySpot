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
  const [authData, setAuthData] = useState({ email: '', password: '', confirmPassword: '' })
  const [isSignUpMode, setIsSignUpMode] = useState(false)

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
      newErrors.crowding = 'Crowd level is required'
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
      
      // Validate auth form
      if (!authData.email || !authData.password) {
        setErrors({ submit: 'Please fill in all required fields.' })
        return
      }
      
      if (isSignUpMode && authData.password !== authData.confirmPassword) {
        setErrors({ submit: 'Passwords do not match.' })
        return
      }
      
      // Authenticate with Supabase
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        'https://qeqpwqdnwbjsgldiorte.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlcXB3cWRud2Jqc2dsZGlvcnRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NjM4NDYsImV4cCI6MjA5MzEzOTg0Nn0.Ea3GLnoqhoAmzMUF2DK2iDLoqPYr_0_LHeuyUIslzmo'
      )
      
      let authResult
      if (isSignUpMode) {
        authResult = await supabase.auth.signUp({
          email: authData.email,
          password: authData.password
        })
      } else {
        authResult = await supabase.auth.signInWithPassword({
          email: authData.email,
          password: authData.password
        })
      }
      
      if (authResult.error) {
        setErrors({ submit: authResult.error.message })
        return
      }
      
      // Map form data to API format
      const reviewData = {
        location_id: parseInt(formData.location_id),
        rating: formData.rating,
        noise_level: formData.noiseLevel,
        wifi_quality: formData.wifiQuality,
        outlets: formData.outlets === 'available' ? 'plenty' : formData.outlets,
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
  
  const toggleAuthMode = () => {
    setIsSignUpMode(!isSignUpMode)
    setErrors({})
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
          <div className="radio-group">
            {[
              { value: 'quiet', label: 'Quiet' },
              { value: 'moderate', label: 'Moderate' },
              { value: 'loud', label: 'Loud' }
            ].map((option) => (
              <label key={option.value}>
                <input
                  type="radio"
                  name="noiseLevel"
                  value={option.value}
                  checked={formData.noiseLevel === option.value}
                  onChange={handleChange}
                />
                {option.label}
              </label>
            ))}
          </div>
          {errors.noiseLevel && <span className="error-message">{errors.noiseLevel}</span>}
        </div>

        <div className="form-group">
          <label>WiFi Quality *</label>
          <div className="radio-group">
            {[
              { value: 'poor', label: 'Poor' },
              { value: 'okay', label: 'Okay' },
              { value: 'fast', label: 'Fast' },
              { value: 'very-fast', label: 'Very Fast' }
            ].map((option) => (
              <label key={option.value}>
                <input
                  type="radio"
                  name="wifiQuality"
                  value={option.value}
                  checked={formData.wifiQuality === option.value}
                  onChange={handleChange}
                />
                {option.label}
              </label>
            ))}
          </div>
          {errors.wifiQuality && <span className="error-message">{errors.wifiQuality}</span>}
        </div>

        <div className="form-group">
          <label>Outlet Availability *</label>
          <div className="radio-group">
            {[
              { value: 'none', label: 'None' },
              { value: 'limited', label: 'Limited' },
              { value: 'plenty', label: 'Plenty' }
            ].map((option) => (
              <label key={option.value}>
                <input
                  type="radio"
                  name="outlets"
                  value={option.value}
                  checked={formData.outlets === option.value}
                  onChange={handleChange}
                />
                {option.label}
              </label>
            ))}
          </div>
          {errors.outlets && <span className="error-message">{errors.outlets}</span>}
        </div>

        <div className="form-group">
          <label>Crowd Level *</label>
          <div className="radio-group">
            {[
              { value: 'empty', label: 'Empty' },
              { value: 'chill', label: 'Chill' },
              { value: 'busy', label: 'Busy' },
              { value: 'packed', label: 'Packed' }
            ].map((option) => (
              <label key={option.value}>
                <input
                  type="radio"
                  name="crowding"
                  value={option.value}
                  checked={formData.crowding === option.value}
                  onChange={handleChange}
                />
                {option.label}
              </label>
            ))}
          </div>
          {errors.crowding && <span className="error-message">{errors.crowding}</span>}
        </div>

        <div className="form-group">
          <label>Time Visited *</label>
          <div className="radio-group">
            {[
              { value: 'morning', label: 'Morning' },
              { value: 'afternoon', label: 'Afternoon' },
              { value: 'evening', label: 'Evening' },
              { value: 'night', label: 'Night' }
            ].map((option) => (
              <label key={option.value}>
                <input
                  type="radio"
                  name="timeVisited"
                  value={option.value}
                  checked={formData.timeVisited === option.value}
                  onChange={handleChange}
                />
                {option.label}
              </label>
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
              <h2>{isSignUpMode ? 'Sign Up to Submit Review' : 'Sign In to Submit Review'}</h2>
              <button 
                type="button" 
                className="close-btn" 
                onClick={() => setShowAuthPrompt(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="auth-modal-body">
              <p>{isSignUpMode ? 'Create an account to submit your review. Your feedback helps other students find great study spots!' : 'Please sign in to submit your review. Your feedback helps other students find great study spots!'}</p>
              
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
                
                {isSignUpMode && (
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={authData.confirmPassword}
                      onChange={(e) => setAuthData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm your password"
                      className="auth-input"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="auth-modal-footer">
              <div className="auth-toggle">
                <span>{isSignUpMode ? 'Already have an account?' : "Don't have an account?"}</span>
                <button 
                  type="button" 
                  className="link-btn" 
                  onClick={toggleAuthMode}
                >
                  {isSignUpMode ? 'Sign In' : 'Sign Up'}
                </button>
              </div>
              
              <div className="auth-actions">
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
                  disabled={!authData.email || !authData.password || (isSignUpMode && !authData.confirmPassword) || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : (isSignUpMode ? 'Sign Up & Submit Review' : 'Sign In & Submit Review')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Review
