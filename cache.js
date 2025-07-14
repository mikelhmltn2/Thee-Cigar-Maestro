// lib/cache.js
import { createClient } from '@supabase/supabase-js';

export const CACHE_DURATION = 3600000; // 1 hour
let cachedCigars = null;
export let lastFetched = 0;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

/**
 * Fetches cigar data from Supabase Storage and caches it.
 * @param {string} filename - Optional JSON file name (default: cigarmaestro.json)
 */
export async function getCigarData(filename = 'cigarmaestro.json') {
  const now = Date.now();

  // Return from cache if fresh
  if (cachedCigars && now - lastFetched < CACHE_DURATION) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[cache.js] Serving cached cigar data (age: ${now - lastFetched}ms)`);
    }
    return cachedCigars;
  }

  try {
    // Request signed URL from Supabase
    const { data: signedUrlData, error: signedUrlError } = await supabase
      .storage
      .from('cigardata')
      .createSignedUrl(filename, 3600); // valid for 1 hour

    if (signedUrlError) {
      throw new Error(`Supabase signed URL error: ${signedUrlError.message}`);
    }

    // Fetch JSON from signed URL
    const response = await fetch(signedUrlData.signedUrl, {
      headers: {
        'User-Agent': 'CigarMaestro/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Supabase fetch failed: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();

    if (!json || typeof json !== 'object') {
      throw new Error('Invalid JSON structure: Expected object root');
    }

    cachedCigars = json;
    lastFetched = now;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[cache.js] Fetched ${Object.keys(json).length} cigars from Supabase`);
    }

    return json;

  } catch (err) {
    console.error(`[cache.js] Error fetching cigar data: ${err.message}`);
    throw err; // propagate to gpt.js
  }
}
