-- Create profile for specific user with email: fafe6dd8-c1fe-408d-a94a-2e685f022688

-- First, get the user's email and metadata
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name' as full_name,
  raw_user_meta_data->>'role' as role,
  created_at
FROM auth.users 
WHERE id = 'fafe6dd8-c1fe-408d-a94a-2e685f022688';

-- Create the missing profile with email from auth.users
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', 'aulbourn'),
  COALESCE(u.raw_user_meta_data->>'role', 'buyer')::user_role,
  u.created_at,
  NOW()
FROM auth.users u
WHERE u.id = 'fafe6dd8-c1fe-408d-a94a-2e685f022688';

-- Verify the profile was created
SELECT * FROM public.profiles WHERE id = 'fafe6dd8-c1fe-408d-a94a-2e685f022688';