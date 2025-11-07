# Database Setup Instructions

## Step 1: Run the Schema SQL

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `schema.sql`
4. Paste and run the SQL script

This will create:
- All required tables (users, tasks, focus_sessions, money_entries, notes)
- Row Level Security (RLS) policies
- Indexes for performance
- Triggers for automatic user profile creation
- Functions for updated_at timestamps

## Step 2: Verify Tables

After running the SQL, verify the tables were created:

1. Go to **Table Editor** in Supabase dashboard
2. You should see:
   - `users`
   - `tasks`
   - `focus_sessions`
   - `money_entries`
   - `notes`

## Step 3: Verify RLS Policies

1. Go to **Authentication** > **Policies**
2. Verify that RLS is enabled on all tables
3. Each table should have policies for SELECT, INSERT, UPDATE, DELETE

## Notes

- The `users` table automatically creates a profile when a user signs up (via trigger)
- All tables have RLS enabled for security
- All queries are scoped to the authenticated user
- Indexes are created for common query patterns

