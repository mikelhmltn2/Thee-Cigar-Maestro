// api/gpt.js
import { createClient } from '@supabase/supabase-js';
import rateLimit from 'express-rate-limit';
import fetch from 'node-fetch'; // Only needed for Node <18

import { validatePrompt } from '../lib/validate.js';
import { fuzzyMatch } from '../lib/fuzzyMatch.js';
import { formatCigarInfo } from '../lib/formatCigar.js';
import { callOpenAI } from '../lib/openaiClient.js';
import { getCigarData, CACHE_DURATION, lastFetched } from '../lib/cache.js';

const MAX_PROMPT_LENGTH = 500;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'OK',
      cacheValid: Date.now() - lastFetched < CACHE_DURATION
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed', allowedMethods: ['POST'] });
  }

  await new Promise((resolve, reject) => {
    limiter(req, res, (result) => (result instanceof Error ? reject(result) : resolve(result)));
  });

  const startTime = Date.now();
  const { prompt } = req.body;
  const validation = validatePrompt(prompt, MAX_PROMPT_LENGTH);

  if (!validation.valid) {
    return res.status(400).json({ error: validation.error, maxLength: MAX_PROMPT_LENGTH });
  }

  try {
    console.log(`[${new Date().toISOString()}] Received prompt: "${prompt.substring(0, 50)}..."`);

    const cigars = await getCigarData();
    const matchedKey = fuzzyMatch(prompt, Object.keys(cigars));

    if (matchedKey) {
      const result = formatCigarInfo(matchedKey, cigars[matchedKey]);
      return res.status(200).json({
        result,
        source: 'database',
        responseTime: Date.now() - startTime
      });
    }

    console.log(`[${new Date().toISOString()}] No match found. Using OpenAI fallback...`);
    const openaiResult = await callOpenAI(prompt);
    return res.status(200).json({
      result: openaiResult,
      source: 'openai',
      responseTime: Date.now() - startTime
    });

  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[${new Date().toISOString()}] Error:`, error);

    if (error.message.includes('OpenAI API error')) {
      return res.status(503).json({
        error: 'External AI service temporarily unavailable',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        responseTime
      });
    }

    if (error.message.includes('fetch cigar data')) {
      return res.status(503).json({
        error: 'Database temporarily unavailable',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        responseTime
      });
    }

    return res.status(500).json({
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      responseTime
    });
  }
}
