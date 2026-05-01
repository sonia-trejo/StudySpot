# Database Migration Instructions

## Setup Instructions

### 1. Run Schema Migration
Execute the schema script first to create all tables:
```sql
-- In Supabase SQL Editor or via psql
\i db/01_schema.sql
```

### 2. Run Seed Data
Populate the database with test data:
```sql
\i db/02_seed.sql
```

### 3. Apply Security Policies (Optional but Recommended)
Enable Row Level Security and access policies:
```sql
\i db/03_policies.sql
```

### 4. Verify Installation
Check that everything was created correctly:
```sql
\i db/verify_schema.sql
```

## Expected Results

After running all scripts, you should have:
- **6 tables**: users, locations, location_details, reviews, ratings, review_reports
- **5 users**, **5 locations**, **6 reviews**, **6 ratings**, **1 review report**
- Proper foreign key relationships and constraints
- Row Level Security policies enabled
- Indexes for performance optimization

## Testing in Supabase

1. Go to your Supabase Dashboard → SQL Editor
2. Copy and paste each script content (or upload files)
3. Run scripts in order: 01_schema → 02_seed → 03_policies
4. Run verify_schema.sql to confirm setup

## Reset Database

To start fresh, run:
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO public;
```

Then re-run the migration scripts in order.
