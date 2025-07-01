-- Create profile for existing user who doesn't have one
-- Replace 'USER_ID_HERE' with the actual user ID from auth.users table

-- First, let's see what users exist without profiles
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data->>'full_name' as full_name,
  u.raw_user_meta_data->>'role' as role,
  u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Insert missing profile (run this after checking the user ID above)
-- UPDATE: Replace the user ID below with the actual ID from the query above
INSERT INTO public.profiles (
  id,
  full_name,
  role,
  created_at,
  updated_at
)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', 'Unknown User'),
  COALESCE(u.raw_user_meta_data->>'role', 'buyer')::user_role,
  u.created_at,
  NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;