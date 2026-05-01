import { useParams, Link } from 'react-router-dom'

const StudySpotDetail = () => {
  const { id } = useParams()
  
  // Mock data - in a real app this would come from an API
  const studySpots = {
    1: {
      id: 1,
      name: "University Library - 3rd Floor",
      location: "Main Campus, Building A",
      description: "Quiet study area with individual carrels and group study rooms. Perfect for focused studying and research work.",
      capacity: 45,
      amenities: "WiFi, Power outlets, Printers, Whiteboards, Reference books",
      noiseLevel: "quiet",
      wifiAvailable: true,
      powerOutlets: true,
      rating: 4.5,
      hours: "Mon-Fri: 8AM-10PM, Sat-Sun: 10AM-8PM",
      rules: "No food allowed, quiet conversation only, valid student ID required"
    },
    2: {
      id: 2,
      name: "Student Union Coffee Shop",
      location: "Student Union Building, 1st Floor",
      description: "Casual study environment with coffee and snacks available. Great for group work and collaborative projects.",
      capacity: 30,
      amenities: "WiFi, Coffee, Snacks, Comfortable seating, Background music",
      noiseLevel: "moderate",
      wifiAvailable: true,
      powerOutlets: true,
      rating: 4.2,
      hours: "Mon-Fri: 7AM-9PM, Sat-Sun: 9AM-7PM",
      rules: "No outside food, clean up after yourself, respect noise levels"
    },
    3: {
      id: 3,
      name: "Engineering Computer Lab",
      location: "Engineering Building, Room 205",
      description: "24/7 computer lab with specialized engineering software and high-performance workstations.",
      capacity: 25,
      amenities: "Computers, WiFi, Power outlets, Specialized software, Printers",
      noiseLevel: "quiet",
      wifiAvailable: true,
      powerOutlets: true,
      rating: 4.0,
      hours: "24/7 access with student ID",
      rules: "Engineering students only, no food or drink, save work to cloud storage"
    },
    4: {
      id: 4,
      name: "Campus Green Space",
      location: "Between Library and Science Building",
      description: "Outdoor study area with benches and tables. Perfect for nice weather and fresh air studying.",
      capacity: 15,
      amenities: "Outdoor seating, Natural light, Fresh air, Beautiful views",
      noiseLevel: "moderate",
      wifiAvailable: false,
      powerOutlets: false,
      rating: 3.8,
      hours: "Sunrise to sunset, weather permitting",
      rules: "Clean up after yourself, respect campus property, no smoking"
    },
    5: {
      id: 5,
      name: "Medical Study Lounge",
      location: "Medical Center, 2nd Floor",
      description: "Quiet lounge specifically for medical students with medical reference materials and anatomy models.",
      capacity: 20,
      amenities: "WiFi, Power outlets, Medical reference books, Anatomy models, Private study rooms",
      noiseLevel: "quiet",
      wifiAvailable: true,
      powerOutlets: true,
      rating: 4.7,
      hours: "Mon-Fri: 6AM-11PM, Sat-Sun: 8AM-10PM",
      rules: "Medical students only, absolute quiet, no food, disinfect surfaces"
    },
    6: {
      id: 6,
      name: "Art Studio Study Area",
      location: "Fine Arts Building, Room 101",
      description: "Creative space with natural lighting and art supplies. Ideal for art students and creative projects.",
      capacity: 12,
      amenities: "Natural light, Art supplies, WiFi, Easels, Storage lockers",
      noiseLevel: "moderate",
      wifiAvailable: true,
      powerOutlets: false,
      rating: 4.1,
      hours: "Mon-Fri: 9AM-9PM, Sat: 10AM-6PM, Closed Sunday",
      rules: "Art students preferred, clean up supplies, respect shared materials"
    }
  }

  const studySpot = studySpots[id]

  if (!studySpot) {
    return (
      <div className="study-spot-detail-page">
        <h1>Study Spot Not Found</h1>
        <p>The study spot you're looking for doesn't exist.</p>
        <Link to="/study-spots" className="btn btn-primary">
          Back to Study Spots
        </Link>
      </div>
    )
  }

  const getNoiseLevelBadge = (level) => {
    const badges = {
      quiet: { class: 'badge-quiet', text: 'Quiet' },
      moderate: { class: 'badge-moderate', text: 'Moderate' },
      loud: { class: 'badge-loud', text: 'Loud' }
    }
    return badges[level] || badges.moderate
  }

  return (
    <div className="study-spot-detail-page">
      <div className="detail-header">
        <h1>{studySpot.name}</h1>
        <div className="header-meta">
          <span className={`noise-badge ${getNoiseLevelBadge(studySpot.noiseLevel).class}`}>
            {getNoiseLevelBadge(studySpot.noiseLevel).text}
          </span>
          <span className="rating">⭐ {studySpot.rating}</span>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-section">
          <h2>Location</h2>
          <p>📍 {studySpot.location}</p>
        </div>

        <div className="detail-section">
          <h2>Description</h2>
          <p>{studySpot.description}</p>
        </div>

        <div className="detail-grid">
          <div className="detail-section">
            <h2>Capacity</h2>
            <p>{studySpot.capacity} people</p>
          </div>

          <div className="detail-section">
            <h2>Hours</h2>
            <p>{studySpot.hours}</p>
          </div>
        </div>

        <div className="detail-section">
          <h2>Amenities</h2>
          <div className="amenities-detail">
            <div className="amenity-icons">
              {studySpot.wifiAvailable && <span className="amenity-icon">📶 WiFi</span>}
              {studySpot.powerOutlets && <span className="amenity-icon">🔌 Power Outlets</span>}
            </div>
            <p>{studySpot.amenities}</p>
          </div>
        </div>

        <div className="detail-section">
          <h2>Rules & Guidelines</h2>
          <p>{studySpot.rules}</p>
        </div>
      </div>

      <div className="detail-actions">
        <Link to="/study-spots" className="btn btn-secondary">
          ← Back to All Study Spots
        </Link>
        <Link to="/dashboard" className="btn btn-outline">
          Dashboard
        </Link>
      </div>
    </div>
  )
}

export default StudySpotDetail
