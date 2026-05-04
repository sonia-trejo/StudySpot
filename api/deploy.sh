#!/bin/bash

# StudySpot API Deployment Script
echo "🚀 Starting StudySpot API deployment..."

# Configuration
FUNCTION_NAME="studyspot-api"
REGION="us-east-1"
ROLE_NAME="studyspot-lambda-role"
HANDLER_FILE="simple-lambda.js"

echo "📦 Creating deployment package..."
zip -r deployment.zip $HANDLER_FILE package*.json node_modules/

echo "🔐 Creating IAM role for Lambda..."
aws iam create-role \
  --role-name $ROLE_NAME \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "lambda.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }' 2>/dev/null || echo "Role already exists"

echo "🔑 Attaching policies to role..."
aws iam attach-role-policy \
  --role-name $ROLE_NAME \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam attach-role-policy \
  --role-name $ROLE_NAME \
  --policy-arn arn:aws:iam::aws:policy/SecretsManagerReadWrite

echo "⏳ Waiting for role to be available..."
sleep 10

echo "🚀 Creating Lambda function..."
aws lambda create-function \
  --function-name $FUNCTION_NAME \
  --runtime nodejs18.x \
  --role arn:aws:iam::846719029083:role/$ROLE_NAME \
  --handler simple-lambda.handler \
  --zip-file fileb://deployment.zip \
  --description "StudySpot API for managing study spots and reviews" \
  --timeout 30 \
  --memory-size 256 2>/dev/null || echo "Function already exists, updating..."

echo "🔄 Updating Lambda function..."
aws lambda update-function-code \
  --function-name $FUNCTION_NAME \
  --zip-file fileb://deployment.zip

echo "🌐 Creating API Gateway..."
API_ID=$(aws apigateway create-rest-api \
  --name "StudySpot-API" \
  --description "API Gateway for StudySpot" \
  --query 'id' \
  --output text)

echo "📋 Getting root resource ID..."
ROOT_RESOURCE_ID=$(aws apigateway get-resources \
  --rest-api-id $API_ID \
  --query 'items[0].id' \
  --output text)

echo "🛤️ Creating API Gateway resources..."
# Create proxy resource
PROXY_RESOURCE_ID=$(aws apigateway create-resource \
  --rest-api-id $API_ID \
  --parent-id $ROOT_RESOURCE_ID \
  --path-part '{proxy+}' \
  --query 'id' \
  --output text)

# Create method for proxy resource
aws apigateway put-method \
  --rest-api-id $API_ID \
  --resource-id $PROXY_RESOURCE_ID \
  --http-method ANY \
  --authorization-type "NONE"

# Create method for root resource
aws apigateway put-method \
  --rest-api-id $API_ID \
  --resource-id $ROOT_RESOURCE_ID \
  --http-method ANY \
  --authorization-type "NONE"

echo "🔗 Setting up Lambda integration..."
LAMBDA_ARN="arn:aws:lambda:us-east-1:846719029083:function:$FUNCTION_NAME"

# Integration for proxy resource
aws apigateway put-integration \
  --rest-api-id $API_ID \
  --resource-id $PROXY_RESOURCE_ID \
  --http-method ANY \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$LAMBDA_ARN/invocations

# Integration for root resource
aws apigateway put-integration \
  --rest-api-id $API_ID \
  --resource-id $ROOT_RESOURCE_ID \
  --http-method ANY \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$LAMBDA_ARN/invocations

echo "🔐 Setting up Lambda permissions..."
aws lambda add-permission \
  --function-name $FUNCTION_NAME \
  --statement-id apigateway-invoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn arn:aws:execute-api:$REGION:846719029083:$API_ID/*/*/*

echo "🚀 Deploying API Gateway..."
aws apigateway create-deployment \
  --rest-api-id $API_ID \
  --stage-name prod

echo "🌍 Getting API Gateway URL..."
API_URL="https://$API_ID.execute-api.$REGION.amazonaws.com/prod"

echo "✅ Deployment completed!"
echo "📍 API URL: $API_URL"
echo "🧪 Health endpoint: $API_URL/health"
echo "📚 Study spots endpoint: $API_URL/api/study-spots"

echo "🧪 Testing API..."
curl -s "$API_URL/health" | jq .

echo "🧪 Testing study spots..."
curl -s "$API_URL/api/study-spots" | jq .

echo "🧹 Cleaning up..."
rm deployment.zip

echo "🎉 StudySpot API is now live at: $API_URL"
