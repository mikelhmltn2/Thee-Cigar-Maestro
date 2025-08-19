#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create a simple favicon using Sharp
async function generateFavicon() {
  const size = 32;
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#1a0f0a"/>
      <text x="50%" y="50%" font-family="serif" font-size="20" fill="#d4af37" text-anchor="middle" dominant-baseline="middle">C</text>
    </svg>
  `;

  try {
    await sharp(Buffer.from(svg)).resize(32, 32).png().toFile(path.join(publicDir, 'favicon.png'));

    await sharp(Buffer.from(svg))
      .resize(16, 16)
      .png()
      .toFile(path.join(publicDir, 'favicon-16x16.png'));

    console.log('✅ Favicon generated');
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
}

// Create apple-touch-icon
async function generateAppleTouchIcon() {
  const size = 180;
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#1a0f0a"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 3}" fill="none" stroke="#d4af37" stroke-width="4"/>
      <text x="50%" y="50%" font-family="serif" font-size="${size / 3}" fill="#d4af37" text-anchor="middle" dominant-baseline="middle">CM</text>
    </svg>
  `;

  try {
    await sharp(Buffer.from(svg))
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));

    console.log('✅ Apple touch icon generated');
  } catch (error) {
    console.error('Error generating apple touch icon:', error);
  }
}

// Create OG image
async function generateOGImage() {
  const width = 1200;
  const height = 630;
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#2a1b14;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1a0f0a;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg)"/>
      <text x="50%" y="40%" font-family="serif" font-size="72" fill="#d4af37" text-anchor="middle" font-weight="bold">Thee Cigar Maestro</text>
      <text x="50%" y="55%" font-family="serif" font-size="36" fill="#f4f1e8" text-anchor="middle">The Art. The Ritual. The Maestro.</text>
      <text x="50%" y="70%" font-family="sans-serif" font-size="24" fill="#a0a0a0" text-anchor="middle">Premium AI-Driven Cigar Experience Platform</text>
    </svg>
  `;

  try {
    await sharp(Buffer.from(svg))
      .resize(1200, 630)
      .jpeg({ quality: 90 })
      .toFile(path.join(publicDir, 'og-image.jpg'));

    console.log('✅ OG image generated');
  } catch (error) {
    console.error('Error generating OG image:', error);
  }
}

// Run all generators
async function generateAllAssets() {
  console.log('🎨 Generating missing assets...');
  await generateFavicon();
  await generateAppleTouchIcon();
  await generateOGImage();
  console.log('✨ All assets generated successfully!');
}

generateAllAssets().catch(console.error);
