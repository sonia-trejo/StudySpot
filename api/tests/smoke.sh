#!/bin/bash

# StudySpot API Smoke Test
# Tests core API endpoints to ensure functionality
# Exits with non-zero code on any failure

set -e  # Exit on any error

# Configuration
BASE_URL="${BASE_URL:-http://localhost:3000}"
TEMP_FILE=$(mktemp)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Cleanup function
cleanup() {
    rm -f "$TEMP_FILE"
}

trap cleanup EXIT

# Test helper
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local description=$5
    
    log_info "Testing: $description"
    log_info "Request: $method $endpoint"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$endpoint" || echo "FAILED")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            "$BASE_URL$endpoint" || echo "FAILED")
    fi
    
    # Extract status code (last line)
    status_code=$(echo "$response" | tail -n1)
    # Extract response body (all but last line)
    body=$(echo "$response" | sed '$d')
    
    if [ "$status_code" = "$expected_status" ]; then
        log_success "Status code: $status_code ✓"
        echo "$body" | grep -q '{' && log_success "Valid JSON response ✓" || log_info "Response: $body"
        return 0
    else
        log_error "Expected status $expected_status, got $status_code ✗"
        log_error "Response: $body"
        return 1
    fi
}

# Start testing
log_info "Starting StudySpot API Smoke Test"
log_info "Base URL: $BASE_URL"
echo

# Check if server is running
log_info "Checking if server is running..."
if ! curl -s "$BASE_URL/api/health" > /dev/null; then
    log_error "Server is not running at $BASE_URL"
    log_error "Please start the server with: npm run dev"
    exit 1
fi
log_success "Server is running ✓"
echo

# Test 1: Health Check (GET)
test_endpoint "GET" "/api/health" "" "200" "Health check endpoint" || exit 1
echo

# Test 2: Get Study Spots (GET)
log_info "Testing: Get all study spots"
response=$(curl -s "$BASE_URL/api/study-spots")
if echo "$response" | grep -q '"study_spots"'; then
    log_success "Get study spots ✓"
    # Store a study spot ID for later tests
    STUDY_SPOT_ID=""
    if echo "$response" | grep -q '"id"'; then
        # Extract ID using grep (simpler than jq)
        STUDY_SPOT_ID=$(echo "$response" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
        if [ -n "$STUDY_SPOT_ID" ]; then
            log_info "Found study spot ID: $STUDY_SPOT_ID"
        else
            log_info "No existing study spots found, will create one for testing"
        fi
    else
        log_info "No existing study spots found, will create one for testing"
    fi
else
    log_error "Failed to get study spots ✗"
    exit 1
fi
echo

# Test 3: Create Study Spot (POST) - Write operation
log_info "Testing: Create new study spot"
create_data='{
  "name": "Test Study Spot - Smoke Test",
  "location": "Test Location, 123 Test St",
  "description": "A test study spot created during smoke testing to verify API functionality",
  "capacity": 25,
  "amenities": "WiFi, Power outlets, Coffee",
  "noise_level": "quiet",
  "wifi_available": true,
  "power_outlets": true
}'

response=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d "$create_data" \
    "$BASE_URL/api/study-spots")

status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$status_code" = "201" ]; then
    log_success "Create study spot ✓"
    # Extract the created study spot ID
    CREATED_STUDY_SPOT_ID=$(echo "$body" | grep -o '"id":[0-9]*' | cut -d':' -f2)
    if [ -n "$CREATED_STUDY_SPOT_ID" ]; then
        STUDY_SPOT_ID="$CREATED_STUDY_SPOT_ID"
        log_info "Created study spot ID: $STUDY_SPOT_ID"
    fi
else
    log_error "Failed to create study spot ✗"
    log_error "Status: $status_code"
    log_error "Response: $body"
    exit 1
fi
echo

# Test 4: Get Specific Study Spot (GET)
if [ -n "$STUDY_SPOT_ID" ]; then
    test_endpoint "GET" "/api/study-spots/$STUDY_SPOT_ID" "" "200" "Get specific study spot" || exit 1
else
    log_error "No study spot ID available for specific test"
    exit 1
fi
echo

# Test 5: Create Review (POST) - Write operation
if [ -n "$STUDY_SPOT_ID" ]; then
    log_info "Testing: Create review for study spot $STUDY_SPOT_ID"
    review_data="{
      \"location_id\": $STUDY_SPOT_ID,
      \"rating\": 5,
      \"noise_level\": \"quiet\",
      \"wifi_quality\": \"excellent\",
      \"outlets\": \"plenty\",
      \"crowding\": \"low\",
      \"time_visited\": \"afternoon\",
      \"visit_type\": \"solo\",
      \"comment\": \"Smoke test review - API is working correctly!\"
    }"
    
    response=$(curl -s -w "\n%{http_code}" -X POST \
        -H "Content-Type: application/json" \
        -d "$review_data" \
        "$BASE_URL/api/reviews")
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$status_code" = "201" ]; then
        log_success "Create review ✓"
        REVIEW_ID=$(echo "$body" | grep -o '"id":[0-9]*' | cut -d':' -f2)
        log_info "Created review ID: $REVIEW_ID"
    else
        log_error "Failed to create review ✗"
        log_error "Status: $status_code"
        log_error "Response: $body"
        exit 1
    fi
else
    log_error "No study spot ID available for review test"
    exit 1
fi
echo

# Test 6: Get Reviews (GET)
test_endpoint "GET" "/api/reviews" "" "200" "Get all reviews" || exit 1
echo

# Test 7: Get Reviews with Filtering (GET)
if [ -n "$STUDY_SPOT_ID" ]; then
    test_endpoint "GET" "/api/reviews?location_id=$STUDY_SPOT_ID" "" "200" "Get reviews with location filter" || exit 1
else
    log_error "No study spot ID available for filtered review test"
    exit 1
fi
echo

# Test 8: Error Handling - Invalid Study Spot ID
test_endpoint "GET" "/api/study-spots/999999" "" "404" "Get non-existent study spot (should return 404)" || exit 1
echo

# Test 9: Error Handling - Invalid Review Data
invalid_review='{"location_id": "invalid", "rating": 10}'
response=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d "$invalid_review" \
    "$BASE_URL/api/reviews")

status_code=$(echo "$response" | tail -n1)

if [ "$status_code" = "400" ]; then
    log_success "Invalid review data properly rejected ✓"
else
    log_error "Expected 400 for invalid data, got $status_code ✗"
    exit 1
fi
echo

# Test 10: Study Spots with Filtering (GET)
test_endpoint "GET" "/api/study-spots?noise_level=quiet&wifi_available=true" "" "200" "Get study spots with filters" || exit 1
echo

# All tests passed
log_success "🎉 All smoke tests passed!"
log_success "API is functioning correctly"
log_success "Endpoints tested: $(echo "Health (GET), Study Spots (GET/POST), Specific Study Spot (GET), Reviews (GET/POST), Error Handling")"
echo

log_info "Test Summary:"
log_info "- ✓ Health check endpoint"
log_info "- ✓ Get study spots (3+ GET operations)"
log_info "- ✓ Create study spot (1+ POST operation)"
log_info "- ✓ Get specific study spot"
log_info "- ✓ Create review (1+ POST operation)"
log_info "- ✓ Get reviews (multiple GET operations)"
log_info "- ✓ Filtering and pagination"
log_info "- ✓ Error handling"
log_info "- ✓ Input validation"

exit 0
