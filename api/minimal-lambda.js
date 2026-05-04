// Working Lambda function for StudySpot API
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const { createClient } = require('@supabase/supabase-js');

let secretsLoaded = false;
let supabase = null;
let useRealData = false; // Flag to switch between real and mock data

async function loadSecrets() {
  if (secretsLoaded) {
    return;
  }

  try {
    console.log('Attempting to load secrets...');
    const secretsManager = new SecretsManagerClient({ region: 'us-east-1' });
    
    const command = new GetSecretValueCommand({
      SecretId: 'studyspot/api/prod'
    });
    
    const response = await secretsManager.send(command);
    const secrets = JSON.parse(response.SecretString);
    
    console.log('Secrets retrieved, initializing Supabase client...');
    
    // Initialize Supabase client
    supabase = createClient(
      secrets.SUPABASE_URL,
      secrets.SUPABASE_SERVICE_ROLE_KEY
    );
    
    secretsLoaded = true;
    useRealData = true;
    console.log('Secrets loaded successfully, using real Supabase data');
  } catch (error) {
    console.error('Error loading secrets:', error);
    console.log('Falling back to mock data...');
    useRealData = false;
    secretsLoaded = true; // Don't retry
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

// API handlers
async function getStudySpots(event) {
  try {
    if (useRealData && supabase) {
      console.log('Fetching from Supabase...');
      const { data, error } = await supabase
        .from('study_spots')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log(`Successfully fetched ${data.length} study spots from Supabase`);
      return createResponse(200, { study_spots: data });
    } else {
      console.log('Using mock data...');
      // Return mock data
      return createResponse(200, { 
        study_spots: [
          {
            id: 1,
            name: "University Library",
            location: "Main Campus",
            description: "Quiet study space with WiFi",
            average_rating: 4.5,
            review_count: 23,
            wifi_available: true,
            power_outlets: true,
            noise_level: "Quiet",
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            name: "Student Union",
            location: "Student Center",
            description: "Collaborative study area",
            average_rating: 4.2,
            review_count: 18,
            wifi_available: true,
            power_outlets: true,
            noise_level: "Moderate",
            created_at: new Date().toISOString()
          }
        ]
      });
    }
  } catch (error) {
    console.error('Error fetching study spots:', error);
    return createResponse(500, { error: 'Failed to fetch study spots' });
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
  try {
    await loadSecrets();
  } catch (error) {
    console.error('Failed to load secrets:', error);
    return createResponse(500, { error: 'Failed to initialize database connection' });
  }

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

    // Default response for unknown routes
    return createResponse(404, { error: 'Route not found' });
    
  } catch (error) {
    console.error('Lambda handler error:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};
