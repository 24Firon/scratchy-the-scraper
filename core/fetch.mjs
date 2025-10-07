import { chromium } from 'playwright';

let browser = null;
let context = null;

export async function initBrowser(config) {
  console.log('🌐 Browser wird gestartet...');
  browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-blink-features=AutomationControlled'
    ]
  });
  context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  console.log('✓ Browser bereit');
  return context;
}

export async function fetchPage(url, config) {
  if (!context) await initBrowser(config);
  console.log('📄 Lade: ' + url);
  try {
    const page = await context.newPage();
    await page.goto(url, { 
      waitUntil: 'load', 
      timeout: 30000 
    });
    await page.waitForTimeout(1500);
    const content = await page.content();
    const title = await page.title();
    let screenshot = null;
    if (config.output && config.output.includeScreenshots) {
      screenshot = await page.screenshot({ fullPage: true });
    }
    await page.close();
    return { success: true, url: url, title: title, html: content, screenshot: screenshot };
  } catch (err) {
    console.error('❌ Fehler bei ' + url + ':', err.message);
    return { success: false, url: url, error: err.message };
  }
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    console.log('✓ Browser geschlossen');
  }
}
