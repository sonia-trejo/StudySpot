// API service for StudySpot client
const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

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
