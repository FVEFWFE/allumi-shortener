import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { memoryDb } from '@/lib/memory-db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, customCode, title, utm } = body;

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    // Generate or validate short code
    const shortCode = customCode || nanoid(6);

    // Check if custom code already exists
    if (customCode && memoryDb.getUrl(customCode)) {
      return NextResponse.json(
        { error: 'Custom code already exists' },
        { status: 409 }
      );
    }

    // Create new shortened URL
    const shortUrl = memoryDb.createUrl({
      id: nanoid(),
      short_code: shortCode,
      long_url: url,
      title: title || null,
      utm_source: utm?.source || null,
      utm_medium: utm?.medium || null,
      utm_campaign: utm?.campaign || null,
      utm_content: utm?.content || null,
      clicks: 0,
      created_at: new Date().toISOString(),
      is_active: true
    });

    const fullShortUrl = `${process.env.NEXT_PUBLIC_SHORT_DOMAIN || 'http://localhost:3000'}/${shortUrl.short_code}`;

    return NextResponse.json({
      success: true,
      shortUrl: fullShortUrl,
      shortCode: shortUrl.short_code,
      data: shortUrl
    });
  } catch (error) {
    console.error('Error in shorten API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}