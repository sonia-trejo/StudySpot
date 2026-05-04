import { useState } from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    // Navigate to results with search query
    window.location.href = `/results?search=${encodeURIComponent(searchQuery)}`
  }

  return (
    <div className="home-page">
      <h1>StudySpot</h1>
      <p>Discover the perfect study spot near you</p>
      
      {/* Primary action - Browse available locations */}
      <div className="home-actions">
        <Link to="/results" className="btn btn-primary btn-large">
          Browse Study Spots
        </Link>
      </div>

      {/* Secondary action - Search (less prominent) */}
      <div className="secondary-search">
        <p>or search for a specific location:</p>
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for study spots..."
              className="search-input"
            />
            <button type="submit" className="btn btn-secondary search-btn">
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Home
