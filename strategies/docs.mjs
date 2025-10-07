import { discoverUrls } from '../core/discovery.mjs';
import { fetchPage, closeBrowser } from '../core/fetch.mjs';
import fs from 'fs/promises';
import path from 'path';

export async function runDocsStrategy(config) {
  console.log('\n🎯 Starte Docs-Strategy: ' + config.projectName + '\n');
  
  const urls = await discoverUrls(config);
  if (urls.length === 0) {
    console.log('❌ Keine URLs gefunden');
    return;
  }
  
  const outputDir = path.join('/opt/scratchy/output', config.projectName, new Date().toISOString().split('T')[0]);
  await fs.mkdir(outputDir, { recursive: true });
  
  let scraped = 0;
  for (const url of urls.slice(0, 5)) {
    const result = await fetchPage(url, config);
    if (result.success) {
      const filename = url.replace(/[^a-z0-9]/gi, '_') + '.html';
      await fs.writeFile(path.join(outputDir, filename), result.html);
      scraped++;
    }
  }
  
  await closeBrowser();
  console.log('\n✅ Fertig! ' + scraped + '/' + urls.length + ' Seiten gespeichert in ' + outputDir);
}
