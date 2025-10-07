import { fetchPage, closeBrowser, initBrowser } from '../core/fetch.mjs';
import fs from 'fs/promises';
import path from 'path';

export async function runSkoolStrategy(config) {
  console.log('\n🎯 Starte Skool-Strategy: ' + config.projectName + '\n');
  
  const cookiesPath = path.join('/opt/scratchy/playwright/.auth/skool-cookies.json');
  let hasCookies = false;
  try {
    await fs.access(cookiesPath);
    hasCookies = true;
  } catch (err) {
    console.log('⚠️  Keine Skool-Cookies gefunden');
    console.log('💡 Führe aus: docker exec -it scratchy node auth.setup.js');
    return;
  }
  
  const context = await initBrowser(config);
  const cookies = JSON.parse(await fs.readFile(cookiesPath, 'utf8'));
  await context.addCookies(cookies);
  console.log('✓ Cookies geladen');
  
  const baseUrl = config.baseUrl || 'https://skool.com/community/';
  const urls = config.discovery.urls || [baseUrl];
  
  const outputDir = path.join('/opt/scratchy/output', config.projectName, new Date().toISOString().split('T')[0]);
  await fs.mkdir(outputDir, { recursive: true });
  
  let scraped = 0;
  for (const url of urls.slice(0, 10)) {
    const result = await fetchPage(url, config);
    if (result.success) {
      const posts = await extractSkoolPosts(result.html);
      const filename = 'skool_' + url.replace(/[^a-z0-9]/gi, '_') + '.json';
      await fs.writeFile(path.join(outputDir, filename), JSON.stringify(posts, null, 2));
      scraped++;
      console.log('✓ ' + posts.length + ' Posts extrahiert');
    }
  }
  
  await closeBrowser();
  console.log('\n✅ Fertig! ' + scraped + ' Seiten in ' + outputDir);
}

async function extractSkoolPosts(html) {
  const posts = [];
  const titleMatches = html.match(/<h2[^>]*>(.*?)<\/h2>/gi) || [];
  
  titleMatches.forEach((title, i) => {
    posts.push({
      id: i + 1,
      title: title.replace(/<[^>]*>/g, '').trim(),
      timestamp: new Date().toISOString(),
      raw_html: title
    });
  });
  
  return posts;
}
