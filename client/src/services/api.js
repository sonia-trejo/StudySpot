// API service for StudySpot client
const API_BASE_URL = 'https://rwyer8alwl.execute-api.us-east-1.amazonaws.com';

// Debug: Log API URL
console.log('API_BASE_URL:', API_BASE_URL);

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Direct Supabase connection for real data
  async getRealStudySpots(params = {}) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      
      const supabase = createClient(
        'https://qeqpwqdnwbjsgldiorte.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlcXB3cWRud2Jqc2dsZGlvcnRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NjM4NDYsImV4cCI6MjA5MzEzOTg0Nn0.Ea3GLnoqhoAmzMUF2DK2iDLoqPYr_0_LHeuyUIslzmo'
      );
      
      let query = supabase
        .from('study_spots')
        .select('*');
      
      // Apply filters if provided
      if (params.search) {
        query = query.ilike('name', `%${params.search}%`);
      }
      
      if (params.sort_by) {
        const ascending = params.order === 'asc';
        query = query.order(params.sort_by, { ascending });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return { study_spots: data || [] };
    } catch (error) {
      console.error('Supabase connection failed:', error);
      throw error;
    }
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
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw new Error(`Failed to connect to API: ${error.message}. Please check your connection and try again.`, { cause: error });
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
    try {
      // Get current user from Supabase auth
      const { createClient } = await import('@supabase/supabase-js');
      
      const supabase = createClient(
        'https://qeqpwqdnwbjsgldiorte.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlcXB3cWRud2Jqc2dsZGlvcnRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NjM4NDYsImV4cCI6MjA5MzEzOTg0Nn0.Ea3GLnoqhoAmzMUF2DK2iDLoqPYr_0_LHeuyUIslzmo'
      );
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('User not authenticated. Please log in to submit a review.');
      }
      
      // Add user_id to review data for RLS compliance
      const reviewWithUserId = {
        ...reviewData,
        user_id: user.id
      };
      
      // Insert directly into Supabase to ensure user_id is set correctly
      const { data, error } = await supabase
        .from('reviews')
        .insert([reviewWithUserId])
        .select();
      
      if (error) throw error;
      
      return data[0];
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
