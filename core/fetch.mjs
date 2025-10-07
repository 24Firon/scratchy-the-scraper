import { chromium } from 'playwright';

let browser = null;
let context = null;

export async function initBrowser(config) {
  console.log('🌐 Browser wird gestartet...');
  
  browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  
  console.log('✓ Browser bereit');
  return context;
}

export async function fetchPage(url, config) {
  if (!context) {
    await initBrowser(config);
  }
  
  console.log(`📄 Lade: ${url}`);
  
  try {
    const page = await context.newPage();
    
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: config.performance?.navigationTimeoutMs || 60000
    });
    
    if (config.performance?.waitAfterLoadMs) {
      await page.waitForTimeout(config.performance.waitAfterLoadMs);
    }
    
    const content = await page.content();
    const title = await page.title();
    
    let screenshot = null;
    if (config.output?.includeScreenshots) {
      screenshot = await page.screenshot({ fullPage: true });
    }
    
    await page.close();
    
    return {
      success: true,
      url,
      title,
      html: content,
      screenshot
    };
    
  } catch (err) {
    console.error(`❌ Fehler bei ${url}:`, err.message);
    return {
      success: false,
      url,
      error: err.message
    };
  }
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    console.log('✓ Browser geschlossen');
  }
}
