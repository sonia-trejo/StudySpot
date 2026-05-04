import { useState, useEffect } from 'react'

const MapView = ({ studySpots, onSpotClick, userLocation }) => {
  const [mapLoaded, setMapLoaded] = useState(true)

  useEffect(() => {
    setMapLoaded(true)
  }, [])

  // Calculate relative positions for study spots based on coordinates
  const getMarkerPosition = (spot, index, total) => {
    if (!spot.latitude || !spot.longitude) {
      // Fallback positioning for spots without coordinates
      const angle = (index / total) * 2 * Math.PI
      const radius = 30
      return {
        left: `${50 + radius * Math.cos(angle)}%`,
        top: `${50 + radius * Math.sin(angle)}%`
      }
    }

    // If we have a user location, position spots relative to it
    if (userLocation && userLocation.latitude && userLocation.longitude) {
      // Calculate relative position with better scaling
      const latDiff = (spot.latitude - userLocation.latitude) * 2000 // Scale factor for better visibility
      const lonDiff = (spot.longitude - userLocation.longitude) * 2000
      
      // Constrain to map bounds
      const left = Math.max(5, Math.min(95, 50 + lonDiff))
      const top = Math.max(5, Math.min(95, 50 - latDiff))
      
      return {
        left: `${left}%`,
        top: `${top}%`
      }
    }

    // Default circular arrangement
    const angle = (index / total) * 2 * Math.PI
    const radius = 25
    return {
      left: `${50 + radius * Math.cos(angle)}%`,
      top: `${50 + radius * Math.sin(angle)}%`
    }
  }

  return (
    <div className="map-container">
      <div className="map-wrapper">
        <div className="static-map">
          <div className="map-background">
            {/* User location marker */}
            {userLocation && (
              <div 
                className="map-marker user-marker"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                title={`Your location: ${userLocation.displayName || userLocation.city || 'Searched location'}`}
              >
                📍
              </div>
            )}
            
            {/* Study spot markers */}
            {studySpots.map((spot, index) => {
              const position = getMarkerPosition(spot, index, studySpots.length)
              
              return (
                <div
                  key={spot.id}
                  className="map-marker spot-marker"
                  style={position}
                  onClick={() => onSpotClick && onSpotClick(spot)}
                  title={spot.name}
                >
                  📚
                  <div className="marker-tooltip">
                    <strong>{spot.name}</strong>
                    <br />
                    {spot.distance && `${spot.distance.toFixed(1)} km away`}
                    <br />
                    ⭐ {spot.average_rating?.toFixed(1) || 'N/A'}
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Map controls */}
          <div className="map-controls">
            <button className="map-control-btn">+</button>
            <button className="map-control-btn">−</button>
            <button className="map-control-btn">📍</button>
          </div>
        </div>
      </div>
      
      {/* Map legend */}
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-icon">📍</span>
          <span>Your Location</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">📚</span>
          <span>Study Spots</span>
        </div>
      </div>
    </div>
  )
}

export default MapView
