import axios from 'axios';
import { JSDOM } from 'jsdom';

export async function discoverUrls(config) {
  console.log('🔍 Discovery: Sammle URLs...');
  
  if (config.discovery.method === 'sitemap') {
    return await discoverFromSitemap(config);
  } else if (config.discovery.method === 'manual') {
    return config.discovery.urls || [];
  }
  
  return [];
}

async function discoverFromSitemap(config) {
  try {
    const response = await axios.get(config.discovery.sitemapUrl);
    const dom = new JSDOM(response.data, { contentType: 'text/xml' });
    const locs = dom.window.document.querySelectorAll('loc');
    
    let urls = Array.from(locs).map(loc => loc.textContent);
    
    if (config.discovery.filterRegex) {
      const regex = new RegExp(config.discovery.filterRegex);
      urls = urls.filter(url => regex.test(url));
    }
    
    console.log(`✓ ${urls.length} URLs gefunden`);
    return urls;
  } catch (err) {
    console.error('❌ Sitemap-Fehler:', err.message);
    return [];
  }
}
