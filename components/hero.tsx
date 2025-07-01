"use client";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  TrendingUp, 
  Shield, 
  Users,
  ArrowRight,
  Home,
  DollarSign,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          {/* Announcement Badge */}
          <Badge variant="secondary" className="mb-8 bg-blue-100 text-blue-800 hover:bg-blue-200">
            <TrendingUp className="mr-2 h-4 w-4" />
            Free Platform • No Fees • Verified Listings
          </Badge>

          {/* Main Heading */}
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Find Creative Real Estate
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}Financing Solutions
            </span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600 sm:text-xl">
            The premier platform for subject-to, seller-finance, and wraparound real estate deals. 
            Connect with verified sellers and buyers for creative financing opportunities.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg" asChild>
              <Link href="/search">
                <Search className="mr-2 h-5 w-5" />
                Browse Deals
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50" asChild>
              <Link href="/signup">
                <Plus className="mr-2 h-5 w-5" />
                List Your Property
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-green-100 p-3">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Verified Listings</h3>
              <p className="mt-2 text-sm text-gray-600">All properties verified for authenticity</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-blue-100 p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Trusted Community</h3>
              <p className="mt-2 text-sm text-gray-600">Vetted buyers and sellers</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-purple-100 p-3">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Always Free</h3>
              <p className="mt-2 text-sm text-gray-600">No listing fees, no hidden charges</p>
            </div>
          </div>
        </div>

        {/* Market Stats */}
        <div className="mt-16 rounded-2xl bg-white p-8 shadow-xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">5,000+</div>
              <div className="text-sm text-gray-600">Active Listings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">$193k</div>
              <div className="text-sm text-gray-600">Avg. Property Equity</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">2.8%</div>
              <div className="text-sm text-gray-600">Avg. Loan Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">100+</div>
              <div className="text-sm text-gray-600">Deals Closed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}