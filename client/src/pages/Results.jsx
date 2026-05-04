import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import apiService from '../services/api'
import MapView from '../components/MapView'

const Results = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [sortBy, setSortBy] = useState('rating')
  const [viewMode, setViewMode] = useState('list') // Default to list view as requested
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
      
      // Build API parameters
      const params = {
        search: searchQuery || undefined,
        noise_level: filters.noiseLevel || undefined,
        wifi_available: filters.wifi ? true : undefined,
        power_outlets: filters.outlets ? true : undefined,
        sort_by: sortBy === 'closest' ? 'name' : sortBy === 'highest rated' ? 'rating' : sortBy,
        order: sortBy === 'closest' ? 'asc' : 'desc'
      }

      // Remove undefined parameters
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key])

      const response = await apiService.getStudySpots(params)
      setStudySpots(response.study_spots || [])
    } catch (err) {
      setError('Failed to load study spots. Please try again.')
      console.error('Error fetching study spots:', err)
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
          placeholder="Search by name..."
          className="search-input"
        />
        <button className="btn btn-primary">Search</button>
        <button className="btn btn-secondary">Browse Nearby</button>
      </div>

      {/* View Toggle */}
      <div className="view-toggle">
        <button 
          className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => setViewMode('list')}
        >
          📋 List View
        </button>
        <button 
          className={`view-toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
          onClick={() => setViewMode('map')}
        >
          🗺️ Map View
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
            <label>View:</label>
            <div className="view-toggle">
              <button 
                className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setViewMode('list')}
              >
                List
              </button>
              <button 
                className={`btn ${viewMode === 'map' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setViewMode('map')}
              >
                Map
              </button>
            </div>
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
          
          {viewMode === 'list' ? (
            <div className="results-list">
              {studySpots.map(spot => (
                <div key={spot.id} className="result-card">
                  <div className="result-header">
                    <h3>{spot.name}</h3>
                    <div className="result-meta">
                      <span className="rating">⭐ {spot.average_rating || 'No rating'}</span>
                      <span className="review-count">({spot.review_count || 0} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="result-tags">
                    {spot.wifi_available && <span className="tag">wifi</span>}
                    {spot.power_outlets && <span className="tag">outlets</span>}
                    <span className="tag">{spot.noise_level}</span>
                  </div>
                  
                  <div className="result-status">
                    <span className="seating">Capacity: {spot.capacity}</span>
                  </div>
                  
                  <div className="result-actions">
                    <Link to={`/location/${spot.id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="map-view-container">
              <MapView 
                studySpots={studySpots} 
                onSpotClick={handleSpotClick}
                userLocation={null}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Results
