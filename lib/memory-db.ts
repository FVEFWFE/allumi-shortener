// Temporary in-memory database for testing
interface ShortUrl {
  id: string;
  short_code: string;
  long_url: string;
  title?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  clicks: number;
  created_at: string;
  is_active: boolean;
}

// In-memory storage
const urls: Map<string, ShortUrl> = new Map();

// Pre-populate with some test URLs
urls.set('test', {
  id: '1',
  short_code: 'test',
  long_url: 'https://www.allumi.com',
  title: 'Test Link',
  clicks: 0,
  created_at: new Date().toISOString(),
  is_active: true
});

urls.set('beta', {
  id: '2',
  short_code: 'beta',
  long_url: 'https://www.allumi.com/pricing',
  title: 'Beta Pricing',
  utm_source: 'direct',
  utm_medium: 'shortlink',
  utm_campaign: 'beta-launch',
  clicks: 0,
  created_at: new Date().toISOString(),
  is_active: true
});

export const memoryDb = {
  getUrl: (shortCode: string): ShortUrl | undefined => {
    return urls.get(shortCode);
  },

  createUrl: (url: ShortUrl): ShortUrl => {
    urls.set(url.short_code, url);
    return url;
  },

  incrementClicks: (shortCode: string): void => {
    const url = urls.get(shortCode);
    if (url) {
      url.clicks++;
    }
  },

  getAllUrls: (): ShortUrl[] => {
    return Array.from(urls.values()).filter(u => u.is_active);
  }
};