import { useState, useEffect } from 'react'

const MapView = ({ studySpots, onSpotClick, userLocation }) => {
  const [mapLoaded, setMapLoaded] = useState(true) // Set to true immediately

  useEffect(() => {
    // Map loads immediately now
    setMapLoaded(true)
  }, [])

  return (
    <div className="map-container">
      <div className="map-wrapper">
        {/* Simple static map visualization */}
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
                title="Your location"
              >
                📍
              </div>
            )}
            
            {/* Study spot markers */}
            {studySpots.map((spot, index) => {
              // Simple positioning based on index for demo
              const positions = [
                { left: '30%', top: '30%' },
                { left: '70%', top: '25%' },
                { left: '45%', top: '60%' },
                { left: '75%', top: '70%' },
                { left: '25%', top: '75%' }
              ]
              
              const pos = positions[index % positions.length]
              
              return (
                <div
                  key={spot.id}
                  className="map-marker spot-marker"
                  style={pos}
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
