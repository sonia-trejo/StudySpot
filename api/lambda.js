const serverless = require('serverless-http');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
require('dotenv').config();

// Import the existing Express app
const app = require('./server');

// Load secrets from AWS Secrets Manager (only in production)
let secretsLoaded = false;

async function loadSecrets() {
  if (secretsLoaded || process.env.AWS_OFFLINE) {
    return;
  }

  try {
    const secretsManager = new SecretsManagerClient({ region: 'us-east-1' });
    
    const command = new GetSecretValueCommand({
      SecretId: 'studyspot/api/prod'
    });
    
    const response = await secretsManager.send(command);
    const secrets = JSON.parse(response.SecretString);
    
    // Set environment variables from secrets
    process.env.SUPABASE_URL = secrets.SUPABASE_URL;
    process.env.SUPABASE_ANON_KEY = secrets.SUPABASE_ANON_KEY;
    process.env.SUPABASE_SERVICE_ROLE_KEY = secrets.SUPABASE_SERVICE_ROLE_KEY;
    
    secretsLoaded = true;
    console.log('Secrets loaded successfully from AWS Secrets Manager');
  } catch (error) {
    console.error('Error loading secrets:', error);
    throw error;
  }
}

// Lambda handler
exports.handler = async (event, context) => {
  // Load secrets before handling the request
  await loadSecrets();
  
  // Use serverless-http to wrap the Express app
  const handler = serverless(app);
  return handler(event, context);
};
