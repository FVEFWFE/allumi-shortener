import { NextRequest, NextResponse } from 'next/server';
import { memoryDb } from '@/lib/memory-db';

export async function GET(
  request: NextRequest,
  { params }: { params: { shortCode: string } }
) {
  try {
    const shortCode = params.shortCode;

    // Fetch the URL from memory
    const urlData = memoryDb.getUrl(shortCode);

    if (!urlData || !urlData.is_active) {
      // Redirect to main site if URL not found
      return NextResponse.redirect(process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'https://allumi.com');
    }

    // Build the destination URL with UTM parameters
    const url = new URL(urlData.long_url);

    // Add UTM parameters if they exist
    if (urlData.utm_source) url.searchParams.set('utm_source', urlData.utm_source);
    if (urlData.utm_medium) url.searchParams.set('utm_medium', urlData.utm_medium);
    if (urlData.utm_campaign) url.searchParams.set('utm_campaign', urlData.utm_campaign);
    if (urlData.utm_content) url.searchParams.set('utm_content', urlData.utm_content);

    // Track the click
    memoryDb.incrementClicks(shortCode);

    // Redirect to the destination URL
    return NextResponse.redirect(url.toString());
  } catch (error) {
    console.error('Error in redirect handler:', error);
    return NextResponse.redirect(process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'https://allumi.com');
  }
}