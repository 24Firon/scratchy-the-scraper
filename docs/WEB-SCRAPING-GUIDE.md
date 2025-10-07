# Web Scraping Complete Guide - Fuer Scratchy-The-Scraper

Diese Datei enthaelt ALLES ueber Web Scraping: Ethics, Legality, Techniques, Anti-Bot, Best Practices.

## Was ist Web Scraping?

Web Scraping = Automatisierte Daten-Extraktion von Websites:
- Extrahiert strukturierte Daten aus HTML
- Imitiert menschliches Browsing
- Speichert Daten in strukturierter Form (JSON, CSV, Database)

### Scraping vs. Crawling vs. Parsing

Crawling:
- Discover URLs (Sitemap, Links folgen)
- Beispiel: Googlebot

Scraping:
- Extract Data von URLs
- Beispiel: Product-Preise

Parsing:
- HTML → Strukturierte Daten
- Beispiel: JSON aus HTML

### Use-Cases

Price Monitoring:
- E-Commerce-Preise tracken
- Competitors analysieren

Lead Generation:
- Kontaktdaten sammeln
- B2B-Prospecting

Market Research:
- Reviews scrapen
- Sentiment-Analyse

Content Aggregation:
- News aggregieren
- Job-Postings sammeln

SEO:
- Backlinks tracken
- Rankings monitoren

Machine Learning:
- Training-Data sammeln
- NLP-Datasets

## Legality & Ethics

### Ist Web Scraping legal?

KURZE ANTWORT: Ja, wenn richtig gemacht.

LANGE ANTWORT: Es kommt darauf an:
- Was wird gescraped?
- Wie wird gescraped?
- Wo wird gescraped? (Jurisdiction)

### Legal Framework

USA (Computer Fraud and Abuse Act - CFAA):
- Scraping oeffentlicher Daten: LEGAL
- Scraping mit Login-Bypass: ILLEGAL
- Scraping trotz Terms of Service: GRAUZONE

Key Case: hiQ Labs vs. LinkedIn (2022)
- Ninth Circuit Ruling: Scraping PUBLIC data = LEGAL
- LinkedIn kann hiQ NICHT verklagen
- CFAA gilt NICHT fuer oeffentliche Websites

EU (GDPR):
- Personal Data scrapen: ILLEGAL ohne Consent
- Non-Personal Data: LEGAL
- Right to be Forgotten beachten

UK (Data Protection Act):
- Aehnlich wie GDPR
- Personal Data = protected

Deutschland:
- Urheberrecht beachten
- Datenschutz (DSGVO)
- Wettbewerbsrecht

### Was IST legal zu scrapen?

1. Oeffentlich zugaengliche Daten:
   - Product-Preise
   - News-Articles
   - Public Profiles
   - Reviews

2. Fakten & Daten (nicht urheberrechtlich geschuetzt):
   - Zahlen, Statistiken
   - Oeffentliche Records

3. Meta-Daten:
   - URLs, Timestamps
   - HTML-Struktur

### Was IST NICHT legal zu scrapen?

1. Personal Identifiable Information (PII):
   - Namen, Adressen
   - E-Mails, Telefonnummern
   - OHNE Consent

2. Copyrighted Content:
   - Vollstaendige Artikel (copy-paste)
   - Bilder, Videos
   - OHNE Attribution

3. Data hinter Login:
   - Private Messages
   - Non-Public Profiles
   - Paywalled Content

4. Terms of Service Violation:
   - Explizit verboten in ToS
   - ABER: ToS = Vertrag, nicht Gesetz!

### robots.txt

Was ist robots.txt?
- File auf Website (/robots.txt)
- Definiert Scraping-Rules
- KEIN Gesetz, nur Bitte!

Beispiel robots.txt:
User-agent: *
Disallow: /admin/
Disallow: /private/
Crawl-delay: 10

Bedeutung:
- Disallow: Bitte nicht scrapen
- Crawl-delay: 10 Sekunden Pause

robots.txt respektieren?
- Ethisch: JA
- Legal: NEIN (kein Gesetz)
- Empfehlung: JA (Best Practice)

robots.txt in Node.js checken:
npm install robots-parser

const robotsParser = require('robots-parser')

const robots = robotsParser('https://example.com/robots.txt', '*')
const allowed = robots.isAllowed('https://example.com/page')

### Ethical Scraping - Code of Conduct

1. Respektiere robots.txt:
   Check /robots.txt BEVOR du scrapst

2. Rate-Limiting:
   Max 1 Request pro Sekunde
   Bei grossen Sites: 1 Request / 5-10 Sekunden

3. User-Agent identifizieren:
   Mozilla/5.0 (compatible; MyBot/1.0; +http://mybot.com)
   NICHT: Generic Python-urllib

4. Keine Last auf Server:
   Scrape nachts (weniger Traffic)
   Keine DDoS-aehnlichen Requests

5. Daten NICHT weiterverkaufen:
   Personal Use OK
   Commercial Use = Consent noetig

6. Attribution:
   Source angeben (wo Daten herkommen)

7. Cache nutzen:
   Bereits gescrapte Daten NICHT nochmal scrapen

8. API nutzen (wenn vorhanden):
   APIs sind optimiert fuer Data-Access
   Scraping = Last Resort

### Scratchy Ethik

Scratchy-Ansatz:
- Respektiert robots.txt (OPTION im Config)
- Rate-Limiting (1 Request / Sekunde default)
- User-Agent identifiziert Scratchy
- Nur oeffentliche Daten
- Keine Personal Data (E-Mails etc.)
- API-first (wenn verfuegbar)

## HTML Fundamentals

### HTML-Struktur

HTML = HyperText Markup Language

Basic Structure:
<!DOCTYPE html>
<html>
<head>
  <title>Page Title</title>
</head>
<body>
  <h1>Heading</h1>
  <p>Paragraph</p>
  <a href="/page">Link</a>
</body>
</html>

### HTML-Elements

Tags:
<tagname>Content</tagname>

Self-Closing:
<img src="image.jpg" />
<br />

Attributes:
<a href="https://example.com" class="link" id="main-link">

Common Elements:
- <div>: Container
- <span>: Inline Container
- <p>: Paragraph
- <h1>-<h6>: Headings
- <a>: Link
- <img>: Image
- <ul>, <li>: Lists
- <table>, <tr>, <td>: Tables

### DOM (Document Object Model)

Was ist DOM?
- Tree-Struktur von HTML
- Programmable (JavaScript)

DOM-Tree:
html
├── head
│   └── title
└── body
    ├── h1
    └── p

### Inspecting HTML

Chrome DevTools:
1. Right-Click → Inspect
2. Elements-Tab
3. Hover ueber HTML → Highlight auf Page

Copy Selector:
Right-Click Element → Copy → Copy selector

Network-Tab:
1. F12 → Network
2. Reload Page
3. See all Requests (HTML, JS, CSS, Images, API-Calls)

## CSS Selectors

### Was sind CSS-Selectors?

CSS-Selectors = Pattern zum Finden von HTML-Elements:
- Urspruenglich fuer CSS (Styling)
- Auch nutzbar fuer Scraping

### Basic Selectors

Tag Selector:
p → Alle <p> Elements

Class Selector:
.classname → Alle Elements mit class="classname"

ID Selector:
#idname → Element mit id="idname"

Attribute Selector:
[href] → Alle Elements mit href-Attribut
[href="https://example.com"] → Specific value

### Combinators

Descendant (space):
div p → Alle <p> INNERHALB <div>

Child (>):
div > p → Alle <p> DIREKT unter <div>

Adjacent Sibling (+):
h1 + p → Erstes <p> NACH <h1>

General Sibling (~):
h1 ~ p → Alle <p> NACH <h1> (same level)

### Pseudo-Classes

:first-child:
p:first-child → Erstes <p> Kind

:last-child:
p:last-child → Letztes <p> Kind

:nth-child(n):
p:nth-child(2) → Zweites <p> Kind

:not():
p:not(.special) → Alle <p> OHNE class="special"

:contains() (jQuery-specific, nicht standard):
p:contains('text') → Alle <p> mit "text"

### Attribute-Matching

Starts with (^=):
[href^="https"] → href beginnt mit "https"

Ends with ($=):
[href$=".pdf"] → href endet mit ".pdf"

Contains (*=):
[class*="button"] → class enthaelt "button"

### Complex Selectors

Example 1:
div.container > ul.list li:first-child a[href^="https"]
→ Erster Link in erster List-Item in .list in .container

Example 2:
article.post > h2.title + p.description
→ <p class="description"> direkt nach <h2 class="title"> in <article class="post">

### CSS-Selectors in JavaScript

document.querySelector (Single):
const element = document.querySelector('div.container')

document.querySelectorAll (Multiple):
const elements = document.querySelectorAll('div.container p')

## XPath

### Was ist XPath?

XPath = XML Path Language:
- Navigate through XML/HTML
- Powerful (mehr als CSS)
- Komplexer Syntax

### XPath vs. CSS

|Feature|CSS|XPath|
|-------|---|-----|
|Syntax|Einfacher|Komplexer|
|Power|Weniger|Mehr|
|Parent-Selection|Nein|Ja|
|Text-Matching|Limited|Full|
|Attribute-Matching|Gut|Besser|
|Browser-Support|Alle|Alle|

### Basic XPath

Absolute Path:
/html/body/div/p
→ NICHT EMPFOHLEN (breaks bei DOM-Change)

Relative Path:
//p
→ Alle <p> Elements

### XPath Axes

Child (//):
//div//p → Alle <p> innerhalb <div>

Parent (..):
//p/.. → Parent von <p>

Following-Sibling:
//h1/following-sibling::p → Alle <p> nach <h1>

Preceding-Sibling:
//h1/preceding-sibling::p → Alle <p> vor <h1>

Ancestor:
//p/ancestor::div → Alle <div> Ancestors

Descendant:
//div/descendant::p → Alle <p> Descendants

### XPath Predicates

By Index:
//p[1] → Erstes <p>
//p[last()] → Letztes <p>

By Attribute:
//a[@href] → Alle <a> mit href
//a[@href='https://example.com'] → Specific href

By Text:
//p[text()='Hello'] → <p> mit exakt "Hello"
//p[contains(text(), 'Hello')] → <p> enthaelt "Hello"

By Class:
//div[@class='container'] → Exact class
//div[contains(@class, 'container')] → Class enthaelt

### XPath Functions

text():
//p/text() → Text-Content

contains():
//p[contains(text(), 'Hello')]

starts-with():
//a[starts-with(@href, 'https')]

normalize-space():
//p[normalize-space()='Hello']
→ Trimmed text

count():
count(//p) → Anzahl <p>

### Complex XPath

Example 1:
//div[@class='post']//h2[@class='title']/text()
→ Text von <h2 class="title"> in <div class="post">

Example 2:
//a[contains(@href, 'product')]/@href
→ href-Attribut von <a> mit "product" in href

Example 3:
//div[@class='comment']//p[not(@class)]/text()
→ Text von <p> OHNE class in <div class="comment">

### XPath in JavaScript

document.evaluate:
const result = document.evaluate(
  '//p',
  document,
  null,
  XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
  null
)

for (let i = 0; i < result.snapshotLength; i++) {
  console.log(result.snapshotItem(i))
}

### Wann CSS, wann XPath?

CSS verwenden:
- Einfache Selektoren
- Class/ID-basiert
- Modern Websites

XPath verwenden:
- Parent-Selection noetig
- Text-Matching noetig
- Complex Attribute-Logic
- XML (nicht HTML)

## Parsing-Libraries

### jsdom (Node.js)

Was ist jsdom?
- JavaScript implementation of DOM
- Browser-like Environment in Node.js

Installation:
npm install jsdom

Usage:
import { JSDOM } from 'jsdom'

const html = '<html><body><p>Hello</p></body></html>'
const dom = new JSDOM(html)
const document = dom.window.document

const p = document.querySelector('p')
console.log(p.textContent)
// Hello

### Cheerio (Node.js)

Was ist Cheerio?
- jQuery-like API fuer Node.js
- Schneller als jsdom (kein JS-Execution)

Installation:
npm install cheerio

Usage:
import cheerio from 'cheerio'

const html = '<html><body><p class="text">Hello</p></body></html>'
const $ = cheerio.load(html)

const text = $('p.text').text()
console.log(text)
// Hello

const links = $('a').map((i, el) => $(el).attr('href')).get()

### lxml (Python)

Installation:
pip install lxml

Usage:
from lxml import html

tree = html.fromstring('<html><body><p>Hello</p></body></html>')
p = tree.xpath('//p/text()')
print(p)
# ['Hello']

### BeautifulSoup (Python)

Installation:
pip install beautifulsoup4

Usage:
from bs4 import BeautifulSoup

html = '<html><body><p class="text">Hello</p></body></html>'
soup = BeautifulSoup(html, 'html.parser')

text = soup.find('p', class_='text').text
print(text)
# Hello

### Scratchy Parsing-Stack

Scratchy nutzt:
1. Playwright (Browser-based, JS-Rendering)
2. jsdom (Fallback fuer Static HTML)

Warum Playwright?
- Next.js, React scrapen (Dynamic Content)
- Full Browser-Emulation
- Anti-Bot-Evasion

Warum jsdom?
- Schneller fuer Static Sites
- Kein Browser noetig
- Good fuer APIs (JSON-Response mit embedded HTML)

## Dynamic Content (SPAs)

### Was sind SPAs?

SPA = Single Page Application:
- JavaScript-rendered Content
- Initial HTML ist fast leer
- Content kommt via AJAX/Fetch

Beispiele:
- React, Vue, Angular
- Next.js, Nuxt
- Modern Dashboards

### Problem mit Static Scraping

Static Scraper (requests/axios):
GET https://spa-site.com
→ HTML response ist leer (nur <div id="root"></div>)
→ KEIN Content!

Loesung: Browser-based Scraping (Playwright, Puppeteer)

### Playwright fuer SPAs

Playwright laed JavaScript:
const page = await context.newPage()
await page.goto('https://spa-site.com')

await page.waitForSelector('div.content')
const content = await page.locator('div.content').textContent()

### Next.js-Specifics

Next.js = React Framework mit SSR/SSG:
- Server-Side Rendering
- JSON in HTML embedded (<script id="__NEXT_DATA__">)

Scratchy Skool-Pattern:
const nextData = await page.evaluate(() => {
  const script = document.querySelector('script#__NEXT_DATA__')
  return JSON.parse(script.textContent)
})

const posts = nextData.props.pageProps.postTrees

Warum besser als HTML-Parsing?
- JSON ist strukturiert
- Kein CSS-Selector noetig
- Robust gegen DOM-Aenderungen

### API-Reverse-Engineering

Viele SPAs laden Daten via API:
1. Chrome DevTools → Network-Tab
2. Filter: XHR
3. Find API-Call (z.B. /api/posts)
4. Copy URL
5. Scrape API direkt (schneller!)

Example:
const response = await fetch('https://site.com/api/posts')
const data = await response.json()

Vorteil:
- Kein Browser noetig
- Schneller
- Strukturierte Daten (JSON)

Nachteil:
- API kann auth/rate-limiting haben
- API-Struktur kann sich aendern

## Pagination

### Was ist Pagination?

Pagination = Daten auf mehrere Seiten verteilt:
- Page 1, 2, 3, ...
- "Load More" Button
- Infinite Scroll

### Types of Pagination

URL-based:
https://site.com/page/1
https://site.com/page/2
https://site.com/page/3

Parameter-based:
https://site.com/posts?page=1
https://site.com/posts?page=2

Load-More Button:
<button id="load-more">Load More</button>
→ Click → AJAX-Request

Infinite Scroll:
Scroll Down → AJAX-Request

### URL-based Pagination

for (let page = 1; page <= 10; page++) {
  const url = `https://site.com/page/${page}`
  const response = await fetch(url)
  const data = await scrape(response)
  results.push(...data)
}

### Load-More Button

while (await page.locator('#load-more').isVisible()) {
  await page.click('#load-more')
  await page.waitForTimeout(2000)
}

const data = await page.locator('.item').all()

### Infinite Scroll

async function scrollToBottom(page) {
  let previousHeight = 0
  while (true) {
    const currentHeight = await page.evaluate(() => document.body.scrollHeight)
    if (currentHeight === previousHeight) break
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(2000)
    previousHeight = currentHeight
  }
}

## Rate-Limiting & Politeness

### Warum Rate-Limiting?

Problem ohne Rate-Limiting:
- Server-Overload (DDoS-aehnlich)
- IP-Ban
- Legal Issues

### Rate-Limiting-Strategien

Fixed Delay:
for (const url of urls) {
  await scrape(url)
  await sleep(1000) // 1 Sekunde
}

Random Delay:
const delay = Math.random() * 1000 + 500 // 0.5-1.5 Sekunden
await sleep(delay)

Exponential Backoff:
let retries = 0
while (retries < 3) {
  try {
    await scrape(url)
    break
  } catch (error) {
    retries++
    await sleep(1000 * Math.pow(2, retries)) // 2s, 4s, 8s
  }
}

### Request-Throttling

npm install bottleneck

const Bottleneck = require('bottleneck')

const limiter = new Bottleneck({
  minTime: 1000, // 1 Request pro Sekunde
  maxConcurrent: 1
})

const scrape = limiter.wrap(async (url) => {
  // Scraping-Logic
})

### Scratchy Rate-Limiting

Scratchy-Config:
const config = {
  rateLimit: {
    requests: 1,
    per: 'second' // 1 Request / Sekunde
  }
}

## Anti-Bot-Detection

### Wie Websites Bots erkennen

1. User-Agent:
   - Python-urllib/3.9 → BOT!

2. navigator.webdriver:
   - true → BOT!

3. Mouse-Movement:
   - Kein Movement → BOT!

4. Request-Pattern:
   - 100 Requests/Sekunde → BOT!

5. IP-Reputation:
   - Datacenter-IP → BOT?

6. JavaScript-Challenges:
   - CAPTCHA
   - Fingerprinting

### Anti-Bot-Techniken (siehe PLAYWRIGHT-GUIDE.md)

1. navigator.webdriver entfernen:
await context.addInitScript(() => {
  Object.defineProperty(navigator, 'webdriver', {
    get: () => undefined
  })
})

2. User-Agent anpassen:
const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
})

3. Launch-Args:
const browser = await chromium.launch({
  args: ['--disable-blink-features=AutomationControlled']
})

4. Human-like Behavior:
await page.hover('button')
await page.waitForTimeout(Math.random() * 1000)
await page.click('button')

5. playwright-extra + stealth:
npm install playwright-extra puppeteer-extra-plugin-stealth

const { chromium } = require('playwright-extra')
const stealth = require('puppeteer-extra-plugin-stealth')()
chromium.use(stealth)

### CAPTCHA-Handling

CAPTCHA = Completely Automated Public Turing test:
- reCAPTCHA (Google)
- hCaptcha
- Image-based

Loesungen:
1. Avoid CAPTCHA (Rate-Limiting, User-Agent)
2. Manual Solving (headed browser)
3. CAPTCHA-Solving Services (2Captcha, Anti-Captcha)
4. NICHT EMPFOHLEN: Automatische Solving (ML-based)

## Proxy-Rotation

### Warum Proxies?

Problem ohne Proxies:
- IP-Ban nach X Requests
- Geo-Restrictions

Loesung: IP-Rotation via Proxies

### Proxy-Types

Datacenter Proxies:
- Schnell
- Guenstig
- Leicht erkennbar

Residential Proxies:
- Real User-IPs
- Teuer
- Schwer erkennbar

Mobile Proxies:
- Mobile-IPs
- Sehr teuer
- Sehr schwer erkennbar

### Proxy-Providers

Paid:
- Bright Data (teuer, gut)
- Oxylabs
- Smartproxy

Free (NICHT EMPFOHLEN):
- Langsam
- Unreliable
- Security-Risk

### Proxies in Playwright

const context = await browser.newContext({
  proxy: {
    server: 'http://proxy.example.com:8080',
    username: 'user',
    password: 'pass'
  }
})

### Proxy-Rotation

const proxies = [
  'http://proxy1.com:8080',
  'http://proxy2.com:8080',
  'http://proxy3.com:8080'
]

for (let i = 0; i < urls.length; i++) {
  const proxy = proxies[i % proxies.length]
  const context = await browser.newContext({ proxy: { server: proxy } })
  // Scrape
  await context.close()
}

## Data-Storage

### File-based

JSON:
import fs from 'fs/promises'

await fs.writeFile('output.json', JSON.stringify(data, null, 2))

CSV:
npm install csv-writer

const createCsvWriter = require('csv-writer').createObjectCsvWriter

const csvWriter = createCsvWriter({
  path: 'output.csv',
  header: [
    { id: 'name', title: 'Name' },
    { id: 'price', title: 'Price' }
  ]
})

await csvWriter.writeRecords(data)

### Database

SQLite:
npm install better-sqlite3

const Database = require('better-sqlite3')
const db = new Database('data.db')

db.exec('CREATE TABLE IF NOT EXISTS posts (id INT, title TEXT)')
const insert = db.prepare('INSERT INTO posts VALUES (?, ?)')

for (const post of posts) {
  insert.run(post.id, post.title)
}

PostgreSQL:
npm install pg

const { Client } = require('pg')
const client = new Client({ connectionString: process.env.DATABASE_URL })

await client.connect()
await client.query('INSERT INTO posts (id, title) VALUES ($1, $2)', [post.id, post.title])

### Cloud-Storage

Airtable:
npm install airtable

const Airtable = require('airtable')
const base = new Airtable({ apiKey: 'KEY' }).base('BASE_ID')

await base('Posts').create([
  { fields: { Title: 'Post 1', Content: 'Content 1' } }
])

Supabase:
npm install @supabase/supabase-js

const { createClient } = require('@supabase/supabase-js')
const supabase = createClient('URL', 'KEY')

await supabase.from('posts').insert([
  { title: 'Post 1', content: 'Content 1' }
])

### Scratchy Storage-Adapter

Scratchy nutzt Adapter-Pattern:
- adapters/file-writer.mjs (JSON/CSV)
- adapters/airtable-adapter.mjs
- adapters/supabase-adapter.mjs

Config:
const config = {
  output: {
    type: 'file', // 'airtable', 'supabase'
    format: 'json' // 'csv'
  }
}

## Best Practices

### 1. Respektiere robots.txt

Check IMMER /robots.txt BEVOR du scrapst.

### 2. Rate-Limiting

Max 1 Request/Sekunde (besser: 1 Request / 5-10 Sekunden)

### 3. User-Agent identifizieren

Mozilla/5.0 (compatible; MyBot/1.0; +http://mybot.com)

### 4. Error-Handling

try-catch bei JEDEM Request:
try {
  await scrape(url)
} catch (error) {
  console.error('Failed:', url, error.message)
}

### 5. Retry-Logic

Bei Timeout/Network-Error: Retry 3x mit Exponential Backoff

### 6. Caching

Bereits gescrapte Daten NICHT nochmal scrapen:
const cache = new Map()

if (cache.has(url)) {
  return cache.get(url)
}

const data = await scrape(url)
cache.set(url, data)

### 7. Monitoring

Log ALLES:
- Erfolgreiche Requests
- Failed Requests
- Rate-Limit-Hits
- CAPTCHA-Encounters

### 8. Graceful Degradation

Wenn Scraping fehlschlaegt:
- Fallback zu API
- Partial Data speichern
- Retry spaeter

### 9. Data-Validation

Validiere gescrapte Daten:
if (!data.title || !data.price) {
  throw new Error('Invalid data')
}

### 10. Incremental Scraping

Scrape NICHT alles auf einmal:
- Scrape nur neue Daten (seit letztem Run)
- Delta-Updates

## Troubleshooting

### Empty Output

Problem: data = []

Ursachen:
1. Selectors falsch
2. Dynamic Content (JS-rendered)
3. Blocked by Anti-Bot

Loesung:
1. Inspect HTML (Chrome DevTools)
2. Use Playwright (fuer JS)
3. Anti-Bot-Evasion

### Timeout-Errors

Problem: TimeoutError: Waiting for selector timed out

Ursachen:
1. Selector falsch
2. Seite laed langsam
3. Element existiert nicht

Loesung:
1. Check Selector
2. Increase Timeout
3. Use waitForLoadState

### IP-Ban

Problem: 403 Forbidden / 429 Too Many Requests

Ursachen:
1. Zu viele Requests
2. Suspicious User-Agent

Loesung:
1. Rate-Limiting
2. Proxy-Rotation
3. User-Agent anpassen

### CAPTCHA

Problem: CAPTCHA appears

Ursachen:
1. Bot detected

Loesung:
1. Anti-Bot-Evasion (siehe PLAYWRIGHT-GUIDE.md)
2. Manual Solving (headed browser)
3. CAPTCHA-Service

## Resources

Web Scraping Legality:
- hiQ vs LinkedIn Case: https://en.wikipedia.org/wiki/HiQ_Labs_v._LinkedIn
- GDPR: https://gdpr.eu

Scraping-Tools:
- Playwright: https://playwright.dev
- Cheerio: https://cheerio.js.org
- Beautiful Soup: https://www.crummy.com/software/BeautifulSoup/

Proxy-Providers:
- Bright Data: https://brightdata.com
- Smartproxy: https://smartproxy.com

CAPTCHA-Services:
- 2Captcha: https://2captcha.com
- Anti-Captcha: https://anti-captcha.com

## Naechste Datei

docs/JSON-GUIDE.md (JSON-Processing Fundamentals)

Ende des Web-Scraping-Guides.
