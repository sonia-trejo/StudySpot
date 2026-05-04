const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

let secretsLoaded = false;
let supabase = null;

async function loadSecrets() {
  if (secretsLoaded) {
    return;
  }

  try {
    const secretsManager = new SecretsManagerClient({ region: 'us-east-1' });
    
    const command = new GetSecretValueCommand({
      SecretId: 'studyspot/api/prod'
    });
    
    const response = await secretsManager.send(command);
    const secrets = JSON.parse(response.SecretString);
    
    // Initialize Supabase client
    supabase = createClient(
      secrets.SUPABASE_URL,
      secrets.SUPABASE_SERVICE_ROLE_KEY
    );
    
    secretsLoaded = true;
    console.log('Secrets loaded successfully');
  } catch (error) {
    console.error('Error loading secrets:', error);
    throw error;
  }
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Content-Type': 'application/json'
};

// Helper function to create response
function createResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body)
  };
}

// Extract user from JWT token
function extractUserFromToken(event) {
  const authHeader = event.headers?.Authorization || event.headers?.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  
  try {
    // This is a simplified approach - in production, you'd verify with Supabase
    const decoded = jwt.decode(token);
    return decoded?.sub || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

// API handlers
async function getStudySpots(event) {
  try {
    const { data, error } = await supabase
      .from('study_spots')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return createResponse(200, { study_spots: data });
  } catch (error) {
    console.error('Error fetching study spots:', error);
    return createResponse(500, { error: 'Failed to fetch study spots' });
  }
}

async function createReview(event) {
  try {
    const userId = extractUserFromToken(event);
    
    if (!userId) {
      return createResponse(401, { error: 'Authentication required' });
    }

    const reviewData = JSON.parse(event.body);
    
    // Add user_id to the review data
    const reviewWithUser = {
      ...reviewData,
      user_id: userId
    };

    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewWithUser])
      .select();

    if (error) throw error;

    return createResponse(201, { review: data[0] });
  } catch (error) {
    console.error('Error creating review:', error);
    return createResponse(500, { error: 'Failed to create review' });
  }
}

async function getReviews(event) {
  try {
    const locationId = event.queryStringParameters?.location_id;
    
    let query = supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (locationId) {
      query = query.eq('location_id', locationId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return createResponse(200, { reviews: data });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return createResponse(500, { error: 'Failed to fetch reviews' });
  }
}

async function getHealth(event) {
  return createResponse(200, { 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    message: 'StudySpot API is running with Supabase integration'
  });
}

// Main Lambda handler
exports.handler = async (event, context) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return createResponse(200, {});
  }

  // Load secrets
  await loadSecrets();

  const path = event.path || event.requestContext?.http?.path || '';
  const method = event.httpMethod || event.requestContext?.http?.method;

  console.log(`Method: ${method}, Path: ${path}`);

  try {
    // Route handling
    if (path === '/health' && method === 'GET') {
      return await getHealth(event);
    }
    
    if (path === '/api/study-spots' && method === 'GET') {
      return await getStudySpots(event);
    }
    
    if (path === '/api/reviews' && method === 'GET') {
      return await getReviews(event);
    }
    
    if (path === '/api/reviews' && method === 'POST') {
      return await createReview(event);
    }

    // Default response for unknown routes
    return createResponse(404, { error: 'Route not found' });
    
  } catch (error) {
    console.error('Lambda handler error:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};
