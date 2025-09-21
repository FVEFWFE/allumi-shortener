import { NextRequest, NextResponse } from 'next/server';
import { memoryDb } from '@/lib/memory-db';

export async function GET(request: NextRequest) {
  try {
    const urls = memoryDb.getAllUrls();
    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Error fetching URLs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}