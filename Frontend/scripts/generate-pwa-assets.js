#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// PWA asset sizes
const ICON_SIZES = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 152, name: 'logo-152.png' },
  { size: 167, name: 'logo-167.png' },
  { size: 180, name: 'logo-180.png' },
  { size: 192, name: 'logo-192.png' },
  { size: 512, name: 'logo-512.png' }
]

const SCREENSHOT_SIZES = [
  { width: 1280, height: 720, name: 'screenshot-wide.png' },
  { width: 750, height: 1334, name: 'screenshot-narrow.png' }
]

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '../public')
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

// Generate placeholder icons (you should replace these with actual icons)
function generatePlaceholderIcon(size, filename) {
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#000000"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial, sans-serif" font-size="${size * 0.3}">AT</text>
    </svg>
  `
  
  const filepath = path.join(publicDir, filename)
  fs.writeFileSync(filepath, svg)
  console.log(`Generated: ${filename}`)
}

// Generate placeholder screenshots
function generatePlaceholderScreenshot(width, height, filename) {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#6b7280" font-family="Arial, sans-serif" font-size="24">API Train Screenshot</text>
      <text x="50%" y="60%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="16">${width}x${height}</text>
    </svg>
  `
  
  const filepath = path.join(publicDir, filename)
  fs.writeFileSync(filepath, svg)
  console.log(`Generated: ${filename}`)
}

// Generate all PWA assets
console.log('Generating PWA assets...')

// Generate icons
ICON_SIZES.forEach(({ size, name }) => {
  generatePlaceholderIcon(size, name)
})

// Generate screenshots
SCREENSHOT_SIZES.forEach(({ width, height, name }) => {
  generatePlaceholderScreenshot(width, height, name)
})

// Create robots.txt
const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://apitrain.dev/sitemap.xml`

fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt)
console.log('Generated: robots.txt')

// Create sitemap.xml
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://apitrain.dev/</loc>
    <lastmod>2025-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://apitrain.dev/login</loc>
    <lastmod>2025-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://apitrain.dev/signup</loc>
    <lastmod>2025-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml)
console.log('Generated: sitemap.xml')

console.log('PWA assets generation completed!')
console.log('\nNote: Replace placeholder icons and screenshots with actual assets for production.') 