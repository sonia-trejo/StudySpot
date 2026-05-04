import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import apiService from '../services/api'

const Results = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name') // Default sort by name
  const [filters, setFilters] = useState({
    noiseLevel: '',
    wifi: false,
    outlets: false,
    seatingType: '',
    openNow: false,
    purchaseRequired: false,
    publicRestroom: false
  })

  const [studySpots, setStudySpots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStudySpots = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = {}
      if (searchQuery) params.search = searchQuery
      if (sortBy) params.sort_by = sortBy
      
      // Add filter parameters
      if (filters.noiseLevel) params.noise_level = filters.noiseLevel
      if (filters.wifi) params.wifi_available = true
      if (filters.outlets) params.power_outlets = true
      if (filters.seatingType) params.seating_type = filters.seatingType
      if (filters.openNow) params.open_now = true
      if (filters.purchaseRequired) params.purchase_required = true
      if (filters.publicRestroom) params.public_restroom = true
      
      const response = await apiService.getStudySpots(params)
      setStudySpots(response.study_spots || [])
    } catch (err) {
      console.error('Error fetching study spots:', err)
      setError('Failed to load study spots. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudySpots()
  }, [searchQuery, filters, sortBy])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      noiseLevel: '',
      wifi: false,
      outlets: false,
      seatingType: '',
      openNow: false,
      purchaseRequired: false,
      publicRestroom: false
    })
  }

  if (loading) {
    return (
      <div className="results-page">
        <h1>Search Results</h1>
        <div className="loading">Loading study spots...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="results-page">
        <h1>Search Results</h1>
        <div className="error">{error}</div>
        <button className="btn btn-primary" onClick={fetchStudySpots}>
          Try Again
        </button>
      </div>
    )
  }

  const handleSpotClick = (spot) => {
    navigate(`/location/${spot.id}`)
  }

  return (
    <div className="results-page">
      <h1>Search Results</h1>
      
      <div className="search-section">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by study spot name..."
          className="search-input"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              fetchStudySpots()
            }
          }}
        />
        <button className="btn btn-primary" onClick={fetchStudySpots}>
          Search
        </button>
        <button className="btn btn-secondary" onClick={() => {
          setSearchQuery('')
          fetchStudySpots()
        }}>
          Clear
        </button>
      </div>

      <div className="results-layout">
        {/* Filter Panel */}
        <div className="filter-panel">
          <h3>Filters</h3>
          
          <div className="filter-group">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Name</option>
              <option value="rating">Highest Rated</option>
              <option value="created_at">Newest</option>
              <option value="capacity">Capacity</option>
            </select>
          </div>

          
          <div className="filter-group">
            <label>Noise Level:</label>
            <select value={filters.noiseLevel} onChange={(e) => handleFilterChange('noiseLevel', e.target.value)}>
              <option value="">Any</option>
              <option value="quiet">Quiet</option>
              <option value="moderate">Moderate</option>
              <option value="loud">Loud</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.wifi}
                onChange={(e) => handleFilterChange('wifi', e.target.checked)}
              />
              WiFi
            </label>
          </div>

          <div className="filter-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.outlets}
                onChange={(e) => handleFilterChange('outlets', e.target.checked)}
              />
              Outlets
            </label>
          </div>

          <div className="filter-group">
            <label>Seating Type:</label>
            <select value={filters.seatingType} onChange={(e) => handleFilterChange('seatingType', e.target.value)}>
              <option value="">Any</option>
              <option value="individual desks">Individual Desks</option>
              <option value="tables & couches">Tables & Couches</option>
              <option value="computer desks">Computer Desks</option>
              <option value="benches & tables">Benches & Tables</option>
              <option value="private carrels">Private Carrels</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.openNow}
                onChange={(e) => handleFilterChange('openNow', e.target.checked)}
              />
              Open Now
            </label>
          </div>

          <div className="filter-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.purchaseRequired}
                onChange={(e) => handleFilterChange('purchaseRequired', e.target.checked)}
              />
              Purchase Required
            </label>
          </div>

          <div className="filter-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.publicRestroom}
                onChange={(e) => handleFilterChange('publicRestroom', e.target.checked)}
              />
              Public Restroom
            </label>
          </div>

          <div className="filter-actions">
            <button className="btn btn-primary" onClick={() => {}}>Apply Filters</button>
            <button className="btn btn-secondary" onClick={clearFilters}>Clear Filters</button>
          </div>
        </div>

        {/* Results Content */}
        <div className="results-content">
          <p>Found {studySpots.length} study spots</p>
          
          <div className="results-list">
            {studySpots.map(spot => (
              <div key={spot.id} className="result-card">
                <div className="result-header">
                  <h3>{spot.name}</h3>
                  <div className="result-meta">
                    <span className="rating">⭐ {spot.average_rating?.toFixed(1) || 'No rating'}</span>
                    <span className="review-count">({spot.review_count || 0} reviews)</span>
                  </div>
                </div>

                <div className="result-location">
                  <p>📍 {spot.location}</p>
                  {spot.distance && (
                    <p className="distance">📏 {spot.distance.toFixed(1)} km away</p>
                  )}
                </div>
                
                <div className="result-tags">
                  {spot.wifi_available && <span className="tag">📶 WiFi</span>}
                  {spot.power_outlets && <span className="tag">🔌 Outlets</span>}
                  <span className="tag">🔇 Noise: {spot.noise_level}</span>
                  {spot.seating_type && <span className="tag">🪑 Seating: {spot.seating_type}</span>}
                </div>
                
                <div className="result-details">
                  <div className="detail-item">
                    <span className="detail-label">Capacity:</span>
                    <span className="detail-value">{spot.capacity} people</span>
                  </div>
                  {spot.amenities && (
                    <div className="detail-item">
                      <span className="detail-label">Amenities:</span>
                      <span className="detail-value">{spot.amenities}</span>
                    </div>
                  )}
                </div>

                <div className="result-actions">
                  <Link to={`/location/${spot.id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Results
