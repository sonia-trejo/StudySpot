require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createClient } = require('@supabase/supabase-js');
const Joi = require('joi');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['https://main.d2jgun0v56d66n.amplifyapp.com', 'https://*.amplifyapp.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Debug: Check environment variables
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set');

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Validation schemas
const studySpotSchema = Joi.object({
  name: Joi.string().required().min(1).max(255),
  location: Joi.string().required().min(1).max(500),
  description: Joi.string().required().min(10).max(1000),
  capacity: Joi.number().integer().min(1).max(1000).required(),
  amenities: Joi.string().max(500),
  noise_level: Joi.string().valid('quiet', 'moderate', 'loud').required(),
  wifi_available: Joi.boolean().required(),
  power_outlets: Joi.boolean().required()
});

const reviewSchema = Joi.object({
  location_id: Joi.number().integer().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  noise_level: Joi.string().valid('very-quiet', 'quiet', 'moderate', 'loud', 'very-loud').required(),
  wifi_quality: Joi.string().valid('excellent', 'good', 'fair', 'poor', 'none').required(),
  outlets: Joi.string().valid('plenty', 'some', 'few', 'none').required(),
  crowding: Joi.string().valid('empty', 'low', 'moderate', 'busy', 'very-busy').required(),
  time_visited: Joi.string().valid('morning', 'afternoon', 'evening', 'night').required(),
  visit_type: Joi.string().valid('solo', 'group', 'both').required(),
  comment: Joi.string().max(1000).optional()
});

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

// Routes

// GET /api/health - Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'StudySpot API'
  });
});

// GET /api/study-spots - Get all study spots with optional filtering
app.get('/api/study-spots', async (req, res) => {
  try {
    const { 
      search, 
      noise_level, 
      wifi_available, 
      power_outlets, 
      open_now,
      min_rating,
      max_distance,
      sort_by = 'name',
      order = 'asc',
      page = 1,
      limit = 20
    } = req.query;

    let query = supabase
      .from('study_spots')
      .select(`
        *,
        reviews(rating)
      `);

    // Apply filters
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    
    if (noise_level) {
      query = query.eq('noise_level', noise_level);
    }
    
    if (wifi_available !== undefined) {
      query = query.eq('wifi_available', wifi_available === 'true');
    }
    
    if (power_outlets !== undefined) {
      query = query.eq('power_outlets', power_outlets === 'true');
    }

    // Apply sorting
    const validSortFields = ['name', 'rating', 'created_at', 'capacity'];
    if (validSortFields.includes(sort_by)) {
      query = query.order(sort_by, { ascending: order === 'asc' });
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    // Calculate average ratings
    const spotsWithRatings = data.map(spot => ({
      ...spot,
      average_rating: spot.reviews.length > 0 
        ? spot.reviews.reduce((sum, review) => sum + review.rating, 0) / spot.reviews.length 
        : null,
      review_count: spot.reviews.length
    }));

    res.json({
      study_spots: spotsWithRatings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/study-spots/:id - Get specific study spot with reviews
app.get('/api/study-spots/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid study spot ID' });
    }

    const { data: spot, error: spotError } = await supabase
      .from('study_spots')
      .select('*')
      .eq('id', id)
      .single();

    if (spotError) {
      if (spotError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Study spot not found' });
      }
      throw spotError;
    }

    // Get reviews for this spot
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('location_id', id)
      .order('created_at', { ascending: false });

    if (reviewsError) throw reviewsError;

    // Calculate rating breakdown
    const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      ratingBreakdown[review.rating]++;
    });

    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : null;

    res.json({
      ...spot,
      reviews,
      rating_breakdown: ratingBreakdown,
      average_rating: averageRating,
      review_count: reviews.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/reviews - Get reviews with optional filtering
app.get('/api/reviews', async (req, res) => {
  try {
    const { 
      location_id, 
      min_rating, 
      max_rating,
      sort_by = 'created_at',
      order = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    let query = supabase
      .from('reviews')
      .select(`
        *,
        study_spots(name, location)
      `);

    // Apply filters
    if (location_id) {
      query = query.eq('location_id', location_id);
    }
    
    if (min_rating) {
      query = query.gte('rating', min_rating);
    }
    
    if (max_rating) {
      query = query.lte('rating', max_rating);
    }

    // Apply sorting
    const validSortFields = ['created_at', 'rating', 'location_id'];
    if (validSortFields.includes(sort_by)) {
      query = query.order(sort_by, { ascending: order === 'asc' });
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      reviews: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/reviews - Create a new review
app.post('/api/reviews', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = reviewSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    // Check if study spot exists
    const { data: spot, error: spotError } = await supabase
      .from('study_spots')
      .select('id')
      .eq('id', value.location_id)
      .single();

    if (spotError || !spot) {
      return res.status(404).json({ error: 'Study spot not found' });
    }

    // Create review
    const { data: review, error: insertError } = await supabase
      .from('reviews')
      .insert({
        ...value,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) throw insertError;

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/study-spots - Create a new study spot
app.post('/api/study-spots', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = studySpotSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    // Create study spot
    const { data: spot, error: insertError } = await supabase
      .from('study_spots')
      .insert({
        ...value,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) throw insertError;

    res.status(201).json(spot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`StudySpot API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
