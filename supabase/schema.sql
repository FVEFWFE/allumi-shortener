-- Create shortened_urls table
CREATE TABLE IF NOT EXISTS shortened_urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  short_code VARCHAR(10) UNIQUE NOT NULL,
  long_url TEXT NOT NULL,
  title VARCHAR(255),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  utm_content VARCHAR(100),
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by VARCHAR(255),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

-- Create click_analytics table
CREATE TABLE IF NOT EXISTS click_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  short_url_id UUID REFERENCES shortened_urls(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  country VARCHAR(2),
  city VARCHAR(100),
  device_type VARCHAR(50)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_short_code ON shortened_urls(short_code);
CREATE INDEX IF NOT EXISTS idx_created_at ON shortened_urls(created_at);
CREATE INDEX IF NOT EXISTS idx_clicks ON click_analytics(short_url_id, clicked_at);
CREATE INDEX IF NOT EXISTS idx_active_urls ON shortened_urls(is_active, short_code);

-- Enable Row Level Security
ALTER TABLE shortened_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to shortened URLs
CREATE POLICY "Public can read active shortened URLs" ON shortened_urls
  FOR SELECT USING (is_active = true);

-- Create policy for service role to manage all URLs
CREATE POLICY "Service role can manage all URLs" ON shortened_urls
  FOR ALL USING (true);

-- Create policy for service role to manage analytics
CREATE POLICY "Service role can manage analytics" ON click_analytics
  FOR ALL USING (true);