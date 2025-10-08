# n8n Complete Guide - Fuer Scratchy-The-Scraper Integration

Diese Datei enthaelt ALLES ueber n8n: Basics, Workflows, Webhooks, API-Integration, Scratchy-Integration.

## Was ist n8n?

n8n = workflow automation platform (pronounced "n-eight-n"):
- Open-Source & Self-Hostable
- Visual Workflow Builder (No-Code/Low-Code)
- 400+ App-Integrations
- AI-Native (OpenAI, Anthropic, etc.)

### n8n vs. Zapier vs. Make

|Feature|n8n|Zapier|Make|
|-------|---|------|-----|
|Open-Source|Ja|Nein|Nein|
|Self-Hostable|Ja|Nein|Nein|
|Price|Free (self-host)|$29+/mo|$10+/mo|
|Node Limit|Unlimited|Limited|Limited|
|Custom Code|Ja|Limited|Ja|
|AI-Native|Ja|Limited|Limited|

### Warum n8n fuer Scratchy?

Vorteil 1: Trigger Scraping from Anywhere
- Webhook → Scraper starts
- Schedule → Daily scraping
- Manual → Button-Click

Vorteil 2: Post-Processing
- Scraped Data → AI-Analysis
- Scraped Data → Airtable/Supabase
- Scraped Data → Slack/Email-Notification

Vorteil 3: No-Code für Non-Developers
- Visual Builder
- User kann eigene Workflows bauen
- Keine Code-Aenderungen noetig

## Installation

### Option 1: n8n Cloud (Hosted)

Website: https://n8n.io/cloud

Pros:
- Kein Setup
- Auto-Updates
- Managed Backups

Cons:
- Paid (ab $20/Monat)
- Data in Cloud (nicht self-hosted)

### Option 2: Self-Hosted (Docker)

Best für Scratchy: Same Server wie Scraper!

#### Docker-Installation

docker-compose.yml:
version: '3.9'

services:
n8n:
image: n8nio/n8n:latest
container_name: n8n
restart: unless-stopped
ports:
- "5678:5678"
environment:
- N8N_HOST=n8n.scratchy.example.com
- N8N_PORT=5678
- N8N_PROTOCOL=https
- NODE_ENV=production
- WEBHOOK_URL=https://n8n.scratchy.example.com/
- GENERIC_TIMEZONE=Europe/Berlin
volumes:
- n8n_data:/home/node/.n8n
networks:
- n8n-network

volumes:
n8n_data:

networks:
n8n-network:

text

Start:
docker-compose up -d

text

Access:
http://localhost:5678

#### Mit Nginx Reverse Proxy (SSL)

nginx.conf:
server {
listen 80;
server_name n8n.scratchy.example.com;
return 301 https://$host$request_uri;
}

server {
listen 443 ssl;
server_name n8n.scratchy.example.com;

text
ssl_certificate /etc/letsencrypt/live/n8n.scratchy.example.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/n8n.scratchy.example.com/privkey.pem;

location / {
    proxy_pass http://localhost:5678;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # WebSocket Support
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
}

text

SSL-Zertifikat (Let's Encrypt):
sudo certbot --nginx -d n8n.scratchy.example.com

text

### Option 3: npm (Quick Test)

npm install -g n8n
n8n start

text

Access: http://localhost:5678

## n8n Basics

### Workflows

Workflow = Automated Process:
- Trigger (Start)
- Nodes (Actions)
- Connections (Data Flow)

Example Workflow:
Webhook → Scraper → AI-Analysis → Airtable

### Nodes

Node = Single Action:
- Trigger Nodes (Webhook, Schedule, Manual)
- Action Nodes (HTTP Request, Code, Set)
- Logic Nodes (IF, Switch, Merge)
- App Nodes (Airtable, Slack, OpenAI)

### Executions

Execution = Single Run:
- Triggered by Event
- Logs every Node-Output
- Success or Error

## Core Nodes

### Webhook (Trigger)

Webhook = HTTP-Endpoint to trigger Workflow:

Setup:
1. Add Webhook Node
2. Method: POST
3. Path: scraper-trigger
4. Respond: Using Respond to Webhook Node

Webhook-URL:
https://n8n.scratchy.example.com/webhook/scraper-trigger

Trigger via curl:
curl -X POST https://n8n.scratchy.example.com/webhook/scraper-trigger
-H "Content-Type: application/json"
-d '{"url": "https://www.skool.com/ki-business-agenten", "maxPosts": 10}'

text

### HTTP Request

HTTP Request = Call External APIs:

Setup:
1. Add HTTP Request Node
2. Method: POST
3. URL: http://localhost:3000/api/scrape
4. Body: JSON
{
"url": "{{ $json.url }}",
"maxPosts": {{ $json.maxPosts }}
}

text

### Code (JavaScript)

Code Node = Custom JavaScript:

Setup:
1. Add Code Node
2. Mode: Run Once for All Items
3. Code:
const items = $input.all();

const filtered = items.filter(item => {
return item.json.title.includes('AI');
});

return filtered;

text

### Set

Set Node = Modify Data:

Setup:
1. Add Set Node
2. Add Field
3. Name: status
4. Value: processed

### IF (Conditional)

IF Node = Branch Logic:

Setup:
1. Add IF Node
2. Condition: {{ $json.title }} contains AI
3. True → Action A
4. False → Action B

### Switch

Switch Node = Multiple Branches:

Setup:
1. Add Switch Node
2. Mode: Rules
3. Rule 1: {{ $json.type }} equals post → Output 1
4. Rule 2: {{ $json.type }} equals comment → Output 2
5. Fallback → Output 3

### Merge

Merge Node = Combine Data:

Modes:
- Append: Combine all items
- Choose Branch: Take data from specific branch
- Merge By Index: Combine items with same index
- Merge By Key: Combine items with same key-value

### Schedule (Trigger)

Schedule Node = Cron-based Trigger:

Setup:
1. Add Schedule Node
2. Trigger Interval: Days
3. Days Between Triggers: 1
4. Trigger Time: 02:00 (2 AM)

Daily at 2 AM → Workflow starts

### Manual Trigger

Manual Trigger = Button-Click:

Setup:
1. Add Manual Trigger Node
2. Click "Execute Workflow"

## Expressions & Variables

### {{ }} Syntax

Access Node Output:
{{ $json.title }}
{{ $json.author.name }}
{{ $json.posts.title }}

text

Previous Node:
{{ $node["HTTP Request"].json.data }}

text

All Items:
{{ $input.all() }}

text

### Built-in Functions

String:
{{ $json.title.toLowerCase() }}
{{ $json.title.toUpperCase() }}
{{ $json.title.trim() }}
{{ $json.title.substring(0, 10) }}

text

Array:
{{ $json.posts.length }}
{{ $json.posts }}
{{ $json.posts.map(p => p.title) }}

text

Date:
{{ $now }}
{{ $today }}
{{ $now.toISO() }}

text

### JavaScript Mode

// Access all items
const items = $input.all();

// Map over items
const titles = items.map(item => item.json.title);

// Filter items
const aiPosts = items.filter(item => {
return item.json.title.includes('AI');
});

// Return new items
return aiPosts;

text

## Webhooks Deep-Dive

### Incoming Webhooks

n8n receives HTTP-Requests:

Webhook Node (Trigger):
- Method: POST, GET, PUT, DELETE
- Path: /webhook/custom-path
- Authentication: None, Header Auth, Query Auth
- Response: Immediate, Using Respond Node

Example: Trigger Scraper
Webhook (POST) → Code (Parse Body) → HTTP Request (Call Scraper) → Respond to Webhook

text

### Respond to Webhook

Custom Response zurück senden:

Setup:
1. Webhook Node → Respond Using Respond to Webhook Node
2. Add Respond to Webhook Node
3. Response Code: 200
4. Response Body:
{
"status": "success",
"message": "Scraper started",
"jobId": "{{ $json.jobId }}"
}

text

### Webhook Security

Header Authentication:
1. Webhook Node → Authentication: Header Auth
2. Header Name: X-API-Key
3. Header Value: your-secret-key

Query Authentication:
1. Webhook Node → Authentication: Query Auth
2. Parameter Name: apiKey
3. Parameter Value: your-secret-key

Request:
curl -X POST https://n8n.scratchy.example.com/webhook/scraper-trigger?apiKey=your-secret-key

text

## API-Integration

### n8n as API Consumer

HTTP Request Node to call external APIs:

Example: Call Scratchy-Scraper API
Workflow:

Webhook (Receive Data)

HTTP Request (POST to Scratchy API)
URL: http://scratchy:3000/api/scrape
Body: { "url": "{{ $json.url }}" }

Code (Process Response)

Airtable (Save Data)

text

### n8n as API Provider

Webhook Nodes expose APIs:

Example: Expose Scraper-Trigger API
Workflow:

Webhook (Trigger)
Path: /api/v1/scrape
Method: POST

Validate Input (Code Node)

HTTP Request (Call Scraper)

Respond to Webhook (Return Result)

text

External Call:
curl -X POST https://n8n.scratchy.example.com/webhook/api/v1/scrape
-H "Content-Type: application/json"
-d '{"url": "https://example.com"}'

text

### Authentication

API-Key in Headers:
// In HTTP Request Node
Headers:
{
"Authorization": "Bearer YOUR_API_KEY",
"Content-Type": "application/json"
}

text

OAuth2:
1. n8n Credentials → Add OAuth2 API
2. Auth URL, Token URL, Client ID, Client Secret
3. Connect & Authorize

## Database-Integration

### Airtable

Airtable Node:

Setup:
1. Add Airtable Node
2. Credentials: API-Key
3. Operation: Append
4. Base ID: appXXXXXX
5. Table: Posts
6. Fields:
   - Title: {{ $json.title }}
   - Content: {{ $json.content }}
   - URL: {{ $json.url }}

### Supabase

HTTP Request Node (REST API):

Create Record:
HTTP Request:
Method: POST
URL: https://YOUR_PROJECT.supabase.co/rest/v1/posts
Headers:
apikey: YOUR_API_KEY
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
Body:
{
"title": "{{ $json.title }}",
"content": "{{ $json.content }}"
}

text

### PostgreSQL

Postgres Node:

Setup:
1. Add Postgres Node
2. Credentials: Host, Port, Database, User, Password
3. Operation: Insert
4. Table: posts
5. Columns: title, content, url

### MySQL

MySQL Node (same as Postgres)

### MongoDB

HTTP Request Node (MongoDB Atlas API) or MongoDB Node

## AI-Integration

### OpenAI

OpenAI Node:

Setup:
1. Add OpenAI Node
2. Credentials: API-Key
3. Resource: Chat
4. Model: gpt-4
5. Messages:
[
{
"role": "user",
"content": "Summarize this: {{ $json.content }}"
}
]

text

Example Workflow:
Webhook → HTTP Request (Scrape) → OpenAI (Summarize) → Airtable (Save)

text

### Anthropic (Claude)

HTTP Request Node:

Method: POST
URL: https://api.anthropic.com/v1/messages
Headers:
x-api-key: YOUR_API_KEY
anthropic-version: 2023-06-01
Content-Type: application/json
Body:
{
"model": "claude-3-5-sonnet-20241022",
"max_tokens": 1024,
"messages": [
{
"role": "user",
"content": "Summarize: {{ $json.content }}"
}
]
}

text

## Scratchy-n8n Integration

### Use-Case 1: Scheduled Scraping

Workflow:
Schedule (Daily 2 AM)
↓
HTTP Request (POST to Scratchy)
URL: http://scratchy:3000/api/scrape
Body: {"url": "https://www.skool.com/ki-business-agenten", "maxPosts": 100}
↓
Code (Parse Response)
↓
Airtable (Save Posts)
↓
Slack (Notify: "Scraping done: 42 new posts")

text

### Use-Case 2: Webhook-Triggered Scraping

Workflow:
Webhook (Receive Request)
↓
Validate Input (Code)
if (!url) throw error
↓
HTTP Request (POST to Scratchy)
↓
Respond to Webhook
{"status": "success", "jobId": "123"}

text

External Trigger:
curl -X POST https://n8n.scratchy.example.com/webhook/scraper-trigger
-d '{"url": "https://www.skool.com/ki-business-agenten"}'

text

### Use-Case 3: Post-Processing mit AI

Workflow:
Webhook (Scraping done)
↓
Loop Over Items
↓
OpenAI (Summarize each post)
↓
Set (Add summary field)
↓
Airtable (Update records)

text

### Use-Case 4: Multi-Platform Aggregation

Workflow:
Schedule
↓
[Branch 1] HTTP Request (Scrape Skool)
[Branch 2] HTTP Request (Scrape YouTube)
[Branch 3] HTTP Request (Scrape Patreon)
↓
Merge (Combine all data)
↓
Airtable (Save all)

text

## Scratchy API-Endpoints (To Create)

### POST /api/scrape

Request:
{
"platform": "skool",
"url": "https://www.skool.com/ki-business-agenten",
"maxPosts": 100,
"outputFormat": "json"
}

text

Response:
{
"jobId": "abc123",
"status": "running",
"eta": 120
}

text

### GET /api/job/:jobId

Response:
{
"jobId": "abc123",
"status": "completed",
"data": {
"posts": [...],
"stats": {
"total": 42,
"new": 15
}
}
}

text

### POST /api/webhook/notify

Scratchy calls n8n Webhook when done:
// In Scratchy (after scraping)
await fetch('https://n8n.scratchy.example.com/webhook/scraping-done', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
jobId: 'abc123',
status: 'completed',
posts: scrapedPosts
})
})

text

## Best Practices

### 1. Error-Handling

Always add Error Handling:
Workflow → Try-Catch Pattern
Try: Main Logic
Catch: Error Node → Slack/Email Notification

text

### 2. Logging

Add Set Nodes for logging:
Set Node:
timestamp: {{ $now }}
workflow: scraper-trigger
status: started

text

### 3. Retry-Logic

HTTP Request Node → Settings:
- Retry On Fail: Yes
- Max Retries: 3
- Retry Interval: 5000ms

### 4. Rate-Limiting

Add Wait Node between requests:
Loop → Wait (1000ms) → HTTP Request

text

### 5. Environment Variables

Use Credentials for Secrets:
- API-Keys
- Database-Passwords
- Webhook-URLs

### 6. Workflow-Versioning

Export Workflows as JSON:
- Workflow → Settings → Export
- Save in Git

### 7. Monitoring

Use n8n Monitoring:
- Workflow → Executions → Check Logs
- Set up Alerts (Slack/Email on Failure)

## Troubleshooting

### Webhook not triggering

Check:
1. Workflow is Active (toggle at top)
2. Webhook-URL is correct
3. Method matches (POST/GET)
4. Firewall allows incoming requests

Test:
curl -X POST https://n8n.scratchy.example.com/webhook-test/test

text

### HTTP Request fails

Check:
1. URL is reachable (ping, curl)
2. Authentication is correct
3. Headers are correct
4. Body-Format matches (JSON)

Debug:
- Check Execution-Logs
- Check Response-Tab in Node

### Workflow hangs

Possible causes:
1. Infinite Loop (no exit condition)
2. Wait Node with huge timeout
3. HTTP Request timeout (increase timeout)

Fix:
- Add timeout to HTTP Request (30s)
- Add max-iterations to Loop

### Data not passing between Nodes

Check:
1. Previous Node has Output
2. Expression is correct: {{ $json.field }}
3. Node is connected properly

Debug:
- Click on Node → Check Input/Output Tab

## Resources

Official Docs:
https://docs.n8n.io

n8n Community:
https://community.n8n.io

Templates:
https://n8n.io/workflows

YouTube:
https://www.youtube.com/@n8n-io

GitHub:
https://github.com/n8n-io/n8n

## Naechste Schritte

1. Install n8n on Scratchy-Server (Docker)
2. Create Scratchy API-Endpoints (/api/scrape, /api/job/:id)
3. Build n8n Workflow: Webhook → Scraper → Airtable
4. Test Integration
5. Deploy to Production

Ende des n8n-Guides.
