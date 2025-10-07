
# Scratchy-The-Scraper - Projekt-Kontext

## Vision
Universal-Scraper für Docs, Communities (Skool), YouTube, Patreon.

## Architektur
- core/discovery.mjs: URL-Discovery
- core/fetch.mjs: Playwright-Wrapper
- strategies/docs.mjs: Sitemap-Scraping
- strategies/skool-interactive.mjs: Skool-Wizard
- strategies/skool-json-extractor.mjs: Next.js JSON-Parsing
- adapters/airtable.mjs: Airtable-Upload
- main.js: CLI-Orchestrator

## Skool-Scraping (aktuell)
Input: Community-URL
Output:
- posts.json: Titel, Content, Autor, Kommentare
- links.json: Alle URLs (mit post_id, type)
- videos.json: YouTube/Loom-Links
- images.json: Asset-URLs
- files.json: PDFs/XLSX (noch nicht implementiert)

Wizard-Flow:
1. URL eingeben
2. Content wählen (Posts/Links/Videos/Bilder/Dateien)
3. Struktur wählen (Nach Datum / Flach)
4. Storage wählen (Server / Airtable)
5. Max. Posts definieren

## Geplante Features (Phase 2)
- Skool-Attachments (PDFs in Posts)
- Cookie-Banner wegklicken
- Post-Zuordnung (Bilder/Dateien)
- Validierung

## Daily Commands
docker exec -it scratchy node main.js
docker logs scratchy --tail 50
git add -A && git commit -m "..." && git push

## Debugging
1. Posts.json leer → skool-json-extractor.mjs prüfen
2. Permission denied → sudo chown -R firon:scratchy /opt/scratchy/output/
3. Browser fehlt → docker exec -it scratchy npx playwright install chromium

## Kontakt
GitHub: https://github.com/24Firon/scratchy-the-scraper
Entwickler: 24Firon
Stand: 07.10.2025

