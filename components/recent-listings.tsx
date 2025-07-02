"use client";

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  MapPin, 
  Home, 
  DollarSign, 
  Percent,
  Calendar,
  Eye,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { properties } from '@/lib/properties';
import { Property } from '@/lib/supabase';

export function RecentListings() {
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentProperties();
  }, []);

  const loadRecentProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await properties.getProperties(undefined, 6, 0);
      
      if (error) {
        console.error('Error loading recent properties:', error);
        return;
      }

      setListings(data || []);
    } catch (error) {
      console.error('Error loading recent properties:', error);
    } finally {
      setLoading(false);
    }
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
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Eye className="mr-2 h-4 w-4" />
            Latest Opportunities
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Recent Listings
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the latest subject-to and creative financing opportunities from verified sellers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
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
            // No listings message
            <div className="col-span-full text-center py-12">
              <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings yet</h3>
              <p className="text-gray-600">Check back soon for new property opportunities.</p>
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
                  <Badge className="absolute top-4 left-4 bg-green-500 hover:bg-green-600">
                    {listing.interest_rate}% Rate
                  </Badge>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {listing.address}, {listing.city}, {listing.state}
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

        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/search">
              View All Listings
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}