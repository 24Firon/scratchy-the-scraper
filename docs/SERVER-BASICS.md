# Server-Grundlagen & DigitalOcean-Operationen

Diese Datei erklaert ALLE wichtigen Server-Konzepte, Befehle und DigitalOcean-Operationen.

## DigitalOcean Droplet-Grundlagen

### Was ist ein Droplet?

Ein Droplet ist eine Linux-basierte virtuelle Maschine (VM) bei DigitalOcean.
Jedes Droplet laeuft auf virtualisierter Hardware.

Unser Droplet:
- Hostname: scratchy
- OS: Ubuntu 24.04.3 LTS
- Public IP: 134.209.241.164
- Private IP: 10.19.0.8
- Region: (DigitalOcean Data Center)
- Plan: (CPU + RAM + Disk)

### Droplet-Typen

Basic Droplets:
- Shared CPU (kostenguenstig)
- 1-16 GB RAM
- 1-8 vCPUs
- 25-320 GB SSD

Premium Droplets:
- Dedicated CPU (hoehere Performance)
- 2-64 GB RAM
- 2-32 vCPUs
- 50-1600 GB SSD

## Backups & Snapshots

### Unterschied: Backups vs. Snapshots

BACKUPS (Automatisch):
- Kosten: 20% des Droplet-Preises pro Monat
- Frequenz: Woechentlich oder taeglich (waehlbar)
- Retention: Woechentlich 4 Wochen, taeglich 7 Tage
- ACHTUNG: Werden geloescht, wenn Droplet geloescht wird!
- Aktivierung: DigitalOcean Control Panel → Droplet → Backups
- Kein Multi-Region Support

SNAPSHOTS (Manuell):
- Kosten: 0.05 USD pro GB pro Monat
- Frequenz: On-Demand (du erstellst sie manuell)
- Retention: Unbegrenzt (bis du sie loeschst)
- Bleiben erhalten, auch wenn Droplet geloescht wird!
- Multi-Region Support: Ja (kostenlos replizierbar)
- Empfohlen fuer: Wichtige Meilensteine, vor grossen Aenderungen

### Snapshot erstellen (DigitalOcean Control Panel)

1. Gehe zu: https://cloud.digitalocean.com/droplets
2. Klicke auf Droplet-Name
3. Scrolle zu "Snapshots"
4. Klicke "Take Snapshot"
5. Name: scratchy-snapshot-2025-10-07
6. Warte 5-10 Minuten (je nach Droplet-Groesse)
7. Snapshot erscheint unter "Snapshots"

### Snapshot erstellen (API)

API-Token benoetigt (erstellen unter: Account → API → Generate New Token)

curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{"type":"snapshot","name":"scratchy-snapshot-2025-10-07"}' \
  "https://api.digitalocean.com/v2/droplets/YOUR_DROPLET_ID/actions"

### Snapshot lokal herunterladen

DigitalOcean erlaubt KEIN direktes Download von Snapshots!

Workaround mit rsync (vom Server zum PC):

Auf PC (Windows mit WSL oder Linux):
rsync -avz -e ssh firon@134.209.241.164:/opt/scratchy /local/backup/path/

Auf PC (macOS/Linux):
rsync -avz -e ssh firon@134.209.241.164:/opt/scratchy ~/backups/scratchy-$(date +%Y%m%d)

### Backup-Strategie Empfehlung

Fuer Production-Server:
1. Automatische Backups aktivieren (woechentlich)
2. Vor jedem grossen Update: Manueller Snapshot
3. Wichtige Daten zusaetzlich via rsync lokal sichern
4. Git-Repository als dritte Backup-Ebene (Code)

Fuer Development-Server (wie scratchy):
1. Snapshots vor grossen Aenderungen
2. Git-Repository aktiv halten (Code-Backup)
3. Wichtige Configs in .context-private.md dokumentieren

## Droplet Resizing (Upgrade/Downgrade)

### Resize-Optionen

Option 1: CPU + RAM only (REVERSIBEL)
- Aendert nur CPU + RAM
- Disk bleibt gleich
- Kann rueckgaengig gemacht werden
- Nutzen: Temporary Performance-Boost

Option 2: Disk + CPU + RAM (PERMANENT)
- Aendert CPU + RAM + Disk
- KANN NICHT rueckgaengig gemacht werden!
- Disk wird dauerhaft groesser
- Nutzen: Mehr Speicherplatz noetig

WICHTIG: Disk NIEMALS verkleinern moeglich!
Grund: Datenverlust + Filesystem-Korruption

### Resize-Prozess (Control Panel)

VOR dem Resize:
1. Snapshot erstellen! (siehe oben)
2. Auf Server einloggen: ssh scratchy
3. Graceful Shutdown: sudo shutdown -h now

Resize:
1. DigitalOcean Control Panel → Droplets
2. Klicke auf scratchy
3. Klicke "Resize" im Menu
4. Waehle: CPU + RAM only ODER Disk + CPU + RAM
5. Waehle neuen Plan
6. Klicke "Resize"
7. Warte (ca. 1 Minute pro GB genutzter Disk)

Nach dem Resize:
1. Droplet wieder starten (On/Off Toggle)
2. SSH-Login: ssh scratchy
3. Check Disk: df -h
4. Check Services: docker ps
5. Test Scraper: docker exec -it scratchy node main.js

### Downtime-Schaetzung

Formel: ~1 Minute pro GB genutzter Disk

Beispiel:
Genutzte Disk: 15 GB (check mit: df / -h)
Erwartete Downtime: ~15 Minuten

ABER: Kann laenger dauern bei:
- Hoher Load auf Host-Maschine
- Droplet wechselt Hypervisor (Daten-Transfer ueber Netzwerk)

### Resize-Fehler vermeiden

IMMER VOR Resize:
sudo shutdown -h now

NIEMALS:
- Droplet einfach ausschalten (Power Off Button)
- Ohne Snapshot resizen
- Disk verkleinern versuchen

Bei Problemen:
- Snapshot wiederherstellen
- DigitalOcean Support kontaktieren (Ticket)

## Droplet Migration & Umzug

### Zu neuem Droplet migrieren

Methode 1: Snapshot → Restore
1. Snapshot vom alten Droplet erstellen
2. Neues Droplet aus Snapshot erstellen
3. IP-Adresse umbiegen (siehe unten)
4. Altes Droplet loeschen

Methode 2: rsync (manuell)
1. Neues Droplet erstellen (frische Ubuntu-Installation)
2. rsync von alt nach neu
3. Services manuell konfigurieren
4. Testen
5. Altes Droplet loeschen

### IP-Adresse migrieren

Floating IP (empfohlen):
- Kostet 4 USD/Monat (solange ungenutzt)
- Kann zwischen Droplets umgeschaltet werden
- Ideal fuer Zero-Downtime-Migration

Reserved IP (DigitalOcean neuer Name):
- Gleich wie Floating IP
- DigitalOcean hat nur Namen geaendert

Erstellen:
1. Control Panel → Networking → Reserved IPs
2. "Reserve IP"
3. Waehle Droplet
4. IP wird zugewiesen

Umschalten:
1. Control Panel → Networking → Reserved IPs
2. Klicke auf IP
3. "Reassign"
4. Waehle neues Droplet
5. Downtime: ~30 Sekunden

### DNS-Update nach Migration

Bei neuer IP-Adresse:
1. Domain-Provider aufrufen (z.B. Namecheap, GoDaddy)
2. DNS-Records aktualisieren:
   - A-Record: scratchy.example.com → 134.209.241.164
   - AAAA-Record: (falls IPv6)
3. TTL beachten (Time To Live):
   - Vor Migration: TTL auf 300 (5 Minuten) setzen
   - Nach Migration: TTL wieder auf 3600 (1 Stunde)
4. DNS-Propagation: 5 Minuten bis 48 Stunden

Check DNS-Propagation:
dig scratchy.example.com
nslookup scratchy.example.com

## Wichtige Linux-Befehle

### Dateisystem & Disk

Disk-Usage pruefen:
df -h                    # Human-readable
df / -h                  # Nur Root-Partition
du -sh /opt/scratchy     # Groesse eines Ordners
du -sh /opt/scratchy/*   # Groesse aller Unterordner

Freien Speicher pruefen:
free -h                  # RAM
df -h                    # Disk

Groesste Files finden:
du -ah /opt/scratchy | sort -rh | head -20
find /opt/scratchy -type f -size +100M

### Prozesse & Services

Laufende Prozesse:
ps aux                   # Alle Prozesse
ps aux | grep docker     # Docker-Prozesse
top                      # Interaktiv (q zum Beenden)
htop                     # Besseres top (installieren: sudo apt install htop)

Docker-Container:
docker ps                # Laufende Container
docker ps -a             # Alle Container (auch gestoppte)
docker stats             # Ressourcen-Nutzung live
docker logs scratchy     # Logs eines Containers

Services starten/stoppen:
sudo systemctl start docker
sudo systemctl stop docker
sudo systemctl restart docker
sudo systemctl status docker

### Netzwerk

IP-Adressen:
ip addr                  # Alle Interfaces
ip addr show eth0        # Spezifisches Interface

Offene Ports:
sudo netstat -tulpn      # Alle offenen Ports
sudo netstat -tulpn | grep :80   # Port 80
sudo lsof -i :3000       # Welcher Prozess auf Port 3000?

Firewall (ufw):
sudo ufw status          # Status pruefen
sudo ufw allow 22        # SSH erlauben
sudo ufw allow 80        # HTTP erlauben
sudo ufw enable          # Firewall aktivieren

Ping & DNS:
ping google.com          # Netzwerk-Verbindung testen
dig google.com           # DNS-Abfrage
nslookup google.com      # DNS-Abfrage (alt)

### User & Permissions

User hinzufuegen:
sudo adduser newuser
sudo usermod -aG sudo newuser    # Sudo-Rechte geben

Permissions aendern:
sudo chown firon:scratchy /opt/scratchy    # Owner aendern
sudo chmod 755 /opt/scratchy               # Permissions setzen
sudo chmod +x script.sh                    # Executable machen

Versteckte Files anzeigen:
ls -a                    # Zeigt .dotfiles
ls -lha                  # Mit Details + Human-readable

### System-Info

OS-Version:
lsb_release -a
cat /etc/os-release

Kernel-Version:
uname -r
uname -a

CPU-Info:
lscpu
cat /proc/cpuinfo

RAM-Info:
free -h
cat /proc/meminfo

Disk-Info:
lsblk
fdisk -l

## DigitalOcean-spezifische Tools

### doctl (DigitalOcean CLI)

Installation (Linux):
cd ~
wget https://github.com/digitalocean/doctl/releases/download/v1.104.0/doctl-1.104.0-linux-amd64.tar.gz
tar xf doctl-1.104.0-linux-amd64.tar.gz
sudo mv doctl /usr/local/bin

Authentifizierung:
doctl auth init
# Token eingeben (erstellen unter: Account → API)

Droplets auflisten:
doctl compute droplet list

Snapshot erstellen:
doctl compute droplet-action snapshot DROPLET_ID --snapshot-name "scratchy-snapshot-$(date +%Y%m%d)"

Droplet resizen:
doctl compute droplet-action resize DROPLET_ID --size s-2vcpu-4gb

### Metadata-Service

Droplet-Metadata abfragen (nur vom Droplet aus):
curl http://169.254.169.254/metadata/v1/id
curl http://169.254.169.254/metadata/v1/hostname
curl http://169.254.169.254/metadata/v1/region
curl http://169.254.169.254/metadata/v1/interfaces/public/0/ipv4/address

## Wichtige File-Locations

### System-Configs

SSH-Config:
/etc/ssh/sshd_config

Firewall-Rules:
/etc/ufw/

Cron-Jobs:
/etc/crontab
/var/spool/cron/crontabs/

Logs:
/var/log/syslog          # System-Logs
/var/log/auth.log        # SSH-Login-Logs
/var/log/docker/         # Docker-Logs

### User-Configs

SSH-Keys:
~/.ssh/id_rsa            # Private Key
~/.ssh/id_rsa.pub        # Public Key
~/.ssh/authorized_keys   # Erlaubte Keys fuer Login

Bash-Config:
~/.bashrc                # Bash-Konfiguration
~/.bash_history          # Command-History

Git-Credentials:
~/.gitconfig             # Git-Config
~/.git-credentials       # Git-Token (nach credential.helper store)

## Versteckte Dateien (Dotfiles)

Was ist ein Dotfile?

Files, die mit . beginnen, sind versteckt:
- .bashrc
- .gitignore
- .env
- .context-private.md

Warum versteckt?
- Weniger Clutter in ls
- Versehentliches Loeschen schwieriger
- Konvention fuer Config-Files

Anzeigen:
ls -a                    # Zeigt .dotfiles
ls -lha                  # Mit Details + Groesse

Wichtig fuer Git:
.gitignore sollte IMMER .env, .context-private.md enthalten!

## Best Practices

### Security

1. NIEMALS als root arbeiten
   - Erstelle immer einen User mit sudo-Rechte
   - Unser User: firon

2. SSH-Key-Auth statt Passwort
   - Passwort-Login deaktivieren in /etc/ssh/sshd_config
   - PasswordAuthentication no

3. Firewall aktivieren
   - sudo ufw allow 22 (SSH)
   - sudo ufw allow 80 (HTTP)
   - sudo ufw allow 443 (HTTPS)
   - sudo ufw enable

4. Updates regelmaessig
   - sudo apt update && sudo apt upgrade -y
   - Oder: unattended-upgrades installieren

5. Fail2Ban installieren
   - Schuetzt vor Brute-Force-Attacken
   - sudo apt install fail2ban

### Performance

1. Monitoring
   - htop installieren (sudo apt install htop)
   - docker stats regelmaessig checken

2. Disk-Space
   - docker system prune regelmaessig (loescht ungenutztes)
   - Alte Logs loeschen: sudo find /var/log -name "*.gz" -delete

3. Swap aktivieren (falls wenig RAM)
   - sudo fallocate -l 2G /swapfile
   - sudo chmod 600 /swapfile
   - sudo mkswap /swapfile
   - sudo swapon /swapfile

### Backup

1. Vor jedem grossen Update: Snapshot!
2. Git-Repository aktiv halten (Code-Backup)
3. Wichtige Configs dokumentieren (.context-private.md)
4. Cronjob fuer automatisches rsync einrichten

## Troubleshooting

### Droplet nicht erreichbar

1. Check Droplet-Status im Control Panel
2. Check Firewall: sudo ufw status
3. Check SSH-Service: sudo systemctl status ssh
4. DigitalOcean Console verwenden (Control Panel → Access → Launch Console)

### Disk voll

1. Check: df -h
2. Groesste Files finden: du -ah / | sort -rh | head -20
3. Docker aufraeumen: docker system prune -a
4. Logs loeschen: sudo rm /var/log/*.gz

### Services starten nicht

1. Check Logs: sudo journalctl -xe
2. Check Service-Status: sudo systemctl status SERVICE_NAME
3. Restart versuchen: sudo systemctl restart SERVICE_NAME

## Naechste Datei

Keine weiteren Dateien. Dies ist die letzte Handoff-Datei.

Fuer weitere Infos:
- DigitalOcean Docs: https://docs.digitalocean.com
- Ubuntu Docs: https://help.ubuntu.com
