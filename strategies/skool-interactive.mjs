import inquirer from 'inquirer';
import { fetchPage, closeBrowser, initBrowser } from '../core/fetch.mjs';
import { pushToAirtable } from '../adapters/airtable.mjs';
import { extractNextJsData, parseSkoolPosts, parseSkoolImages, parseSkoolLinks, parseSkoolVideos, parseSkoolFiles } from './skool-json-extractor.mjs';
import fs from 'fs/promises';
import path from 'path';

export async function runSkoolInteractiveStrategy(config) {
  console.log('\n🎓 Interaktiver Skool-Scraper\n');
  console.log('📌 Focus: Feed (Beiträge) - Classroom kommt später\n');
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'communityUrl',
      message: 'Skool-Community URL:',
      default: 'https://www.skool.com/your-community',
      validate: input => input.startsWith('https://') || 'Muss mit https:// starten'
    },
    {
      type: 'checkbox',
      name: 'contentTypes',
      message: 'Was scrapen?',
      choices: [
        { name: '📝 Posts (Texte)', value: 'posts', checked: true },
        { name: '🔗 Links (aus Posts)', value: 'links', checked: true },
        { name: '🎥 Videos (YouTube/Loom)', value: 'videos', checked: true },
        { name: '🖼️  Bilder', value: 'images', checked: true },
        { name: '📎 Dateien (PDF/JSON/XLSX)', value: 'files', checked: true }
      ]
    },
    {
      type: 'list',
      name: 'structure',
      message: 'Datei-Struktur:',
      choices: [
        { name: 'Nach Datum (2025-10-07/...)', value: 'date' },
        { name: 'Flach (alle in einem Ordner)', value: 'flat' }
      ]
    },
    {
      type: 'checkbox',
      name: 'storage',
      message: 'Wo speichern?',
      choices: [
        { name: '💾 Server (/opt/scratchy/output)', value: 'server', checked: true },
        { name: '📊 Airtable (Metadaten)', value: 'airtable', checked: false }
      ]
    },
    {
      type: 'number',
      name: 'maxPosts',
      message: 'Max. Anzahl Posts:',
      default: 50
    }
  ]);
  
  console.log('\n🚀 Starte Scraping mit folgender Config:');
  console.log('  📍 URL:', answers.communityUrl);
  console.log('  📦 Content:', answers.contentTypes.join(', '));
  console.log('  📂 Struktur:', answers.structure);
  console.log('  💾 Storage:', answers.storage.join(', '));
  console.log('  🔢 Max Posts:', answers.maxPosts);
  console.log('');
  
  const context = await initBrowser(config);
  
  const cookiesPath = '/opt/scratchy/playwright/.auth/skool-cookies.json';
  const cookies = JSON.parse(await fs.readFile(cookiesPath, 'utf8'));
  await context.addCookies(cookies);
  
  console.log('✓ 🍪 Cookies geladen\n');
  
  const outputDir = path.join('/opt/scratchy/output', 'skool-' + Date.now());
  await fs.mkdir(outputDir, { recursive: true });
  
  console.log('📄 Lade Skool-Feed...');
  const result = await fetchPage(answers.communityUrl, config);
  
  if (!result.success) {
    console.error('❌ Fehler beim Laden der Community');
    await closeBrowser();
    return;
  }
  
  console.log('🔍 Extrahiere Next.js-Daten...');
  const nextData = extractNextJsData(result.html);
  
  if (!nextData) {
    console.error('❌ Konnte Next.js-Daten nicht extrahieren');
    await closeBrowser();
    return;
  }
  
  const posts = answers.contentTypes.includes('posts') ? parseSkoolPosts(nextData) : [];
  const links = (answers.contentTypes.includes('links') || answers.contentTypes.includes('videos') || answers.contentTypes.includes('files')) ? parseSkoolLinks(posts) : [];
  
  const extracted = {
    posts: posts,
    links: answers.contentTypes.includes('links') ? links : [],
    videos: answers.contentTypes.includes('videos') ? parseSkoolVideos(links) : [],
    images: answers.contentTypes.includes('images') ? parseSkoolImages(nextData) : [],
    files: answers.contentTypes.includes('files') ? parseSkoolFiles(links) : []
  };
  
  console.log('\n📊 Extrahiert:');
  console.log('  📝 Posts:', extracted.posts.length);
  console.log('  🔗 Links:', extracted.links.length);
  console.log('  🎥 Videos:', extracted.videos.length);
  console.log('  🖼️  Bilder:', extracted.images.length);
  console.log('  📎 Dateien:', extracted.files.length);
  
  if (answers.storage.includes('server')) {
    await saveToServer(extracted, outputDir);
  }
  
  if (answers.storage.includes('airtable')) {
    await saveToAirtable(extracted, config);
  }
  
  await closeBrowser();
  console.log('\n✅ Fertig! Output: ' + outputDir);
}

async function saveToServer(data, outputDir) {
  console.log('\n💾 Speichere auf Server...');
  
  await fs.writeFile(path.join(outputDir, 'posts.json'), JSON.stringify(data.posts, null, 2));
  await fs.writeFile(path.join(outputDir, 'links.json'), JSON.stringify(data.links, null, 2));
  await fs.writeFile(path.join(outputDir, 'videos.json'), JSON.stringify(data.videos, null, 2));
  await fs.writeFile(path.join(outputDir, 'images.json'), JSON.stringify(data.images, null, 2));
  await fs.writeFile(path.join(outputDir, 'files.json'), JSON.stringify(data.files, null, 2));
  
  console.log('  ✓ posts.json (' + data.posts.length + ' Einträge)');
  console.log('  ✓ links.json (' + data.links.length + ' Einträge)');
  console.log('  ✓ videos.json (' + data.videos.length + ' Einträge)');
  console.log('  ✓ images.json (' + data.images.length + ' Einträge)');
  console.log('  ✓ files.json (' + data.files.length + ' Einträge)');
}

async function saveToAirtable(data, config) {
  console.log('\n📊 Push zu Airtable...');
  const records = data.posts.map(post => ({
    title: post.title,
    content: post.content,
    author: post.author,
    url: 'https://www.skool.com/post/' + post.id
  }));
  await pushToAirtable(records, config);
}
