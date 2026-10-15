# MangaLounge selbst hosten (GitHub Pages)

Diese Dateien sind alles, was du brauchst:

- `index.html` – die App
- `manifest.json` – macht sie zur installierbaren PWA
- `sw.js` – Service Worker, sorgt für echtes Offline-Funktionieren
- `config.js` – URL des optionalen MangaDex-Proxys
- `mangadex-proxy.js` – Cloudflare-Worker für den integrierten Reader
- `icon-180.png`, `icon-512.png`, `favicon-32.png` – App-Icons (Home-Bildschirm, Browser-Tab)
- `icon.svg` – Quelldatei der Icons (nur zum Nachbearbeiten, wird von der App nicht geladen)

## 1. Repository anlegen

1. Auf [github.com](https://github.com) einloggen, oben rechts **+ → New repository**.
2. Name vergeben, z. B. `mangalounge`. Öffentlich (public) lassen – GitHub Pages ist im
   kostenlosen Plan nur für öffentliche Repos verfügbar.
3. **Create repository**.

## 2. Dateien hochladen

1. Im neuen Repo auf **Add file → Upload files**.
2. Alle Dateien aus diesem Ordner reinziehen.
3. Unten **Commit changes**.

## 3. GitHub Pages aktivieren

1. Im Repo auf **Settings → Pages** (linkes Menü, unter „Code and automation“).
2. Unter **Build and deployment → Source**: „Deploy from a branch“.
3. Branch: `main`, Ordner: `/ (root)` → **Save**.
4. Nach ca. 1–2 Minuten erscheint oben eine URL, meist:
   `https://DEIN-USERNAME.github.io/mangalounge/`

## 4. Auf dem iPhone einrichten

1. Die URL aus Schritt 3 in **Safari** öffnen (wichtig: Safari, nicht Chrome – nur
   Safari kann iOS-Webseiten zu echten Home-Bildschirm-Apps machen).
2. Teilen-Symbol (Quadrat mit Pfeil nach oben) antippen.
3. **Zum Home-Bildschirm** wählen, Name bestätigen, **Hinzufügen**.
4. Das Icon liegt jetzt auf deinem Home-Bildschirm und startet ohne Adressleiste,
   im Dark Mode deines iPhones, mit eigenem App-Icon.

## Updates später

Wenn du die App über mich weiter verbessern lässt, bekommst du wieder eine
aktualisierte `index.html`. Zum Aktualisieren:

1. Im Repo die alte `index.html` öffnen → Stift-Icon (bearbeiten) → Inhalt
   komplett ersetzen → **Commit changes**. (Oder: alte Datei löschen, neue per
   Upload hochladen.)
2. In `sw.js` die Zeile `var CACHE_NAME = "mangalounge-cache-v38";` hochzählen
   (`v39`, `v40`, …) – sonst liefert der Service Worker weiter die alte,
   zwischengespeicherte Version aus, selbst wenn du die neue hochgeladen hast.
   Die Nummer steht auch in `index.html` ganz unten in der Zeile
   `navigator.serviceWorker.register("sw.js?v=38")` – beide zusammen ändern.
3. Auf dem iPhone die App einmal komplett schließen (nach oben wischen im
   App-Umschalter) und neu öffnen, damit sie die neue Version lädt.

Deine gespeicherten Mangas bleiben dabei erhalten – die liegen in `localStorage`
deines iPhones, nicht in den Dateien selbst, und werden von einem Update der
`index.html` nicht angerührt.

## Der Reader

Der integrierte Reader lässt sich komplett auf dich einstellen. Alles ist einzeln
an- und abschaltbar – entweder in den Einstellungen unter **Reader** bzw.
**Reader-Bedienung** oder direkt beim Lesen über das Zahnrad in der Leiste oben.

- **Blättern:** Scroll oder Einzelseite, Seitenbreite, Abstand zwischen den Seiten.
- **Wischen:** Wischen blättert (Einzelseite) bzw. wechselt das Kapitel (Scroll).
- **Tipp-Zonen:** Tippen links/rechts blättert, in der Mitte erscheint die Leiste.
- **Leiste automatisch ausblenden:** Beim Lesen verschwindet die Leiste, ein
  kleiner Griff oben holt sie zurück.
- **Doppeltipp vergrößert** die aktuelle Seite (Einzelseiten-Modus).
- **Helligkeit:** eigener Regler, wirkt nur im Reader.
- **Qualität:** Original, datensparend oder automatisch je nach Verbindung.
- **Nahtlos weiterlesen:** das nächste Kapitel wird im Hintergrund vorgeladen und
  am Kapitelende direkt geladen – abbrechbar durch Hochscrollen.
- **Als gelesen markieren:** am Kapitelende, ab 80 % oder nur von Hand.
- **Bildschirm bleibt an**, **Sleep-Timer** und **Tastatursteuerung** (Pfeile, Esc).
- **Offline:** Kapitel lassen sich speichern; die Verwaltung zeigt alle
  gespeicherten Kapitel mit Seitenzahl und Größe und erlaubt gezieltes Löschen.
  Offline zuerst aus dem Cache lässt gespeicherte Kapitel auch im Flugmodus laden.

Der Lesestand wird pro Titel als Kapitel **und** Seite gemerkt, damit
„Weiterlesen“ wirklich an der richtigen Stelle landet.

## Gerätespeicher

Eigene Cover liegen als Text im `localStorage`, der auf dem iPhone klein ist.
In den Einstellungen unter **Gerätespeicher** siehst du, wie viel belegt ist, und
kannst große Cover per Knopfdruck in eine größere lokale Ablage (IndexedDB)
auslagern. Ein Backup enthält die Cover weiterhin, und du kannst sie jederzeit
zurückholen.

## Was sich durch das Selbst-Hosten ändert

- **Kein Zeitlimit / keine Abhängigkeit von Claude** – die Seite läuft dauerhaft
  unter deiner eigenen URL.
- **Keine CSP-Einschränkung mehr**: Die Artifact-Umgebung bei Claude erlaubt nur
  Netzwerk-Anfragen an eine feste Liste von Domains, deshalb ging die
  automatische AniList-Cover-Suche vorher nur über den Umweg „Tab öffnen und
  Bild manuell hochladen“. Auf GitHub Pages gilt diese Einschränkung nicht mehr –
  eine echte automatische Cover-Suche direkt per Klick wäre jetzt technisch
  möglich. Das ist aber ein eigenes Stück Code (inkl. eines Sonderfalls, falls
  AniLists Bilder-Server keine Bilder für Fremd-Domains freigibt) – sag Bescheid,
  wenn ich das für dich nachrüsten soll, dann baue ich es gezielt für die
  gehostete Version.

## MangaDex-Reader auf GitHub Pages

GitHub Pages kann die MangaDex-API wegen CORS nicht direkt aus dem Browser aufrufen.
Für den integrierten Reader liegt deshalb `mangadex-proxy.js` als Cloudflare-Worker bereit.

1. Bei Cloudflare Workers einen neuen Worker anlegen.
2. Den Inhalt von `mangadex-proxy.js` in den Worker kopieren und deployen.
3. Die Worker-URL in `config.js` eintragen:
   `window.MANGADEX_PROXY_URL = "https://DEIN-WORKER.workers.dev";`
4. `index.html`, `config.js` und `sw.js` zusammen mit den übrigen Dateien auf GitHub Pages hochladen.

Danach läuft der integrierte Reader über den Worker. Der externe MangaDex-Link bleibt als Fallback verfügbar.
