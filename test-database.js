const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uvrgvmyssdqdsleymykx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2cmd2bXlzc2RxZHNsZXlteWt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyOTg1MDUsImV4cCI6MjA2Njg3NDUwNX0.ZyUH85yLjTfLLvCuZMVMcVYIQhcyUhCJ_W6MnaxtaaU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  console.log('🔍 Testing database access...\n');

  try {
    // Test 1: Check if we can read from properties table at all
    console.log('1. Testing basic properties table access...');
    const { data: allProps, error: allError, count } = await supabase
      .from('properties')
      .select('*', { count: 'exact' });
    
    if (allError) {
      console.error('❌ Error reading properties:', allError);
      return;
    }
    
    console.log(`✅ Found ${count} total properties in database`);
    if (allProps && allProps.length > 0) {
      console.log(`📄 Properties found:`, allProps.map(p => ({ id: p.id, title: p.title, status: p.status })));
    }

    // Test 2: Check active properties specifically
    console.log('\n2. Testing active properties only...');
    const { data: activeProps, error: activeError } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'active');
    
    if (activeError) {
      console.error('❌ Error reading active properties:', activeError);
      return;
    }
    
    console.log(`✅ Found ${activeProps?.length || 0} active properties`);
    if (activeProps && activeProps.length > 0) {
      console.log(`📄 Active properties:`, activeProps.map(p => ({ id: p.id, title: p.title })));
    }

    // Test 3: Check with joins (like our actual query)
    console.log('\n3. Testing properties with profile joins...');
    const { data: joinProps, error: joinError } = await supabase
      .from('properties')
      .select(`
        *,
        profiles:user_id (
          id,
          full_name,
          verified
        ),
        property_images (
          id,
          image_url,
          is_primary
        )
      `)
      .eq('status', 'active');
    
    if (joinError) {
      console.error('❌ Error with joined query:', joinError);
      return;
    }
    
    console.log(`✅ Joined query returned ${joinProps?.length || 0} properties`);
    if (joinProps && joinProps.length > 0) {
      console.log(`📄 Joined properties:`, joinProps.map(p => ({ 
        id: p.id, 
        title: p.title,
        hasProfile: !!p.profiles,
        imageCount: p.property_images?.length || 0
      })));
    }

    // Test 4: Check profiles table
    console.log('\n4. Testing profiles table...');
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, email, verified');
    
    if (profileError) {
      console.error('❌ Error reading profiles:', profileError);
    } else {
      console.log(`✅ Found ${profiles?.length || 0} profiles`);
      if (profiles && profiles.length > 0) {
        console.log(`👥 Profiles:`, profiles);
      }
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

testDatabase();