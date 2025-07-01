-- Debug trigger issues - comprehensive approach

-- 1. Check if trigger exists and is active
SELECT 
    t.tgname as trigger_name,
    t.tgrelid::regclass as table_name,
    t.tgenabled as enabled,
    t.tgtype as trigger_type
FROM pg_trigger t 
WHERE t.tgname = 'on_auth_user_created';

-- 2. Check if function exists with correct security settings
SELECT 
    p.proname as function_name,
    p.prosecdef as is_security_definer,
    p.proconfig as config_settings
FROM pg_proc p 
WHERE p.proname = 'handle_new_user';

-- 3. Check recent auth.users (to see if users are being created)
SELECT id, email, created_at, raw_user_meta_data
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- 4. Check if corresponding profiles exist
SELECT p.id, p.full_name, p.role, p.created_at
FROM public.profiles p
WHERE p.id IN (
    SELECT id FROM auth.users 
    ORDER BY created_at DESC 
    LIMIT 5
);

-- 5. Test trigger function manually (this will help identify issues)
-- First, let's create a test that simulates what should happen
DO $$
DECLARE
    test_user_id uuid := gen_random_uuid();
    test_metadata jsonb := '{"full_name": "Test User", "role": "buyer"}';
BEGIN
    -- Try to execute the profile creation logic directly
    BEGIN
        INSERT INTO public.profiles (
            id,
            full_name,
            role,
            created_at,
            updated_at
        )
        VALUES (
            test_user_id,
            COALESCE(test_metadata->>'full_name', ''),
            COALESCE(test_metadata->>'role', 'buyer')::user_role,
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'SUCCESS: Profile created for test user %', test_user_id;
        
        -- Clean up test data
        DELETE FROM public.profiles WHERE id = test_user_id;
        
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ERROR: Failed to create profile: %', SQLERRM;
    END;
END $$;

-- 6. Check if user_role enum exists and is correct
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role');

-- 7. Check table permissions
SELECT 
    grantee, 
    privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'profiles' 
    AND table_schema = 'public';