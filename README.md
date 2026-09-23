# MangaLounge selbst hosten (GitHub Pages)

Diese fünf Dateien sind alles, was du brauchst:

- `index.html` – die App
- `manifest.json` – macht sie zur installierbaren PWA
- `sw.js` – Service Worker, sorgt für echtes Offline-Funktionieren
- `icon-180.png`, `icon-512.png`, `favicon-32.png` – App-Icons

## 1. Repository anlegen

1. Auf [github.com](https://github.com) einloggen, oben rechts **+ → New repository**.
2. Name vergeben, z. B. `mangalounge`. Öffentlich (public) lassen – GitHub Pages ist im
   kostenlosen Plan nur für öffentliche Repos verfügbar.
3. **Create repository**.

## 2. Dateien hochladen

1. Im neuen Repo auf **Add file → Upload files**.
2. Alle fünf Dateien aus diesem Ordner reinziehen.
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
2. In `sw.js` die Zeile `var CACHE_NAME = "mangalounge-cache-v1";` hochzählen
   (`v2`, `v3`, …) – sonst liefert der Service Worker weiter die alte,
   zwischengespeicherte Version aus, selbst wenn du die neue hochgeladen hast.
3. Auf dem iPhone die App einmal komplett schließen (nach oben wischen im
   App-Umschalter) und neu öffnen, damit sie die neue Version lädt.

Deine gespeicherten Mangas bleiben dabei erhalten – die liegen in `localStorage`
deines iPhones, nicht in den Dateien selbst, und werden von einem Update der
`index.html` nicht angerührt.

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
