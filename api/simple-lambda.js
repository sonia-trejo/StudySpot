const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const { createClient } = require('@supabase/supabase-js');

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

// API handlers
async function getStudySpots(event) {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return createResponse(200, { study_spots: data });
  } catch (error) {
    console.error('Error fetching study spots:', error);
    return createResponse(500, { error: 'Failed to fetch study spots' });
  }
}

async function getHealth(event) {
  return createResponse(200, { status: 'healthy', timestamp: new Date().toISOString() });
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
    
    if (path === '/api/study-spots' && method === 'POST') {
      // TODO: Implement create study spot
      return createResponse(501, { error: 'Not implemented yet' });
    }

    // Default response for unknown routes
    return createResponse(404, { error: 'Route not found' });
    
  } catch (error) {
    console.error('Lambda handler error:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
};
