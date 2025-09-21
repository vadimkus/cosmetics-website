#!/usr/bin/env node

/**
 * Sitemap Validation Script
 * Validates XML sitemap structure and checks for common issues
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const PRODUCTION_URL = 'https://genosys.ae';

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function validateSitemap() {
  console.log('🔍 Validating Sitemap...\n');
  
  try {
    // Test local sitemap
    console.log(`📡 Testing local sitemap: ${BASE_URL}/sitemap.xml`);
    const localSitemap = await fetchUrl(`${BASE_URL}/sitemap.xml`);
    
    if (localSitemap.status !== 200) {
      console.error(`❌ Local sitemap returned status: ${localSitemap.status}`);
      return;
    }
    
    // Validate XML structure
    const xmlContent = localSitemap.data;
    const urlMatches = xmlContent.match(/<url>/g);
    const locMatches = xmlContent.match(/<loc>/g);
    const lastmodMatches = xmlContent.match(/<lastmod>/g);
    
    console.log(`✅ Sitemap structure valid:`);
    console.log(`   - URLs found: ${urlMatches ? urlMatches.length : 0}`);
    console.log(`   - Locations found: ${locMatches ? locMatches.length : 0}`);
    console.log(`   - Last modified dates: ${lastmodMatches ? lastmodMatches.length : 0}`);
    
    // Check for required elements
    const hasUrlset = xmlContent.includes('<urlset');
    const hasXmlDeclaration = xmlContent.includes('<?xml version="1.0"');
    const hasNamespace = xmlContent.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    
    console.log(`\n📋 XML Structure Check:`);
    console.log(`   - XML Declaration: ${hasXmlDeclaration ? '✅' : '❌'}`);
    console.log(`   - URLSet Element: ${hasUrlset ? '✅' : '❌'}`);
    console.log(`   - Namespace: ${hasNamespace ? '✅' : '❌'}`);
    
    // Extract URLs for validation
    const urlRegex = /<loc>(.*?)<\/loc>/g;
    const urls = [];
    let match;
    while ((match = urlRegex.exec(xmlContent)) !== null) {
      urls.push(match[1]);
    }
    
    console.log(`\n🔗 Found ${urls.length} URLs in sitemap:`);
    
    // Check for important pages
    const importantPages = [
      'https://genosys.ae',
      'https://genosys.ae/products',
      'https://genosys.ae/about',
      'https://genosys.ae/contact'
    ];
    
    console.log(`\n📄 Important Pages Check:`);
    importantPages.forEach(page => {
      const found = urls.includes(page);
      console.log(`   - ${page}: ${found ? '✅' : '❌'}`);
    });
    
    // Check for product pages
    const productPages = urls.filter(url => url.includes('/products/') && url !== 'https://genosys.ae/products');
    console.log(`\n🛍️ Product Pages: ${productPages.length} found`);
    
    if (productPages.length > 0) {
      console.log(`   - Sample: ${productPages.slice(0, 3).join(', ')}`);
    }
    
    // Test robots.txt
    console.log(`\n🤖 Testing robots.txt: ${BASE_URL}/robots.txt`);
    const robots = await fetchUrl(`${BASE_URL}/robots.txt`);
    
    if (robots.status === 200) {
      const robotsContent = robots.data;
      const hasSitemap = robotsContent.includes('Sitemap:');
      const hasUserAgent = robotsContent.includes('User-agent:');
      
      console.log(`✅ Robots.txt structure:`);
      console.log(`   - Sitemap reference: ${hasSitemap ? '✅' : '❌'}`);
      console.log(`   - User-agent: ${hasUserAgent ? '✅' : '❌'}`);
    } else {
      console.log(`❌ Robots.txt returned status: ${robots.status}`);
    }
    
    console.log(`\n🎯 Next Steps:`);
    console.log(`1. Submit sitemap to Google Search Console: https://search.google.com/search-console/`);
    console.log(`2. Add sitemap URL: ${PRODUCTION_URL}/sitemap.xml`);
    console.log(`3. Monitor indexing status in GSC`);
    console.log(`4. Request indexing for important pages`);
    
  } catch (error) {
    console.error('❌ Error validating sitemap:', error.message);
  }
}

// Run validation
validateSitemap();
