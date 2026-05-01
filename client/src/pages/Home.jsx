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
      <p>Find the perfect study spot near you</p>
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for study spots..."
            className="search-input"
          />
          <button type="submit" className="btn btn-primary search-btn">
            Search
          </button>
        </div>
      </form>

      <div className="home-actions">
        <Link to="/results" className="btn btn-secondary">
          Browse All Spots
        </Link>
      </div>
    </div>
  )
}

export default Home
