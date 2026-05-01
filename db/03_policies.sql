-- StudySpot RLS Policies and Permissions (Level 2 Specification)
-- Row Level Security for data protection and access control

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_reports ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Users can only see their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Users can insert their own profile (handled by auth trigger)
CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Locations table policies (public read access, authenticated write access)
CREATE POLICY "Public can view locations" ON locations
    FOR SELECT USING (true);

-- Authenticated users can create new locations
CREATE POLICY "Authenticated users can create locations" ON locations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Location owners can update their locations (for now, any authenticated user)
CREATE POLICY "Authenticated users can update locations" ON locations
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Business hours table policies (same as locations)
CREATE POLICY "Public can view business hours" ON business_hours
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create business hours" ON business_hours
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update business hours" ON business_hours
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Reviews table policies
CREATE POLICY "Public can view reviews" ON reviews
    FOR SELECT USING (true);

-- Users can create reviews for locations
CREATE POLICY "Authenticated users can create reviews" ON reviews
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid()::text = user_id::text);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews" ON reviews
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews" ON reviews
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Review votes table policies
CREATE POLICY "Public can view review votes" ON review_votes
    FOR SELECT USING (true);

-- Authenticated users can vote on reviews
CREATE POLICY "Authenticated users can vote on reviews" ON review_votes
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        auth.uid()::text = user_id::text AND
        review_id NOT IN (SELECT review_id FROM review_votes WHERE user_id::text = auth.uid()::text)
    );

-- Users can update their own votes
CREATE POLICY "Users can update own votes" ON review_votes
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Users can delete their own votes
CREATE POLICY "Users can delete own votes" ON review_votes
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Review reports table policies
CREATE POLICY "Public can view review reports" ON review_reports
    FOR SELECT USING (true);

-- Authenticated users can report reviews
CREATE POLICY "Authenticated users can report reviews" ON review_reports
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        auth.uid()::text = user_id::text AND
        review_id NOT IN (SELECT review_id FROM review_reports WHERE user_id::text = auth.uid()::text)
    );

-- Service role bypass for admin operations
-- The service role key can bypass all RLS policies for admin tasks

-- Function to check if user is admin (for future admin features)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT auth.jwt() ->> 'role' = 'service_role';
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
