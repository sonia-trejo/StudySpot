Task List

Epic: Find Study Locations
Task: build search results view (frontend)
User Story: As a student, I want to browse study locations so that I can choose where to go.
Acceptance Criteria:
List of locations is displayed on page load
Data is fetched via GET /locations
Each item shows name, distance, and rating

Task: build map view (frontend)
User Story: As a student, I want to view study locations on a map so that I can see what is closest.
Acceptance Criteria:
Map displays location markers
Each marker shows location name and rating
Data is fetched via GET /locations

Task: implement location search (backend)
User Story: As a student, I want to search by location name so that I can quickly find a specific place.
Acceptance Criteria:
API endpoint GET /locations?search= returns matching results
Partial matches are supported
Returns list of matching locations

Epic: Apply Filters
Task: implement filtering API (backend)
User Story: As a student, I want to filter study locations by noise level, outlets, and other criteria so that I can find a suitable environment.
Acceptance Criteria:
API endpoint GET /locations accepts query params:
noiseLevel
outlets
wifi
seatingType
openNow
Returns filtered results
Supports multiple filters at once

Task: build filter panel (frontend)
User Story: As a student, I want to select study preferences so that results match my needs.
Acceptance Criteria:
UI includes filter options (noise, outlets, WiFi, etc.)
Selecting filters triggers API request
Results update without page reload

Epic: View Location Information
Task: build location preview cards (frontend)
User Story: As a student, I want to quickly preview locations so that I can compare options.
Acceptance Criteria:
Each card displays:
name
distance
star rating
open/closed status
Data comes from GET /locations

Task: build location details page (frontend)
User Story: As a student, I want to view full details of a location so that I can decide if it meets my needs.
Acceptance Criteria:
Page displays:
address
hours
amenities
ratings summary
Data fetched via GET /locations/:id

Task: calculate average ratings (backend)
User Story: As a student, I want to see average noise and crowding levels so that I know what to expect.
Acceptance Criteria:
API calculates averages from reviews
Returns:
average noise level
average crowding
Included in GET /locations/:id

Epic: Submit Reviews
Task: build review form (frontend)
User Story: As a user, I want to submit ratings about a location so that I can help others.
Acceptance Criteria:
Form includes:
noise rating
crowding rating
outlet rating
wifi rating
optional comment
Submit button sends POST request

Task: implement review submission API (backend)
User Story: As a user, I want my review to be saved so that others can see it.
Acceptance Criteria:
POST /reviews stores review in database
Validates required fields
Returns success response

Epic: Review Moderation
Task: implement report review feature (frontend)
User Story: As a user, I want to report misleading reviews so that inaccurate information is reduced.
Acceptance Criteria:
Each review has a “Report” button
Clicking sends POST /reviews/report

Task: handle review reporting (backend)
User Story: As a system, I want to track reported reviews so that flagged content can be managed.
Acceptance Criteria:
Reports are stored in database
Reviews flagged after threshold
Flag status returned in API