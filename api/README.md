# StudySpot API

A Node.js/Express API server for managing study spots and user reviews. This API serves as the backend for the StudySpot application, connecting to a Supabase database.

## Features

- **Study Spot Management**: CRUD operations for study spots
- **Review System**: Create and retrieve reviews for study spots
- **Advanced Filtering**: Filter study spots by various criteria
- **Pagination**: Efficient pagination for large datasets
- **Input Validation**: Comprehensive request validation using Joi
- **Error Handling**: Structured error responses
- **Security**: CORS protection, helmet security headers

## Prerequisites

- Node.js 16+ and npm
- Supabase project with database tables set up
- Environment variables configured

## Installation

1. Clone the repository and navigate to the API directory:
```bash
cd api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with your Supabase credentials:
```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration (if needed)
CORS_ORIGIN=http://localhost:5173
```

## Database Setup

Make sure your Supabase database has the following tables:

### study_spots table
```sql
CREATE TABLE study_spots (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity >= 1 AND capacity <= 1000),
  amenities VARCHAR(500),
  noise_level VARCHAR(20) NOT NULL CHECK (noise_level IN ('quiet', 'moderate', 'loud')),
  wifi_available BOOLEAN NOT NULL,
  power_outlets BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### reviews table
```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  location_id INTEGER NOT NULL REFERENCES study_spots(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  noise_level VARCHAR(20) NOT NULL CHECK (noise_level IN ('very-quiet', 'quiet', 'moderate', 'loud', 'very-loud')),
  wifi_quality VARCHAR(20) NOT NULL CHECK (wifi_quality IN ('excellent', 'good', 'fair', 'poor', 'none')),
  outlets VARCHAR(20) NOT NULL CHECK (outlets IN ('plenty', 'some', 'few', 'none')),
  crowding VARCHAR(20) NOT NULL CHECK (crowding IN ('empty', 'low', 'moderate', 'busy', 'very-busy')),
  time_visited VARCHAR(20) NOT NULL CHECK (time_visited IN ('morning', 'afternoon', 'evening', 'night')),
  visit_type VARCHAR(20) NOT NULL CHECK (visit_type IN ('solo', 'group', 'both')),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Running the Server

### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:3000` and automatically restart on file changes.

### Production Mode
```bash
npm start
```

## API Endpoints

### Base URL
- Development: `http://localhost:3000`
- Production: `https://api.studyspot.com`

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/study-spots` | Get all study spots with filtering |
| POST | `/api/study-spots` | Create a new study spot |
| GET | `/api/study-spots/:id` | Get specific study spot with reviews |
| GET | `/api/reviews` | Get reviews with filtering |
| POST | `/api/reviews` | Create a new review |

### Query Parameters

#### Study Spots (`GET /api/study-spots`)
- `search` (string): Filter by name
- `noise_level` (string): Filter by noise level (quiet, moderate, loud)
- `wifi_available` (boolean): Filter by WiFi availability
- `power_outlets` (boolean): Filter by power outlet availability
- `sort_by` (string): Sort field (name, rating, created_at, capacity)
- `order` (string): Sort order (asc, desc)
- `page` (integer): Page number (default: 1)
- `limit` (integer): Items per page (default: 20, max: 100)

#### Reviews (`GET /api/reviews`)
- `location_id` (integer): Filter by study spot ID
- `min_rating` (integer): Minimum rating (1-5)
- `max_rating` (integer): Maximum rating (1-5)
- `sort_by` (string): Sort field (created_at, rating, location_id)
- `order` (string): Sort order (asc, desc)
- `page` (integer): Page number (default: 1)
- `limit` (integer): Items per page (default: 20, max: 100)

## Response Formats

### Success Response
```json
{
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": ["Detailed error messages"]
}
```

## Status Codes

- `200 OK`: Successful GET request
- `201 Created`: Successful POST request
- `400 Bad Request`: Invalid input parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Testing

### Smoke Test
Run the smoke test to verify API functionality:
```bash
npm test
```
Or directly:
```bash
bash tests/smoke.sh
```

### Manual Testing
Use curl or any API client to test endpoints:

```bash
# Health check
curl http://localhost:3000/api/health

# Get study spots
curl http://localhost:3000/api/study-spots

# Create a review
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "location_id": 1,
    "rating": 5,
    "noise_level": "quiet",
    "wifi_quality": "excellent",
    "outlets": "plenty",
    "crowding": "low",
    "time_visited": "afternoon",
    "visit_type": "solo",
    "comment": "Great place to study!"
  }'
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Yes | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Your Supabase service role key |
| `PORT` | No | Server port (default: 3000) |
| `NODE_ENV` | No | Environment (development/production) |
| `CORS_ORIGIN` | No | Allowed CORS origins |

## Security Considerations

- The service role key has full database access - keep it secure
- Use HTTPS in production
- Implement rate limiting for production
- Validate all input parameters
- Use environment variables for sensitive data

## API Documentation

Full API documentation is available in OpenAPI 3.0 format:
- [OpenAPI Specification](./openapi.yaml)

You can view the documentation using Swagger UI or other OpenAPI tools.

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify Supabase URL and service role key
   - Check if Supabase project is active
   - Ensure database tables exist

2. **CORS Errors**
   - Set `CORS_ORIGIN` environment variable
   - Check if client URL is whitelisted

3. **Validation Errors**
   - Check request body format
   - Ensure required fields are included
   - Verify field values match allowed options

4. **Port Already in Use**
   - Change PORT environment variable
   - Kill process using the port: `lsof -ti:3000 | xargs kill`

## Development Notes

- The API uses Joi for input validation
- All database operations go through Supabase
- Error responses are structured and consistent
- Pagination is implemented for all list endpoints
- The server includes security headers via helmet

## License

MIT License
