'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortUrl('');

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          customCode: customCode || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShortUrl(data.shortUrl);
        setUrl('');
        setCustomCode('');
      } else {
        setError(data.error || 'Failed to create short URL');
      }
    } catch (err) {
      setError('Failed to create short URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Allumi URL Shortener</h1>
          <p className="mt-2 text-gray-600">Create short, trackable links for your campaigns</p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                Long URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://www.allumi.com/pricing"
              />
            </div>

            <div>
              <label htmlFor="customCode" className="block text-sm font-medium text-gray-700">
                Custom Code (optional)
              </label>
              <input
                type="text"
                id="customCode"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                pattern="[a-zA-Z0-9-_]+"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="my-link"
              />
              <p className="mt-1 text-xs text-gray-500">
                Leave empty to generate random code
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Shorten URL'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {shortUrl && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800 font-medium">Success!</p>
              <div className="mt-2 flex items-center justify-between">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-purple-600 hover:text-purple-500 truncate"
                >
                  {shortUrl}
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(shortUrl)}
                  className="ml-2 px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://www.allumi.com"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Back to Allumi →
          </a>
        </div>
      </div>
    </div>
  );
}