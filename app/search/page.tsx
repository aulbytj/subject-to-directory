"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [interestRate, setInterestRate] = useState('');

  const sampleListings = [
    {
      id: 1,
      address: "123 Maple St, Austin, TX 78701",
      type: "Single Family",
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1850,
      currentBalance: 285000,
      interestRate: 2.8,
      monthlyPayment: 1240,
      askingPrice: 320000,
      daysListed: 5,
      verified: true,
      image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: 2,
      address: "456 Oak Ave, Denver, CO 80202",
      type: "Townhouse",
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2200,
      currentBalance: 340000,
      interestRate: 3.2,
      monthlyPayment: 1580,
      askingPrice: 380000,
      daysListed: 12,
      verified: true,
      image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: 3,
      address: "789 Pine Rd, Phoenix, AZ 85001",
      type: "Single Family",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1450,
      currentBalance: 220000,
      interestRate: 2.5,
      monthlyPayment: 980,
      askingPrice: 265000,
      daysListed: 8,
      verified: false,
      image: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: 4,
      address: "321 Elm Dr, Miami, FL 33101",
      type: "Condo",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      currentBalance: 195000,
      interestRate: 3.1,
      monthlyPayment: 850,
      askingPrice: 235000,
      daysListed: 3,
      verified: true,
      image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ];

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
                    <SelectItem value="single-family">Single Family</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="multi-family">Multi-Family</SelectItem>
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
              <Button>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
              <Button variant="outline">
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {sampleListings.length} results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleListings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                <img 
                  src={listing.image} 
                  alt={listing.address}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-green-500 hover:bg-green-600">
                    {listing.interestRate}% Rate
                  </Badge>
                  {listing.verified && (
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
      </div>
    </div>
  );
}