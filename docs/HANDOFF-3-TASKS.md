# Scratchy - Phase 2 Tasks

## Uebersicht
5 Tasks fuer Skool-Perfektion:
1. Attachments extrahieren
2. Cookie-Banner wegklicken
3. Post-Zuordnung implementieren
4. Automatische Validierung
5. Unvollstaendige Files fixen

Prioritaet: Tasks 1-5 sequenziell abarbeiten.

## Task 1: Skool-Attachments extrahieren

### Problem
PDFs, XLSX, JSON-Dateien in Posts werden nicht extrahiert.
Aktuell: files.json ist immer leer.

### Analyse
Attachments sind im Next.js JSON unter metadata.attachments.
KRITISCH: attachments ist ein JSON-String, nicht ein JSON-Objekt!

### Loesung
In strategies/skool-json-extractor.mjs:

Funktion parseSkoolAttachments erstellen:
- Iteriere ueber postTrees
- Parse metadata.attachments mit JSON.parse
- Extrahiere url, name, type
- Return Array mit post_id-Zuordnung

### Integration
In strategies/skool-interactive.mjs:
- Import parseSkoolAttachments
- Fuege zu extracted-Objekt hinzu
- Speichere in files.json

### Test
docker exec -it scratchy node main.js
Waehle: skool, files auswaehlen
Check: cat output/skool-*/files.json | jq length

### Success-Kriterium
files.json enthaelt mind. 1 Attachment (wenn Posts Attachments haben).
Jedes File hat: post_id, url, name, type.

## Task 2: Cookie-Banner wegklicken

### Problem
Bei Screenshots sind Cookie-Banner sichtbar.

### Analyse
Cookie-Banner haben meist diese Selektoren:
- button:has-text("Accept")
- button:has-text("Alle akzeptieren")
- id onetrust-accept-btn-handler
- class cookie-consent-accept

### Loesung
In core/fetch.mjs nach page.goto():

Funktion dismissCookieBanner erstellen:
- Array mit Selektoren definieren
- Loop durch Selektoren
- Versuche page.click mit timeout 2000ms
- Bei Erfolg: break
- Bei Fehler: naechster Selector

### Test
Screenshot-Test auf Server.
Check ob Cookie-Banner weg ist.

### Success-Kriterium
Screenshot hat keinen Cookie-Banner.
Console-Log zeigt "Cookie-Banner weggeklickt".

## Task 3: Post-Zuordnung implementieren

### Problem
images.json, links.json, files.json haben zwar post_id,
aber fuer schnellen Zugriff waere nested structure besser.

### Aktuell
Separate Files:
- posts.json
- images.json mit post_id
- links.json mit post_id

### Gewuenscht
posts.json mit nested:
- post.images Array
- post.links Array
- post.files Array

### Loesung
In strategies/skool-interactive.mjs:

Funktion enrichPostsWithAssets erstellen:
- posts.map durch alle Posts
- Filtere links nach post_id
- Filtere images nach post_id
- Filtere files nach post_id
- Return enriched post

In saveToServer:
- Rufe enrichPostsWithAssets auf
- Speichere enriched posts in posts.json
- Behalte separate Files fuer Backwards-Compatibility

### Test
cat output/skool-*/posts.json | jq '..links'
Erwarteter Output: Array mit Links fuer ersten Post.

### Success-Kriterium
posts.json enthaelt nested links, images, files.
Separate JSON-Files bleiben erhalten.

## Task 4: Automatische Validierung

### Problem
Nach Scraping wird nicht geprueft ob JSON korrekt erstellt wurde.

### Loesung
In strategies/skool-interactive.mjs:

Funktion validateOutput erstellen:
- Loop durch files Array
- Lese jedes File mit fs.readFile
- Parse mit JSON.parse
- Check ob Array
- Console-Log fuer jedes File
- Return allValid boolean

Nach saveToServer:
- Rufe validateOutput auf
- Bei Fehler: Warnung ausgeben

### Test
docker exec -it scratchy node main.js
Nach Scraping sollte "Alle Dateien valid!" erscheinen.

### Success-Kriterium
Console zeigt Validierungs-Status fuer jede Datei.
Bei Fehlern wird Warnung angezeigt.

## Task 5: Unvollstaendige Files fixen

### Problem
skool-interactive.mjs und skool-json-extractor.mjs sind unvollstaendig.
Heredoc-Fehler beim vorherigen Befehl.

### Loesung
Option A: Files via nano manuell editieren.
Option B: Files komplett neu schreiben (sichere Methode).

Option B empfohlen:
- Backup der aktuellen Files erstellen
- Neue Files erstellen
- Vollstaendige Versionen siehe .context-private.md

### Test nach Fix
Syntax-Check:
docker exec -it scratchy node --input-type=module -e "import('./strategies/skool-interactive.mjs').then(() => console.log('OK'))"

Funktions-Check:
docker exec -it scratchy node main.js

### Success-Kriterium
Beide Files haben keine Syntax-Errors.
Scraper laeuft komplett durch.
Output-Files werden korrekt erstellt.

## Workflow fuer Phase 2

### Task-Reihenfolge
Task 5 (Files fixen) zuerst
Task 1 (Attachments)
Task 2 (Cookie-Banner)
Task 3 (Post-Zuordnung)
Task 4 (Validierung) zuletzt

Warum diese Reihenfolge?
Task 5 zuerst: Code-Basis stabil machen.
Task 1-3: Feature-Additions.
Task 4 zuletzt: Validierung ueber alles.

### Testing nach jedem Task
Nach jedem Task:
docker exec -it scratchy node main.js
Waehle: skool, test-community, alle Content-Typen

Output pruefen:
ls -lh output/skool-*/
cat output/skool-*/posts.json | jq length
cat output/skool-*/files.json | jq length

### Git-Commit nach jedem Task
git add -A
git commit -m "feat(skool): task X - beschreibung"
git push origin main

## Naechste Datei
docs/HANDOFF-4-DEBUGGING.md
