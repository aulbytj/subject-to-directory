import { NextResponse } from 'next/server';
import { properties } from '@/lib/properties';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      city: searchParams.get('city') || undefined,
      state: searchParams.get('state') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      propertyType: searchParams.get('propertyType') || undefined,
      minInterestRate: searchParams.get('minInterestRate') ? Number(searchParams.get('minInterestRate')) : undefined,
      maxInterestRate: searchParams.get('maxInterestRate') ? Number(searchParams.get('maxInterestRate')) : undefined,
      minBedrooms: searchParams.get('minBedrooms') ? Number(searchParams.get('minBedrooms')) : undefined,
      maxBedrooms: searchParams.get('maxBedrooms') ? Number(searchParams.get('maxBedrooms')) : undefined,
    };

    const limit = Number(searchParams.get('limit')) || 50;
    const offset = Number(searchParams.get('offset')) || 0;

    const { data, error } = await properties.getProperties(filters, limit, offset);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}