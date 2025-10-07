# Node.js Complete Guide - Fuer Scratchy-The-Scraper

Diese Datei enthaelt ALLES ueber Node.js: Fundamentals, Async Programming, Module System, Best Practices.

## Was ist Node.js?

Node.js ist eine JavaScript-Runtime, die auf Chrome's V8 Engine basiert:
- Server-Side JavaScript
- Asynchronous & Event-Driven
- Non-Blocking I/O
- Single-Threaded (mit Event Loop)

### Geschichte

Created: 2009 von Ryan Dahl
Current Version: v22.x (LTS)
Engine: V8 (Google Chrome)
Package Manager: npm (Node Package Manager)

### Warum Node.js?

Vorteil 1: JavaScript Everywhere
- Frontend: Browser (JavaScript)
- Backend: Server (Node.js)
- Gleiche Sprache!

Vorteil 2: Performance
- V8 Engine (sehr schnell)
- Non-Blocking I/O (keine Wartezeiten)
- Event Loop (efficient)

Vorteil 3: npm-Ecosystem
- 2+ Millionen Packages
- Playwright, Express, Axios, etc.

Vorteil 4: Community
- Aktive Community
- Viele Tutorials & Docs
- Open Source

### Warum Node.js fuer Scratchy?

1. Playwright ist Node.js-basiert
2. Asynchronous (perfekt fuer Scraping)
3. npm-Packages fuer alles (jsdom, inquirer, axios)
4. Docker-Integration einfach

## Installation

### Ubuntu (Scratchy-Server)

NodeSource Repository hinzufuegen:
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

Node.js installieren:
sudo apt install -y nodejs

Check:
node --version
Output: v22.3.0

npm --version
Output: 10.5.0

### Alternative: nvm (Node Version Manager)

nvm installieren:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

Node.js via nvm:
nvm install 22
nvm use 22
nvm alias default 22

Vorteil: Multiple Node-Versionen parallel

## V8 Engine

### Was ist V8?

V8 ist Google's JavaScript-Engine:
- Geschrieben in C++
- Kompiliert JavaScript zu Machine Code
- JIT (Just-In-Time) Compilation
- Garbage Collection

### Wie V8 funktioniert

1. Parsing: JavaScript → Abstract Syntax Tree (AST)
2. Ignition: AST → Bytecode (Interpreter)
3. TurboFan: Bytecode → Optimized Machine Code (Compiler)
4. Execution: Machine Code wird ausgefuehrt

### Memory-Management

Stack (primitives):
- Numbers
- Strings (immutable)
- Booleans
- null, undefined

Heap (objects):
- Objects
- Arrays
- Functions
- Closures

Garbage Collection:
- Mark-and-Sweep Algorithm
- Generational GC (Young + Old Generation)
- Automatisch

## Event Loop

### Was ist der Event Loop?

Der Event Loop ist der Kern von Node.js:
- Single-Threaded
- Non-Blocking I/O
- Event-Driven

### Event Loop Phases

1. Timers: setTimeout(), setInterval()
2. Pending Callbacks: I/O-Callbacks
3. Idle, Prepare: Intern
4. Poll: I/O-Events abholen
5. Check: setImmediate()
6. Close Callbacks: socket.on('close')

### Code-Beispiel

console.log('1')

setTimeout(() => {
  console.log('2')
}, 0)

Promise.resolve().then(() => {
  console.log('3')
})

console.log('4')

Output:
1
4
3
2

Warum?
- console.log('1'): Synchron (sofort)
- console.log('4'): Synchron (sofort)
- Promise: Microtask Queue (hoehere Prioritaet)
- setTimeout: Macrotask Queue (niedrigere Prioritaet)

### Call Stack, Task Queue, Microtask Queue

Call Stack:
- Synchrone Funktionen
- LIFO (Last In, First Out)

Microtask Queue:
- Promises (.then, .catch)
- process.nextTick()
- Hoehere Prioritaet

Task Queue (Macrotask):
- setTimeout, setInterval
- setImmediate
- I/O-Callbacks
- Niedrigere Prioritaet

Event Loop Regel:
1. Call Stack leeren
2. Microtask Queue abarbeiten
3. Einen Task aus Task Queue
4. Repeat

## Module System

### CommonJS (Standard in Node.js)

Exportieren:
// math.js
const add = (a, b) => a + b
const subtract = (a, b) => a - b

module.exports = { add, subtract }

// ODER:
exports.add = (a, b) => a + b
exports.subtract = (a, b) => a - b

Importieren:
// main.js
const math = require('./math')
console.log(math.add(2, 3))

// ODER:
const { add, subtract } = require('./math')
console.log(add(2, 3))

### ES Modules (Modern)

Exportieren:
// math.mjs
export const add = (a, b) => a + b
export const subtract = (a, b) => a - b

// ODER Default Export:
const multiply = (a, b) => a * b
export default multiply

Importieren:
// main.mjs
import { add, subtract } from './math.mjs'
console.log(add(2, 3))

// Default Import:
import multiply from './math.mjs'
console.log(multiply(2, 3))

### CommonJS vs. ES Modules

|Feature|CommonJS|ES Modules|
|-------|--------|----------|
|Syntax|require/module.exports|import/export|
|Loading|Synchronous|Asynchronous|
|File Extension|.js (default)|.mjs oder .js mit "type": "module"|
|Top-Level await|No|Yes|
|Tree-Shaking|No|Yes|
|Browser|No|Yes|
|Node.js|Yes (default)|Yes (seit v12)|

### ES Modules in Node.js aktivieren

Option 1: .mjs Extension:
math.mjs
main.mjs

Option 2: package.json:
{
  "type": "module"
}

Dann:
math.js → ES Module
main.js → ES Module

### Dynamic Imports

CommonJS:
const modulePath = './math'
const math = require(modulePath)

ES Modules:
const modulePath = './math.mjs'
const math = await import(modulePath)

### Scratchy Module-Pattern

Scratchy nutzt ES Modules (.mjs):
- strategies/skool-interactive.mjs
- core/fetch.mjs
- adapters/file-writer.mjs

Warum?
- Moderne Syntax
- Top-Level await
- Cleaner Code

## package.json

### Was ist package.json?

package.json ist die Projekt-Konfigurationsdatei:
- Dependencies
- Scripts
- Metadata
- Engines

### Basic package.json

{
  "name": "scratchy-the-scraper",
  "version": "1.0.0",
  "description": "Universal web scraping framework",
  "main": "main.js",
  "type": "module",
  "scripts": {
    "start": "node main.js",
    "test": "node --test"
  },
  "keywords": ["scraping", "playwright"],
  "author": "24Firon",
  "license": "MIT",
  "engines": {
    "node": ">=22.0.0"
  },
  "dependencies": {
    "playwright": "^1.56.0",
    "inquirer": "^11.0.0"
  },
  "devDependencies": {
    "eslint": "^9.0.0"
  }
}

### package.json Fields

name:
- Projekt-Name
- Lowercase, no spaces
- "scratchy-the-scraper"

version:
- Semantic Versioning (MAJOR.MINOR.PATCH)
- "1.0.0"

description:
- Kurze Beschreibung
- "Universal web scraping framework"

main:
- Entry Point
- "main.js"

type:
- "commonjs" (default) oder "module"
- "module" fuer ES Modules

scripts:
- Custom Commands
- "start": "node main.js"
- Ausfuehren: npm start

keywords:
- Suchbegriffe fuer npm
- ["scraping", "playwright"]

author:
- "24Firon"

license:
- "MIT", "ISC", "Apache-2.0"

engines:
- Node-Version Requirements
- "node": ">=22.0.0"

dependencies:
- Production Dependencies
- "playwright": "^1.56.0"

devDependencies:
- Development Dependencies
- "eslint": "^9.0.0"

### Semantic Versioning

MAJOR.MINOR.PATCH (1.2.3):

MAJOR (1.x.x):
- Breaking Changes
- API nicht kompatibel

MINOR (x.2.x):
- Neue Features
- Backward-kompatibel

PATCH (x.x.3):
- Bug-Fixes
- Backward-kompatibel

### Version-Ranges

Exact:
"playwright": "1.56.0"

Caret (^):
"playwright": "^1.56.0"
Erlaubt: 1.56.0 bis <2.0.0

Tilde (~):
"playwright": "~1.56.0"
Erlaubt: 1.56.0 bis <1.57.0

Wildcard:
"playwright": "*"
Erlaubt: Jede Version (NICHT EMPFOHLEN!)

### Scripts

Predefined Scripts:
npm start → "start" script
npm test → "test" script
npm install → "preinstall", "install", "postinstall"

Custom Scripts:
"scripts": {
  "dev": "node --watch main.js",
  "lint": "eslint .",
  "format": "prettier --write ."
}

Ausfuehren:
npm run dev
npm run lint

## npm (Node Package Manager)

### Was ist npm?

npm ist der Package Manager fuer Node.js:
- Installiert Packages
- Managed Dependencies
- Publishes Packages (zu npm Registry)

### npm-Commands

npm install (oder npm i):
npm install playwright
npm install playwright@1.56.0
npm install playwright --save-dev
npm install -g typescript

npm uninstall:
npm uninstall playwright

npm update:
npm update
npm update playwright

npm outdated:
npm outdated

npm list:
npm list
npm list --depth=0

npm search:
npm search playwright

npm info:
npm info playwright

npm init:
npm init
npm init -y  # Mit Defaults

npm audit:
npm audit
npm audit fix

npm run:
npm run script-name

npm start:
npm start

npm test:
npm test

### package-lock.json

Was ist package-lock.json?
- Genaue Versionen aller Dependencies
- Transitiv (Dependencies von Dependencies)
- Garantiert Reproduzierbarkeit

WICHTIG: IMMER in Git committen!

### node_modules/

Was ist node_modules/?
- Alle installierten Packages
- Kann SEHR gross sein (100+ MB)
- NIEMALS in Git committen!

.gitignore:
node_modules/

### Global vs. Local Installation

Local (default):
npm install playwright
Installiert in: ./node_modules/
Nur fuer dieses Projekt

Global:
npm install -g typescript
Installiert in: /usr/local/lib/node_modules/
Verfuegbar system-weit

Check global packages:
npm list -g --depth=0

### npx

Was ist npx?
- Fuehrt npm-Packages aus OHNE Installation
- Oder: Fuehrt lokales Package aus node_modules aus

Beispiel:
npx playwright install chromium
npx eslint .

Vorteil: Keine globale Installation noetig!

### Scratchy Dependencies

dependencies:
- playwright: ^1.56.0 (Browser-Automation)
- inquirer: ^11.0.0 (CLI-Prompts)
- jsdom: ^25.0.0 (HTML-Parsing)

devDependencies:
- eslint: ^9.0.0 (Linting)
- prettier: ^3.0.0 (Formatting)

## Asynchronous Programming

### Callbacks (Alt)

Callback = Function als Argument:

fs.readFile('file.txt', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(data.toString())
})

Problem: Callback Hell:

fs.readFile('file1.txt', (err, data1) => {
  fs.readFile('file2.txt', (err, data2) => {
    fs.readFile('file3.txt', (err, data3) => {
      // Hell!
    })
  })
})

### Promises (Besser)

Promise = Object fuer zukuenftiges Resultat:

const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Success!')
  }, 1000)
})

promise
  .then(result => console.log(result))
  .catch(error => console.error(error))

Promise-States:
- Pending: Initial
- Fulfilled: resolve() called
- Rejected: reject() called

Promise-Chaining:

fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error))

Promise.all (Parallel):

Promise.all([
  fetch('https://api.example.com/users'),
  fetch('https://api.example.com/posts')
])
  .then(([users, posts]) => {
    console.log(users, posts)
  })

Promise.race (First):

Promise.race([
  fetch('https://api1.example.com'),
  fetch('https://api2.example.com')
])
  .then(response => console.log(response))

### Async/Await (Modern)

async/await = Syntactic Sugar fuer Promises:

async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data')
    const data = await response.json()
    console.log(data)
  } catch (error) {
    console.error(error)
  }
}

Vorteile:
- Sieht synchron aus
- Einfacheres Error-Handling (try-catch)
- Bessere Lesbarkeit

Top-Level await (nur in ES Modules):

// main.mjs
const data = await fetch('https://api.example.com/data')
console.log(data)

### Callbacks vs. Promises vs. Async/Await

|Feature|Callbacks|Promises|Async/Await|
|-------|---------|--------|-----------|
|Syntax|Function als Argument|.then().catch()|async/await|
|Error-Handling|Manuell (err param)|.catch()|try-catch|
|Readability|Callback Hell|Chaining|Synchron-ähnlich|
|Parallel|Manuell|Promise.all|Promise.all|
|Browser-Support|Alle|Modern|Modern (ES2017+)|

### Scratchy Async-Pattern

Scratchy nutzt async/await:

export async function runSkoolInteractiveStrategy(config) {
  const context = await initBrowser(config)
  const page = await context.newPage()
  await page.goto(config.url)
  
  const nextData = await page.evaluate(() => {
    const script = document.querySelector('script#__NEXT_DATA__')
    return JSON.parse(script.textContent)
  })
  
  return nextData
}

Warum?
- Moderne Syntax
- Einfaches Error-Handling
- Playwright ist Promise-basiert

## File System (fs)

### fs vs. fs/promises

fs (Callback-basiert):
const fs = require('fs')

fs.readFile('file.txt', (err, data) => {
  if (err) throw err
  console.log(data.toString())
})

fs/promises (Promise-basiert):
const fs = require('fs').promises

const data = await fs.readFile('file.txt', 'utf-8')
console.log(data)

Empfehlung: fs/promises (async/await-friendly)

### File Operations

Read File:
const fs = require('fs').promises
const data = await fs.readFile('file.txt', 'utf-8')

Write File:
await fs.writeFile('file.txt', 'Content')

Append File:
await fs.appendFile('file.txt', 'More content')

Delete File:
await fs.unlink('file.txt')

Check if File exists:
try {
  await fs.access('file.txt')
  console.log('File exists')
} catch {
  console.log('File does not exist')
}

Read Directory:
const files = await fs.readdir('./output')

Create Directory:
await fs.mkdir('./output', { recursive: true })

### Path-Modul

const path = require('path')

Join Paths:
const filePath = path.join(__dirname, 'output', 'file.txt')
// /opt/scratchy/output/file.txt

Resolve:
const absolute = path.resolve('file.txt')

Basename:
path.basename('/opt/scratchy/output/file.txt')
// file.txt

Dirname:
path.dirname('/opt/scratchy/output/file.txt')
// /opt/scratchy/output

Extension:
path.extname('file.txt')
// .txt

### Scratchy File-Pattern

import fs from 'fs/promises'
import path from 'path'

export async function writeToFile(filename, data) {
  const outputDir = path.join(process.cwd(), 'output')
  await fs.mkdir(outputDir, { recursive: true })
  
  const filepath = path.join(outputDir, filename)
  await fs.writeFile(filepath, JSON.stringify(data, null, 2))
  
  console.log(`Saved to: ${filepath}`)
}

## Environment Variables

### process.env

Was ist process.env?
- Environment Variables
- Konfiguration
- Secrets (API-Keys, Passwords)

Read:
const apiKey = process.env.API_KEY
const nodeEnv = process.env.NODE_ENV

Set (bei Start):
NODE_ENV=production API_KEY=abc123 node main.js

### .env File

.env File:
NODE_ENV=production
API_KEY=abc123
DATABASE_URL=postgres://localhost:5432/mydb

Laden mit dotenv:
npm install dotenv

// main.js
require('dotenv').config()

console.log(process.env.API_KEY)
// abc123

WICHTIG: .env in .gitignore!

### Scratchy Environment-Pattern

.env:
NODE_ENV=production
SKOOL_COMMUNITY_URL=https://www.skool.com/ki-business-agenten
MAX_POSTS=100

In Code:
import 'dotenv/config'

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  skoolUrl: process.env.SKOOL_COMMUNITY_URL,
  maxPosts: parseInt(process.env.MAX_POSTS, 10) || 10
}

## Error-Handling

### try-catch

try {
  const data = await fetchData()
  console.log(data)
} catch (error) {
  console.error('Error:', error.message)
}

### Error-Types

Error (Base):
throw new Error('Something went wrong')

TypeError:
throw new TypeError('Expected string, got number')

ReferenceError:
// Automatisch bei undefined variables

Custom Error:
class ScrapingError extends Error {
  constructor(message, url) {
    super(message)
    this.name = 'ScrapingError'
    this.url = url
  }
}

throw new ScrapingError('Failed to scrape', 'https://example.com')

### process.on('uncaughtException')

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  process.exit(1)
})

### process.on('unhandledRejection')

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason)
  process.exit(1)
})

### Scratchy Error-Pattern

try {
  const data = await runScraper(config)
  await writeToFile('output.json', data)
} catch (error) {
  console.error('Scraping failed:', error.message)
  
  if (error.name === 'TimeoutError') {
    console.error('Timeout: Server zu langsam')
  } else if (error.name === 'NetworkError') {
    console.error('Network: Keine Verbindung')
  } else {
    console.error('Unknown error:', error)
  }
  
  process.exit(1)
}

## Debugging

### console.log

console.log('Simple message')
console.log('Variable:', myVar)
console.log({ user, posts })

console.error('Error message')
console.warn('Warning message')
console.info('Info message')

console.table([
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 }
])

console.time('label')
// Code
console.timeEnd('label')

### node --inspect

Debug-Mode starten:
node --inspect main.js

Chrome DevTools:
chrome://inspect

Breakpoints:
debugger  // In Code

### VS Code Debugger

.vscode/launch.json:
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/main.js"
    }
  ]
}

F5 zum Starten

## Best Practices

### Code-Style

1. Use ES Modules:
import fs from 'fs'
export { myFunction }

2. Use async/await:
const data = await fetchData()

3. Use const/let (NICHT var):
const apiKey = 'abc123'
let counter = 0

4. Use Template Literals:
const message = `Hello, ${name}!`

5. Use Arrow Functions:
const add = (a, b) => a + b

### Error-Handling

1. IMMER try-catch bei async:
try {
  await fetchData()
} catch (error) {
  console.error(error)
}

2. Uncaught Exception Handler:
process.on('uncaughtException', handleError)
process.on('unhandledRejection', handleError)

3. Custom Error-Classes:
class MyError extends Error { }

### Performance

1. Use Streams fuer grosse Files:
const readStream = fs.createReadStream('large.txt')
readStream.pipe(process.stdout)

2. Avoid Blocking:
// Bad:
fs.readFileSync('file.txt')

// Good:
await fs.readFile('file.txt')

3. Use Worker Threads fuer CPU-intensive Tasks:
const { Worker } = require('worker_threads')

### Security

1. Validate Input:
if (typeof input !== 'string') throw new TypeError()

2. Use .env fuer Secrets:
process.env.API_KEY

3. Update Dependencies:
npm audit
npm audit fix

## Resources

Official Docs:
https://nodejs.org/en/docs/

npm Docs:
https://docs.npmjs.com

Node.js Best Practices:
https://github.com/goldbergyoni/nodebestpractices

## Naechste Datei

docs/WEB-SCRAPING-GUIDE.md (Web-Scraping Fundamentals)

Ende des Node.js-Guides.
