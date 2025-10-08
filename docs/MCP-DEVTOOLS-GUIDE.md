# MCP & Chrome DevTools Complete Guide - Fuer AI-Agent Integration

Diese Datei enthaelt ALLES ueber MCP (Model Context Protocol) und Chrome DevTools MCP für AI-Agent-Integration.

## Was ist MCP (Model Context Protocol)?

MCP = Open Standard fuer AI-Context-Management:
- Von Anthropic entwickelt (Nov 2024)
- Verbindet LLMs mit External Data Sources & Tools
- Client-Server Architecture
- "USB-C for AI Applications"

### Das N×M Problem

OHNE MCP:
- Jedes Tool braucht Custom Connector fuer jedes LLM
- N Tools × M LLMs = N×M Connectors
- Exponentielles Wachstum
- Wartungs-Nightmare

MIT MCP:
- Ein Standard-Interface
- N Tools + M LLMs = N+M Integrations
- Linear Growth
- Single Point of Integration

### MCP-Komponenten

**MCP Server:**
- Exponiert Tools, Resources, Prompts
- Implements MCP Protocol (JSON-RPC 2.0)
- Kann lokal oder remote sein

**MCP Client:**
- AI-Application (Claude Desktop, Cursor, etc.)
- Verbindet zu MCP Servers
- Ruft Tools/Resources auf

**Tools:**
- Functions die LLMs ausfuehren koennen
- Beispiel: weather_api, file_search, database_query

**Resources:**
- Data Sources die LLMs lesen koennen
- Beispiel: file_system, database_tables, API_endpoints

**Prompts:**
- Pre-defined Templates
- Optimale Tool/Resource-Nutzung

## MCP Transports

### stdio (Standard Input/Output)

Local Process Communication:
- MCP Server = Local Process
- Communication via stdin/stdout
- Best fuer: Local Tools (File System, Git, etc.)

Example:
{
"mcpServers": {
"filesystem": {
"command": "node",
"args": ["/path/to/mcp-server-filesystem/index.js"]
}
}
}

text

### HTTP with SSE (Server-Sent Events)

HTTP-based Communication:
- MCP Server = HTTP Endpoint
- One-way streaming (Server → Client)
- Best fuer: Remote Data Sources

### Streamable HTTP

Bi-directional HTTP:
- Two-way communication
- Streamable responses
- Best fuer: Complex Remote Integrations

## Chrome DevTools MCP

### Was ist Chrome DevTools MCP?

Chrome DevTools MCP = MCP Server fuer Chrome DevTools Protocol:
- Verbindet AI-Agents mit Chrome Browser
- Debugging, Performance-Analysis, Automation
- Real-time Browser-Inspection

### Use-Cases

1. **Automated Debugging:**
   AI-Agent debuggt Web-App live in Chrome

2. **Performance Analysis:**
   AI-Agent analysiert Performance-Traces

3. **Web Scraping (Advanced):**
   AI-Agent steuert Browser fuer komplexe Scraping-Tasks

4. **Testing:**
   AI-Agent tested Web-App interaktiv

### Features

**Network Monitoring:**
- HTTP Requests/Responses
- Headers, Body, Timing
- Filter by URL/Method

**Console Integration:**
- Browser Console Logs
- Errors, Warnings
- Execute JavaScript in Browser-Context

**Performance Metrics:**
- Page Load Time
- Resource Loading
- Memory Usage

**Page Inspection:**
- DOM Structure
- Element Properties
- Multi-Frame Support

**Storage Access:**
- Cookies
- localStorage
- sessionStorage

**Real-time Monitoring:**
- Live Console Output
- Network Request Streaming

**Object Inspection:**
- JavaScript Objects
- Variables
- Scope

## Installation

### Claude Desktop

#### Option 1: One-Click (.dxt Extension)

1. Visit: https://github.com/benjaminr/chrome-devtools-mcp
2. Click "Add to Claude Desktop"
3. Done!

#### Option 2: Manual Configuration

1. Open Claude Desktop
2. Settings → Developer → Edit Config
3. Add:
{
"mcpServers": {
"chrome-devtools": {
"command": "npx",
"args": ["-y", "chrome-devtools-mcp@latest"]
}
}
}

text
4. Restart Claude Desktop

### Cursor

1. Open Cursor Settings (Cmd/Ctrl + ,)
2. Navigate to "MCP" section
3. Click "New MCP Server"
4. Add:
{
"chrome-devtools": {
"command": "npx",
"args": ["-y", "chrome-devtools-mcp@latest"]
}
}

text
5. Save & Restart Cursor

### Visual Studio Code (Copilot)

Coming soon (MCP support in development)

## Chrome DevTools MCP - Available Tools

### browser_navigate

Navigate to URL:
{
"name": "browser_navigate",
"arguments": {
"url": "https://example.com"
}
}

text

### browser_screenshot

Take Screenshot:
{
"name": "browser_screenshot",
"arguments": {
"fullPage": true
}
}

text

### browser_click

Click Element:
{
"name": "browser_click",
"arguments": {
"selector": "button#submit"
}
}

text

### browser_type

Type Text:
{
"name": "browser_type",
"arguments": {
"selector": "input#email",
"text": "test@example.com"
}
}

text

### browser_evaluate

Execute JavaScript:
{
"name": "browser_evaluate",
"arguments": {
"script": "document.title"
}
}

text

### network_get_requests

Get Network Requests:
{
"name": "network_get_requests",
"arguments": {
"filter": "https://api.example.com/*"
}
}

text

### console_get_logs

Get Console Logs:
{
"name": "console_get_logs",
"arguments": {
"level": "error"
}
}

text

### performance_get_metrics

Get Performance Metrics:
{
"name": "performance_get_metrics",
"arguments": {}
}

text

### storage_get_cookies

Get Cookies:
{
"name": "storage_get_cookies",
"arguments": {
"domain": ".example.com"
}
}

text

### dom_get_element

Get Element Properties:
{
"name": "dom_get_element",
"arguments": {
"selector": "div.container"
}
}

text

## Use-Cases mit Scratchy

### Use-Case 1: Advanced Scraping mit AI-Agent

**Szenario:** Skool-Classroom scrapen (komplex, viele Interactions)

**Workflow:**
1. AI-Agent oeffnet Chrome via DevTools MCP
2. Navigiert zu Skool-Classroom
3. Clickt durch Kurse, Module, Lessons
4. Extrahiert Daten via JavaScript-Evaluation
5. Speichert in strukturierter Form

**Vorteil vs. Playwright:**
- AI-Agent entscheidet SELBST was zu clicken ist
- Kein statischer Code (adaptive Scraping)
- Natural Language Instructions

**Prompt-Beispiel:**
"Navigate to https://www.skool.com/ki-business-agenten/classroom.
Click on the first course.
Extract all module titles and lesson counts.
Save as JSON."

text

### Use-Case 2: Cookie-Banner Detection & Handling

**Szenario:** Automatische Cookie-Banner-Erkennung

**Workflow:**
1. AI-Agent navigiert zu Site
2. Inspiziert DOM via DevTools MCP
3. Findet Cookie-Banner (Smart Detection)
4. Clickt "Accept" Button

**Vorteil:**
- Keine statischen Selectors
- AI adaptiert an verschiedene Banner-Typen

### Use-Case 3: Performance-Monitoring

**Szenario:** Scraper-Performance optimieren

**Workflow:**
1. AI-Agent startet Scraper in Chrome
2. Monitored Network-Requests via DevTools MCP
3. Analysiert langsame Requests
4. Gibt Optimierungs-Empfehlungen

### Use-Case 4: Debug-Assistant

**Szenario:** Scraper funktioniert nicht

**Workflow:**
1. AI-Agent oeffnet Scraper in Chrome
2. Inspiziert Console-Errors via DevTools MCP
3. Analysiert Network-Requests
4. Diagnostiziert Problem
5. Gibt Fix-Vorschlaege

## MCP Server Development (Custom)

### Scratchy als MCP Server

**Vision:** Scratchy exponiert Scraping-Capabilities via MCP

**Architecture:**
Claude Desktop (MCP Client)
↓
Scratchy MCP Server (Tools)

scrape_skool_feed

scrape_skool_classroom

scrape_youtube

scrape_patreon
↓
Scratchy Core (Strategies)

text

### Implementation (Node.js)

#### Install MCP SDK

npm install @modelcontextprotocol/sdk

text

#### Basic MCP Server

// mcp-server.mjs
import { MCPServer } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

const server = new MCPServer({
name: 'scratchy-mcp-server',
version: '1.0.0'
})

// Define Tool: scrape_skool_feed
server.tool(
'scrape_skool_feed',
'Scrapes Skool community feed',
{
url: {
type: 'string',
description: 'Skool community URL',
required: true
},
maxPosts: {
type: 'number',
description: 'Max number of posts to scrape',
required: false
}
},
async ({ url, maxPosts = 100 }) => {
// Call Scratchy Scraper
const { runSkoolInteractiveStrategy } = await import('./strategies/skool-interactive.mjs')

text
const result = await runSkoolInteractiveStrategy({
  url,
  maxPosts,
  cookiePath: 'playwright/.auth/skool-cookies.json'
})

return {
  content: [
    {
      type: 'text',
      text: JSON.stringify(result, null, 2)
    }
  ]
}
}
)

// Start Server
const transport = new StdioServerTransport()
await server.connect(transport)

text

#### Claude Desktop Config

{
"mcpServers": {
"scratchy": {
"command": "node",
"args": ["/opt/scratchy/mcp-server.mjs"]
}
}
}

text

#### Usage in Claude

User: "Scrape the latest 50 posts from Skool community"

Claude: calls scrape_skool_feed tool
url: "https://www.skool.com/ki-business-agenten"
maxPosts: 50

returns scraped data

Claude: "I've scraped 50 posts. Here's a summary: ..."

text

### Advanced: Resource Definition

Expose File-System as Resource:

server.resource(
'scraped-data',
'Access to scraped data files',
async () => {
const files = await fs.readdir('./output')

text
return {
  resources: files.map(file => ({
    uri: `file:///opt/scratchy/output/${file}`,
    name: file,
    mimeType: 'application/json'
  }))
}
}
)

// Read specific resource
server.resourceTemplate(
'scraped-data/{filename}',
async ({ filename }) => {
const content = await fs.readFile(./output/${filename}, 'utf-8')

text
return {
  contents: [
    {
      uri: `file:///opt/scratchy/output/${filename}`,
      mimeType: 'application/json',
      text: content
    }
  ]
}
}
)

text

## Security Considerations

### Sensitive Data Exposure

**Problem:** MCP Server exponiert Browser-Content

**Loesung:**
1. Run MCP Server lokal (nicht remote)
2. Keine sensitive Sites oeffnen waehrend MCP aktiv
3. Review welche Tools/Resources exponiert werden

### Authentication

**Problem:** MCP Server braucht Auth fuer Remote-Access

**Loesung:**
1. Use API-Keys in Headers
2. Implement OAuth2 (fuer Enterprise)
3. IP-Whitelisting

### Rate-Limiting

**Problem:** AI-Agent macht zu viele Requests

**Loesung:**
1. Implement Rate-Limiting im MCP Server
2. Max X Requests pro Minute
3. Queue-based Execution

## Best Practices

### 1. Clear Tool Descriptions

Good:
server.tool(
'scrape_skool_feed',
'Scrapes posts from a Skool community feed. Returns title, content, author, timestamp, and media.',
{...}
)

text

Bad:
server.tool('scrape', 'Scrapes', {...})

text

### 2. Input Validation

server.tool('scrape_skool_feed', '...', { url: {...} }, async ({ url }) => {
if (!url.startsWith('https://www.skool.com/')) {
throw new Error('Invalid Skool URL')
}

// Scrape
})

text

### 3. Error-Handling

try {
const result = await scrape(url)
return { content: [{ type: 'text', text: JSON.stringify(result) }] }
} catch (error) {
return {
content: [{
type: 'text',
text: Error: ${error.message}
}],
isError: true
}
}

text

### 4. Logging

console.error('[MCP] Tool called:', toolName, args)
console.error('[MCP] Result:', result)

text

### 5. Versioning

const server = new MCPServer({
name: 'scratchy-mcp-server',
version: '1.0.0' // Semantic Versioning
})

text

## Debugging

### MCP Server Logs

Claude Desktop:
- View → Developer → Toggle Developer Tools
- Console-Tab → See MCP Server Logs

Cursor:
- Help → Toggle Developer Tools
- Console-Tab

### Test MCP Server Standalone

node mcp-server.mjs

text

Input (stdin):
{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}

text

Expected Output (stdout):
{"jsonrpc":"2.0","id":1,"result":{"tools":[...]}}

text

### Common Issues

**"MCP Server not found":**
- Check command/args in Config
- Check file path is correct
- Check Node.js is installed

**"Tool call failed":**
- Check Tool implementation
- Check Input validation
- Check Error-Handling

**"Connection lost":**
- MCP Server crashed (check logs)
- Restart Claude Desktop/Cursor

## Resources

MCP Official:
https://modelcontextprotocol.io

MCP Spec:
https://spec.modelcontextprotocol.io

Chrome DevTools MCP:
https://github.com/benjaminr/chrome-devtools-mcp

Anthropic MCP Docs:
https://docs.anthropic.com/en/docs/mcp

MCP SDK (Node.js):
https://github.com/modelcontextprotocol/sdk

## Naechste Schritte (Scratchy)

1. Install Chrome DevTools MCP in Claude Desktop
2. Test Basic Scraping mit AI-Agent
3. Build Custom Scratchy MCP Server (Phase 6)
4. Integrate mit n8n (Webhooks → MCP → Scraper)
5. Deploy to Production

Ende des MCP/DevTools-Guides.
