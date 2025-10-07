# Docker Complete Guide - Fuer Scratchy-The-Scraper

Diese Datei enthaelt ALLES ueber Docker: Konzepte, Commands, Best Practices, Troubleshooting.

## Was ist Docker?

Docker ist eine Plattform fuer Containerisierung von Anwendungen.

### Kernkonzept: Container vs. Virtual Machines

Virtual Machine (VM):
- Eigenes komplettes OS
- Hypervisor (VMware, VirtualBox)
- Groß (GB)
- Langsamer Start (Minuten)
- Ressourcen-intensiv

Container:
- Shared Host-Kernel
- Docker Engine
- Klein (MB)
- Schneller Start (Sekunden)
- Ressourcen-effizient

### Warum Docker fuer Scratchy?

Vorteil 1: Konsistente Umgebung
- Playwright v1.56.0 immer gleich
- Keine "works on my machine" Probleme

Vorteil 2: Dependencies gebundled
- Browser, Node.js, npm packages
- Alles in einem Image

Vorteil 3: Isolation
- Container = isolated
- Kein Konflikt mit Host-System

Vorteil 4: Portability
- Docker-Image laeuft ueberall
- PC → Server → CI/CD

## Installation

### Ubuntu (Scratchy-Server)

Alte Versionen entfernen:
sudo apt remove docker docker-engine docker.io containerd runc

Dependencies installieren:
sudo apt update
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

GPG-Key hinzufuegen:
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

Repository hinzufuegen:
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

Docker installieren:
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

Docker-Service starten:
sudo systemctl start docker
sudo systemctl enable docker

User zu Docker-Gruppe hinzufuegen:
sudo usermod -aG docker $USER

WICHTIG: Logout + Login, damit Gruppe aktiv wird!

### Docker Compose installieren

Neueste Version (Stand: 2025):
sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

Executable machen:
sudo chmod +x /usr/local/bin/docker-compose

Check:
docker-compose --version
Output: Docker Compose version v2.23.0

### Version-Check

Docker:
docker --version
Output: Docker version 24.0.7

Docker Daemon:
docker info

## Docker-Architektur

### Komponenten

Docker Client (docker):
- CLI (Command Line Interface)
- Kommuniziert mit Docker Daemon via API

Docker Daemon (dockerd):
- Background-Service
- Managed Containers, Images, Networks, Volumes

Docker Registry (Docker Hub):
- Image-Storage
- Public: hub.docker.com
- Private: Registry selbst hosten

### Workflow

1. Developer schreibt Dockerfile
2. docker build erstellt Image
3. docker push zu Registry (optional)
4. docker run erstellt Container aus Image
5. Container laeuft isoliert

## Images

### Was ist ein Image?

Ein Image ist ein Read-Only Template fuer Container:
- Basis-OS (z.B. Ubuntu)
- Dependencies (Node.js, npm packages)
- Code
- Configuration

Layered Architecture:
- Layer 1: Ubuntu Base
- Layer 2: Node.js Installation
- Layer 3: npm install
- Layer 4: Code COPY
- Layer 5: CMD

### Image-Commands

Images auflisten:
docker images
docker image ls

Image pullen:
docker pull ubuntu:22.04
docker pull mcr.microsoft.com/playwright:v1.56.0-noble

Image bauen:
docker build -t myimage:latest .
docker build -t myimage:v1.0 -f Dockerfile.prod .

Image taggen:
docker tag myimage:latest myimage:v1.0

Image pushen:
docker push myuser/myimage:latest

Image loeschen:
docker rmi myimage:latest
docker image rm myimage:latest

Image inspizieren:
docker inspect myimage:latest
docker history myimage:latest

Ungenutztes loeschen:
docker image prune
docker image prune -a  # Alle ungenutzten

### Dockerfile

Was ist ein Dockerfile?
- Textdatei mit Instructions
- Definiert, wie Image gebaut wird
- Layer fuer Layer

Basic Dockerfile:
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y curl
COPY app.js /app/
WORKDIR /app
CMD ["node", "app.js"]

### Dockerfile Instructions

FROM (Base Image):
FROM ubuntu:22.04
FROM node:22-alpine
FROM mcr.microsoft.com/playwright:v1.56.0-noble

RUN (Commands):
RUN apt-get update && apt-get install -y curl
RUN npm install
RUN mkdir /app

COPY (Files kopieren):
COPY package.json /app/
COPY . /app/

ADD (wie COPY, aber kann URLs + Archives):
ADD https://example.com/file.tar.gz /app/
ADD archive.tar.gz /app/

WORKDIR (Working Directory):
WORKDIR /app
WORKDIR /opt/scratchy

ENV (Environment Variables):
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE (Ports dokumentieren):
EXPOSE 3000
EXPOSE 8080

CMD (Default Command):
CMD ["node", "app.js"]
CMD ["npm", "start"]

ENTRYPOINT (Command + Args):
ENTRYPOINT ["node"]
CMD ["app.js"]
# docker run myimage → node app.js
# docker run myimage server.js → node server.js

USER (User setzen):
USER firon
USER 1000:1000

VOLUME (Volumes definieren):
VOLUME /data
VOLUME ["/data", "/logs"]

ARG (Build-Time Variables):
ARG VERSION=1.0
RUN echo "Building version ${VERSION}"

LABEL (Metadata):
LABEL version="1.0"
LABEL description="My App"

HEALTHCHECK (Container Health):
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/ || exit 1

ONBUILD (Trigger fuer derived Images):
ONBUILD COPY . /app/

SHELL (Default Shell):
SHELL ["/bin/bash", "-c"]

STOPSIGNAL (Stop-Signal):
STOPSIGNAL SIGTERM

### Dockerfile Best Practices

1. Use specific tags (NOT latest):
FROM node:22.3.0
NOT: FROM node:latest

2. Multi-stage builds (reduce size):
# Build Stage
FROM node:22 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --production
CMD ["node", "dist/app.js"]

3. Minimize layers (combine RUN):
# Bad:
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git

# Good:
RUN apt-get update && apt-get install -y \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

4. Copy only necessary files:
# Bad:
COPY . /app/

# Good:
COPY package*.json /app/
RUN npm install
COPY src/ /app/src/

5. Use .dockerignore:
node_modules
.git
.env
*.log

6. Non-root user:
RUN useradd -m myuser
USER myuser

7. Clean up in same layer:
RUN apt-get update && apt-get install -y curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

### Scratchy Dockerfile (Beispiel)

FROM mcr.microsoft.com/playwright:v1.56.0-noble

WORKDIR /opt/scratchy

COPY package*.json ./
RUN npm install

COPY . .

RUN useradd -m firon && chown -R firon:firon /opt/scratchy
USER firon

EXPOSE 3000

CMD ["node", "main.js"]

## Containers

### Was ist ein Container?

Ein Container ist eine laufende Instanz eines Images:
- Isolated Process
- Eigenes Filesystem (aus Image)
- Eigene Netzwerk-Schnittstelle
- Eigene Prozess-IDs

### Container-Commands

Container starten:
docker run ubuntu
docker run -d ubuntu sleep infinity  # Detached (background)
docker run -it ubuntu bash  # Interactive (foreground)

Mit Namen:
docker run --name scratchy ubuntu

Mit Port-Mapping:
docker run -p 3000:3000 myapp

Mit Volume:
docker run -v /host/path:/container/path myapp

Mit Environment Variables:
docker run -e NODE_ENV=production myapp

Alle Optionen:
docker run -d \
  --name scratchy \
  --hostname scratchy \
  -p 3000:3000 \
  -v /opt/scratchy:/app \
  -e NODE_ENV=production \
  --network host \
  --restart unless-stopped \
  --memory 4g \
  --cpus 2 \
  myapp

Container auflisten:
docker ps  # Running
docker ps -a  # All (including stopped)

Container stoppen:
docker stop scratchy
docker stop $(docker ps -q)  # Alle

Container starten:
docker start scratchy

Container neu starten:
docker restart scratchy

Container loeschen:
docker rm scratchy
docker rm -f scratchy  # Force (auch wenn running)

Container-Logs:
docker logs scratchy
docker logs -f scratchy  # Follow (live)
docker logs --tail 100 scratchy  # Letzte 100 Zeilen

In Container exec:
docker exec -it scratchy bash
docker exec -it scratchy node main.js

Container inspizieren:
docker inspect scratchy

Container-Stats:
docker stats scratchy

Container-Prozesse:
docker top scratchy

Container-Aenderungen:
docker diff scratchy

Container zu Image:
docker commit scratchy myimage:v2

Container pausieren/unpausieren:
docker pause scratchy
docker unpause scratchy

### Container-Lifecycle

1. Created: docker create
2. Running: docker start
3. Paused: docker pause
4. Stopped: docker stop
5. Removed: docker rm

Restart-Policies:
no: Nie neu starten (default)
always: Immer neu starten
unless-stopped: Immer, außer manuell gestoppt
on-failure: Nur bei Fehler

docker run --restart unless-stopped myapp

### Resource-Limits

Memory:
docker run --memory 1g myapp
docker run --memory 1g --memory-swap 2g myapp

CPU:
docker run --cpus 2 myapp
docker run --cpu-shares 512 myapp

## Volumes & Bind Mounts

### Unterschied: Volumes vs. Bind Mounts vs. tmpfs

Volumes (EMPFOHLEN):
- Docker managed
- Stored: /var/lib/docker/volumes/
- Backup einfach
- Portabel

Bind Mounts:
- Host-Path direkt
- Stored: Beliebiger Host-Path
- Gut fuer Development (live editing)
- Nicht portabel

tmpfs Mounts:
- In-Memory
- Temporaer
- Schnell
- Gut fuer Secrets

### Volume-Commands

Volume erstellen:
docker volume create mydata

Volumes auflisten:
docker volume ls

Volume inspizieren:
docker volume inspect mydata

Volume loeschen:
docker volume rm mydata

Ungenutzte Volumes loeschen:
docker volume prune

### Volumes verwenden

Named Volume:
docker run -v mydata:/app/data myapp

Anonymous Volume:
docker run -v /app/data myapp

Bind Mount:
docker run -v /host/path:/container/path myapp
docker run -v /opt/scratchy:/app myapp

Read-Only:
docker run -v mydata:/app/data:ro myapp

tmpfs Mount:
docker run --tmpfs /tmp myapp

### Volume-Driver

Local (default):
docker volume create --driver local mydata

NFS:
docker volume create --driver local \
  --opt type=nfs \
  --opt o=addr=192.168.1.1,rw \
  --opt device=:/path/to/dir \
  mydata

### Scratchy Volume-Setup

docker-compose.yml:
services:
  scratchy:
    volumes:
      - ./:/opt/scratchy
      - playwright-cache:/root/.cache/ms-playwright
      - node-modules:/opt/scratchy/node_modules

volumes:
  playwright-cache:
  node-modules:

Warum separate Volumes?
- playwright-cache: Browser-Binaries (groß, selten aendern)
- node-modules: Dependencies (Docker-managed, nicht Host)

## Networking

### Network-Modes

bridge (default):
- Private Network
- Container untereinander kommunizieren
- Port-Mapping fuer Host-Zugriff

host:
- Shared Host-Network
- Kein Port-Mapping noetig
- Performance +

none:
- Kein Netzwerk
- Isolation

container:
- Shared Network mit anderem Container

### Network-Commands

Networks auflisten:
docker network ls

Network erstellen:
docker network create mynetwork
docker network create --driver bridge mynetwork

Network inspizieren:
docker network inspect mynetwork

Network loeschen:
docker network rm mynetwork

Container zu Network hinzufuegen:
docker network connect mynetwork scratchy

Container von Network trennen:
docker network disconnect mynetwork scratchy

### Container in Network

docker run --network mynetwork myapp

Container untereinander:
Container A: docker run --name app --network mynetwork myapp
Container B: docker run --name db --network mynetwork postgres

Von A zu B:
curl http://db:5432

### Scratchy Network-Setup

docker-compose.yml:
services:
  scratchy:
    network_mode: host

Warum host?
- Playwright braucht direkten Zugriff auf Internet
- Keine Port-Mapping-Probleme
- Performance +

Alternative (bridge):
services:
  scratchy:
    networks:
      - scratchy-net
    ports:
      - "3000:3000"

networks:
  scratchy-net:
    driver: bridge

## Docker Compose

### Was ist Docker Compose?

Docker Compose = Multi-Container-Orchestration:
- YAML-File (docker-compose.yml)
- Definiert multiple Services
- Ein Command fuer alles (up/down)

### docker-compose.yml Structure

version: '3.9'

services:
  app:
    image: node:22
    container_name: app
    ports:
      - "3000:3000"
    volumes:
      - ./:/app
    environment:
      - NODE_ENV=production
    networks:
      - mynetwork
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15
    container_name: db
    volumes:
      - postgres-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=secret
    networks:
      - mynetwork

volumes:
  postgres-data:

networks:
  mynetwork:

### Compose-Commands

Starten (build + start):
docker-compose up

Detached:
docker-compose up -d

Mit Build:
docker-compose up --build

Nur bauen:
docker-compose build

Stoppen (Container bleiben):
docker-compose stop

Stoppen + loeschen:
docker-compose down

Mit Volumes loeschen:
docker-compose down -v

Logs:
docker-compose logs
docker-compose logs -f app

Exec:
docker-compose exec app bash

Services auflisten:
docker-compose ps

Config validieren:
docker-compose config

Restart:
docker-compose restart app

Scale (multiple instances):
docker-compose up --scale app=3

### Service-Optionen

image (Pre-built Image):
services:
  app:
    image: node:22

build (Build from Dockerfile):
services:
  app:
    build: .
    # ODER:
    build:
      context: .
      dockerfile: Dockerfile.prod
      args:
        VERSION: 1.0

container_name (Custom Name):
services:
  app:
    container_name: scratchy

ports (Port-Mapping):
services:
  app:
    ports:
      - "3000:3000"
      - "8080:80"
      - "127.0.0.1:3000:3000"  # Nur localhost

volumes (Volumes/Bind Mounts):
services:
  app:
    volumes:
      - ./:/app
      - mydata:/data
      - /var/run/docker.sock:/var/run/docker.sock

environment (Env Variables):
services:
  app:
    environment:
      - NODE_ENV=production
      - PORT=3000
    # ODER:
    environment:
      NODE_ENV: production
      PORT: 3000
    # ODER aus .env:
    env_file:
      - .env

networks (Networks):
services:
  app:
    networks:
      - frontend
      - backend

depends_on (Dependencies):
services:
  app:
    depends_on:
      - db
      - redis

restart (Restart-Policy):
services:
  app:
    restart: unless-stopped
    # Optionen: no, always, unless-stopped, on-failure

command (Override CMD):
services:
  app:
    command: npm start

entrypoint (Override ENTRYPOINT):
services:
  app:
    entrypoint: ["node", "app.js"]

working_dir (Working Directory):
services:
  app:
    working_dir: /app

user (User):
services:
  app:
    user: "1000:1000"

hostname (Hostname):
services:
  app:
    hostname: scratchy

healthcheck (Health Check):
services:
  app:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

deploy (Resource Limits):
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G

labels (Metadata):
services:
  app:
    labels:
      - "com.example.description=My App"

logging (Logging Driver):
services:
  app:
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

### Scratchy docker-compose.yml (VOLLSTAENDIG)

version: '3.9'

services:
  scratchy:
    image: mcr.microsoft.com/playwright:v1.56.0-noble
    container_name: scratchy
    hostname: scratchy
    working_dir: /opt/scratchy
    command: tail -f /dev/null
    network_mode: host
    volumes:
      - ./:/opt/scratchy
      - playwright-cache:/root/.cache/ms-playwright
      - ./playwright/.auth:/opt/scratchy/playwright/.auth
    environment:
      - NODE_ENV=production
      - DISPLAY=:99
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 4G
          cpus: '2'
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

  scratchy-redis:
    image: redis:7-alpine
    container_name: scratchy-redis
    network_mode: host
    volumes:
      - redis-data:/data
    restart: unless-stopped

volumes:
  playwright-cache:
  redis-data:

### Environment Variables

.env File:
NODE_ENV=production
POSTGRES_PASSWORD=secret
API_KEY=abc123

In docker-compose.yml:
services:
  app:
    environment:
      - NODE_ENV=${NODE_ENV}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}

ODER:
services:
  app:
    env_file:
      - .env

Variable Substitution:
services:
  app:
    image: myapp:${VERSION:-latest}

Precedence (hoechste zuerst):
1. docker-compose run -e
2. docker-compose.yml environment
3. .env file
4. Dockerfile ENV

### Multiple Compose Files

Base (docker-compose.yml):
services:
  app:
    image: myapp

Development (docker-compose.override.yml):
services:
  app:
    volumes:
      - ./:/app
    command: npm run dev

Production (docker-compose.prod.yml):
services:
  app:
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 4G

Run Development:
docker-compose up  # Automatisch mit override

Run Production:
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

## Docker Best Practices

### Images

1. Use official images:
FROM node:22  # Official Node.js
FROM postgres:15  # Official PostgreSQL

2. Pin versions:
FROM node:22.3.0-alpine  # Specific version
NOT: FROM node:latest

3. Minimize layers:
RUN apt-get update && apt-get install -y \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

4. Multi-stage builds:
# Build
FROM node:22 AS builder
...
# Production
FROM node:22-alpine
COPY --from=builder /app/dist ./dist

5. Use .dockerignore:
node_modules
.git
.env

### Containers

1. One process per container:
Container A: App
Container B: Database
Container C: Redis

2. Use volumes for data:
docker run -v data:/var/lib/postgresql/data postgres

3. Non-root user:
USER firon

4. Resource limits:
docker run --memory 1g --cpus 2 myapp

5. Health checks:
HEALTHCHECK CMD curl -f http://localhost/ || exit 1

### Security

1. Scan images:
docker scan myimage:latest

2. No secrets in Dockerfile:
ENV API_KEY=abc123  # BAD!
Use docker secrets or env files

3. Read-only filesystem:
docker run --read-only myapp

4. Drop capabilities:
docker run --cap-drop=ALL myapp

5. Use secrets:
docker secret create db_password password.txt
docker service create --secret db_password myapp

### Performance

1. Layer caching:
COPY package*.json ./
RUN npm install
COPY . .
# npm install wird gecached!

2. Minimize image size:
FROM node:22-alpine  # Alpine statt full

3. Use .dockerignore:
node_modules
.git

4. Clean up in same layer:
RUN apt-get install -y curl \
    && apt-get clean

## Troubleshooting

### Container startet nicht

Check Logs:
docker logs scratchy
docker logs --tail 100 scratchy

Check Exit-Code:
docker ps -a
EXITED (0): OK
EXITED (1): Error
EXITED (137): OOM (Out of Memory)

Inspect:
docker inspect scratchy

### Permission-Fehler

Error: Permission denied

Loesung 1: User zu docker-Gruppe:
sudo usermod -aG docker $USER
# Logout + Login

Loesung 2: chmod:
chmod 755 /opt/scratchy

Loesung 3: chown:
chown -R firon:scratchy /opt/scratchy

### Port bereits belegt

Error: Bind for 0.0.0.0:3000 failed: port is already allocated

Check Port:
sudo lsof -i :3000
sudo netstat -tulpn | grep :3000

Kill Prozess:
kill -9 PID

Oder: Anderen Port:
docker run -p 3001:3000 myapp

### Out of Disk Space

Error: no space left on device

Check:
df -h
docker system df

Clean up:
docker system prune
docker system prune -a
docker volume prune
docker image prune -a

### DNS-Probleme

Error: Temporary failure in name resolution

Check DNS:
docker run --rm alpine cat /etc/resolv.conf

Fix (docker-compose.yml):
services:
  app:
    dns:
      - 8.8.8.8
      - 8.8.4.4

### Network-Probleme

Container nicht erreichbar:

Check Network:
docker network inspect mynetwork

Check Firewall:
sudo ufw status

Ping Container:
docker exec app ping db

### Volume-Permission-Fehler

Error: EACCES: permission denied

Loesung (docker-compose.yml):
services:
  app:
    user: "1000:1000"
    volumes:
      - ./:/app

Oder auf Host:
sudo chown -R 1000:1000 /opt/scratchy

### Zombie-Prozesse

docker ps -a zeigt viele EXITED Container

Clean up:
docker container prune

Auto-Remove:
docker run --rm myapp

## Advanced: Docker in Production

### Health Checks

Dockerfile:
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost/ || exit 1

docker-compose.yml:
services:
  app:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3

Check:
docker inspect --format='{{.State.Health.Status}}' scratchy

### Logging

JSON-File (default):
services:
  app:
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

Syslog:
services:
  app:
    logging:
      driver: syslog
      options:
        syslog-address: "tcp://192.168.0.42:123"

### Monitoring

Docker Stats:
docker stats

cAdvisor:
docker run -d \
  --name=cadvisor \
  -p 8080:8080 \
  -v /:/rootfs:ro \
  -v /var/run:/var/run:ro \
  -v /sys:/sys:ro \
  -v /var/lib/docker/:/var/lib/docker:ro \
  google/cadvisor:latest

Prometheus + Grafana:
# docker-compose.yml mit Prometheus, Grafana, Node-Exporter

### Auto-Restart

Restart-Policies:
services:
  app:
    restart: unless-stopped

Systemd Service:
sudo nano /etc/systemd/system/docker-compose-scratchy.service

[Unit]
Description=Scratchy Docker Compose
Requires=docker.service
After=docker.service

[Service]
WorkingDirectory=/opt/scratchy
ExecStart=/usr/local/bin/docker-compose up
ExecStop=/usr/local/bin/docker-compose down
Restart=always

[Install]
WantedBy=multi-user.target

Enable:
sudo systemctl enable docker-compose-scratchy
sudo systemctl start docker-compose-scratchy

### Backup & Restore

Backup Volume:
docker run --rm \
  -v mydata:/data \
  -v $(pwd):/backup \
  ubuntu tar czf /backup/mydata-backup.tar.gz /data

Restore Volume:
docker run --rm \
  -v mydata:/data \
  -v $(pwd):/backup \
  ubuntu tar xzf /backup/mydata-backup.tar.gz -C /

Backup Container:
docker commit scratchy scratchy-backup:$(date +%Y%m%d)
docker save scratchy-backup:$(date +%Y%m%d) -o scratchy-backup.tar

Restore Container:
docker load -i scratchy-backup.tar
docker run scratchy-backup:20251007

## Docker Registry

### Docker Hub

Login:
docker login
Username: your-username
Password: your-password

Pull:
docker pull your-username/myimage:latest

Push:
docker tag myimage:latest your-username/myimage:latest
docker push your-username/myimage:latest

Logout:
docker logout

### Private Registry

Starten:
docker run -d \
  -p 5000:5000 \
  --name registry \
  -v registry-data:/var/lib/registry \
  registry:2

Push zu Private Registry:
docker tag myimage:latest localhost:5000/myimage:latest
docker push localhost:5000/myimage:latest

Pull von Private Registry:
docker pull localhost:5000/myimage:latest

## Scratchy-spezifische Patterns

### Playwright-Browser-Cache persistent

volumes:
  - playwright-cache:/root/.cache/ms-playwright

Warum?
- Browser-Binaries sind groß (500+ MB)
- Bei jedem npm install wuerden sie neu geladen
- Volume = persistent

### Node-Modules im Container

volumes:
  - node-modules:/opt/scratchy/node_modules

Warum?
- Host hat evtl. andere Architektur (macOS vs. Linux)
- Native Dependencies muessen im Container gebaut werden

### Cookie-Persistence

volumes:
  - ./playwright/.auth:/opt/scratchy/playwright/.auth

Warum?
- Cookies von Host in Container
- Scraper nutzt persistent login

### Output-Verzeichnis

volumes:
  - ./output:/opt/scratchy/output

Warum?
- Output auf Host sichtbar
- Einfacher Zugriff zu Scraped Data

### Command: tail -f /dev/null

command: tail -f /dev/null

Warum?
- Container bleibt am Laufen
- Keine automatische Ausfuehrung
- docker exec fuer manuelle Runs

### network_mode: host

network_mode: host

Warum?
- Playwright braucht direkten Internet-Zugriff
- Keine NAT/Port-Forwarding-Probleme
- Performance +

## Resources

Official Docs:
https://docs.docker.com

Docker Hub:
https://hub.docker.com

Dockerfile Reference:
https://docs.docker.com/reference/dockerfile/

Compose File Reference:
https://docs.docker.com/compose/compose-file/

Best Practices:
https://docs.docker.com/develop/dev-best-practices/

Security:
https://docs.docker.com/engine/security/

## Naechste Datei

Keine weiteren Dateien fuer Docker.
Siehe: docs/SERVER-BASICS.md fuer DigitalOcean-Operationen.

Ende des Docker-Guides.
