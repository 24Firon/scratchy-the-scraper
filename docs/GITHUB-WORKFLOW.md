# Scratchy - GitHub-Workflow

## Repository-Details
GitHub: https://github.com/24Firon/scratchy-the-scraper
Branch: main
Visibility: Public

## Daily Workflow

### 1. Code aendern
cd /opt/scratchy
nano strategies/skool-interactive.mjs

### 2. Status pruefen
git status

Erwarteter Output:
On branch main
Changes not staged for commit:
  modified:   strategies/skool-interactive.mjs

### 3. Aenderungen stagen
Alle Aenderungen:
git add -A

Spezifische Files:
git add strategies/skool-interactive.mjs
git add docs/HANDOFF-3-TASKS.md

### 4. Commit erstellen
git commit -m "feat(skool): add attachment extraction"

Konvention: type(scope): subject

Types:
- feat: Neues Feature
- fix: Bug-Fix
- docs: Dokumentation
- refactor: Code-Refactoring
- test: Tests hinzugefuegt
- chore: Maintenance

Scopes:
- skool: Skool-Scraper
- docs: Docs-Scraper
- core: Core-Module
- docker: Docker-Setup

### 5. Zu GitHub pushen
git push origin main

Username: 24Firon
Password: [GitHub Personal Access Token]

Erwarteter Output:
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Writing objects: 100% (3/3), 1.23 KiB, done.
To https://github.com/24Firon/scratchy-the-scraper.git
   2cb2ebb..55fc7fc  main -> main

## Commit-Message-Beispiele

Feature hinzugefuegt:
git commit -m "feat(skool): add attachment extraction from metadata.attachments"

Bug gefixt:
git commit -m "fix(skool): handle missing contributors field gracefully"

Dokumentation:
git commit -m "docs: add GitHub workflow guide"

Refactoring:
git commit -m "refactor(core): extract cookie-banner dismissal to separate function"

## Branch-Workflow (fuer groessere Features)

Feature-Branch erstellen:
git checkout -b feature/skool-classroom

Changes machen:
nano strategies/skool-classroom.mjs
git add -A
git commit -m "feat(skool): add classroom scraping strategy"

Zu GitHub pushen:
git push origin feature/skool-classroom

Pull Request erstellen:
1. Gehe zu: https://github.com/24Firon/scratchy-the-scraper
2. "Compare & pull request" klicken
3. Titel: feat(skool): Classroom scraping
4. Beschreibung mit What/Why/Testing
5. "Create pull request" klicken

Merge in main:
git checkout main
git pull origin main
git merge feature/skool-classroom
git push origin main

Feature-Branch loeschen:
git branch -d feature/skool-classroom
git push origin --delete feature/skool-classroom

## Haeufige Git-Operationen

Aenderungen verwerfen:
git reset --hard HEAD

Spezifisches File zuruecksetzen:
git checkout -- strategies/skool-interactive.mjs

Letzten Commit rueckgaengig machen:
Commit rueckgaengig, Changes behalten:
git reset --soft HEAD~1

Commit + Changes verwerfen:
git reset --hard HEAD~1

Remote-Aenderungen pullen:
git pull origin main

ODER: Fetch + Merge (sicherer):
git fetch origin
git merge origin/main

Merge-Konflikt loesen:
git status
nano strategies/skool-interactive.mjs
Suche nach: <<<<<<<, =======, >>>>>>>
git add strategies/skool-interactive.mjs
git commit -m "fix: resolve merge conflict"
git push origin main

History anzeigen:
Letzten 10 Commits:
git log --oneline -10

Mit Diff:
git log -p -3

Grafisch:
git log --graph --oneline --all

Diff anzeigen:
Uncommitted Changes:
git diff

Staged Changes:
git diff --staged

Zwischen zwei Commits:
git diff 2cb2ebb..55fc7fc

Spezifisches File:
git diff strategies/skool-interactive.mjs

## .gitignore (wichtig!)

Aktueller Stand:
.env
.context-private.md
playwright/.auth/
output/
node_modules/
*.log
.DS_Store

KRITISCH: Diese Files duerfen NIE in Git:
- .env (Credentials)
- .context-private.md (Server-Details)
- playwright/.auth/ (Cookies)
- output/ (Scraping-Ergebnisse)

Check ob File ignored ist:
git check-ignore -v .env
Output: .gitignore:1:.env    .env

File aus Git entfernen (wenn versehentlich committed):
git rm --cached .env
git commit -m "chore: remove .env from git"
git push origin main

## GitHub Personal Access Token

Token erstellen (einmalig):
1. GitHub → Settings → Developer settings → Personal access tokens
2. "Generate new token" klicken
3. Note: scratchy-server-access
4. Expiration: 90 days
5. Scopes: repo (full control)
6. "Generate token" klicken
7. Token kopieren (wird nur einmal angezeigt!)

Token verwenden:
Bei git push:
Username: 24Firon
Password: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Token in Git-Credential-Manager speichern:
git config --global credential.helper store
git push origin main
Username + Token eingeben
Wird gespeichert, naechstes Mal kein Prompt

Token-Speicherort:
cat ~/.git-credentials
Output: https://24Firon:ghp_xxx@github.com

ACHTUNG: Token = Passwort. Niemals in Git committen!

## Git-Config empfohlen

User-Info setzen:
git config --global user.name "24Firon"
git config --global user.email "your-email@example.com"

Credential-Helper (Token speichern):
git config --global credential.helper store

Default-Branch:
git config --global init.defaultBranch main

Editor (fuer Commit-Messages):
git config --global core.editor nano

Farben aktivieren:
git config --global color.ui true

## Troubleshooting

Push rejected (non-fast-forward):
git pull origin main --rebase
git push origin main

Detached HEAD:
git checkout main

Lost Commits (nach hartem Reset):
git reflog
git reset --hard abc1234

## Naechste Datei
.context-private.md (Private Server-Details, NICHT in Git)
