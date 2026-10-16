# MangaLounge

MangaLounge ist eine Web-App für deine Manga-Sammlung: Katalog, Lesestand,
Statistik und ein eingebauter Reader. Die ganze App steckt in einer einzigen
Datei (`index.html`), läuft komplett im Browser und speichert alles lokal auf
dem Gerät. Vom Home-Bildschirm gestartet sieht sie aus und fühlt sich an wie
eine normale App, inklusive Offline-Start.

Diese Anleitung bringt die App in wenigen Minuten auf GitHub Pages und danach
auf dein iPhone.

## Was die App kann

Oben unter der Suche sitzt die Hauptnavigation mit zwei Registern:
**Bibliothek** und **API-Katalog**. Rechts in der Kopfzeile sammelt ein
Download-Symbol mit kleiner Zahl alle laufenden Downloads; ein Tipp öffnet das
**Download-Center**.

Kern der Bibliothek ist die Liste in Listen- oder Cover-Ansicht. Die Suche läuft
über Titel, Alt-Titel, Autor, Tags, Studio und Notizen. Dazu kommen Filter nach
Status, Typ und Autor, eine Sortierung nach Änderung, Bewertung oder fehlenden
Kapiteln und fertige Sammlungen wie „Binge-Ready“ oder „Vergessene Schätze“.
Jeder Titel hat eine Detailseite mit Kapitelstand, deiner Bewertung von 0 bis 10,
AniList-Score, Tags, Notizen, Leseverlauf und einer Kapitelliste, aus der heraus
sich einzelne Kapitel offline speichern lassen.

Über AniList lassen sich Titel verknüpfen und abgleichen, neue Kapitel erkennt
die App und meldet sie über die Glocke. Die Zahl daran zeigt, wie viele neue
Kapitel noch offen sind; ein kleiner Punkt steht für alles andere Neue. Die
Zahl verschwindet von selbst, sobald du einmal in der Glocke warst, und lässt
sich dort mit einem Schalter ganz abschalten.

Die Glocke ist gleichzeitig die Statistik: Lesefortschritt, gelesene Kapitel,
Top-Autor und -Genre, Streak, Leseaktivität und Verlauf, alles in einem Blatt.
Ein eingebauter Reader öffnet MangaDex direkt in der App, mit einer ganzen
Reihe einzelner Schalter (siehe unten). Und im Backup-Bereich exportierst du
die ganze Sammlung als JSON-Datei und spielst sie wieder ein.

## Einstellungen

Die Einstellungen sind in fünf Gruppen sortiert: **Darstellung**, **Bedienung**,
**Reader**, **AniList** und **Daten**. Oben bleibt die Kopfzeile mit „Fertig“
stehen, darunter sitzt die fixierte Register-Leiste, mit der du flüssig zu einer
Gruppe springst – die aktuelle Gruppe ist dabei hervorgehoben und bleibt in der
Leiste immer sichtbar.

Die Gruppenköpfe sind so schlicht wie in den iOS-Einstellungen: klein, grau, in
normaler Schreibung, ohne Symbol und ohne Linie. Darunter sitzt je Karte eine
ebenso leise Beschriftung. Die Karten haben den Radius der iOS-Listen (10 px),
die Zeilen sind 44 px hoch und der Text darin 17 px wie im System.

## Die Dateien

| Datei | Zweck |
| --- | --- |
| `index.html` | die App selbst (HTML, CSS und JavaScript in einer Datei) |
| `manifest.json` | macht sie zur installierbaren PWA, mit Icons und Startverknüpfungen |
| `sw.js` | Service Worker, cached die App für den Offline-Start |
| `config.js` | Adresse des Proxys (MangaDex, API-Katalog, Downloads) |
| `mangadex-proxy.js` | der Cloudflare-Worker dazu (MangaDex-API, Bilder und der generische `?url=`-Weg) |
| `icon-180.png` | App-Icon für den Home-Bildschirm |
| `icon-512.png` | App-Icon in groß |
| `favicon-32.png` | kleines Icon für den Browser-Tab |
| `icon.svg` | Quelldatei der Icons, nur zum Nachbearbeiten |

## 1. Auf GitHub Pages hosten

1. Auf [github.com](https://github.com) einloggen und oben rechts **+ → New
   repository** wählen.
2. Namen vergeben, zum Beispiel `mangalounge`. Das Repo muss **öffentlich**
   sein, weil GitHub Pages im kostenlosen Plan nur öffentliche Repos ausliefert.
3. **Create repository**.
4. Im neuen Repo auf **Add file → Upload files** und die Dateien aus der Liste
   oben hineinziehen (die README selbst braucht es dort nicht). Unten
   **Commit changes**.
5. **Settings → Pages** öffnen. Als **Source** „Deploy from a branch“ wählen,
   Branch `main` und Ordner `/ (root)`, dann **Save**.
6. Nach ein bis zwei Minuten steht oben die Adresse, meist
   `https://DEIN-USERNAME.github.io/mangalounge/`.

GitHub Pages liefert die Seite über HTTPS aus. Das braucht die App, damit der
Service Worker startet.

## 2. Auf dem iPhone einrichten

1. Die Adresse aus Schritt 1 in **Safari** öffnen. Wichtig: Safari, nicht
   Chrome. Nur Safari kann Webseiten zu echten Home-Bildschirm-Apps machen.
2. Auf das Teilen-Symbol tippen (Quadrat mit Pfeil nach oben).
3. **Zum Home-Bildschirm** wählen, Namen bestätigen, **Hinzufügen**.
4. Das Icon liegt jetzt auf dem Home-Bildschirm und startet ohne Adressleiste,
   im Dark Mode deines iPhones, mit eigenem App-Icon.

Tipp: Ein langer Druck auf das App-Icon zeigt die Verknüpfungen
**Weiterlesen**, **Neueste** und **Suche**, die direkt an der richtigen Stelle
starten.

## 3. MangaDex-Reader aktivieren

Der eingebaute Reader holt seine Bilder von der MangaDex-API, und die lässt
sich aus dem Browser heraus nicht direkt aufrufen (CORS). Dafür liegt
`mangadex-proxy.js` bei, ein kleiner Cloudflare Worker, der die Anfragen
weiterleitet.

Für dich ist das schon erledigt: In `config.js` ist bereits eine Worker-Adresse
eingetragen, der Reader läuft also ohne weitere Schritte. Nur wenn du einen
eigenen Worker betreiben willst:

1. Bei Cloudflare Workers einen neuen Worker anlegen.
2. Den Inhalt von `mangadex-proxy.js` hineinkopieren und deployen.
3. Die Worker-Adresse in `config.js` eintragen:
   `window.MANGADEX_PROXY_URL = "https://DEIN-WORKER.workers.dev";`
4. `index.html`, `config.js` und `sw.js` zusammen hochladen.

Der externe MangaDex-Link auf der Detailseite bleibt immer als Ausweg
verfügbar.

## Updates einspielen

Wenn du eine aktualisierte `index.html` bekommst, tauschst du sie im Repo aus
(über das Stift-Icon „bearbeiten“ oder einfach neu hochladen) und machst einen
**Commit**. Danach zählst du die Versionsnummer hoch, damit der Service Worker
die alte Kopie wegwirft:

1. In `sw.js` die Zeile
   `var CACHE_NAME = "mangalounge-cache-v81";` auf `v60`, `v61`, … ändern.
2. In `index.html` ganz unten dieselbe Nummer in
   `navigator.serviceWorker.register("sw.js?v=81")` anpassen.

**Beide Nummern gehören zusammen.** Aktuell sind beide auf **v81**. Bleibt eine
der beiden stehen, liefert der Service Worker weiter die alte Version aus,
selbst wenn die neue Datei schon online ist.

Zum Schluss die App auf dem iPhone einmal komplett schließen (im App-Umschalter
nach oben wischen) und neu öffnen.

## Wo deine Daten liegen

Alle Mangas, Einstellungen und die Lesehistorie liegen im `localStorage` deines
iPhones, nicht in den Dateien im Repo. Ein Update der `index.html` löscht
deshalb nichts, und du kannst die App jederzeit auf einen anderen Webspace
umziehen, ohne dass Daten verloren gehen.

Zwei Dinge folgen daraus:

- Die Daten hängen an der Adresse. Auf einer neuen URL fängst du leer an,
  vorher also exportieren und dort importieren.
- Werden die Safari-Websitedaten gelöscht oder das iPhone zurückgesetzt, ist
  alles weg. Deshalb im Backup-Bereich der Einstellungen regelmäßig
  **Exportieren** und die JSON-Datei in „Dateien“ ablegen.

## Der Reader

Der Reader lässt sich komplett auf dich einstellen. Jeder Punkt ist einzeln an-
und abschaltbar, entweder in den Einstellungen in der Gruppe **Reader** oder
direkt beim Lesen über das Zahnrad in der oberen Leiste. Beide Stellen greifen
auf dieselben Werte zu.

- **Blättern:** Scroll oder Einzelseite, dazu Seitenbreite und Abstand.
- **Bedienung:** Wischen blättert, Tipp-Zonen links und rechts blättern, ein
  Doppeltipp vergrößert die Seite (im Einzelseiten-Modus).
- **Leiste automatisch ausblenden:** Beim Lesen verschwindet die Leiste, ein
  kleiner Griff oben holt sie zurück.
- **Anzeige:** eigener Helligkeitsregler für den Reader, dazu die Bildqualität
  nach Wahl (Original, datensparend oder automatisch je nach Verbindung).
- **Nahtlos weiterlesen:** Das nächste Kapitel wird schon beim Lesen vorbereitet.
  Am Kapitelende blendet der Reader ohne Ladepause um und springt an den Anfang
  des neuen Kapitels. Hochscrollen bricht ab. Für dieses Vorladen lädt die App
  das folgende Kapitel im Hintergrund – bei knappem Datentarif lohnt es sich,
  den Schalter auszuschalten.
- **Als gelesen markieren:** am Kapitelende, ab 80 Prozent oder nur von Hand.
- **Extras:** Bildschirm bleibt an, Sleep-Timer und Tastatursteuerung (Pfeile,
  Leertaste, Esc).
- **Offline:** Kapitel lassen sich speichern. Die Verwaltung zeigt alle
  gespeicherten Kapitel mit Seitenzahl und Größe und erlaubt gezieltes Löschen.
  Offline zuerst aus dem Cache lässt gespeicherte Kapitel auch im Flugmodus
  laden.

Der Lesestand wird pro Titel als Kapitel **und** Seite gemerkt, damit
„Weiterlesen“ wirklich an der richtigen Stelle landet.

## MangaDex-Suche und Downloads

Der **API-Katalog** ist ein reines MangaDex-Suchsystem im Stil der offiziellen
Seite. Unter der Suchleiste sitzt ein Knopf **Filters**, der ein dunkles Panel
(`#advancedFilters`) mit diesen Werten öffnet:

| Feld | Optionen |
| --- | --- |
| Sort by | None (Standard), Relelevance, Latest Chapter, Followed Count, Publication Year |
| Content Rating | Any, Safe, Suggestive, Erotica |
| Magazine Demographic | Any, Shounen, Shoujo, Seinen, Josei |
| Original languages | All languages, Japanese (ja), Korean (ko), Chinese (zh) |
| Publication Status | Any, Ongoing, Completed, Hiatus, Cancelled |
| Has translated chapters | Checkbox + Sprach-Dropdown (de / en) |

Unten rechts liegen **Reset filters** und **I'm feeling lucky**. Der Query-Builder
setzt die Werte 1:1 in die offiziellen MangaDex-Parameter um
(`order[...]`, `contentRating[]`, `publicationDemographic[]`, `originalLanguage[]`,
`status[]`, `availableTranslatedLanguage[]`).

**Entdecken-Modus.** Ist das Suchfeld beim Öffnen des Katalogs leer, läuft
automatisch eine Abfrage nach den meistgefolgten Mangas
(`order[followedCount]=desc`). Diese werden als **Cover-Gitter** gezeigt, bis der
Nutzer selbst einen Begriff eintippt. Kapitellisten werden dabei **erst bei Klick**
auf einen Titel nachgeladen.

**API-Client-Authentifizierung.** Unter **Einstellungen → MangaDex** stehen
**MangaDex Client ID**, **Client Secret**, **Username** und **Password** (werden
lokal gespeichert). Vor jeder Suche oder Kapitel-Abfrage wird geprüft, ob ein
gültiger `access_token` vorliegt; nicht oder abgelaufen, wird per POST an
`auth.mangadex.org/.../token` mit `grant_type=password` ein neuer Token geholt,
gecacht und als `Authorization: Bearer <token>` mitgeschickt. Fehlt ein Wert,
läuft die Suche unauthentifiziert im Gast-Modus. Der Knopf **Anmelden** startet sofort
einen Verbindungstest gegen `/auth/check` und zeigt „Prüfe Verbindung …“, dann
grün „Anmeldung erfolgreich! Verbindung steht.“ bzw. rot die Fehlermeldung.

**AniList-Bildintegration.** MangaDex ist Ratelimits ausgesetzt; die hochauflösenden
Cover kommen daher primär von **AniList**. Über die MangaDex→AniList-ID-Zuordnung
(wird aus der Beziehung gelesen) wird `coverImage.extraLarge || large` geholt und
ersetzt das Cover – im Gitter, in der Liste und auf dem Ergebnisobjekt. Liefert
AniList nichts, bleibt das originale MangaDex-Cover bestehen. **Übernehmen** legt
den Titel mit dem Cover direkt in die Bibliothek; das Cover wandert komprimiert in
die IndexedDB.

**Alles über den Worker.** Fremde Hosts erlauben kein CORS. Suche, Kapitellisten
und Bilder laufen daher durch den Cloudflare-Worker (`config.js`): die Ziel-URL
wird angehängt, der Worker holt sie und setzt die CORS-Kopfzeilen. MangaDex nutzt
weiter seine `/manga`-Routen.

**MangaDex-Bilder gezielt proxyt.** MangaDex blockiert direktes Hotlinking. Jede
Lese-Seiten-URL (Reader und Download-Center) wird daher erzwungen durch
`proxyTargetUrl()` geleitet – auch im Download-Pool. Der Proxy ist idempotent,
schon gejagte URLs bleiben unverändert.

**Download-Center.** Das Symbol rechts in der Kopfzeile trägt eine kleine Zahl
mit den gerade laufenden Downloads. Ein Tipp öffnet das Download-Center mit allen
laufenden und fertigen Kapiteln, der belegten Gesamtgröße und einem Knopf
**Alle löschen**. Der Ring des runden Knopfes füllt sich synchron zum
Ladefortschritt; danach erscheint ein Haken. Bilder werden mit zehn parallelen
Verbindungen geholt.

**Wie gespeichert wird.** Kapitelbilder liegen als Binärdaten (Blobs) in der
IndexedDB (`mangalounge-downloads`), geschlüsselt nach Kapitel-ID, die Metadaten
unter `chapters`. Das ist deutlich geräumiger als der Text-Speicher und hält den
`localStorage` frei.

**Offline-Umschaltung.** Der Reader prüft vor jedem Kapitel, ob es als Download
vorliegt – unabhängig davon, von welchem Dienst es stammt. Ist die App offline
oder ist in den Reader-Einstellungen *Offline zuerst aus dem Cache* an, kommt das
Kapitel ohne Netzwerkabruf direkt aus der IndexedDB. Objekt-URLs werden beim
Kapitelwechsel und beim Schließen wieder freigegeben. Im Detail-Blatt und unter
**Einstellungen → Daten → Downloads** stehen die belegte Größe und
**Alle Downloads löschen**.

## Markieren und Kopieren

Auf dem Handy markiert langes Drücken standardmäßig keinen Text, kopiert nichts
und öffnet kein Bild-Menü. Das stört beim Lesen mehr, als es hilft. Wenn du doch
mal Text aus einer Beschreibung oder einem Link mitnehmen willst, schaltest du
unter **Einstellungen → Bedienung** (oder im Reader-Zahnrad) *Text markieren
erlauben* ein. Eingabefelder wie Notizen oder die Suche lassen sich immer ganz
normal bearbeiten. Bilder bleiben in jedem Fall gesperrt.

## Glas und Tiefe

Glas sitzt nur dort, wo etwas über dem Inhalt schwebt: Kopfzeile, Sheets,
Aufklapp-Menüs, der Plus-Knopf, Hinweisblasen und die runden Knöpfe auf Covern
und im Reader. Im Inhalt selbst – Listenzeilen, Karten, Cover – steht bewusst
kein Glas; dort trennt Farbe und Abstand, nicht Transparenz. Sonst verliert die
Oberfläche ihre Richtung.

Das Material besteht aus vier Teilen: einer Weichzeichnung, einer Anhebung der
Sättigung, einer halbdurchlässigen Füllung und einer hellen Lichtkante an der
Oberkante. Wo Inhalt unter eine Leiste taucht, blendet die App zusätzlich einen
weichen Rand ein – der Text läuft nicht mehr hart an der Kante ab, sondern löst
sich in der Unschärfe auf. Dieser Rand erscheint erst, wenn wirklich gescrollt
wird, und ist oben stehengeblieben nicht zu sehen.

Unter **Einstellungen → Darstellung → Glas-Effekt** stehen drei Stufen:

- **Aus** – alles deckend, ohne Weichzeichnen.
- **Subtil** (Standard) – 24 px Unschärfe, klar als Glas erkennbar.
- **Stark** – 42 px Unschärfe und deutlich mehr Durchsicht.

## Fenster ziehen

Jedes Fenster – die Einstellungen, ein Detail, das Aktionsmenü, der Reader-Zahnrad
und alle übrigen – lässt sich wie in iOS am oberen Griff nach unten ziehen und
damit schließen. Der Griff ist dabei größer als der sichtbare Balken, damit der
Finger ihn gut trifft.

Wichtig ist das Verhalten am Anfang: Steht der Inhalt noch nicht ganz oben,
scrollt das Ziehen zuerst. Erst wenn du oben angekommen bist, wird aus derselben
Bewegung das Schließen – du musst also nicht loslassen und neu ansetzen. Nach
oben oder zur Seite gezogen passiert nichts, dann bleibt normales Scrollen und
Wischen erhalten.

Losgelassen entscheidet die App anhand von zwei Dingen: Weit genug gezogen
(mehr als ein Viertel der Fensterhöhe) **oder** kurz, aber schnell nach unten
geschnippt. Sonst federt das Fenster zurück. Während des Zugs dunkelt der
Hintergrund langsam ab, so wie man es vom System kennt. Auf dem Rechner geht das
auch mit der Maus – außer *Text markieren erlauben* ist eingeschaltet, dann
bleibt das Auswählen wichtiger.

## Lesbarkeit und Systemeinstellungen

Die Textfarben sind gegen Apples Richtlinien geprüft: kleine Hinweise und
Feldbeschriftungen liegen jetzt bei mindestens 4,5:1 Kontrast, hell wie dunkel.
Die Akzentfarbe hat zwei Aufgaben: `--accent` füllt Flächen (Chips, „Fertig“,
Plus-Button), aus `--accent-text` kommen Text und Symbole. Aus jeder der sechs
Paletten – und aus *Eigene Farbe* – rechnet die App beim Start eine Textvariante
mit mindestens 4,6:1 heraus und wählt dazu die besser passende Schriftfarbe auf
den gefüllten Flächen. So bleibt zum Beispiel iOS-Blau lesbar, ohne die
Flächenfarbe zu verändern.

Die beiden Bedienungshilfen des Systems werden beachtet:

- **Transparenz reduzieren** – alle Glas-Flächen (Kopfzeile, Sheets, Hinweis-
  blasen, runde Knöpfe auf dem Cover) werden deckend, der weiche Scroll-Rand
  verschwindet.
- **Kontrast erhöhen** – Trennlinien und Kartenränder werden kräftiger.

Am Desktop und am Tablet zeigen Knöpfe, Felder und Links außerdem einen
sichtbaren Tastaturfokus-Ring. Beim Tippen auf dem iPhone erscheint keiner.

## Gerätespeicher

Cover liegen als Text im `localStorage`, der auf dem iPhone knapp ist. Unter
**Einstellungen → Gerätespeicher** zeigt ein Balken, wohin der Platz geht:
App-Daten, ausgelagerte Cover, heruntergeladene Kapitel und Offline-Kapitel,
jeweils mit Größe und Anzahl.

Große Cover wandern **von selbst** in eine geräumigere lokale Ablage
(IndexedDB), sobald sie zu groß werden oder der Text-Speicher voll läuft – so
kommt er nicht ins Straucheln. Den Automatismus schaltest du dort mit einem
Schalter ab; „Alle Cover auslagern“ und „Cover zurückholen“ erledigen das
Ganze auf einmal. Ein Backup (JSON) enthält die Cover weiterhin vollständig,
egal ob sie gerade im Text- oder im Cover-Speicher liegen.

## Bekannte Einschränkungen

- Beim allerersten Start braucht die App kurz Internet (Schriftart und Icons).
  Danach startet sie auch im Flugmodus.
- Die automatische Cover-Suche über AniList ist noch nicht eingebaut.
  Auf GitHub Pages wäre sie technisch möglich, das ist aber ein eigenes
  Stück Code.
- Der **API-Katalog** ist ein reines MangaDex-Suchsystem mit Filter-UI. Die Filter
  werden in `buildMangaDexQuery()` in offizielle URL-Parameter übersetzt. Nutzt
  MangaDex seine API-Parameter, ist das eine Zeile.
- Der **Worker muss neu deployt** werden, damit der generische `?url=`-Proxy
  greift. Ohne das liefert er nur die MangaDex-Anfragen aus.
- **Client-ID, Secret, Username und Password** liegen im localStorage des Browsers
  und sind damit grundsätzlich auslesbar. Der Password-Grant ist so wie von
  MangaDex vorgesehen, aber in einer reinen Client-App kein echter Geheimschutz.
- MangaDex-Lese-Seiten laufen nur durch den Proxy. Fehlt der Worker oder blockiert
  er die Bildserver, bleibt der Reader auf den betroffenen Seiten leer.
- Fremde Bild-CDN verlangen teils einen Referer. Der Worker setzt einen, das
  deckt die gängigen Fälle ab, ist aber keine Garantie.
