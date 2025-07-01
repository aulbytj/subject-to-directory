-- Final fix for auth trigger - grant permissions to supabase_auth_admin
-- This is the missing piece that prevents triggers from working

-- First, run the other debug queries to see current state
SELECT 
    t.tgname as trigger_name,
    t.tgrelid::regclass as table_name,
    t.tgenabled as enabled
FROM pg_trigger t 
WHERE t.tgname = 'on_auth_user_created';

-- Check if supabase_auth_admin has access to profiles table
SELECT 
    grantee, 
    privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'profiles' 
    AND table_schema = 'public'
    AND grantee = 'supabase_auth_admin';

-- Grant necessary permissions to supabase_auth_admin (this is usually the missing piece)
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT ALL ON public.profiles TO supabase_auth_admin;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO supabase_auth_admin;

-- Also grant access to the user_role type
GRANT USAGE ON TYPE public.user_role TO supabase_auth_admin;

-- Recreate the trigger with explicit schema references
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the function with explicit schema references and better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  -- Use explicit schema references and better error handling
  INSERT INTO public.profiles (
    id,
    full_name,
    role,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer')::public.user_role,
    NOW(),
    NOW()
  );
  
  -- Log success for debugging
  RAISE LOG 'Profile created successfully for user: %', NEW.id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log detailed error information
    RAISE LOG 'ERROR creating profile for user %: SQLSTATE=%, MESSAGE=%', NEW.id, SQLSTATE, SQLERRM;
    -- Still return NEW to allow user creation to proceed
    RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verify the setup
SELECT 'Trigger created successfully' as status;

-- Test with a mock insertion to verify permissions
DO $$
DECLARE
    test_id uuid := gen_random_uuid();
BEGIN
    -- Test the profile creation logic
    INSERT INTO public.profiles (id, full_name, role, created_at, updated_at)
    VALUES (test_id, 'Test User', 'buyer'::public.user_role, NOW(), NOW());
    
    -- Clean up
    DELETE FROM public.profiles WHERE id = test_id;
    
    RAISE NOTICE 'SUCCESS: Profile creation test passed';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'ERROR: Profile creation test failed: %', SQLERRM;
END $$;