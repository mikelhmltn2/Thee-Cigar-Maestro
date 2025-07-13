// api/gpt.js
import { createClient } from ‘@supabase/supabase-js’;
import rateLimit from ‘express-rate-limit’;

// Configuration constants
const MAX_PROMPT_LENGTH = 500;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds
const OPENAI_MODEL = ‘gpt-4’;
const OPENAI_TEMPERATURE = 0.2;

// In-memory cache (consider Redis for production)
let cachedCigars = null;
let cacheTimestamp = 0;

// Rate limiting middleware
const limiter = rateLimit({
windowMs: 15 * 60 * 1000, // 15 minutes
max: 100, // limit each IP to 100 requests per windowMs
message: {
error: ‘Too many requests from this IP, please try again later.’,
retryAfter: ‘15 minutes’
},
standardHeaders: true,
legacyHeaders: false,
});

// Initialize Supabase client
const supabase = createClient(
process.env.SUPABASE_URL,
process.env.SUPABASE_ANON_KEY
);

// Utility function for fuzzy string matching
function fuzzyMatch(query, targets) {
const normalizedQuery = query.toLowerCase().trim();

// Exact match first
for (const target of targets) {
if (target.toLowerCase() === normalizedQuery) {
return target;
}
}

// Substring match
for (const target of targets) {
if (target.toLowerCase().includes(normalizedQuery)) {
return target;
}
}

// Word-based matching for better results
const queryWords = normalizedQuery.split(/\s+/);
for (const target of targets) {
const targetLower = target.toLowerCase();
const matchCount = queryWords.filter(word =>
targetLower.includes(word) && word.length > 2
).length;

```
if (matchCount >= Math.min(queryWords.length, 2)) {
  return target;
}
```

}

return null;
}

// Function to fetch cigar data with caching
async function getCigarData() {
const now = Date.now();

// Return cached data if still valid
if (cachedCigars && now - cacheTimestamp < CACHE_DURATION) {
return cachedCigars;
}

try {
// Generate signed URL dynamically
const { data: signedUrlData, error: signedUrlError } = await supabase
.storage
.from(‘cigardata’)
.createSignedUrl(‘cigarmaestro.json’, 3600); // 1 hour expiry

```
if (signedUrlError) {
  throw new Error(`Failed to generate signed URL: ${signedUrlError.message}`);
}

// Fetch the data
const response = await fetch(signedUrlData.signedUrl, {
  headers: {
    'User-Agent': 'CigarMaestro/1.0',
  },
});

if (!response.ok) {
  throw new Error(`Failed to fetch cigar data: ${response.status} ${response.statusText}`);
}

const cigars = await response.json();

// Validate data structure
if (!cigars || typeof cigars !== 'object') {
  throw new Error('Invalid cigar data format');
}

// Update cache
cachedCigars = cigars;
cacheTimestamp = now;

return cigars;
```

} catch (error) {
console.error(‘Error fetching cigar data:’, error);
throw error;
}
}

// Function to call OpenAI API with proper error handling
async function callOpenAI(prompt) {
const response = await fetch(‘https://api.openai.com/v1/chat/completions’, {
method: ‘POST’,
headers: {
‘Authorization’: `Bearer ${process.env.OPENAI_API_KEY}`,
‘Content-Type’: ‘application/json’,
},
body: JSON.stringify({
model: OPENAI_MODEL,
messages: [
{
role: ‘system’,
content: ‘You are a cigar specification assistant. Only provide verified specifications and clearly indicate if the cigar is not officially documented. Be concise and factual.’
},
{ role: ‘user’, content: prompt }
],
temperature: OPENAI_TEMPERATURE,
max_tokens: 500,
})
});

if (!response.ok) {
const errorData = await response.json().catch(() => ({}));
throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
}

const data = await response.json();
return data.choices?.[0]?.message?.content || ‘No response received from OpenAI.’;
}

// Input validation function
function validateInput(prompt) {
if (!prompt || typeof prompt !== ‘string’) {
return { valid: false, error: ‘Prompt is required and must be a string’ };
}

if (prompt.length > MAX_PROMPT_LENGTH) {
return {
valid: false,
error: `Prompt too long. Maximum length is ${MAX_PROMPT_LENGTH} characters.`
};
}

if (prompt.trim().length === 0) {
return { valid: false, error: ‘Prompt cannot be empty’ };
}

return { valid: true };
}

// Format cigar information
function formatCigarInfo(cigarName, cigar) {
return `Cigar Name: ${cigarName} Length: ${cigar.length || 'N/A'}" Ring Gauge: ${cigar.ringGauge || 'N/A'} Shape: ${cigar.shape || 'N/A'} Color: ${cigar.color || 'N/A'} Strength: ${cigar.strength || 'N/A'} Body: ${cigar.body || 'N/A'} Country: ${cigar.country || 'N/A'} Wrapper: ${cigar.wrapper || 'N/A'} Binder: ${cigar.binder || 'N/A'} Filler: ${cigar.filler || 'N/A'} Tasting Notes: ${cigar.tastingNotes || 'N/A'} Source: CigarMaestro Database`.trim();
}

// Main handler function
export default async function handler(req, res) {
// Apply rate limiting
await new Promise((resolve, reject) => {
limiter(req, res, (result) => {
if (result instanceof Error) {
reject(result);
} else {
resolve(result);
}
});
});

// Set CORS headers
res.setHeader(‘Access-Control-Allow-Origin’, process.env.ALLOWED_ORIGINS || ‘*’);
res.setHeader(‘Access-Control-Allow-Methods’, ‘POST, OPTIONS’);
res.setHeader(‘Access-Control-Allow-Headers’, ‘Content-Type, Authorization’);

// Handle preflight requests
if (req.method === ‘OPTIONS’) {
return res.status(200).end();
}

// Only allow POST requests
if (req.method !== ‘POST’) {
return res.status(405).json({
error: ‘Method Not Allowed’,
allowedMethods: [‘POST’]
});
}

const startTime = Date.now();

try {
// Extract and validate input
const { prompt } = req.body;
const validation = validateInput(prompt);

```
if (!validation.valid) {
  return res.status(400).json({ 
    error: validation.error,
    maxLength: MAX_PROMPT_LENGTH 
  });
}

// Log request (consider structured logging in production)
console.log(`[${new Date().toISOString()}] Query: "${prompt.substring(0, 50)}..."`);

// Fetch cigar data
const cigars = await getCigarData();

// Search for matching cigar using fuzzy matching
const cigarNames = Object.keys(cigars);
const matchedKey = fuzzyMatch(prompt, cigarNames);

if (matchedKey) {
  const cigar = cigars[matchedKey];
  const result = formatCigarInfo(matchedKey, cigar);
  
  const responseTime = Date.now() - startTime;
  console.log(`[${new Date().toISOString()}] Database match found: ${matchedKey} (${responseTime}ms)`);
  
  return res.status(200).json({ 
    result,
    source: 'database',
    responseTime: responseTime
  });
}

// Fallback to OpenAI if no match found
console.log(`[${new Date().toISOString()}] No database match, falling back to OpenAI`);

const openaiResult = await callOpenAI(prompt);
const responseTime = Date.now() - startTime;

console.log(`[${new Date().toISOString()}] OpenAI response received (${responseTime}ms)`);

return res.status(200).json({ 
  result: openaiResult,
  source: 'openai',
  responseTime: responseTime
});
```

} catch (error) {
const responseTime = Date.now() - startTime;
console.error(`[${new Date().toISOString()}] Error:`, error);

```
// Return appropriate error response based on error type
if (error.message.includes('OpenAI API error')) {
  return res.status(503).json({ 
    error: 'External AI service temporarily unavailable',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    responseTime: responseTime
  });
}

if (error.message.includes('Failed to fetch cigar data')) {
  return res.status(503).json({ 
    error: 'Database temporarily unavailable',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    responseTime: responseTime
  });
}

return res.status(500).json({ 
  error: 'Internal Server Error',
  details: process.env.NODE_ENV === 'development' ? error.message : undefined,
  responseTime: responseTime
});
```

}
}
