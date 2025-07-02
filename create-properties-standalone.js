// Standalone script to create sample properties
// You can run this in a Node.js environment or copy individual property objects to use manually

const USER_ID = 'fafe6dd8-c1fe-408d-a94a-2e685f022688';

// Individual property creation calls using properties.createProperty()
const sampleProperties = [
  {
    // Property 1: Under $200k - Single Family in Austin, TX
    user_id: USER_ID,
    title: 'Charming 3BR Starter Home in East Austin',
    description: 'Perfect starter home in up-and-coming East Austin neighborhood. This cozy single-family home features original hardwood floors, updated kitchen, and a large backyard. Great opportunity for subject-to financing with low monthly payments.',
    address: '1847 E 12th Street',
    city: 'Austin',
    state: 'TX',
    zip_code: '78702',
    property_type: 'single_family',
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 1250,
    current_loan_balance: 145000,
    interest_rate: 4.25,
    monthly_payment: 1180,
    asking_price: 185000,
    property_value: 195000,
    monthly_rent: 1650,
    property_taxes: 3800,
    insurance: 1200,
    hoa_fees: 0,
    loan_type: 'Conventional 30-year',
    lender: 'Wells Fargo',
    years_remaining: 22,
    due_on_sale_clause: true,
    status: 'active',
    featured: false
  },
  {
    // Property 2: $200k-350k - Townhouse in Denver, CO
    user_id: USER_ID,
    title: 'Modern 2BR Townhouse Near Downtown Denver',
    description: 'Beautifully maintained townhouse just minutes from downtown Denver. Features open floor plan, granite countertops, finished basement, and attached garage. Low interest rate makes this an excellent subject-to opportunity.',
    address: '2156 S Delaware Street',
    city: 'Denver',
    state: 'CO',
    zip_code: '80223',
    property_type: 'townhouse',
    bedrooms: 2,
    bathrooms: 2.5,
    square_feet: 1450,
    current_loan_balance: 275000,
    interest_rate: 3.75,
    monthly_payment: 1680,
    asking_price: 315000,
    property_value: 325000,
    monthly_rent: 2200,
    property_taxes: 2400,
    insurance: 950,
    hoa_fees: 185,
    loan_type: 'FHA 30-year',
    lender: 'Chase Bank',
    years_remaining: 26,
    due_on_sale_clause: true,
    status: 'active',
    featured: true
  },
  {
    // Property 3: $350k-500k - Condo in Phoenix, AZ
    user_id: USER_ID,
    title: 'Luxury 3BR Condo with Mountain Views',
    description: 'Stunning condo in prestigious Scottsdale area with breathtaking mountain views. Features include stainless steel appliances, marble countertops, balcony, and access to resort-style amenities. Excellent subject-to deal with assumable VA loan.',
    address: '7141 E Rancho Vista Drive #3007',
    city: 'Scottsdale',
    state: 'AZ',
    zip_code: '85251',
    property_type: 'condo',
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 1850,
    current_loan_balance: 380000,
    interest_rate: 2.875,
    monthly_payment: 2240,
    asking_price: 435000,
    property_value: 450000,
    monthly_rent: 2850,
    property_taxes: 3200,
    insurance: 800,
    hoa_fees: 425,
    loan_type: 'VA 30-year',
    lender: 'USAA',
    years_remaining: 24,
    due_on_sale_clause: false,
    status: 'active',
    featured: true
  },
  {
    // Property 4: Over $500k - Single Family in Miami, FL
    user_id: USER_ID,
    title: 'Elegant 4BR Family Home in Coral Gables',
    description: 'Magnificent Mediterranean-style home in prestigious Coral Gables. Features include marble floors, gourmet kitchen, pool, and lush landscaping. This is a rare subject-to opportunity in one of Miami\'s most desirable neighborhoods.',
    address: '1425 Coral Way',
    city: 'Coral Gables',
    state: 'FL',
    zip_code: '33134',
    property_type: 'single_family',
    bedrooms: 4,
    bathrooms: 3.5,
    square_feet: 2850,
    current_loan_balance: 485000,
    interest_rate: 4.125,
    monthly_payment: 2890,
    asking_price: 675000,
    property_value: 695000,
    monthly_rent: 4200,
    property_taxes: 8500,
    insurance: 2400,
    hoa_fees: 0,
    loan_type: 'Jumbo 30-year',
    lender: 'Bank of America',
    years_remaining: 18,
    due_on_sale_clause: true,
    status: 'active',
    featured: true
  },
  {
    // Property 5: Mid-range Duplex in Nashville, TN
    user_id: USER_ID,
    title: 'Income-Producing Duplex in Music City',
    description: 'Excellent investment opportunity in Nashville\'s growing market. Each unit features 2BR/1BA with separate entrances and utilities. Both units currently rented with stable tenants. Perfect for house hacking with subject-to financing.',
    address: '1823 16th Avenue South',
    city: 'Nashville',
    state: 'TN',
    zip_code: '37212',
    property_type: 'duplex',
    bedrooms: 4,
    bathrooms: 2,
    square_feet: 2200,
    current_loan_balance: 285000,
    interest_rate: 3.95,
    monthly_payment: 1725,
    asking_price: 365000,
    property_value: 375000,
    monthly_rent: 2800,
    property_taxes: 2200,
    insurance: 1350,
    hoa_fees: 0,
    loan_type: 'Conventional 30-year',
    lender: 'Regions Bank',
    years_remaining: 21,
    due_on_sale_clause: true,
    status: 'active',
    featured: false
  },
  {
    // Property 6: Budget-friendly Multi-family in Atlanta, GA
    user_id: USER_ID,
    title: 'Triplex Investment Property Near Atlanta',
    description: 'Solid brick triplex in established Atlanta neighborhood. Three 1BR/1BA units with good rental history. Property needs minor cosmetic updates but has strong bones and excellent cash flow potential. Great subject-to deal for investors.',
    address: '875 Oakland Avenue SE',
    city: 'Atlanta',
    state: 'GA',
    zip_code: '30315',
    property_type: 'multi_family',
    bedrooms: 3,
    bathrooms: 3,
    square_feet: 1950,
    current_loan_balance: 165000,
    interest_rate: 4.5,
    monthly_payment: 1245,
    asking_price: 225000,
    property_value: 235000,
    monthly_rent: 2100,
    property_taxes: 2800,
    insurance: 1450,
    hoa_fees: 0,
    loan_type: 'Investment Property Loan',
    lender: 'SunTrust Bank',
    years_remaining: 19,
    due_on_sale_clause: true,
    status: 'active',
    featured: false
  }
];

// Manual execution code - use this pattern to create each property
console.log('Sample property creation code:');
console.log('');

sampleProperties.forEach((property, index) => {
  console.log(`// Create Property ${index + 1}: ${property.title}`);
  console.log(`// Price: $${property.asking_price.toLocaleString()} - ${property.city}, ${property.state}`);
  console.log(`const property${index + 1}Result = await properties.createProperty(`);
  console.log(JSON.stringify(property, null, 2));
  console.log(`);`);
  console.log(`console.log('Created property ${index + 1}:', property${index + 1}Result.data?.id);`);
  console.log('');
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { sampleProperties, USER_ID };
}