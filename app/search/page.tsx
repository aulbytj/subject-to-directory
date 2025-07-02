"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search,
  Filter,
  MapPin,
  Home,
  DollarSign,
  Heart,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { properties, PropertyFilters } from '@/lib/properties';
import { Property } from '@/lib/supabase';
import { toast } from 'sonner';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredCount, setFilteredCount] = useState(0);

  // Load properties on component mount
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async (filters?: PropertyFilters) => {
    try {
      setLoading(true);
      const { data, error } = await properties.getProperties(filters, 50, 0);
      
      if (error) {
        console.error('Error loading properties:', error);
        toast.error('Failed to load properties');
        return;
      }

      setListings(data || []);
      setFilteredCount(data?.length || 0);
    } catch (error) {
      console.error('Error loading properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const filters: PropertyFilters = {};
    
    // Location filter
    if (searchQuery.trim()) {
      filters.city = searchQuery.trim();
    }
    
    // Price range filter
    if (priceRange) {
      switch (priceRange) {
        case '0-200k':
          filters.maxPrice = 200000;
          break;
        case '200k-350k':
          filters.minPrice = 200000;
          filters.maxPrice = 350000;
          break;
        case '350k-500k':
          filters.minPrice = 350000;
          filters.maxPrice = 500000;
          break;
        case '500k+':
          filters.minPrice = 500000;
          break;
      }
    }
    
    // Property type filter
    if (propertyType) {
      filters.propertyType = propertyType.replace('-', '_');
    }
    
    // Interest rate filter
    if (interestRate) {
      switch (interestRate) {
        case '0-3':
          filters.maxInterestRate = 3;
          break;
        case '3-4':
          filters.minInterestRate = 3;
          filters.maxInterestRate = 4;
          break;
        case '4-5':
          filters.minInterestRate = 4;
          filters.maxInterestRate = 5;
          break;
        case '5+':
          filters.minInterestRate = 5;
          break;
      }
    }
    
    // Immediate feedback for empty filters
    if (Object.keys(filters).length === 0 && !searchQuery.trim()) {
      loadProperties(); // Load all properties
      return;
    }
    
    await loadProperties(filters);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPriceRange('');
    setPropertyType('');
    setInterestRate('');
    loadProperties();
  };

  const formatPropertyType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const hasPropertyImage = (property: Property) => {
    return property.property_images && property.property_images.length > 0;
  };

  const getPropertyImage = (property: Property) => {
    if (hasPropertyImage(property)) {
      const primaryImage = property.property_images!.find(img => img.is_primary);
      return primaryImage?.image_url || property.property_images![0].image_url;
    }
    return null;
  };

  const getDaysListed = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Deals</h1>
          <p className="text-gray-600">Find subject-to and creative financing opportunities</p>
        </div>

        {/* Search Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filter Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Location
                </label>
                <Input
                  placeholder="City, State, or ZIP"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Price Range
                </label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-200k">$0 - $200k</SelectItem>
                    <SelectItem value="200k-350k">$200k - $350k</SelectItem>
                    <SelectItem value="350k-500k">$350k - $500k</SelectItem>
                    <SelectItem value="500k+">$500k+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Property Type
                </label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single_family">Single Family</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="multi_family">Multi-Family</SelectItem>
                    <SelectItem value="duplex">Duplex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Interest Rate
                </label>
                <Select value={interestRate} onValueChange={setInterestRate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-3">0% - 3%</SelectItem>
                    <SelectItem value="3-4">3% - 4%</SelectItem>
                    <SelectItem value="4-5">4% - 5%</SelectItem>
                    <SelectItem value="5+">5%+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-6 flex gap-4">
              <Button onClick={handleSearch} disabled={loading}>
                <Search className="mr-2 h-4 w-4" />
                {loading ? 'Searching...' : 'Search'}
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `Showing ${filteredCount} results`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <CardHeader className="pb-3">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Skeleton className="h-3 w-full mb-1" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div>
                      <Skeleton className="h-3 w-full mb-1" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))
          ) : listings.length === 0 ? (
            // No results state
            <div className="col-span-full text-center py-12">
              <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search filters or check back later for new listings.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </div>
          ) : (
            // Real listings
            listings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  {hasPropertyImage(listing) ? (
                    <img 
                      src={getPropertyImage(listing)!} 
                      alt={`${listing.address}, ${listing.city}, ${listing.state}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Hide broken images gracefully
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
                      <div className="text-center">
                        <Home className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm font-medium">
                          {formatPropertyType(listing.property_type)}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          No image available
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className="bg-green-500 hover:bg-green-600">
                      {listing.interest_rate}% Rate
                    </Badge>
                    {listing.profiles?.verified && (
                      <Badge className="bg-blue-500 hover:bg-blue-600">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="absolute top-4 right-4"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {listing.address}, {listing.city}, {listing.state} {listing.zip_code}
                  </div>
                  <CardTitle className="text-lg">{formatPropertyType(listing.property_type)}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {listing.bedrooms} bed • {listing.bathrooms} bath{listing.square_feet ? ` • ${listing.square_feet.toLocaleString()} sqft` : ''}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Current Balance</div>
                      <div className="font-semibold">${listing.current_loan_balance.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Monthly Payment</div>
                      <div className="font-semibold">${listing.monthly_payment.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <div className="text-sm text-gray-600">Asking Price</div>
                      <div className="text-xl font-bold text-green-600">
                        ${listing.asking_price.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Listed</div>
                      <div className="text-sm font-semibold">{getDaysListed(listing.created_at)} days ago</div>
                    </div>
                  </div>

                  <Button className="w-full" asChild>
                    <Link href={`/property/${listing.id}`}>
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}