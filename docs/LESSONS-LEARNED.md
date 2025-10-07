# Lessons Learned - Fuer das naechste LLM

Diese Datei enthaelt ALLE wichtigen Regeln und Fehler aus der Entwicklung von Scratchy. Das naechste LLM MUSS diese lesen, BEVOR es mit Phase 2 startet.

## 1. Grosse Textbloecke NIEMALS via Heredoc

Problem:
Heredoc bei >300 Zeilen fuehrt zu:
- Copy-Paste-Fehlern
- Terminal-Buffer-Ueberlauf
- Unsichtbaren Syntax-Errors
- Abgeschnittenen Dateien

Richtig:
- Shell-Scripts mit echo >> (Zeile fuer Zeile)
- ODER: Separate kleine Scripts pro Datei
- ODER: nano + direktes Copy-Paste

Falsch:
cat > file.md << 'EOF'
... 500 Zeilen ...
EOF

## 2. IMMER validieren nach Output

Problem:
"Fertig" gesagt, bevor User getestet hat.
Files waren kaputt, User hat es erst spaeter gemerkt.

Richtig nach jedem File-Output:
wc -l datei.txt
tail -10 datei.txt
head -10 datei.txt

Richtig in Scripts:
LINES=$(wc -l < "$FILE")
if [ "$LINES" -lt 50 ]; then
  echo "FEHLER: Zu wenig Zeilen!"
  exit 1
fi

## 3. Fokus auf EINE Aufgabe

Problem:
Versuch, 6 Dateien in einer Response zu erstellen.
Resultat: Token-Overflow + Qualitaetsverlust.

Richtig:
1 Datei pro Response, dann User-Feedback einholen.

Falsch:
"Ich erstelle jetzt alle 6 Dateien auf einmal..."

## 4. Nie vom Plan abweichen ohne zu fragen

Problem:
User sagt "Datei fuer Datei", LLM macht "alles auf einmal".
User sagt "Einzelne Scripts", LLM macht "ein Mega-Script".

Richtig:
Bei Abweichung vom Plan IMMER erst fragen:
"Soll ich X machen oder Y?"

## 5. Token-Budget im Auge behalten

Problem:
Bei 85k/200k Tokens wird Output qualitativ schlechter.
LLM faengt an, Inhalte zu kuerzen ohne zu fragen.

Richtig:
- Kuerzere Responses
- Mehr Fokus
- Haeufigere User-Interaktion
- Bei 100k: User warnen

## 6. Codeblöcke in Markdown richtig formatieren

Problem:
Codeblöcke OHNE Backticks fuehren zu:
- "text" erscheint zwischen Bloecken
- Code wird nicht als Code erkannt
- Syntax-Highlighting fehlt

Richtig in Markdown-Dateien:
Entweder GAR KEINE Codeblock-Formatierung (nur Text)
ODER: Explizit sagen "Das ist nur Pseudocode, keine Backticks noetig"

Falsch:
In Markdown-File, das als Plain Text gespeichert wird, Backticks verwenden.

## 7. Klare Anweisungen geben

Problem:
LLM gibt unklare Befehle wie:
"Fuehre das aus" (aber was genau?)
"Dann machst du..." (aber wo faengt es an, wo hoert es auf?)

Richtig:
Jeder Befehl muss haben:
- ANFANG-Marker: "KOPIERE DIESEN BLOCK:"
- ENDE-Marker: "BIS HIER, DANN Ctrl+O"
- Erwarteter Output: "Du solltest sehen: ..."

## 8. Keine Annahmen treffen

Problem:
LLM nimmt an: "User weiss schon, was gemeint ist."
Realitaet: User ist verwirrt.

Richtig:
IMMER davon ausgehen, dass User:
- Keine Ahnung hat, wo ein Befehl anfaengt
- Nicht weiss, ob etwas Code oder Kommentar ist
- Nicht weiss, was als naechstes passieren soll

## 9. Testen auf eigene Fehler

Problem:
LLM erstellt Code/Docs, aber testet nicht, ob:
- Heredoc komplett ist
- Codeblöcke korrekt formatiert sind
- File korrekt erstellt wurde

Richtig nach jedem Output:
Mentale Checkliste:
- Ist der Heredoc-Block komplett? (EOF vorhanden?)
- Sind alle Codeblöcke korrekt formatiert?
- Habe ich Validierungs-Commands gegeben?

## 10. User-Feedback ernst nehmen

Problem:
User sagt "Das ist kaputt" oder "Ich verstehe es nicht".
LLM reagiert mit "Das sollte funktionieren" statt nachzufragen.

Richtig:
Wenn User verwirrt ist:
1. STOPP
2. Frage: "Was genau ist unklar?"
3. Erklaere es nochmal, anders
4. Gib ein KONKRETES Beispiel

## 11. Vom Einfachen zum Komplexen

Problem:
LLM startet mit komplexer Loesung (6 Dateien, Scripts, Validierung).
User ist ueberfordert.

Richtig:
Start: Einfachste Loesung (1 Datei via nano)
Wenn das klappt: Naechste Datei
Erst am Ende: Komplexe Automatisierung

## 12. Private vs. Oeffentliche Daten trennen

Problem:
LLM schreibt echte URLs, IPs, Credentials in oeffentliche Dateien.

Richtig:
Oeffentliche Dateien (GitHub):
- Nur Platzhalter (YOUR_SERVER, example.com)
- Keine echten IPs, URLs, Credentials

Private Dateien (Server):
- .context-private.md mit ALLEN echten Daten
- Steht in .gitignore

## 13. Konsistenz in Workflows

Problem:
LLM aendert staendig die Vorgehensweise:
Erst Heredoc, dann Scripts, dann nano, dann wieder Heredoc.

Richtig:
Einen Workflow waehlen und dabei bleiben:
Fuer dieses Projekt: nano + direktes Copy-Paste

## 14. Erwartungen klar kommunizieren

Problem:
LLM sagt "Das ist fertig", aber User sieht Fehler.

Richtig:
Nach jedem Output:
"Erwarteter Output: ..."
"Wenn du das NICHT siehst, sag Bescheid!"

## 15. Bei Fehlern: Root Cause finden

Problem:
LLM fixt Symptome, nicht die Ursache.
Fehler taucht wieder auf.

Richtig:
Wenn Fehler auftritt:
1. Was ist das Symptom?
2. Was ist die Ursache?
3. Wie verhindere ich, dass es wieder passiert?

Beispiel aus diesem Projekt:
Symptom: Codeblöcke erscheinen als "text"
Ursache: Backticks in Markdown-File, das als Plain Text gespeichert wird
Loesung: Keine Backticks verwenden
Prevention: In Zukunft IMMER pruefen, ob Datei Markdown ODER Plain Text ist

## Zusammenfassung fuer naechstes LLM

Wenn du Phase 2 startest:
1. Lies ALLE Handoff-Dateien
2. Lies .context-private.md (mit echten URLs)
3. Lies DIESE Datei (Lessons Learned)
4. Frage dich: "Habe ich alles verstanden?"
5. Wenn NEIN: Frage den User
6. Erst DANN: Starte mit Task 1

NIEMALS:
- Schnell machen wollen
- Inhalte kuerzen ohne zu fragen
- Vom Plan abweichen ohne Rueckfrage
- "Fertig" sagen bevor User getestet hat

IMMER:
- Langsam und gruendlich
- Validierung nach jedem Output
- User-Feedback einholen
- Klare, unmissverstaendliche Anweisungen
