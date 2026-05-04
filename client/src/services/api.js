// API service for StudySpot client
const API_BASE_URL = import.meta.env.VITE_API_BASE || 'https://vdz04zruk5.execute-api.us-east-1.amazonaws.com/prod';

// Mock data fallback for when API is not available
const mockStudySpots = [
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
    capacity: 150,
    latitude: 40.7128,
    longitude: -74.0060,
    amenities: "Private study rooms, printing services, reference desk",
    seating_type: "Individual desks, group tables"
  },
  {
    id: 2,
    name: "Campus Coffee Shop",
    location: "5678 Student Union, University Town",
    description: "Cozy atmosphere with good coffee and background music",
    average_rating: 4.2,
    review_count: 18,
    wifi_available: true,
    power_outlets: true,
    noise_level: "Moderate",
    capacity: 50,
    latitude: 40.7130,
    longitude: -74.0058,
    amenities: "Coffee, snacks, comfortable seating",
    seating_type: "Tables, couches, bar seating"
  },
  {
    id: 3,
    name: "Science Building Study Hall",
    location: "9101 Research Blvd, University Town",
    description: "Modern study hall with whiteboards and collaborative spaces",
    average_rating: 4.7,
    review_count: 31,
    wifi_available: true,
    power_outlets: true,
    noise_level: "Quiet",
    capacity: 80,
    latitude: 40.7126,
    longitude: -74.0062,
    amenities: "Whiteboards, projectors, group study rooms",
    seating_type: "Individual desks, collaborative tables"
  },
  {
    id: 4,
    name: "Student Center Lounge",
    location: "3456 Campus Center, University Town",
    description: "Relaxed atmosphere perfect for group study",
    average_rating: 4.0,
    review_count: 15,
    wifi_available: true,
    power_outlets: false,
    noise_level: "Moderate",
    capacity: 60,
    latitude: 40.7129,
    longitude: -74.0059,
    amenities: "Vending machines, microwave, comfortable seating",
    seating_type: "Couches, lounge chairs, group tables"
  },
  {
    id: 5,
    name: "Engineering Lab",
    location: "7890 Tech Park, University Town",
    description: "High-tech lab with specialized equipment",
    average_rating: 4.3,
    review_count: 12,
    wifi_available: true,
    power_outlets: true,
    noise_level: "Quiet",
    capacity: 40,
    latitude: 40.7127,
    longitude: -74.0061,
    amenities: "Computers, specialized software, technical support",
    seating_type: "Computer workstations, technical benches"
  },
  {
    id: 6,
    name: "Art Studio",
    location: "2345 Creative Arts, University Town",
    description: "Inspiring space for creative work and study",
    average_rating: 4.6,
    review_count: 8,
    wifi_available: true,
    power_outlets: true,
    noise_level: "Moderate",
    capacity: 30,
    latitude: 40.7131,
    longitude: -74.0057,
    amenities: "Art supplies, natural lighting, inspiration boards",
    seating_type: "Art tables, easels, flexible seating"
  }
];

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method for making API requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      console.log('Falling back to mock data');
      
      // Return mock data for study spots endpoint
      if (endpoint.includes('/study-spots')) {
        return { study_spots: mockStudySpots };
      }
      
      // Return mock data for specific study spot
      if (endpoint.includes('/study-spots/') && endpoint.split('/').pop()) {
        const id = parseInt(endpoint.split('/').pop());
        const spot = mockStudySpots.find(s => s.id === id);
        if (spot) return spot;
      }
      
      // Return mock health check
      if (endpoint.includes('/health')) {
        return { 
          status: 'healthy', 
          timestamp: new Date().toISOString(),
          message: 'StudySpot API is running (mock version)'
        };
      }
      
      throw error;
    }
  }

  // GET /api/health
  async healthCheck() {
    return this.request('/health');
  }

  // GET /api/study-spots
  async getStudySpots(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/study-spots?${queryString}` : '/study-spots';
    return this.request(endpoint);
  }

  // GET /api/study-spots/:id
  async getStudySpot(id) {
    return this.request(`/study-spots/${id}`);
  }

  // POST /api/study-spots
  async createStudySpot(studySpotData) {
    return this.request('/study-spots', {
      method: 'POST',
      body: JSON.stringify(studySpotData),
    });
  }

  // GET /api/reviews
  async getReviews(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/reviews?${queryString}` : '/reviews';
    return this.request(endpoint);
  }

  // POST /api/reviews
  async createReview(reviewData) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
