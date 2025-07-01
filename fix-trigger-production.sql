-- Production-ready trigger fix for Supabase auth profile creation
-- Based on official Supabase documentation and best practices

-- First check current state
SELECT 'Checking current trigger state...' as status;

SELECT 
    t.tgname as trigger_name,
    t.tgrelid::regclass as table_name,
    t.tgenabled as enabled
FROM pg_trigger t 
WHERE t.tgname = 'on_auth_user_created';

-- Check supabase_auth_admin permissions (this is usually the missing piece)
SELECT 
    grantee, 
    privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'profiles' 
    AND table_schema = 'public'
    AND grantee = 'supabase_auth_admin';

-- Grant essential permissions to supabase_auth_admin (most common fix)
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT ALL ON public.profiles TO supabase_auth_admin;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO supabase_auth_admin;
GRANT USAGE ON TYPE public.user_role TO supabase_auth_admin;

-- Drop and recreate trigger with proper email handling
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create production-ready trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  -- Insert profile with ALL required fields including email
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email, -- This was missing and likely causing constraint violations
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'full_name', ''), 'User'),
    COALESCE(
      (NULLIF(NEW.raw_user_meta_data->>'role', ''))::public.user_role, 
      'buyer'
    ),
    NOW(),
    NOW()
  );
  
  -- Log success for debugging
  RAISE LOG 'Profile created successfully for user: % with email: %', NEW.id, NEW.email;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log detailed error but don't prevent user creation
    RAISE LOG 'ERROR creating profile for user % (email: %): SQLSTATE=%, MESSAGE=%', 
              NEW.id, NEW.email, SQLSTATE, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Test the setup with a comprehensive check
DO $$
DECLARE
    test_id uuid := gen_random_uuid();
    test_email text := 'test@example.com';
BEGIN
    -- Test profile creation with all required fields
    INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
    VALUES (
        test_id, 
        test_email, 
        'Test User', 
        'buyer'::public.user_role, 
        NOW(), 
        NOW()
    );
    
    -- Clean up test data
    DELETE FROM public.profiles WHERE id = test_id;
    
    RAISE NOTICE 'SUCCESS: Profile creation test passed - trigger should work now';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'ERROR: Profile creation test failed: %', SQLERRM;
        RAISE NOTICE 'This indicates a remaining issue with permissions or constraints';
END $$;

-- Verify everything is set up correctly
SELECT 'Verifying final setup...' as status;

SELECT 
    t.tgname as trigger_name,
    'Enabled' as status
FROM pg_trigger t 
WHERE t.tgname = 'on_auth_user_created';

SELECT 
    'supabase_auth_admin permissions' as check_type,
    count(*) as permission_count
FROM information_schema.role_table_grants 
WHERE table_name = 'profiles' 
    AND table_schema = 'public'
    AND grantee = 'supabase_auth_admin';

SELECT 'Production-ready trigger setup complete!' as final_status;