# 🎯 Scratchy-The-Scraper - Projekt-Übersicht

## Mission Statement
Ein universeller, Docker-basierter Web-Scraper für strukturierte Dokumentationen, Community-Plattformen, Video-Transkripte und Creator-Content. Modular, erweiterbar, production-ready.

## Vision (End-Goal)
Eine zentrale Scraping-Engine, die automatisch:
1. Dokumentations-Sites scrapt (OpenAI, Anthropic) → Markdown + JSON
2. Community-Content aggregiert (Skool, Circle) → Posts + Attachments + Kommentare
3. Video-Transkripte extrahiert (YouTube, Loom) → Text + Timestamps
4. Creator-Content archiviert (Patreon) → Paid Content + Media
5. Alles strukturiert in Airtable/Supabase/Google Drive ablegt
6. Via n8n-Webhooks automatisch triggert
7. Mit AI-Summarization anreichert

## Aktueller Stand (07.10.2025)

### ✅ Phase 1: MVP (FERTIG)

#### OpenAI-Docs-Scraper
- Input: configs/openai.json
- Output: 718 URLs als JSON + HTML
- Methode: Sitemap-basiert
- Status: Vollständig funktionsfähig
- Code: strategies/docs.mjs

#### Skool-Feed-Scraper
- Input: Skool-Community-URL (Beispiel: https://www.skool.com/example-community)
- Output:
  - Posts: 33 extrahiert
  - Links: 37 extrahiert
  - Videos: 1 YouTube-Link erkannt
  - Bilder: 277 Asset-URLs
  - Dateien: 0 (noch nicht implementiert)
- Methode: Next.js JSON-Parsing
- Status: Basis funktioniert, Attachments fehlen
- Code: strategies/skool-interactive.mjs + strategies/skool-json-extractor.mjs

#### Interaktiver Wizard
- CLI-basiert (inquirer.js)
- Fragt ab: URL, Content-Typen, Struktur, Storage, Max-Posts
- Output: JSON-Files in /opt/scratchy/output/

#### Docker-Setup
- Container: Playwright v1.56.0 (Chromium)
- Redis: Für zukünftige Features (Queue, Caching)
- Network: host (direkter Zugriff)

### ❌ Phase 2: Offene Aufgaben (NEXT STEPS)

1. Skool-Attachments extrahieren
2. Cookie-Banner wegklicken
3. Post-Zuordnung implementieren
4. Automatische Validierung
5. Unvollständige Files fixen

### 🔄 Phase 3: Geplante Features
- Skool-Classroom scrapen
- YouTube-Transkript-Scraping
- Patreon-Content-Scraping
- Google Drive Auto-Upload
- Markdown-Konvertierung
- AI-Summarization
- Scheduled Scraping
- n8n-Webhook-Integration

## Architektur-Prinzipien

1. Modular: Jede Plattform = eigene Strategy
2. Adapter-basiert: Output-Formate via Adapter
3. Config-driven: Alles über JSON steuerbar
4. Docker-first: Keine lokalen Dependencies
5. CLI-first: Interaktiv + scriptbar
6. Anti-Bot: Custom UserAgent + AutomationControlled disabled
7. Cookie-Auth: Persistent via playwright/.auth/

## Team & Ownership
- GitHub: https://github.com/24Firon/scratchy-the-scraper
- Entwickler: 24Firon
- Stand: 07.10.2025, 21:21 CEST
