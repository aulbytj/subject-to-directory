-- Create profile for specific user: fafe6dd8-c1fe-408d-a94a-2e685f022688

-- First, check the user's metadata
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name' as full_name,
  raw_user_meta_data->>'role' as role,
  created_at
FROM auth.users 
WHERE id = 'fafe6dd8-c1fe-408d-a94a-2e685f022688';

-- Create the missing profile
INSERT INTO public.profiles (
  id,
  full_name,
  role,
  created_at,
  updated_at
)
VALUES (
  'fafe6dd8-c1fe-408d-a94a-2e685f022688',
  'aulbourn',  -- Based on the navigation showing "aulbourn buyer"
  'buyer',     -- Based on the navigation showing "aulbourn buyer"
  NOW(),
  NOW()
);

-- Verify the profile was created
SELECT * FROM public.profiles WHERE id = 'fafe6dd8-c1fe-408d-a94a-2e685f022688';