# GitHub Complete Guide - Fuer Scratchy-The-Scraper

Diese Datei enthaelt ALLES ueber GitHub: Git-Basics, Workflows, Actions, Best Practices.

## Was ist GitHub?

GitHub ist eine Cloud-Plattform fuer Git-Repositories mit zusaetzlichen Features:
- Repository-Hosting
- Collaboration (Issues, Pull Requests)
- CI/CD (GitHub Actions)
- Project Management (Projects, Milestones)
- Security (Dependabot, Code Scanning)
- Documentation (GitHub Pages, Wikis)

### Git vs. GitHub

Git (Tool):
- Version Control System
- Lokal auf deinem PC
- Command Line
- Entwickelt von Linus Torvalds

GitHub (Platform):
- Hosting fuer Git-Repositories
- Cloud-basiert
- Web-Interface + API
- Entwickelt von GitHub Inc. (jetzt Microsoft)

### Warum GitHub fuer Scratchy?

Vorteil 1: Code-Backup
- Cloud-basiert
- Versionshistorie
- Disaster-Recovery

Vorteil 2: Collaboration
- Multiple Developers
- Pull Requests fuer Code-Review
- Issues fuer Bug-Tracking

Vorteil 3: CI/CD
- GitHub Actions fuer Automation
- Automatische Tests
- Automatische Deployments

Vorteil 4: Documentation
- README.md direkt im Repo
- GitHub Pages fuer Doku-Website
- Wikis fuer erweiterte Doku

## Git-Grundlagen

### Git installieren

Ubuntu:
sudo apt update
sudo apt install git

Check:
git --version
Output: git version 2.34.1

### Git konfigurieren

User-Info setzen:
git config --global user.name "24Firon"
git config --global user.email "your-email@example.com"

Editor setzen:
git config --global core.editor nano

Default-Branch setzen:
git config --global init.defaultBranch main

Farben aktivieren:
git config --global color.ui true

Check Config:
git config --list
git config --global --list

### Repository initialisieren

Neues Repo:
mkdir myproject
cd myproject
git init

Existing Code:
cd /opt/scratchy
git init

Output:
Initialized empty Git repository in /opt/scratchy/.git/

### Git-Workflow (Basic)

1. Aenderungen machen:
nano main.js

2. Status checken:
git status

3. Files stagen:
git add main.js
git add -A  # Alle

4. Commit:
git commit -m "feat: add new feature"

5. Zu GitHub pushen:
git push origin main

### Git-Commands (Vollstaendig)

git init:
Neues Repo initialisieren

git clone:
git clone https://github.com/24Firon/scratchy-the-scraper.git
git clone git@github.com:24Firon/scratchy-the-scraper.git  # SSH

git status:
Status checken (changed, staged, untracked)

git add:
git add main.js  # Spezifisches File
git add *.js  # Alle .js Files
git add -A  # Alle Files
git add .  # Current directory + subdirectories
git add -p  # Interactive (patch mode)

git commit:
git commit -m "feat: add feature"
git commit -m "fix: bug fix" -m "Detailed description"
git commit --amend  # Letzten Commit aendern

git push:
git push origin main
git push origin feature-branch
git push -u origin main  # Set upstream
git push --force  # Force (GEFAEHRLICH!)

git pull:
git pull origin main
git pull --rebase origin main  # Mit Rebase

git fetch:
git fetch origin
git fetch --all

git branch:
git branch  # Alle Branches auflisten
git branch feature-x  # Neuen Branch erstellen
git branch -d feature-x  # Branch loeschen
git branch -D feature-x  # Force delete
git branch -m old-name new-name  # Rename

git checkout:
git checkout main  # Branch wechseln
git checkout -b feature-x  # Neuen Branch erstellen + wechseln
git checkout -- file.js  # File zuruecksetzen

git switch (neu):
git switch main  # Branch wechseln
git switch -c feature-x  # Neuen Branch erstellen + wechseln

git merge:
git checkout main
git merge feature-x

git rebase:
git checkout feature-x
git rebase main

git log:
git log
git log --oneline
git log --oneline --graph --all
git log -p  # Mit Diff
git log --author="24Firon"
git log --since="2 weeks ago"

git diff:
git diff  # Unstaged changes
git diff --staged  # Staged changes
git diff HEAD  # All changes
git diff main..feature-x  # Between branches

git reset:
git reset HEAD~1  # Letzten Commit rueckgaengig, Changes behalten
git reset --soft HEAD~1  # Commit rueckgaengig, staged behalten
git reset --hard HEAD~1  # Commit + Changes verwerfen (GEFAEHRLICH!)

git revert:
git revert abc123  # Commit rueckgaengig (neuer Commit)

git stash:
git stash  # Changes temporaer speichern
git stash list
git stash pop  # Wiederherstellen + loeschen
git stash apply  # Wiederherstellen (bleibt in stash)
git stash drop  # Loeschen

git tag:
git tag v1.0.0  # Lightweight tag
git tag -a v1.0.0 -m "Version 1.0"  # Annotated tag
git push origin v1.0.0  # Tag pushen
git push origin --tags  # Alle Tags

git remote:
git remote -v  # Alle Remotes
git remote add origin https://github.com/24Firon/scratchy.git
git remote remove origin
git remote set-url origin https://github.com/24Firon/scratchy.git

git clean:
git clean -n  # Dry-run (zeigt was geloescht wuerde)
git clean -f  # Untracked files loeschen
git clean -fd  # Untracked files + directories

git reflog:
git reflog  # History aller HEAD-Changes
git reset --hard abc123  # Zu altem Commit zurueck

## GitHub-Repository erstellen

### Via Web-Interface

1. GitHub.com → Einloggen
2. Oben rechts: "+" → "New repository"
3. Repository Name: scratchy-the-scraper
4. Description: Universal web scraping framework
5. Public/Private: Public (fuer Open Source)
6. Add README: Optional
7. Add .gitignore: Node
8. Choose License: MIT
9. "Create repository"

### Existing Repo zu GitHub pushen

1. Auf GitHub: Repository erstellen (OHNE README, .gitignore, License)
2. Auf PC:
git remote add origin https://github.com/24Firon/scratchy-the-scraper.git
git branch -M main
git push -u origin main

### SSH-Keys (empfohlen)

SSH-Key generieren:
ssh-keygen -t ed25519 -C "your-email@example.com"

Output:
Enter file: /home/firon/.ssh/id_ed25519
Enter passphrase: (optional)

Public Key kopieren:
cat ~/.ssh/id_ed25519.pub

Zu GitHub hinzufuegen:
1. GitHub → Settings → SSH and GPG keys
2. "New SSH key"
3. Title: scratchy-server
4. Key: (paste public key)
5. "Add SSH key"

Test:
ssh -T git@github.com
Output: Hi 24Firon! You've successfully authenticated

Repo mit SSH clonen:
git clone git@github.com:24Firon/scratchy-the-scraper.git

## Branches

### Was ist ein Branch?

Ein Branch ist eine separate Version des Codes:
- main: Production-Code
- develop: Development-Code
- feature/xyz: Feature-Development
- fix/abc: Bug-Fix

### Branch-Strategien

GitHub Flow (EINFACH):
- main: Always deployable
- feature/xyz: Feature-Branch von main
- Pull Request → Review → Merge to main

Git Flow (KOMPLEX):
- main: Production
- develop: Development
- feature/xyz: Features von develop
- release/1.0: Release-Branch
- hotfix/abc: Hotfix von main

Trunk-Based Development (CONTINUOUS):
- main: Einziger Branch
- Feature-Flags fuer unfertige Features

### Branch-Commands

Neuen Branch erstellen:
git checkout -b feature/skool-classroom
# ODER:
git switch -c feature/skool-classroom

Branch pushen:
git push -u origin feature/skool-classroom

Branch loeschen (lokal):
git branch -d feature/skool-classroom
git branch -D feature/skool-classroom  # Force

Branch loeschen (remote):
git push origin --delete feature/skool-classroom

Alle Branches auflisten:
git branch  # Lokal
git branch -r  # Remote
git branch -a  # Alle

Branch wechseln:
git checkout main
git switch main

Branch mergen:
git checkout main
git merge feature/skool-classroom

### Merge-Conflicts loesen

Conflict entsteht:
git merge feature/skool-classroom
CONFLICT (content): Merge conflict in main.js

Conflict-Marker:
<<<<<<< HEAD
const version = '1.0'
=======
const version = '2.0'
>>>>>>> feature/skool-classroom

Loesen:
1. nano main.js
2. Entferne <<<<<<<, =======, >>>>>>>
3. Waehle korrekte Version (oder kombiniere)
4. git add main.js
5. git commit -m "fix: resolve merge conflict"

Merge abbrechen:
git merge --abort

## Pull Requests

### Was ist ein Pull Request?

Ein Pull Request (PR) ist ein Request, Code zu mergen:
- Von Branch A nach Branch B
- Mit Code-Review
- Mit Discussion
- Mit CI-Checks

### PR erstellen (Web-Interface)

1. Branch pushen:
git push origin feature/skool-classroom

2. GitHub → Repository → "Compare & pull request"

3. PR-Details:
   - Title: feat(skool): add classroom scraping
   - Description: What/Why/Testing
   - Reviewers: Auswaehlen
   - Assignees: Auswaehlen
   - Labels: enhancement, feature

4. "Create pull request"

### PR-Template

.github/PULL_REQUEST_TEMPLATE.md:
## What
Brief description of what this PR does.

## Why
Why is this change needed?

## Testing
How was this tested?

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes

## Screenshots
(if applicable)

### PR-Review

Reviewer:
1. GitHub → Pull Requests → PR auswaehlen
2. "Files changed" → Code reviewen
3. Kommentare hinzufuegen
4. "Review changes":
   - Comment: Nur Kommentar
   - Approve: Genehmigen
   - Request changes: Aenderungen anfordern

Author nach Review:
1. Aenderungen machen
2. git add + git commit + git push
3. PR wird automatisch updated

### PR mergen

Merge-Optionen:
- Create a merge commit (standard)
- Squash and merge (alle Commits zu einem)
- Rebase and merge (rebase, dann merge)

Nach Merge:
1. Branch loeschen (GitHub fragt automatisch)
2. Lokal aufraeum:
git checkout main
git pull origin main
git branch -d feature/skool-classroom

## Issues

### Was ist ein Issue?

Ein Issue ist ein Task/Bug/Feature-Request:
- Bug-Reports
- Feature-Requests
- Tasks
- Questions

### Issue erstellen

1. GitHub → Repository → Issues → "New issue"
2. Title: Bug: Scraper crashes on large files
3. Description:
   - What happened
   - Expected behavior
   - Steps to reproduce
   - Environment (OS, Node version)
4. Assignees: Zuweisen
5. Labels: bug, priority-high
6. Milestone: v1.0
7. "Submit new issue"

### Issue-Template

.github/ISSUE_TEMPLATE/bug_report.md:
---
name: Bug Report
about: Report a bug
title: "Bug: "
labels: bug
assignees: ''
---

## Description
Brief description of the bug.

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen?

## Actual Behavior
What actually happens?

## Environment
- OS: Ubuntu 24.04
- Node: v22.3.0
- Docker: 24.0.7

## Screenshots
(if applicable)

### Issue-Labels

Standard-Labels:
- bug: Bug-Report
- enhancement: Feature-Request
- documentation: Doku-Update
- help wanted: Hilfe benoetigt
- good first issue: Fuer neue Contributors

Custom-Labels erstellen:
1. GitHub → Repository → Issues → Labels
2. "New label"
3. Name: priority-high
4. Color: Red
5. "Create label"

### Issue-Milestones

Milestone erstellen:
1. GitHub → Repository → Issues → Milestones
2. "New milestone"
3. Title: v1.0
4. Due date: 2025-12-31
5. Description: First stable release
6. "Create milestone"

Issues zu Milestone zuweisen:
1. Issue oeffnen
2. Rechts: Milestone auswaehlen
3. v1.0 auswaehlen

### Issues in Commits referenzieren

In Commit-Message:
git commit -m "fix: handle large files (#42)"

Issue wird automatisch verlinkt.

Issue automatisch schließen:
git commit -m "fix: handle large files (fixes #42)"
git commit -m "fix: handle large files (closes #42)"

## GitHub Actions (CI/CD)

### Was sind GitHub Actions?

GitHub Actions = CI/CD Plattform:
- Automatische Workflows
- Trigger bei Events (push, pull_request, schedule)
- Runner (GitHub-hosted oder self-hosted)
- YAML-Config (.github/workflows/)

### Workflow erstellen

.github/workflows/ci.yml:
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '22'
    
    - name: Install dependencies
      run: npm install
    
    - name: Run tests
      run: npm test
    
    - name: Run linter
      run: npm run lint

### Workflow-Syntax

name (Optional):
name: CI

on (Trigger):
on: push
on: [push, pull_request]
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight

jobs (Jobs):
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Hello"

runs-on (Runner):
runs-on: ubuntu-latest
runs-on: windows-latest
runs-on: macos-latest
runs-on: self-hosted

steps (Steps):
steps:
  - name: Checkout
    uses: actions/checkout@v4
  
  - name: Run command
    run: npm test
  
  - name: Multi-line
    run: |
      npm install
      npm test

uses (Reusable Actions):
uses: actions/checkout@v4
uses: actions/setup-node@v4
uses: docker/build-push-action@v5

with (Parameters):
- uses: actions/setup-node@v4
  with:
    node-version: '22'

env (Environment Variables):
env:
  NODE_ENV: production
  API_KEY: ${{ secrets.API_KEY }}

if (Conditional):
if: github.event_name == 'push'
if: success()
if: failure()

timeout-minutes (Timeout):
timeout-minutes: 10

continue-on-error (Ignore Errors):
continue-on-error: true

### Secrets

Secrets erstellen:
1. GitHub → Repository → Settings → Secrets and variables → Actions
2. "New repository secret"
3. Name: API_KEY
4. Value: abc123xyz
5. "Add secret"

In Workflow verwenden:
env:
  API_KEY: ${{ secrets.API_KEY }}

### Matrix-Builds

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]
        os: [ubuntu-latest, windows-latest]
    
    steps:
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}

### Artifacts

Upload:
- name: Upload artifact
  uses: actions/upload-artifact@v4
  with:
    name: dist
    path: dist/

Download:
- name: Download artifact
  uses: actions/download-artifact@v4
  with:
    name: dist

### Caching

- name: Cache node_modules
  uses: actions/cache@v4
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}

### Scratchy CI-Workflow

.github/workflows/ci.yml:
name: Scratchy CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '22'
    
    - name: Install Playwright
      run: |
        npm install
        npx playwright install chromium
    
    - name: Run tests
      run: npm test
    
    - name: Upload test results
      if: failure()
      uses: actions/upload-artifact@v4
      with:
        name: test-results
        path: test-results/

### Scratchy CD-Workflow

.github/workflows/cd.yml:
name: Scratchy CD

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Deploy to Server
      uses: appleboy/ssh-action@v1.0.0
      with:
        host: ${{ secrets.SSH_HOST }}
        username: ${{ secrets.SSH_USER }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /opt/scratchy
          git pull origin main
          docker-compose down
          docker-compose up -d --build

## Branch Protection

### Was ist Branch Protection?

Branch Protection = Regeln fuer Branches:
- Keine direkte Pushes zu main
- PR-Review erforderlich
- CI-Checks muessen passen
- Linear history

### Branch Protection einrichten

1. GitHub → Repository → Settings → Branches
2. "Add rule"
3. Branch name pattern: main
4. Optionen:
   - Require a pull request before merging
   - Require approvals: 1
   - Require status checks to pass before merging
   - Require branches to be up to date before merging
   - Require linear history
   - Include administrators
5. "Create"

### Empfohlene Rules fuer Scratchy

main Branch:
- Require pull request
- Require 1 approval
- Require status checks (CI)
- Include administrators

develop Branch:
- Require pull request
- No approval required
- Require status checks (CI)

## GitHub Pages

### Was ist GitHub Pages?

GitHub Pages = Static Website Hosting:
- Free fuer Public Repos
- HTTPS automatisch
- Custom Domain moeglich
- Jekyll oder Static HTML

### Pages aktivieren

1. GitHub → Repository → Settings → Pages
2. Source: Deploy from a branch
3. Branch: main
4. Folder: /docs oder /root
5. "Save"

URL: https://24firon.github.io/scratchy-the-scraper/

### Custom Domain

1. Domain kaufen (z.B. Namecheap)
2. DNS-Records setzen:
   - CNAME: www.scratchy-scraper.com → 24firon.github.io
   - A: scratchy-scraper.com → GitHub-IPs
3. GitHub → Settings → Pages
4. Custom domain: scratchy-scraper.com
5. "Save"

## .gitignore

### Was ist .gitignore?

.gitignore definiert Files, die NICHT in Git kommen:
- node_modules/
- .env
- build/
- *.log

### .gitignore erstellen

.gitignore:
# Dependencies
node_modules/

# Environment
.env
.env.local
.context-private.md

# Build
dist/
build/
output/

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp

# Docker
.dockerignore

# Playwright
playwright/.auth/
playwright-report/
test-results/

### .gitignore Patterns

Wildcards:
*.log  # Alle .log Files
*.txt  # Alle .txt Files

Directories:
node_modules/  # Directory + Inhalt
/build/  # Nur im Root

Negation:
*.log  # Ignore alle .log
!important.log  # EXCEPT important.log

Comments:
# This is a comment

### Check ob File ignored

git check-ignore -v .env
Output: .gitignore:5:.env    .env

### File aus Git entfernen (bereits committed)

git rm --cached .env
git commit -m "chore: remove .env from git"

## README.md

### Was ist README.md?

README.md ist die Hauptdokumentation:
- Erste Datei, die User sehen
- Beschreibt Projekt
- Markdown-Format

### README-Structure

# Scratchy-The-Scraper

Universal web scraping framework with Docker, Playwright.

## Features
- Docker-based, zero-config Playwright
- Multi-Strategy: Docs, YouTube, Skool
- Anti-Bot: 4-stage escalation
- Multi-Storage: Files, Airtable, Supabase

## Quick Start

bash
git clone https://github.com/24Firon/scratchy-the-scraper.git
cd scratchy-the-scraper
docker-compose up -d
docker exec -it scratchy node main.js


## Installation
...

## Usage
...

## Documentation
See [docs/](docs/) for detailed documentation.

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md).

## License
MIT License

### Markdown-Syntax

Headers:
# H1
## H2
### H3

Bold:
**bold**

Italic:
*italic*

Code:
`code`

Code Block:
const x = 1


Links:
[GitHub](https://github.com)

Images:
![Alt text](https://example.com/image.png)

Lists:
- Item 1
- Item 2

Numbered:
1. First
2. Second

Tables:
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |

Quotes:
> This is a quote

Horizontal Rule:
---

Task Lists:
- [x] Done
- [ ] Todo

## GitHub CLI (gh)

### Installation

Ubuntu:
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

### Auth

gh auth login

### Commands

Repo erstellen:
gh repo create scratchy-the-scraper --public

Repo clonen:
gh repo clone 24Firon/scratchy-the-scraper

PR erstellen:
gh pr create --title "feat: add feature" --body "Description"

PR auflisten:
gh pr list

PR mergen:
gh pr merge 42

Issue erstellen:
gh issue create --title "Bug" --body "Description"

Issue auflisten:
gh issue list

## Best Practices

### Commits

1. Commit-Konvention (Conventional Commits):
feat: Neues Feature
fix: Bug-Fix
docs: Dokumentation
refactor: Code-Refactoring
test: Tests
chore: Maintenance

2. Atomic Commits:
Ein Commit = Eine Logische Aenderung

3. Beschreibende Messages:
GOOD: feat(skool): add attachment extraction
BAD: update

### Branches

1. Beschreibende Namen:
feature/skool-classroom
fix/cookie-banner-dismiss
refactor/extract-json-parser

2. Kurze Lebensdauer:
Feature-Branch → PR → Merge → Delete

3. Regelmaessig rebagen:
git checkout feature-x
git rebase main

### Pull Requests

1. Klein halten:
Max 400 Zeilen pro PR

2. Beschreibung:
Was, Warum, Testing

3. Tests:
CI muss gruen sein

4. Review:
Mind. 1 Approval

### Security

1. Niemals Secrets committen:
.env in .gitignore
Use GitHub Secrets fuer CI

2. Dependabot aktivieren:
GitHub → Settings → Security → Dependabot

3. Code Scanning aktivieren:
GitHub → Settings → Security → Code scanning

## Troubleshooting

### Push rejected

Error: Updates were rejected because the remote contains work

Loesung:
git pull origin main --rebase
git push origin main

### Merge-Conflict

Error: CONFLICT (content): Merge conflict in file.js

Loesung:
1. nano file.js
2. Resolve <<<<<<<, =======, >>>>>>>
3. git add file.js
4. git commit -m "fix: resolve conflict"

### Authentication failed

Error: Authentication failed

Loesung 1 (HTTPS):
GitHub → Settings → Developer settings → Personal access tokens
Token erstellen, als Password verwenden

Loesung 2 (SSH):
SSH-Key erstellen + zu GitHub hinzufuegen (siehe oben)

### Large files

Error: File exceeds GitHub's file size limit of 100 MB

Loesung:
Git LFS verwenden:
git lfs install
git lfs track "*.zip"
git add .gitattributes

### Detached HEAD

Error: You are in 'detached HEAD' state

Loesung:
git checkout main

## Resources

Official Docs:
https://docs.github.com

Git Docs:
https://git-scm.com/doc

GitHub Actions:
https://docs.github.com/actions

GitHub CLI:
https://cli.github.com

## Naechste Datei

Siehe docs/GITHUB-WORKFLOW.md fuer Scratchy-spezifischen Workflow.

Ende des GitHub-Guides.

