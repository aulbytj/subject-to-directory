import { NextResponse } from 'next/server';
import { properties } from '@/lib/properties';

export async function GET() {
  try {
    const { data, error } = await properties.getFeaturedProperties(6);

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