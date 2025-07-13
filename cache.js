// lib/cache.js
import { createClient } from '@supabase/supabase-js';

export const CACHE_DURATION = 3600000; // 1 hour
let cachedCigars = null;
export let lastFetched = 0;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function getCigarData() {
  const now = Date.now();

  if (cachedCigars && now - lastFetched < CACHE_DURATION) {
    return cachedCigars;
  }

  const { data: signedUrlData, error: signedUrlError } = await supabase
    .storage
    .from('cigardata')
    .createSignedUrl('cigarmaestro.json', 3600); // 1 hour signed URL

  if (signedUrlError) {
    throw new Error(`Failed to generate signed URL: ${signedUrlError.message}`);
  }

  const response = await fetch(signedUrlData.signedUrl, {
    headers: {
      'User-Agent': 'CigarMaestro/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch cigar data: ${response.status} ${response.statusText}`);
  }

  const cigars = await response.json();

  if (!cigars || typeof cigars !== 'object') {
    throw new Error('Invalid cigar data format');
  }

  cachedCigars = cigars;
  lastFetched = now;

  return cigars;
}
