// Simple test Lambda function
exports.handler = async (event, context) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Content-Type': 'application/json'
  };

  function createResponse(statusCode, body) {
    return {
      statusCode: statusCode,
      headers: corsHeaders,
      body: JSON.stringify(body)
    };
  }

  const path = event.path || event.requestContext?.http?.path || '';
  const method = event.httpMethod || event.requestContext?.http?.method;

  console.log(`Method: ${method}, Path: ${path}`);

  try {
    if (path === '/health' && method === 'GET') {
      return createResponse(200, { 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        message: 'StudySpot API is running (test version)'
      });
    }
    
    if (path === '/api/study-spots' && method === 'GET') {
      // Study spots with real coordinates (example locations)
      const allStudySpots = [
        {
          id: 1,
          name: "University Library",
          location: "1234 Campus Drive, University Town",
          description: "Quiet study space with WiFi and plenty of outlets",
          average_rating: 4.5,
          review_count: 23,
          wifi_available: true,
          power_outlets: true,
          noise_level: "Quiet",
          latitude: 40.7128,
          longitude: -74.0060,
          capacity: 150,
          amenities: "WiFi, Outlets, Quiet Rooms, Printers",
          seating_type: "Individual Study Rooms"
        },
        {
          id: 2,
          name: "Student Union Building",
          location: "567 Student Way, University Town",
          description: "Collaborative study area with group tables",
          average_rating: 4.2,
          review_count: 18,
          wifi_available: true,
          power_outlets: true,
          noise_level: "Moderate",
          latitude: 40.7260,
          longitude: -74.0180,
          capacity: 80,
          amenities: "WiFi, Outlets, Group Tables, Café",
          seating_type: "Group Study Tables"
        },
        {
          id: 3,
          name: "Engineering Study Hall",
          location: "890 Tech Lane, University Town",
          description: "24/7 study space for engineering students",
          average_rating: 4.7,
          review_count: 31,
          wifi_available: true,
          power_outlets: true,
          noise_level: "Quiet",
          latitude: 40.7080,
          longitude: -74.0120,
          capacity: 200,
          amenities: "WiFi, Outlets, Whiteboards, 24/7 Access",
          seating_type: "Mixed Seating"
        },
        {
          id: 4,
          name: "Campus Coffee Shop",
          location: "321 Brew Street, University Town",
          description: "Casual study spot with good coffee",
          average_rating: 3.9,
          review_count: 15,
          wifi_available: true,
          power_outlets: false,
          noise_level: "Moderate",
          latitude: 40.7200,
          longitude: -74.0080,
          capacity: 40,
          amenities: "WiFi, Coffee, Snacks",
          seating_type: "Casual Seating"
        },
        {
          id: 5,
          name: "Science Library",
          location: "456 Research Road, University Town",
          description: "Specialized science resources and quiet study areas",
          average_rating: 4.6,
          review_count: 27,
          wifi_available: true,
          power_outlets: true,
          noise_level: "Quiet",
          latitude: 40.7150,
          longitude: -74.0200,
          capacity: 120,
          amenities: "WiFi, Outlets, Science Resources, Study Rooms",
          seating_type: "Individual Study Rooms"
        }
      ];

      // Parse query parameters for filtering
      const queryParams = event.queryStringParameters || {};
      let filteredSpots = [...allStudySpots];

      // Apply filters if provided
      if (queryParams.search) {
        const searchLower = queryParams.search.toLowerCase();
        filteredSpots = filteredSpots.filter(spot => 
          spot.name.toLowerCase().includes(searchLower) ||
          spot.location.toLowerCase().includes(searchLower) ||
          spot.description.toLowerCase().includes(searchLower)
        );
      }

      if (queryParams.noise_level) {
        filteredSpots = filteredSpots.filter(spot => 
          spot.noise_level.toLowerCase() === queryParams.noise_level.toLowerCase()
        );
      }

      if (queryParams.wifi_available === 'true') {
        filteredSpots = filteredSpots.filter(spot => spot.wifi_available);
      }

      if (queryParams.power_outlets === 'true') {
        filteredSpots = filteredSpots.filter(spot => spot.power_outlets);
      }

      // Apply sorting
      if (queryParams.sort_by) {
        if (queryParams.sort_by === 'rating') {
          filteredSpots.sort((a, b) => b.average_rating - a.average_rating);
        } else if (queryParams.sort_by === 'name') {
          filteredSpots.sort((a, b) => a.name.localeCompare(b.name));
        }
      }

      return createResponse(200, { study_spots: filteredSpots });
    }

    return createResponse(404, { error: 'Route not found' });
    
  } catch (error) {
    console.error('Lambda handler error:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};
