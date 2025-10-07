# Scratchy - Debugging-Guide

## Quick-Diagnostics Checklist

Wenn etwas nicht funktioniert:

### 1. Container laeuft?
docker ps | grep scratchy
Erwarteter Output: 2 Zeilen (scratchy + scratchy-redis)

Falls NICHT:
docker compose up -d
docker ps | grep scratchy

### 2. Dependencies installiert?
docker exec -it scratchy ls node_modules/playwright
Erwarteter Output: Verzeichnis-Listing

Falls Fehler:
docker exec -it scratchy npm install

### 3. Browser installiert?
docker exec -it scratchy npx playwright --version
Erwarteter Output: Version 1.56.0

Falls Fehler:
docker exec -it scratchy npx playwright install chromium

### 4. Cookies vorhanden?
ls -lh /opt/scratchy/playwright/.auth/
Erwarteter Output: skool-cookies.json (3229 bytes)

Falls leer:
Cookies auf PC erstellen, dann zum Server kopieren.

### 5. Permissions OK?
ls -ld /opt/scratchy/output/
Erwarteter Output: drwxr-xr-x ... USER GROUP ...

Falls root:
sudo chown -R USER:GROUP /opt/scratchy/output/

## Problem-Kategorien

### A. Scraper startet nicht

Symptom:
docker exec -it scratchy node main.js
Fehler: Cannot find module './strategies/...'

Ursache:
File fehlt oder Import-Path falsch.

Fix:
ls strategies/skool-interactive.mjs
Check Syntax mit node --input-type=module

### B. Cookies expired

Symptom:
Posts: 0
Kommentare: 0
Bilder: 0

ODER JSON zeigt:
total: 0
postTrees: []

Ursache:
Cookies aelter als 30 Tage ODER ungueltig.

Fix:
1. Auf PC: node auth.setup.js
2. SCP zum Server: scp playwright/.auth/skool-cookies.json SERVER:/opt/scratchy/playwright/.auth/
3. Test: cat /opt/scratchy/playwright/.auth/skool-cookies.json | jq length

### C. JSON-Parse-Error

Symptom:
JSON-Parse-Fehler: Unexpected token

Ursache:
metadata.contributors oder metadata.attachments ist kein valides JSON.

Fix in skool-json-extractor.mjs:
Vorher (fehleranfaellig):
const contributor = JSON.parse(metadata.contributors)[0]

Nachher (mit Try-Catch):
let contributor = { name: "Unknown" }
if (metadata.contributors) {
  try {
    contributor = JSON.parse(metadata.contributors)[0] || { name: "Unknown" }
  } catch (err) {
    console.warn('Contributor-Parse-Error:', err.message)
  }
}

### D. Browser-Timeout

Symptom:
Error: page.goto: Timeout 30000ms exceeded

Ursache:
Seite laed zu langsam ODER NetworkIdle wird nie erreicht.

Fix 1: Timeout erhoehen
In core/fetch.mjs:
await page.goto(url, { 
  waitUntil: 'networkidle', 
  timeout: 60000
})

Fix 2: waitUntil aendern
await page.goto(url, { 
  waitUntil: 'domcontentloaded',
  timeout: 30000 
})

### E. Permission denied

Symptom:
Error: EACCES: permission denied, open '/opt/scratchy/output/...'

Ursache:
Container erstellt Files als root, User kann nicht schreiben.

Fix:
sudo chown -R USER:GROUP /opt/scratchy/output/

Permanent Fix in docker-compose.yml:
services:
  scratchy:
    user: "1000:1000"

Dann:
docker compose down
docker compose up -d

### F. Playwright-Version-Mismatch

Symptom:
Executable doesn't exist at /ms-playwright/chromium-xxxx/...
Playwright version mismatch

Ursache:
package.json hat v1.56.0, Docker-Image hat v1.50.0.

Fix:
docker pull mcr.microsoft.com/playwright:v1.56.0-noble
docker compose down
docker compose up -d
docker exec -it scratchy npx playwright install chromium
docker exec -it scratchy npx playwright --version

### G. Empty Output (posts.json = [])

Symptom:
Scraper laeuft durch, aber alle JSON-Files sind leer.

Ursache-Matrix:
- total: 0 im JSON → Cookies expired
- total: 1279, aber postTrees: [] → JSON-Struktur geaendert
- postTrees vorhanden, aber parseSkoolPosts() returned [] → Parsing-Logic-Error
- Alle Felder undefined → Import-Path falsch

Debug-Steps:
1. HTML dumpen
2. JSON extrahieren: grep '__NEXT_DATA__' debug.html
3. Struktur pruefen: cat next-data.txt | jq '.props.pageProps.total'
4. Ersten Post pruefen: cat next-data.txt | jq '.props.pageProps.postTrees[0]'

### H. Zombie-Prozesse

Symptom:
ps aux | grep defunct
Output: 10+ Zeilen mit defunct

Ursache:
Playwright-Prozesse werden nicht korrekt beendet.

Fix:
docker compose down
docker compose up -d
ps aux | grep defunct | wc -l

Prevention:
In core/fetch.mjs am Ende:
export async function closeBrowser() {
  if (globalContext) await globalContext.close()
  if (globalBrowser) await globalBrowser.close()
}

WICHTIG: IMMER closeBrowser() am Ende des Scraping-Runs aufrufen!

## Useful One-Liners

JSON validieren:
cat output/skool-*/posts.json | jq . > /dev/null && echo "Valid" || echo "Invalid"

Anzahl Eintraege:
cat output/skool-*/posts.json | jq 'length'

Ersten Post anzeigen:
cat output/skool-*/posts.json | jq '.[0]'

Alle Post-IDs extrahieren:
cat output/skool-*/posts.json | jq '.[].id' -r

Links nach Type gruppieren:
cat output/skool-*/links.json | jq 'group_by(.type) | map({type: .[0].type, count: length})'

Files nach Type gruppieren:
cat output/skool-*/files.json | jq 'group_by(.type) | map({type: .[0].type, count: length})'

## Emergency-Recovery

Wenn Container nicht mehr startet:
docker logs scratchy --tail 100
docker rm -f scratchy scratchy-redis
docker compose up -d

Wenn Output corrupt ist:
cp -r /opt/scratchy/output /opt/scratchy/output.backup
rm -rf /opt/scratchy/output/skool-*
sudo chown -R USER:GROUP /opt/scratchy/output

Wenn Git kaputt ist:
git status
git reset --hard HEAD
git pull origin main --force

## Naechste Datei
docs/GITHUB-WORKFLOW.md
