"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

export function RecentListings() {
  const sampleListings = [
    {
      id: 1,
      address: "123 Maple St, Austin, TX",
      type: "Single Family",
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1850,
      currentBalance: 285000,
      interestRate: 2.8,
      monthlyPayment: 1240,
      askingPrice: 320000,
      daysListed: 5,
      image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: 2,
      address: "456 Oak Ave, Denver, CO",
      type: "Townhouse",
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2200,
      currentBalance: 340000,
      interestRate: 3.2,
      monthlyPayment: 1580,
      askingPrice: 380000,
      daysListed: 12,
      image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: 3,
      address: "789 Pine Rd, Phoenix, AZ",
      type: "Single Family",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1450,
      currentBalance: 220000,
      interestRate: 2.5,
      monthlyPayment: 980,
      askingPrice: 265000,
      daysListed: 8,
      image: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ];

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
          {sampleListings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                <img 
                  src={listing.image} 
                  alt={listing.address}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-green-500 hover:bg-green-600">
                  {listing.interestRate}% Rate
                </Badge>
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {listing.address}
                </div>
                <CardTitle className="text-lg">{listing.type}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {listing.bedrooms} bed • {listing.bathrooms} bath • {listing.sqft.toLocaleString()} sqft
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Current Balance</div>
                    <div className="font-semibold">${listing.currentBalance.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Monthly Payment</div>
                    <div className="font-semibold">${listing.monthlyPayment.toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <div className="text-sm text-gray-600">Asking Price</div>
                    <div className="text-xl font-bold text-green-600">
                      ${listing.askingPrice.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Listed</div>
                    <div className="text-sm font-semibold">{listing.daysListed} days ago</div>
                  </div>
                </div>

                <Button className="w-full" asChild>
                  <Link href={`/listing/${listing.id}`}>
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
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