# Playwright Complete Guide - Fuer Scratchy-The-Scraper

Diese Datei enthaelt ALLES ueber Playwright: API, Konzepte, Anti-Bot, Best Practices.

## Was ist Playwright?

Playwright ist eine Node.js-Bibliothek fuer Browser-Automatisierung, entwickelt von Microsoft.

### Kernmerkmale

Cross-Browser:
- Chromium (Chrome, Edge)
- Firefox
- WebKit (Safari)

Cross-Platform:
- Windows
- macOS
- Linux

Headless & Headed:
- Headless: Kein UI (schneller, fuer Server)
- Headed: Mit UI (fuer Debugging)

Auto-Waiting:
- Wartet automatisch auf Elemente
- Keine expliziten sleep() noetig
- Intelligent Retry-Mechanismus

### Warum Playwright fuer Scraping?

Vorteil 1: JavaScript-Rendering
- Kann Next.js, React, Vue scrapen
- Wartet auf Dynamic Content

Vorteil 2: Anti-Bot-Evasion
- Kann navigator.webdriver entfernen
- User-Agent anpassbar
- Cookie-Injection moeglich

Vorteil 3: Screenshot & Video
- Debug-Screenshots automatisch
- Video-Recording fuer CI/CD

Vorteil 4: Network-Interception
- Requests blocken/modifizieren
- API-Calls mitlesen
- Performance-Optimierung

## Installation & Setup

### Lokale Installation (PC)

Neueste Version:
npm install playwright@latest

Spezifische Version (wie in Scratchy):
npm install playwright@1.56.0

Browser installieren:
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit

Alle Browser:
npx playwright install

### Docker-Installation (Scratchy-Setup)

Docker-Image verwenden:
docker pull mcr.microsoft.com/playwright:v1.56.0-noble

Warum Docker?
- Browser bereits vorinstalliert
- Dependencies bereits dabei
- Konsistente Umgebung

Docker-Compose (wie in Scratchy):
services:
  scratchy:
    image: mcr.microsoft.com/playwright:v1.56.0-noble
    volumes:
      - ./:/opt/scratchy
    working_dir: /opt/scratchy
    command: tail -f /dev/null
    network_mode: host

### Version-Check

Check installierte Version:
npx playwright --version
Output: Version 1.56.0

Check Browser-Versionen:
npx playwright install --with-deps chromium
Chromium: 130.0.6723.19

## Browser-Launch-Optionen

### Basic Launch

Chromium headless:
const { chromium } = require('playwright')
const browser = await chromium.launch()

Chromium headed (mit UI):
const browser = await chromium.launch({ headless: false })

Firefox:
const { firefox } = require('playwright')
const browser = await firefox.launch()

WebKit:
const { webkit } = require('playwright')
const browser = await webkit.launch()

### Advanced Launch Options

Vollstaendiges Beispiel:
const browser = await chromium.launch({
  headless: true,
  slowMo: 100,
  timeout: 30000,
  args: [
    '--disable-blink-features=AutomationControlled',
    '--no-sandbox',
    '--disable-setuid-sandbox'
  ],
  ignoreDefaultArgs: ['--enable-automation'],
  executablePath: '/path/to/chrome'
})

headless (Boolean):
- true: Kein UI (Standard)
- false: Mit UI (zum Debuggen)

slowMo (Number):
- Millisekunden zwischen Aktionen
- Nuetzlich zum Debuggen
- slowMo: 100 = 100ms Pause

timeout (Number):
- Browser-Launch-Timeout in ms
- Standard: 30000 (30 Sekunden)

args (Array):
- Chrome/Chromium Launch-Argumente
- --disable-blink-features=AutomationControlled (Anti-Bot!)
- --no-sandbox (fuer Docker)

ignoreDefaultArgs (Array):
- Deaktiviert Standard-Argumente
- --enable-automation entfernen (Anti-Bot!)

executablePath (String):
- Pfad zu Chrome/Chromium
- Nutze System-Browser statt Playwright-Browser

### Anti-Bot Launch Config (Scratchy-optimiert)

Best Config fuer Scraping:
const browser = await chromium.launch({
  headless: true,
  args: [
    '--disable-blink-features=AutomationControlled',
    '--disable-features=IsolateOrigins,site-per-process',
    '--disable-site-isolation-trials'
  ]
})

const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
  locale: 'en-US',
  timezoneId: 'America/New_York'
})

await context.addInitScript(() => {
  Object.defineProperty(navigator, 'webdriver', {
    get: () => undefined
  })
})

## Browser-Context

### Was ist ein Context?

Ein Context ist eine isolierte Browser-Session:
- Eigene Cookies
- Eigener LocalStorage
- Eigene Cache
- Eigene Permissions

Warum Context statt Browser?
- Multiple Contexts = Multiple Sessions gleichzeitig
- Cookie-Isolation (verschiedene User testen)
- Performance (Context schneller als neuer Browser)

### Context erstellen

Basic:
const context = await browser.newContext()

Mit Cookies:
const context = await browser.newContext({
  storageState: 'path/to/cookies.json'
})

Mobile Emulation:
const { devices } = require('playwright')
const iPhone = devices['iPhone 13']
const context = await browser.newContext({
  ...iPhone
})

Custom Viewport:
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 }
})

### Context-Optionen (Vollstaendig)

const context = await browser.newContext({
  userAgent: 'Mozilla/5.0...',
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
  isMobile: false,
  hasTouch: false,
  locale: 'en-US',
  timezoneId: 'America/New_York',
  geolocation: { longitude: 12.5, latitude: 45.5 },
  permissions: ['geolocation'],
  colorScheme: 'dark',
  acceptDownloads: true,
  ignoreHTTPSErrors: true,
  offline: false,
  httpCredentials: { username: 'user', password: 'pass' },
  extraHTTPHeaders: { 'X-Custom-Header': 'value' },
  proxy: {
    server: 'http://proxy.example.com:8080',
    username: 'user',
    password: 'pass'
  },
  storageState: 'path/to/cookies.json',
  recordVideo: { dir: 'videos/', size: { width: 1280, height: 720 } },
  recordHar: { path: 'network.har' }
})

userAgent (String):
- User-Agent String
- KRITISCH fuer Anti-Bot!
- Sollte aktuell sein (Check: https://www.whatismybrowser.com/detect/what-is-my-user-agent/)

viewport (Object):
- Fenstergroesse
- { width: 1920, height: 1080 }

deviceScaleFactor (Number):
- Pixel Density
- 1 = Normal, 2 = Retina

isMobile (Boolean):
- Mobile-Modus
- Andert User-Agent + Viewport

hasTouch (Boolean):
- Touch-Events aktivieren

locale (String):
- Sprache
- 'en-US', 'de-DE', etc.

timezoneId (String):
- Zeitzone
- 'America/New_York', 'Europe/Berlin'

geolocation (Object):
- GPS-Koordinaten
- { longitude: 12.5, latitude: 45.5 }

permissions (Array):
- Browser-Permissions
- ['geolocation', 'notifications']

colorScheme (String):
- 'light', 'dark', 'no-preference'

acceptDownloads (Boolean):
- Downloads erlauben

ignoreHTTPSErrors (Boolean):
- SSL-Fehler ignorieren
- Nuetzlich bei self-signed certs

offline (Boolean):
- Offline-Modus simulieren

httpCredentials (Object):
- HTTP Basic Auth
- { username: 'user', password: 'pass' }

extraHTTPHeaders (Object):
- Custom HTTP-Headers
- { 'X-API-Key': 'abc123' }

proxy (Object):
- Proxy-Server
- { server: 'http://proxy:8080', username: '...', password: '...' }

storageState (String | Object):
- Cookies & LocalStorage laden
- 'cookies.json' oder { cookies: [...], origins: [...] }

recordVideo (Object):
- Video-Recording
- { dir: 'videos/', size: { width: 1280, height: 720 } }

recordHar (Object):
- Network-Traffic aufzeichnen
- { path: 'network.har' }

### Cookie-Management (Scratchy-Workflow)

Cookies speichern:
await context.storageState({ path: 'cookies.json' })

Cookies laden:
const context = await browser.newContext({
  storageState: 'cookies.json'
})

Cookie-Format (cookies.json):
{
  "cookies": [
    {
      "name": "session",
      "value": "abc123...",
      "domain": ".skool.com",
      "path": "/",
      "expires": 1699999999,
      "httpOnly": true,
      "secure": true,
      "sameSite": "Lax"
    }
  ],
  "origins": [
    {
      "origin": "https://www.skool.com",
      "localStorage": []
    }
  ]
}

Manual Cookie-Injection (wie in Scratchy):
const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf-8'))
await context.addCookies(cookies.cookies)

Cookie-Debugging:
const cookies = await context.cookies()
console.log(cookies)

## Pages

### Was ist eine Page?

Eine Page ist ein Browser-Tab:
- Jeder Context kann multiple Pages haben
- Page = 1 Tab
- Pages sharen Context (Cookies, LocalStorage)

### Page erstellen

Neue Page:
const page = await context.newPage()

Oder direkt vom Browser (erstellt automatisch Context):
const page = await browser.newPage()

Multiple Pages:
const page1 = await context.newPage()
const page2 = await context.newPage()
// page1 und page2 sharen Cookies!

### Page-Navigieren

Zu URL navigieren:
await page.goto('https://example.com')

Mit Optionen:
await page.goto('https://example.com', {
  waitUntil: 'networkidle',
  timeout: 60000
})

waitUntil Optionen:
- 'load': DOMContentLoaded Event
- 'domcontentloaded': HTML komplett geparst
- 'networkidle': Keine Netzwerk-Requests mehr (2 Sekunden Ruhe)
- 'commit': Navigation committed

ACHTUNG: 'networkidle' kann SEHR langsam sein bei Seiten mit Ads/Analytics!
Empfehlung fuer Scraping: 'domcontentloaded'

Zurueck/Vorwaerts:
await page.goBack()
await page.goForward()

Reload:
await page.reload()

Current URL:
const url = page.url()

### Page-Interaktionen

Click:
await page.click('button')
await page.click('button', { clickCount: 2 }) // Double-click

Fill (Input):
await page.fill('input[name="email"]', 'test@example.com')

Type (langsamer, simuliert echtes Tippen):
await page.type('input[name="email"]', 'test@example.com', { delay: 100 })

Select (Dropdown):
await page.selectOption('select#country', 'Germany')
await page.selectOption('select#country', { label: 'Germany' })
await page.selectOption('select#country', { value: 'DE' })

Checkbox/Radio:
await page.check('input[type="checkbox"]')
await page.uncheck('input[type="checkbox"]')

Hover:
await page.hover('button')

Focus:
await page.focus('input[name="email"]')

Press Key:
await page.press('input[name="email"]', 'Enter')
await page.press('input[name="email"]', 'Control+A')

Upload File:
await page.setInputFiles('input[type="file"]', 'path/to/file.pdf')
await page.setInputFiles('input[type="file"]', ['file1.pdf', 'file2.pdf']) // Multiple

### Warten

Wait fuer Element:
await page.waitForSelector('button')

Wait fuer Timeout:
await page.waitForTimeout(5000) // 5 Sekunden

Wait fuer Function:
await page.waitForFunction(() => document.readyState === 'complete')

Wait fuer Network:
await page.waitForLoadState('networkidle')

Wait fuer URL:
await page.waitForURL('**/login')

## Locators (Elemente finden)

### Was sind Locators?

Locators sind Playwright's Methode, um Elemente zu finden:
- Auto-Waiting (wartet automatisch)
- Auto-Retry (versucht mehrfach)
- Strict Mode (Fehler bei multiple matches)

### Empfohlene Locators (User-Facing)

getByRole (BEST):
await page.getByRole('button', { name: 'Submit' }).click()

Alle Roles:
- button
- checkbox
- heading (h1-h6)
- link (a)
- listitem (li)
- textbox (input type=text)
- radio
- table
- row
- cell

getByLabel (Forms):
await page.getByLabel('Email').fill('test@example.com')

getByPlaceholder:
await page.getByPlaceholder('Enter your name').fill('John')

getByText:
await page.getByText('Welcome').click()
await page.getByText(/Welcome/i).click() // Case-insensitive

getByAltText (Images):
await page.getByAltText('Logo').click()

getByTitle:
await page.getByTitle('Close').click()

getByTestId (Test-IDs):
await page.getByTestId('submit-button').click()

### CSS & XPath Locators

CSS:
await page.locator('button.submit').click()
await page.locator('#login-form input[name="email"]').fill('test@example.com')

XPath (NICHT EMPFOHLEN):
await page.locator('xpath=//button[@id="submit"]').click()
await page.locator('//button[@id="submit"]').click()

WARUM NICHT XPath?
- Bricht bei DOM-Aenderungen
- Schwer zu lesen
- Nicht user-facing
- Langsamer als CSS

### Chaining Locators

Parent → Child:
await page.locator('form').locator('button').click()
await page.locator('form button').click() // Equivalent

Mit getBy*:
await page.locator('form').getByRole('button', { name: 'Submit' }).click()

Filtering:
await page.getByRole('listitem').filter({ hasText: 'Product 2' }).click()

NOT Filtering:
await page.getByRole('listitem').filter({ hasNotText: 'Out of stock' })

Has Child:
await page.getByRole('listitem').filter({ has: page.getByText('Product 2') })

### Multiple Elements

First:
await page.locator('button').first().click()

Last:
await page.locator('button').last().click()

Nth (Index):
await page.locator('button').nth(2).click() // 3. Button (0-indexed)

All (Loop):
const buttons = await page.locator('button').all()
for (const button of buttons) {
  await button.click()
}

Count:
const count = await page.locator('button').count()

### Strictness (WICHTIG!)

Playwright wirft Fehler bei multiple matches:
await page.locator('button').click() // ERROR wenn >1 Button!

Loesung 1: Spezifischerer Locator:
await page.getByRole('button', { name: 'Submit' }).click()

Loesung 2: Filter:
await page.locator('button').filter({ hasText: 'Submit' }).click()

Loesung 3: First/Nth (NICHT EMPFOHLEN):
await page.locator('button').first().click()

## Selectors Deep-Dive

### Text Selectors

Exakter Text:
page.getByText('Welcome', { exact: true })

Substring:
page.getByText('Welcome') // Matches "Welcome!" auch

Regex:
page.getByText(/welcome/i) // Case-insensitive

### hasText Filter

Partial Match:
page.locator('div').filter({ hasText: 'Product' })

Regex:
page.locator('div').filter({ hasText: /product \d+/i })

### CSS Pseudo-Selectors

Visible:
page.locator('button:visible')

Hidden:
page.locator('button:hidden')

Nth-Child:
page.locator('li:nth-child(2)')

First-Child:
page.locator('li:first-child')

Last-Child:
page.locator('li:last-child')

### Playwright-spezifische Selectors

has-text (CSS):
page.locator('button:has-text("Submit")')

has (CSS):
page.locator('article:has(h2:has-text("Product"))')

text (CSS):
page.locator('text=Submit') // Exact
page.locator('text=/Submit/i') // Regex

### Shadow DOM

Playwright durchdringt Shadow DOM automatisch:
page.locator('custom-element button').click()

AUSNAHME: XPath durchdringt Shadow DOM NICHT!

## Data Extraction

### Text extrahieren

innerText:
const text = await page.locator('h1').innerText()

textContent:
const text = await page.locator('h1').textContent()

Unterschied:
- innerText: Wie User sieht (ohne hidden elements)
- textContent: Roher Text (mit hidden elements)

allInnerTexts:
const texts = await page.locator('li').allInnerTexts()
// ['Item 1', 'Item 2', 'Item 3']

allTextContents:
const texts = await page.locator('li').allTextContents()

### Attribute extrahieren

getAttribute:
const href = await page.locator('a').getAttribute('href')
const src = await page.locator('img').getAttribute('src')

ACHTUNG: Gibt null zurueck wenn Attribut nicht existiert!

### HTML extrahieren

innerHTML:
const html = await page.locator('div').innerHTML()

outerHTML:
const html = await page.locator('div').outerHTML()

### Input-Values extrahieren

inputValue:
const value = await page.locator('input[name="email"]').inputValue()

### Evaluate (Custom JavaScript)

evaluate (Single Element):
const bgColor = await page.locator('button').evaluate(el => {
  return window.getComputedStyle(el).backgroundColor
})

evaluateAll (Multiple Elements):
const texts = await page.locator('li').evaluateAll(elements => {
  return elements.map(el => el.textContent)
})

evaluateHandle (Return DOM Element):
const elementHandle = await page.evaluateHandle(() => document.querySelector('button'))

ACHTUNG: evaluate() laeuft im Browser-Context, NICHT in Node.js!
Du kannst KEINE Node.js-Module verwenden!

### JSON extrahieren (Scratchy-Pattern)

Next.js __NEXT_DATA__:
const nextData = await page.evaluate(() => {
  const scriptTag = document.querySelector('script#__NEXT_DATA__')
  return JSON.parse(scriptTag.textContent)
})

Alle Script-Tags:
const scripts = await page.evaluate(() => {
  const tags = Array.from(document.querySelectorAll('script'))
  return tags.map(tag => ({
    src: tag.src,
    text: tag.textContent
  }))
})

## Screenshots & PDFs

### Screenshot

Vollseite:
await page.screenshot({ path: 'screenshot.png', fullPage: true })

Viewport:
await page.screenshot({ path: 'screenshot.png' })

Element:
await page.locator('button').screenshot({ path: 'button.png' })

Als Buffer:
const buffer = await page.screenshot()

Optionen:
await page.screenshot({
  path: 'screenshot.png',
  fullPage: true,
  type: 'png', // 'png' oder 'jpeg'
  quality: 80, // Nur fuer jpeg
  clip: { x: 0, y: 0, width: 100, height: 100 }, // Region
  omitBackground: true // Transparenter Hintergrund
})

### PDF

Nur Chromium!
await page.pdf({ path: 'page.pdf' })

Optionen:
await page.pdf({
  path: 'page.pdf',
  format: 'A4',
  printBackground: true,
  margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
  scale: 0.8
})

## Network-Interception

### Request-Interception

Route (Block/Modify):
await page.route('**/*.jpg', route => route.abort()) // Block images

await page.route('**/*.css', route => route.abort()) // Block CSS

await page.route('**/api/data', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify({ mock: 'data' })
  })
})

Modify Headers:
await page.route('**/*', route => {
  route.continue({
    headers: {
      ...route.request().headers(),
      'X-Custom-Header': 'value'
    }
  })
})

### Request/Response Listening

On Request:
page.on('request', request => {
  console.log(request.url())
})

On Response:
page.on('response', response => {
  console.log(response.url(), response.status())
})

Wait for specific Response:
const response = await page.waitForResponse('**/api/data')
const data = await response.json()

### Network Idle

Wait for Network Idle:
await page.goto('https://example.com', { waitUntil: 'networkidle' })

ACHTUNG: Kann sehr langsam sein!

## Anti-Bot-Techniken

### Problem: Bot-Detection

Websites erkennen Playwright durch:
1. navigator.webdriver = true
2. Missing Chrome Properties (window.chrome)
3. Headless User-Agent
4. Webdriver-specific Permissions
5. Missing Plugins

### Loesung 1: navigator.webdriver entfernen

await context.addInitScript(() => {
  Object.defineProperty(navigator, 'webdriver', {
    get: () => undefined
  })
})

WICHTIG: Muss VOR page.goto() passieren!

### Loesung 2: User-Agent anpassen

const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
})

Check aktuellen User-Agent:
https://www.whatismybrowser.com/detect/what-is-my-user-agent/

### Loesung 3: Launch Args

const browser = await chromium.launch({
  args: [
    '--disable-blink-features=AutomationControlled',
    '--disable-features=IsolateOrigins,site-per-process'
  ]
})

### Loesung 4: Chrome Properties patchen

await context.addInitScript(() => {
  window.chrome = {
    runtime: {}
  }
  Object.defineProperty(navigator, 'plugins', {
    get: () => [1, 2, 3, 4, 5]
  })
  Object.defineProperty(navigator, 'languages', {
    get: () => ['en-US', 'en']
  })
})

### Loesung 5: playwright-extra + stealth-plugin

Installation:
npm install playwright-extra puppeteer-extra-plugin-stealth

Usage:
const { chromium } = require('playwright-extra')
const stealth = require('puppeteer-extra-plugin-stealth')()
chromium.use(stealth)

const browser = await chromium.launch()

Vorteil: Automatisch 30+ Patches!

### Loesung 6: Realistic Viewport

const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1
})

NICHT verwenden:
- viewport: { width: 800, height: 600 } (zu klein, verdaechtig)
- viewport: null (headless-specific!)

### Loesung 7: Proxies

const context = await browser.newContext({
  proxy: {
    server: 'http://proxy.example.com:8080',
    username: 'user',
    password: 'pass'
  }
})

Warum Proxies?
- IP-Rotation
- Geo-Targeting
- Rate-Limit umgehen

### Loesung 8: Delays (Human-like)

Langsames Tippen:
await page.type('input', 'text', { delay: 100 })

Random Delays:
await page.waitForTimeout(Math.random() * 1000 + 500)

Mouse-Bewegung vor Click:
await page.hover('button')
await page.waitForTimeout(500)
await page.click('button')

### Vollstaendiges Anti-Bot-Setup (Scratchy-optimiert)

const { chromium } = require('playwright')

async function launchStealthBrowser() {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-features=IsolateOrigins,site-per-process',
      '--disable-site-isolation-trials'
    ]
  })

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    locale: 'en-US',
    timezoneId: 'America/New_York'
  })

  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined
    })
    window.chrome = {
      runtime: {}
    }
    Object.defineProperty(navigator, 'plugins', {
      get: () => [1, 2, 3, 4, 5]
    })
  })

  return { browser, context }
}

module.exports = { launchStealthBrowser }

## Error-Handling

### Common Errors

TimeoutError:
playwright.errors.TimeoutError: Timeout 30000ms exceeded.

Ursache:
- Element nicht gefunden
- Seite laed zu langsam

Loesung:
- Timeout erhoehen: await page.click('button', { timeout: 60000 })
- waitUntil aendern: await page.goto(url, { waitUntil: 'domcontentloaded' })

StrictModeViolationError:
Error: strict mode violation: locator('button') resolved to 5 elements

Ursache:
- Multiple elements matchen

Loesung:
- Spezifischerer Locator: await page.getByRole('button', { name: 'Submit' }).click()
- Filter: await page.locator('button').filter({ hasText: 'Submit' }).click()

NavigationError:
Error: Navigation failed because page was closed

Ursache:
- Page wurde geschlossen waehrend Navigation

Loesung:
- Check ob Page noch existiert: if (!page.isClosed()) { await page.goto(url) }

### Try-Catch

try {
  await page.click('button', { timeout: 5000 })
} catch (error) {
  if (error instanceof playwright.errors.TimeoutError) {
    console.log('Button nicht gefunden')
  } else {
    throw error
  }
}

### Retry-Logic

async function clickWithRetry(page, selector, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await page.click(selector)
      return
    } catch (error) {
      if (i === retries - 1) throw error
      await page.waitForTimeout(1000)
    }
  }
}

## Best Practices

### Locators

1. IMMER getByRole, getByLabel, getByText verwenden
2. NIEMALS XPath (außer Shadow DOM ist closed)
3. CSS nur wenn getBy* nicht geht
4. Test-IDs als letzter Ausweg

### Waiting

1. KEINE expliziten waitForTimeout() (außer fuer Delays)
2. Nutze Auto-Waiting (await page.click() wartet automatisch)
3. waitForSelector() nur wenn wirklich noetig

### Performance

1. Headless verwenden (schneller)
2. Bilder blocken: await page.route('**/*.jpg', route => route.abort())
3. CSS blocken: await page.route('**/*.css', route => route.abort())
4. networkidle vermeiden (langsam)

### Anti-Bot

1. IMMER navigator.webdriver entfernen
2. IMMER aktuellen User-Agent verwenden
3. Realistic Viewport (1920x1080)
4. playwright-extra + stealth-plugin fuer Production

### Error-Handling

1. Try-Catch bei kritischen Operationen
2. Retry-Logic fuer flaky Selectors
3. Screenshot bei Errors: await page.screenshot({ path: 'error.png' })

## Scratchy-spezifische Patterns

### Cookie-Auth-Pattern

1. Cookies auf PC erstellen (mit headed browser):
node auth.setup.js

2. Cookies zum Server kopieren:
scp playwright/.auth/skool-cookies.json SERVER:/opt/scratchy/playwright/.auth/

3. Cookies im Scraper laden:
const context = await browser.newContext({
  storageState: 'playwright/.auth/skool-cookies.json'
})

### Next.js JSON-Extraction-Pattern

const nextData = await page.evaluate(() => {
  const scriptTag = document.querySelector('script#__NEXT_DATA__')
  if (!scriptTag) return null
  try {
    return JSON.parse(scriptTag.textContent)
  } catch {
    return null
  }
})

if (!nextData) {
  throw new Error('Next.js data not found')
}

const posts = nextData.props.pageProps.postTrees || []

### Global Browser-Pattern (Scratchy core/fetch.mjs)

let globalBrowser = null
let globalContext = null

export async function initBrowser(config) {
  if (globalBrowser) return globalContext

  globalBrowser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled']
  })

  globalContext = await globalBrowser.newContext({
    userAgent: config.userAgent,
    storageState: config.cookiePath
  })

  return globalContext
}

export async function closeBrowser() {
  if (globalContext) await globalContext.close()
  if (globalBrowser) await globalBrowser.close()
  globalBrowser = null
  globalContext = null
}

### Cookie-Banner-Dismissal-Pattern

async function dismissCookieBanner(page) {
  const selectors = [
    'button:has-text("Accept")',
    'button:has-text("Alle akzeptieren")',
    'button:has-text("Accept all")',
    '#onetrust-accept-btn-handler',
    '.cookie-consent-accept'
  ]

  for (const selector of selectors) {
    try {
      await page.click(selector, { timeout: 2000 })
      console.log('Cookie-Banner dismissed:', selector)
      break
    } catch {
      // Naechster Selector
    }
  }
}

## Debugging

### Headed Mode

const browser = await chromium.launch({ headless: false, slowMo: 1000 })

slowMo: Verlangsamt Aktionen (ms)

### Playwright Inspector

Set Environment Variable:
PWDEBUG=1 node script.js

Oeffnet Inspector UI:
- Step durch Code
- Inspect Locators
- Console

### Screenshots bei jedem Step

await page.screenshot({ path: '01-start.png' })
await page.click('button')
await page.screenshot({ path: '02-after-click.png' })

### Video-Recording

const context = await browser.newContext({
  recordVideo: { dir: 'videos/' }
})

Video wird gespeichert nach context.close()

### Console-Logs mithoeren

page.on('console', msg => {
  console.log('PAGE LOG:', msg.text())
})

### Network-Logs

page.on('request', request => {
  console.log('REQUEST:', request.url())
})

page.on('response', response => {
  console.log('RESPONSE:', response.url(), response.status())
})

## Advanced: Custom Functions

### Smart Wait (Wait for Element OR Timeout)

async function waitForSelectorOrTimeout(page, selector, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { timeout })
    return true
  } catch {
    return false
  }
}

if (await waitForSelectorOrTimeout(page, 'button')) {
  await page.click('button')
}

### Scroll to Bottom (Infinite Scroll)

async function scrollToBottom(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0
      const distance = 100
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight
        window.scrollBy(0, distance)
        totalHeight += distance

        if (totalHeight >= scrollHeight) {
          clearInterval(timer)
          resolve()
        }
      }, 100)
    })
  })
}

### Extract All Links

async function extractAllLinks(page) {
  return await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(a => ({
      href: a.href,
      text: a.textContent.trim()
    }))
  })
}

### Extract All Images

async function extractAllImages(page) {
  return await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt
    }))
  })
}

## Performance-Optimierung

### Resource-Blocking

Block Images:
await page.route('**/*.{png,jpg,jpeg,gif,svg,webp}', route => route.abort())

Block CSS:
await page.route('**/*.css', route => route.abort())

Block Fonts:
await page.route('**/*.{woff,woff2,ttf}', route => route.abort())

Block Analytics:
await page.route('**/*{google-analytics,googletagmanager,facebook,doubleclick}*', route => route.abort())

### Request-Caching

const cache = new Map()

await page.route('**/*', async route => {
  const url = route.request().url()
  if (cache.has(url)) {
    route.fulfill({ body: cache.get(url) })
  } else {
    const response = await route.fetch()
    const body = await response.body()
    cache.set(url, body)
    route.fulfill({ response })
  }
})

### Multiple Pages Parallel

const urls = ['https://example1.com', 'https://example2.com']
const results = await Promise.all(
  urls.map(url => scrapePage(browser, url))
)

ACHTUNG: Nicht zu viele parallel (Rate-Limits!)

## Docker-Integration

### Dockerfile (Scratchy-Pattern)

FROM mcr.microsoft.com/playwright:v1.56.0-noble

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "main.js"]

### docker-compose.yml (Scratchy-Pattern)

services:
  scratchy:
    image: mcr.microsoft.com/playwright:v1.56.0-noble
    volumes:
      - ./:/opt/scratchy
    working_dir: /opt/scratchy
    command: tail -f /dev/null
    network_mode: host
    environment:
      - DISPLAY=:99
    deploy:
      resources:
        limits:
          memory: 4G

### Docker-Commands

Build:
docker compose build

Start:
docker compose up -d

Exec:
docker exec -it scratchy node main.js

Logs:
docker logs scratchy -f

Stop:
docker compose down

## Resources

Offizielle Docs:
https://playwright.dev/docs/intro

API Reference:
https://playwright.dev/docs/api/class-playwright

Best Practices:
https://playwright.dev/docs/best-practices

Community:
https://github.com/microsoft/playwright/discussions

Playwright Stealth:
https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth

## Naechste Datei

docs/CONTEXT.md oder ARCHITECTURE.md (falls nicht bereits vorhanden)

Ende des Playwright-Guides.
