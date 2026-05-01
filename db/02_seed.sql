-- StudySpot Seed Data (Level 2 Specification)
-- Realistic test data (3-5 rows per table) honoring relationships

-- Insert users
INSERT INTO users (display_name, email) VALUES
('Alex Chen', 'student1@university.edu'),
('Sarah Johnson', 'student2@university.edu'),
('Mike Wilson', 'student3@university.edu'),
('Emma Davis', 'student4@university.edu'),
('James Brown', 'student5@university.edu');

-- Insert locations (includes basic location data)
INSERT INTO locations (name, address, latitude, longitude, seating_type, purchase_required, has_public_restroom, has_wifi, has_outlets) VALUES
('University Library Main Floor', '123 Campus Ave, University City, CA 92101', 32.7767, -117.0698, 'mixed', false, true, true, true),
('Campus Coffee Shop', '456 Student Center Dr, University City, CA 92101', 32.7758, -117.0705, 'table', true, true, true, false),
('Student Union Building', '789 Union Way, University City, CA 92101', 32.7775, -117.0689, 'lounge', false, true, true, true),
('Engineering Study Lounge', '321 Tech Hall, University City, CA 92101', 32.7782, -117.0672, 'desk', false, true, true, true),
('Downtown Public Library', '555 Main St, University City, CA 92101', 32.7745, -117.0712, 'mixed', false, true, true, true);

-- Insert business hours (separate structured entity)
INSERT INTO business_hours (location_id, day_of_week, open_time, close_time) VALUES
-- University Library Main Floor
((SELECT location_id FROM locations WHERE name = 'University Library Main Floor'), 'monday', '08:00', '22:00'),
((SELECT location_id FROM locations WHERE name = 'University Library Main Floor'), 'tuesday', '08:00', '22:00'),
((SELECT location_id FROM locations WHERE name = 'University Library Main Floor'), 'wednesday', '08:00', '22:00'),
((SELECT location_id FROM locations WHERE name = 'University Library Main Floor'), 'thursday', '08:00', '22:00'),
((SELECT location_id FROM locations WHERE name = 'University Library Main Floor'), 'friday', '08:00', '20:00'),
((SELECT location_id FROM locations WHERE name = 'University Library Main Floor'), 'saturday', '10:00', '18:00'),
((SELECT location_id FROM locations WHERE name = 'University Library Main Floor'), 'sunday', '12:00', '18:00'),

-- Campus Coffee Shop
((SELECT location_id FROM locations WHERE name = 'Campus Coffee Shop'), 'monday', '07:00', '20:00'),
((SELECT location_id FROM locations WHERE name = 'Campus Coffee Shop'), 'tuesday', '07:00', '20:00'),
((SELECT location_id FROM locations WHERE name = 'Campus Coffee Shop'), 'wednesday', '07:00', '20:00'),
((SELECT location_id FROM locations WHERE name = 'Campus Coffee Shop'), 'thursday', '07:00', '20:00'),
((SELECT location_id FROM locations WHERE name = 'Campus Coffee Shop'), 'friday', '07:00', '20:00'),
((SELECT location_id FROM locations WHERE name = 'Campus Coffee Shop'), 'saturday', '08:00', '18:00'),
((SELECT location_id FROM locations WHERE name = 'Campus Coffee Shop'), 'sunday', '09:00', '16:00'),

-- Student Union Building
((SELECT location_id FROM locations WHERE name = 'Student Union Building'), 'monday', '06:00', '23:00'),
((SELECT location_id FROM locations WHERE name = 'Student Union Building'), 'tuesday', '06:00', '23:00'),
((SELECT location_id FROM locations WHERE name = 'Student Union Building'), 'wednesday', '06:00', '23:00'),
((SELECT location_id FROM locations WHERE name = 'Student Union Building'), 'thursday', '06:00', '23:00'),
((SELECT location_id FROM locations WHERE name = 'Student Union Building'), 'friday', '06:00', '23:00'),
((SELECT location_id FROM locations WHERE name = 'Student Union Building'), 'saturday', '08:00', '22:00'),
((SELECT location_id FROM locations WHERE name = 'Student Union Building'), 'sunday', '10:00', '20:00'),

-- Engineering Study Lounge
((SELECT location_id FROM locations WHERE name = 'Engineering Study Lounge'), 'monday', '07:00', '22:00'),
((SELECT location_id FROM locations WHERE name = 'Engineering Study Lounge'), 'tuesday', '07:00', '22:00'),
((SELECT location_id FROM locations WHERE name = 'Engineering Study Lounge'), 'wednesday', '07:00', '22:00'),
((SELECT location_id FROM locations WHERE name = 'Engineering Study Lounge'), 'thursday', '07:00', '22:00'),
((SELECT location_id FROM locations WHERE name = 'Engineering Study Lounge'), 'friday', '07:00', '20:00'),
((SELECT location_id FROM locations WHERE name = 'Engineering Study Lounge'), 'saturday', '09:00', '17:00'),

-- Downtown Public Library
((SELECT location_id FROM locations WHERE name = 'Downtown Public Library'), 'monday', '09:00', '21:00'),
((SELECT location_id FROM locations WHERE name = 'Downtown Public Library'), 'tuesday', '09:00', '21:00'),
((SELECT location_id FROM locations WHERE name = 'Downtown Public Library'), 'wednesday', '09:00', '21:00'),
((SELECT location_id FROM locations WHERE name = 'Downtown Public Library'), 'thursday', '09:00', '21:00'),
((SELECT location_id FROM locations WHERE name = 'Downtown Public Library'), 'friday', '09:00', '18:00'),
((SELECT location_id FROM locations WHERE name = 'Downtown Public Library'), 'saturday', '10:00', '17:00'),
((SELECT location_id FROM locations WHERE name = 'Downtown Public Library'), 'sunday', '12:00', '16:00');

-- Insert reviews (updated with new fields)
INSERT INTO reviews (user_id, location_id, overall_rating, noise_level_value, outlet_availability_value, crowding_value, wifi_quality_value, study_type_value, time_of_day_visited, comment_text) VALUES
-- University Library reviews
((SELECT user_id FROM users WHERE email = 'student1@university.edu'), (SELECT location_id FROM locations WHERE name = 'University Library Main Floor'), 5, 2, 4, 3, 5, 'solo', 'afternoon', 'Great for quiet study. Plenty of desks and the WiFi is reliable.'),
((SELECT user_id FROM users WHERE email = 'student2@university.edu'), (SELECT location_id FROM locations WHERE name = 'University Library Main Floor'), 4, 3, 4, 4, 4, 'both', 'evening', 'Can get crowded during midterms, but overall excellent study environment.'),
((SELECT user_id FROM users WHERE email = 'student3@university.edu'), (SELECT location_id FROM locations WHERE name = 'Campus Coffee Shop'), 3, 4, 1, 3, 4, 'group', 'morning', 'Nice atmosphere but can be noisy. Good for group work, not so much for focused study.'),
((SELECT user_id FROM users WHERE email = 'student4@university.edu'), (SELECT location_id FROM locations WHERE name = 'Student Union Building'), 4, 3, 5, 3, 4, 'both', 'afternoon', 'Lots of seating options and outlets. Great for long study sessions.'),
((SELECT user_id FROM users WHERE email = 'student5@university.edu'), (SELECT location_id FROM locations WHERE name = 'Engineering Study Lounge'), 5, 2, 4, 2, 5, 'solo', 'evening', 'Perfect for engineering students. Quiet and has whiteboards for problem solving.'),
((SELECT user_id FROM users WHERE email = 'student1@university.edu'), (SELECT location_id FROM locations WHERE name = 'Downtown Public Library'), 4, 1, 4, 3, 4, 'solo', 'morning', 'Beautiful building and very quiet. Parking can be challenging though.');

-- Insert review votes (new entity)
INSERT INTO review_votes (review_id, user_id, vote_type) VALUES
-- Upvote the library reviews
((SELECT review_id FROM reviews WHERE user_id = (SELECT user_id FROM users WHERE email = 'student1@university.edu') AND location_id = (SELECT location_id FROM locations WHERE name = 'University Library Main Floor')), (SELECT user_id FROM users WHERE email = 'student3@university.edu'), 'upvote'),
((SELECT review_id FROM reviews WHERE user_id = (SELECT user_id FROM users WHERE email = 'student2@university.edu') AND location_id = (SELECT location_id FROM locations WHERE name = 'University Library Main Floor')), (SELECT user_id FROM users WHERE email = 'student4@university.edu'), 'upvote'),
-- Downvote the coffee shop review
((SELECT review_id FROM reviews WHERE user_id = (SELECT user_id FROM users WHERE email = 'student3@university.edu') AND location_id = (SELECT location_id FROM locations WHERE name = 'Campus Coffee Shop')), (SELECT user_id FROM users WHERE email = 'student5@university.edu'), 'downvote'),
-- Upvote the engineering lounge review
((SELECT review_id FROM reviews WHERE user_id = (SELECT user_id FROM users WHERE email = 'student5@university.edu') AND location_id = (SELECT location_id FROM locations WHERE name = 'Engineering Study Lounge')), (SELECT user_id FROM users WHERE email = 'student2@university.edu'), 'upvote');

-- Insert review reports
INSERT INTO review_reports (review_id, user_id, reason) VALUES
-- Report the coffee shop review as potentially misleading
((SELECT review_id FROM reviews WHERE user_id = (SELECT user_id FROM users WHERE email = 'student3@university.edu') AND location_id = (SELECT location_id FROM locations WHERE name = 'Campus Coffee Shop')), 
 (SELECT user_id FROM users WHERE email = 'student2@university.edu'), 'Review seems outdated - coffee shop has been renovated recently');
