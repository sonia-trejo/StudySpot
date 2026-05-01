-- StudySpot Database Schema (Level 2 Specification)
-- Tables, Primary Keys, Foreign Keys, and Constraints

-- Users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    display_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Locations table (includes basic location data)
CREATE TABLE locations (
    location_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    seating_type VARCHAR(50) CHECK (seating_type IN ('desk', 'table', 'lounge', 'mixed')),
    purchase_required BOOLEAN DEFAULT false,
    has_public_restroom BOOLEAN DEFAULT false,
    has_wifi BOOLEAN DEFAULT false,
    has_outlets BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Hours table (separate structured entity)
CREATE TABLE business_hours (
    business_hour_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES locations(location_id) ON DELETE CASCADE,
    day_of_week VARCHAR(10) NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
    open_time TIME,
    close_time TIME,
    UNIQUE(location_id, day_of_week)
);

-- Reviews table (updated with new fields)
CREATE TABLE reviews (
    review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES locations(location_id) ON DELETE CASCADE,
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
    noise_level_value INTEGER CHECK (noise_level_value >= 1 AND noise_level_value <= 5),
    outlet_availability_value INTEGER CHECK (outlet_availability_value >= 1 AND outlet_availability_value <= 5),
    crowding_value INTEGER CHECK (crowding_value >= 1 AND crowding_value <= 5),
    wifi_quality_value INTEGER CHECK (wifi_quality_value >= 1 AND wifi_quality_value <= 5),
    study_type_value VARCHAR(20) CHECK (study_type_value IN ('solo', 'group', 'both')),
    time_of_day_visited VARCHAR(20) CHECK (time_of_day_visited IN ('morning', 'afternoon', 'evening', 'night')),
    comment_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, location_id) -- One review per user per location
);

-- Review Votes table (new entity)
CREATE TABLE review_votes (
    vote_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES reviews(review_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    vote_type VARCHAR(10) CHECK (vote_type IN ('upvote', 'downvote')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(review_id, user_id) -- One vote per user per review
);

-- Review Reports table
CREATE TABLE review_reports (
    report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES reviews(review_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    reason VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(review_id, user_id) -- One report per user per review
);

-- Indexes for performance
CREATE INDEX idx_locations_coordinates ON locations(latitude, longitude);
CREATE INDEX idx_business_hours_location_id ON business_hours(location_id);
CREATE INDEX idx_reviews_location_id ON reviews(location_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_review_votes_review_id ON review_votes(review_id);
CREATE INDEX idx_review_votes_user_id ON review_votes(user_id);
CREATE INDEX idx_review_reports_review_id ON review_reports(review_id);
CREATE INDEX idx_review_reports_user_id ON review_reports(user_id);
