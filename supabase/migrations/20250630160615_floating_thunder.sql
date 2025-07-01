/*
  # Fix signup trigger function

  1. Updates
    - Fix `handle_new_user` function to properly handle empty strings from user metadata
    - Use NULLIF to convert empty strings to NULL before COALESCE and type casting
    - This prevents database errors when signup metadata contains empty strings

  2. Changes
    - Modified INSERT statement in handle_new_user function
    - Added NULLIF for both full_name and role fields
    - Ensures proper type casting for user_role enum
*/

-- Function to create user profile on signup (fixed version)
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'full_name', ''), 'User'),
    COALESCE((NULLIF(NEW.raw_user_meta_data->>'role', ''))::user_role, 'buyer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;