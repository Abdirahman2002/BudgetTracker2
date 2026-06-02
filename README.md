# Projektdokumentation - [BudgetTracker]

## Inhaltsverzeichnis

1. [Ausgangslage](#1-ausgangslage)
2. [Lösungsidee](#2-lösungsidee)
3. [Vorgehen & Artefakte](#3-vorgehen--artefakte)
    1. [Understand & Define](#31-understand--define)
    2. [Sketch](#32-sketch)
    3. [Decide](#33-decide)
    4. [Prototype](#34-prototype)
    5. [Validate](#35-validate)
4. [Erweiterungen [Optional]](#4-erweiterungen-optional)
5. [Projektorganisation [Optional]](#5-projektorganisation-optional)
6. [KI-Deklaration](#6-ki-deklaration)
7. [Anhang [Optional]](#7-anhang-optional)

> **Hinweis:** Massgeblich sind die im **Unterricht** und auf **Moodle** kommunizierten Anforderungen.

<!-- WICHTIG: DIE KAPITELSTRUKTUR DARF NICHT VERÄNDERT WERDEN! -->

<!-- Diese Vorlage ist für eine README.md im Repository gedacht. Abschnitte mit [Optional] können weggelassen werden, wenn in den Übungen nichts anderes verlangt wird. -->

## 1. Ausgangslage
Kurz beschreiben, welches Problem adressiert wird und welches Ergebnis angestrebt ist. Wem nützt die Lösung, wer ist beteiligt oder betroffen?
- **Problem:** 
Schweizer Studierende leben mit knappem Monatsbudget aus BAföG, Nebenjob oder Elternunterhalt. Sie verlieren über den Monat den Überblick über viele Kleinstausgaben (Kaffee, ÖV-Ticket, Lebensmittel) und stehen am Monatsende oft unerwartet im Minus. Bestehende Lösungen helfen nur eingeschränkt: BudgetCH ist gestalterisch veraltet und wirkt für junge Nutzer nicht ansprechend, YNAB ist mit USD 109/Jahr zu teuer und für Einsteiger zu komplex, internationale Apps wie Money Manager bringen keine CH-Spezifika (Krankenkasse, ÖV, TWINT) mit. Die Folge: nach wenigen Tagen lässt die Motivation nach und die App wird wieder gelöscht.

- **Ziele:**
  - Schnelle, niederschwellige Erfassung von Ausgaben (max. 4 Felder pro Transaktion)
  - Klare visuelle Monatsübersicht mit Total und Verteilung pro Kategorie
  - Schweizer Alltagsbezug: CHF, vordefinierte Kategorien wie Lebensmittel, ÖV, Krankenkasse, Miete
  - Bewusst schlanker Funktionsumfang — wenige Funktionen, konsequent gut umgesetzt
  - Komplett kostenlos, kein Abo, kein Login

- **Primäre Zielgruppe:** Studierende in der Schweiz (ca. 18–28 Jahre) mit begrenztem Monatseinkommen, geringer Erfahrung in Budgetplanung und dem Wunsch nach einer einfachen, modernen App. Sie nutzen primär das Smartphone und erfassen Ausgaben unterwegs — direkt nach dem Einkauf oder nach dem Lösen eines ÖV-Tickets.

- **Weitere Stakeholder [Optional]:** Mitfinanzierende Bezugspersonen (z. B. Eltern), die ein Interesse daran haben, dass das Budget eingehalten wird; Studienberatungsstellen, die solche Tools weiterempfehlen können.
 


## 2. Lösungsidee
Beschreibt die Lösungsidee.
Eine schlanke Web-App, die Studierenden den Überblick über ihre monatlichen Ausgaben gibt — ohne Bankanbindung, ohne Bezahlschranke, ohne überfrachtete Funktionen. Im Zentrum stehen drei Bildschirme (Monatsübersicht, Ausgabe erfassen, Verlauf), ergänzt durch eine Verwaltung der Kategorien.

- **Kernfunktionalität:**
  - **Ausgabe erfassen** (Workflow 1 — Happy Path): Betrag → Kategorie wählen → Datum (vorausgefüllt auf heute) → optionale Notiz → Speichern. Eingabe in unter 15 Sekunden.
  - **Monatsübersicht** als Startseite: Gesamtbetrag des ausgewählten Monats, Verteilung pro Kategorie mit Farb-Indikator und Prozentanteil; Monatsauswahl per Dropdown.
  - **History** (Workflow 2): chronologische Liste aller Transaktionen, nach Monat gruppiert, filterbar nach Kategorie, einzelne Einträge löschbar.
  - **Kategorien verwalten** (Workflow 3): vordefinierte Schweizer Standardkategorien (Lebensmittel, ÖV, Freizeit, Krankenkasse, Miete) plus eigene Kategorien mit Icon und Farbe hinzufügen oder löschen.
  - **Persistenz:** alle Daten in einer MongoDB-Datenbank — kein `localStorage`, sodass die App auch konzeptionell als ernsthafte Anwendung trägt.

- **Annahmen [Optional]:**
  - Studierende sind bereit, Ausgaben manuell zu erfassen, wenn die Eingabe wirklich schnell geht (max. 15 Sek.).
  - 5–8 Standardkategorien werden besser genutzt als 30+ (zentrale Erkenntnis aus der Recherche).
  - Visuelles Feedback (Farben pro Kategorie, prozentuale Anteile) erhöht die Motivation am Dranbleiben.
  - Eine fehlende Bankanbindung ist für die Zielgruppe akzeptabel, da sie in der Schweiz ohnehin nicht standardisiert verfügbar ist.

- **Abgrenzung [Optional]:**
  - Keine Bank-/PSD2-Anbindung, kein Belegscan / OCR, kein TWINT-Import
  - Kein Multi-User, kein Login, keine Synchronisation über mehrere Geräte
  - Keine Erfassung von Einnahmen — Fokus rein auf Ausgaben
  - Keine Investment-, Sparziel- oder Schuldenmanagement-Funktionen
  - Keine Push-Notifications oder E-Mail-Reports
  - Konzeptionell mobile-first, das aktuelle Layout ist desktop-orientiert ausgebaut

## 3. Vorgehen & Artefakte
Die Durchführung erfolgt phasenbasiert; dokumentieren Sie die wichtigsten Ergebnisse je Phase.

### 3.1 Understand & Define
- **Zielgruppenverständnis:** Die Problemraumanalyse hat vier sich überlappende Felder identifiziert: *Finanzen & Alltag*, *Studierendenleben*, *Digitalisierung* und *Eigenverantwortung*. Im Schnitt dieser Felder lebt die Persona der App. Sie wurde entlang vier Dimensionen ausgearbeitet:

  | Dimension | Beschreibung |
  |---|---|
  | **Nutzer** | Studierende mit begrenztem Monatseinkommen aus BAföG, Nebenjob oder Elternunterhalt |
  | **Bedürfnisse** | Überblick über Ausgaben behalten, Monatsziel nicht überschreiten, Sparen ohne grossen Aufwand |
  | **Kontext** | Unregelmässige Einnahmen, viele Kleinstausgaben (Kaffee, ÖV, Lebensmittel), wenig Erfahrung mit Budgetplanung |
  | **Herausforderungen** | Kein Überblick am Monatsende, bestehende Apps zu komplex oder kostenpflichtig, fehlende Motivation nach wenigen Tagen |

  Die Konkurrenzanalyse im Schweizer App Store hat vier relevante Lösungen verglichen — BudgetCH (CH, kostenlos, aber gestalterisch veraltet), YNAB (international, USD 109/Jahr, sehr komplex), Money Manager (international, Freemium, nicht CH-spezifisch) und Expense Tracker Genius (international, iOS-only, viele Features). Die **identifizierte Marktlücke**: keine kostenlose, einfache App mit modernem Design und CH-spezifischen Kategorien (Krankenkasse, ÖV, TWINT) speziell für Studierende.

  Die Recherche wurde mit drei *How-Might-We*-Fragen verdichtet, die als Brücke vom Problem zur Lösung dienen:
  - Wie könnten wir Studierenden helfen, ihre monatlichen Ausgaben schnell und mühelos zu erfassen, damit sie jederzeit wissen, wie viel Budget noch übrig ist?
  - Wie könnten wir Budgetziele so visualisieren, dass Studierende frühzeitig erkennen, wenn sie eine Kategorie zu stark belasten?
  - Wie könnten wir die Motivation zur Finanzkontrolle aufrechterhalten, ohne dass die App sich wie Arbeit anfühlt?

- **Wesentliche Erkenntnisse:**
  - **Designlücke im CH-Markt:** Die einzige CH-spezifische App (BudgetCH) wirkt veraltet — junge Nutzer haben kein attraktives Angebot.
  - **Fehlendes kostenloses Einstiegsmodell:** Bestehende Lösungen sind entweder zu teuer (YNAB) oder zu komplex (Money Manager) — eine niederschwellige Alternative fehlt.
  - **Manuelle Erfassung als Standard:** In der Schweiz ist eine automatische Bankverbindung praktisch nicht möglich (Quelle: thepoorswiss.com). Die manuelle Eingabe muss daher so schmerzfrei wie möglich gestaltet werden.
  - **CH-typische Fixkosten als Pflicht:** Miete, Krankenkasse und ÖV müssen als Standardkategorien vorhanden sein (Quelle: BudgetHub CH).
  - **Visualisierung erhöht Motivation:** Fortschrittsbalken und Diagramme pro Kategorie erhöhen nachweislich die Nutzungsdauer (Quelle: Expense Tracker Genius).
  - **Weniger ist mehr:** 5–8 Standardkategorien werden besser genutzt als 30+; eine App, die drei Dinge gut macht, wird mehr genutzt als eine mit Funktionsfülle.

  Diese Erkenntnisse verdichten sich zu drei Leitprinzipien für die Lösung: **schlank**, **schweizerisch**, **schnell**.

### 3.2 Sketch
- **Variantenüberblick:** Im Rahmen der Ideenfindung wurden mit der **Crazy-8's-Methode** acht alternative Skizzen pro Bildschirm bzw. Funktion in kurzer Zeit entworfen, anschliessend von Peers kommentiert und gegeneinander abgewogen. Ziel war es, möglichst breit zu denken und nicht vorschnell auf die erste Idee zu setzen. Die acht Varianten unterscheiden sich darin, **was zuerst sichtbar ist** (Total, Kategorien, Trend, Status) und **wie Erfolg visualisiert wird** (Zahlen, Balken, Häkchen).

  | # | Skizze | Idee in einem Satz | Kernfeedback |
  |---|---|---|---|
  | 1 | Budget-Tracker Übersicht | Kategorien als Kacheln, Total oben | Fortschrittsbalken pro Kategorie wären sinnvoll |
  | 2 | Ausgabe erfassen | Klassisches Formular mit Betrag, Kategorie, Kommentar | Datum vorausfüllen, Speichern-Button prominenter |
  | 3 | Monatsübersicht | Balkendiagramm pro Kategorie + Total | Gesamtsumme oben gross anzeigen — sonst überzeugend |
  | 4 | Essen Detailansicht | Drilldown in eine Kategorie mit Einzelausgaben | Gesamtsumme der Kategorie oben wäre hilfreich |
  | 5 | Deine Ausgaben im Blick | Top-Liste mit Beträgen pro Kategorie | Balken statt nur Zahlen wäre intuitiver |
  | 6 | Historia | Liste vergangener Monate als Trendüberblick | Filter nach Kategorie wäre eine sinnvolle Ergänzung |
  | 7 | Budget pro Monat | "Ziel erreicht / nicht erreicht" pro Monat | Differenz farbig hervorheben wäre wirkungsvoller |
  | 8 | Monatsstatus | Häkchen/Kreuze pro Monat als Status-Liste | Besten Monat farblich auszeichnen wäre motivierend |

- **Skizzen:**
![Crazy 8's Sketches](/img/Crazy8.png)
![Ausarbeitung von Sketch 3](/img/AusarbeitungCrazy8.png)

### 3.3 Decide
- **Gewählte Variante & Begründung:** Ausgewählt wurde **Skizze 3 — Monatsübersicht** mit Balkendiagramm pro Kategorie und Total. Sie ist das Herzstück der App, weil sie die wichtigste Frage des Nutzers in einem Blick beantwortet: *Wohin ist mein Geld geflossen?* Das Balkendiagramm macht Ausgabenmuster sofort sichtbar, ohne dass Zahlen verglichen werden müssen. Das Peer-Feedback wurde direkt eingearbeitet — die Gesamtsumme erscheint nun gross über dem Diagramm, die Kombination aus Zahlen und Balken bleibt erhalten.

  Auf dieser Entscheidung aufbauend wurden in Übung 10 weitere Designentscheide getroffen, die den Prototyp prägen:
  - **Mobile vs. Desktop:** Konzipiert als mobile Web-App, weil Studierende Ausgaben unterwegs erfassen — direkt nach dem Einkauf oder nach dem ÖV-Ticket. (Im umgesetzten Prototyp wurde das Layout zusätzlich auf Desktop ausgebaut.)
  - **Navigation:** Fixe Bottom-Navigation mit vier Punkten — Overview, Add, History, Categories. Auf Mobile intuitiv, immer sichtbar, kein Zurücknavigieren nötig.
  - **Hauptseite:** Die Monatsübersicht ist die Startseite, weil sie die wichtigste Frage sofort beantwortet.
  - **Erfassungsformular:** Bewusst kurz — Betrag, Kategorie, Datum, optionale Notiz. Mehr nicht. Das Datum ist auf heute vorausgefüllt, um die Eingabe zu minimieren.
  - **Kategorien:** Vordefinierte Schweizer Standardkategorien (Lebensmittel, ÖV, Freizeit, Krankenkasse, Miete) sind ab Start vorhanden und können ergänzt werden.

- **End-to-End-Ablauf:** Drei zentrale Workflows decken den Alltag der Zielgruppe ab.

  - **Workflow 1 — Ausgabe erfassen (Happy Path):**
    Nutzer öffnet App → landet auf Monatsübersicht → tippt auf *Add* in der Navigation → gibt Betrag ein → wählt Kategorie → Datum ist bereits ausgefüllt → tippt auf *Speichern* → wird zurück zur Monatsübersicht geleitet → neue Ausgabe erscheint in der Liste.

  - **Workflow 2 — Ausgaben prüfen:**
    Nutzer öffnet App → sieht Monatsübersicht mit Gesamtbetrag und Kategorien → tippt auf *History* → sieht alle Transaktionen nach Monat gruppiert → scrollt durch vergangene Monate, optional filtert er nach Kategorie.

  - **Workflow 3 — Kategorien verwalten:**
    Nutzer tippt auf *Categories* → sieht alle Kategorien mit bisherigen Ausgaben → kann neue Kategorie mit *+* hinzufügen oder bestehende löschen.

  Diese drei Pfade kreuzen sich in der **Monatsübersicht** als Drehscheibe — alles führt zurück dorthin.

- **Mockup:** Statt eines digitalen Mockups (Figma o. ä.) wurde bewusst auf ein zweites Set **handgezeichneter Wireframes** gesetzt (Übung 10), eine Stufe detaillierter als die Crazy-8-Skizzen. Vier zentrale Screens wurden ausgearbeitet:

  - **Overview:** Monat per Pfeil wechselbar (im Prototyp später durch Dropdown ersetzt), Total in CHF gross zentriert, Balken pro Kategorie inkl. Budget-Markierung (rote Linie), Kategorienliste mit Icon und Mini-Bar.
  - **Add Transaction:** Betrag prominent, Kategorie-Grid mit 6 Buttons (3×2), Datum-Picker, Notiz-Feld, blauer *Speichern*-Button.
  - **History:** Transaktionen nach Monat gruppiert (April, März, Februar …), Filter-Icon oben rechts.
  - **Categories:** Liste aller Kategorien mit Total in CHF, FAB *+* zum Hinzufügen. 

![Overview](img/Overview.png)
![Add Transaction](img/AddTransaction.png)
![History](img/History.png)
![Categories](/img/Categories.png)

### 3.4 Prototype

#### 3.4.1. Entwurf (Design)
> **Hinweis:** Hier wird der **Prototyp** beschrieben, nicht das **Mockup**.

- **Informationsarchitektur:** Die App besteht aus **vier gleichrangigen Bildschirmen**, die über eine flache, jederzeit sichtbare Navigation erreichbar sind — keine Untermenüs, kein Drilldown, kein Breadcrumb. Die Logik dahinter: Studierende sollen aus jedem Zustand mit maximal einem Klick zur nächsten Aktion gelangen.

  | Bildschirm | Route | Zweck |
  |---|---|---|
  | **Overview** | `/` | Startseite — Total und Verteilung pro Kategorie für den ausgewählten Monat |
  | **Add** | `/add` | Erfassen einer neuen Transaktion |
  | **History** | `/history` | Chronologische Liste aller Transaktionen mit Lösch-Funktion |
  | **Categories** | `/categories` | Verwaltung (Anlegen, Löschen) der Kategorien |

  Im Header sitzt links das Logo („Budget Tracker — Deine Ausgaben im Blick") als Link zurück zur Overview, rechts die Navigationsleiste mit drei Buttons: *Add* (Primary-Blau, da Haupt-Aktion), *History* und *Categories* (Dark, sekundär). Die Monatsauswahl auf der Overview ist als Dropdown realisiert; sie schreibt einen URL-Parameter `?month=YYYY-MM`, sodass jeder Monat eine eigene teilbare URL hat und der Browser-Back-Button konsistent funktioniert.

- **User Interface Design:** Vier Screens decken den vollständigen Funktionsumfang ab:

  **Overview (`/`)** — Dropdown zur Monatswahl oben, gefolgt von einer zentrierten Card mit dem grossen Gesamtbetrag („Total Spending"), darunter eine Bootstrap-`list-group` mit allen Kategorien und ihrem jeweiligen Monats-Total als Badge. Die Liste ist nach Reihenfolge der Kategorien in der DB, der Fokus liegt auf dem Total als Einstiegs-Information.

  **Add (`/add`)** — „Back"-Button oben links für Rückkehr ohne Browser-Back-Button. Eine einzige Card enthält das gesamte Formular: Amount (number, step 0.01), Category (select), Date (date), Note (text, optional). Submit-Button als Primary mit Plus-Icon. Erfolg und Fehler werden als Bootstrap-Alert *im Seitenkopf* angezeigt — bewusst keine Modals/Toasts, da der gesamte Flow auf einer Seite bleibt.

  **History (`/history`)** — H1 mit Counter-Badge (z. B. „History 42") für sofortige Mengen-Information. Jede Zeile zeigt links Kategorie-Badge (Icon + Name) und darunter Datum + Note in kleinerer Schrift, rechts den Betrag (negativ formatiert mit Minus-Zeichen) und den Lösch-Button.

  **Categories (`/categories`)** — Bestehende Kategorien als Liste mit Delete-Button (mit Warnung, dass alle zugehörigen Transaktionen mitgelöscht werden), darunter Trennlinie und das Add-Form: Name und Icon (als Bootstrap-Icon-Klassenname, z. B. `apple`, `bag`, `train-front`), mit Verweis auf [icons.getbootstrap.com](https://icons.getbootstrap.com/).

- **Designentscheidungen:**
  - **Bootstrap 5.3 als Design-System** statt eigenem CSS — konsistente Look-and-Feel, schnelle Iteration, etablierte Mobile-First-Breakpoints. Die App muss als Schulprojekt nicht visuell einzigartig sein, sondern verlässlich funktionieren.
  - **Bootstrap Icons** für Kategorien (Icon-Name in der DB gespeichert) — über 1700 Icons abgedeckt, keine eigene Asset-Pipeline nötig.
  - **Farbliche Hierarchie nach Aktion:** Primary-Blau für Hauptaktionen (Add, Speichern), Dark für Navigation, Danger-Rot ausschliesslich für destruktive Aktionen (Löschen). Damit ist die Konsequenz jedes Buttons an seiner Farbe ablesbar.
  - **Deutsche Inhalte + englische Funktions-Labels** (Overview, Add, History, Categories). Englische Labels sind kurz und unter Studierenden bekannt; Hilfetexte und Fehlermeldungen sind deutsch (Zielgruppe Schweiz).
  - **CHF als feste Währung** — eigene `Money`-Komponente formatiert mit `toFixed(2)` und optionalem Minus-Präfix für History-Einträge. Keine Internationalisierung nötig.
  - **Native `confirm()`-Dialoge** für Lösch-Bestätigung statt Modal-Komponente. Bewusst minimal: kein zusätzlicher State, kein Modal-Backdrop, plattform-konsistente UX.
  - **Inline-Feedback statt Toasts:** Bootstrap-Alerts werden direkt über dem Formular eingeblendet (`form.success` / `form.error` aus SvelteKit-Server-Action). Damit bleibt der Nutzerfokus am selben Ort.
  - **Monat als URL-Parameter** (`?month=2026-05`) — bookmarkbar, share-bar, Browser-Back funktioniert natürlich.

#### 3.4.2. Umsetzung (Technik)

- **Technologie-Stack:**

  | Schicht | Technologie | Version | Begründung |
  |---|---|---|---|
  | Framework | SvelteKit | 2.57 | Full-Stack-Framework mit File-based Routing, Server Actions, Loader-Pattern |
  | UI-Library | Svelte | 5.55 | Runes-Syntax (`$props`, `$state`), reaktiv ohne Boilerplate |
  | Datenbank | MongoDB | Atlas (Cloud) | Dokumentbasiert, passt zum flexiblen Schema |
  | DB-Treiber | `mongodb` | 6.10 | Offizieller Node-Treiber, keine ORM-Schicht (kein Mongoose) |
  | Build-Tool | Vite | 8.0 | Wird automatisch von SvelteKit konfiguriert |
  | CSS-Framework | Bootstrap | 5.3.2 (CDN) | Schnelle, konsistente UI ohne eigene Design-Iterationen |
  | Icons | Bootstrap Icons | 1.13.1 (CDN) | 1700+ Icons, namensbasiert in DB referenziert |
  | Hosting | Netlify | — | Auto-Deploy aus Git, integrierter Serverless-Backend-Modus |
  | Adapter | `@sveltejs/adapter-netlify` | 6.0.4 | Verpackt SvelteKit-Server-Routes als Netlify Functions |

- **Tooling:**
  - **Editor:** Visual Studio Code mit der offiziellen *Svelte for VS Code*-Erweiterung (`.vscode/`-Ordner ist im Repo, enthält Workspace-Einstellungen).
  - **Versionierung:** Git mit GitHub als Remote, lokale Branches für grössere Änderungen, Merge in `main`.
  - **Package-Manager:** npm (festgelegt durch `.npmrc` und `package-lock.json`).
  - **Lokale Entwicklung:** `npm run dev` startet Vite-Dev-Server mit HMR. `.env`-Datei mit `DB_URI` ist über `.gitignore` ausgeschlossen.
  - **Type-Checking:** `jsconfig.json` mit `allowJs: true`, `checkJs: false` — bewusst keine TypeScript-Migration; JSDoc-Hinweise im Editor reichen für das Projekt.
  - **Browser-DevTools:** Svelte-DevTools-Extension für Komponenten-Inspektion.

- **Struktur & Komponenten:** Die Codebase folgt der SvelteKit-Konvention `src/routes/` für Routen und `src/lib/` für wiederverwendbaren Code.

  ```
  src/
  ├── app.html                          # HTML-Shell, lädt Bootstrap CDN
  ├── lib/
  │   ├── db.js                         # MongoDB-Connection + CRUD-Funktionen
  │   ├── index.js                      # $lib-Barrel (leer)
  │   ├── assets/favicon.svg
  │   └── components/
  │       ├── CategoryBadge.svelte      # Icon + Name (wiederverwendet)
  │       ├── Money.svelte              # CHF-Formatierung
  │       └── DeleteButton.svelte       # Form mit confirm()-Dialog
  └── routes/
      ├── +layout.svelte                # Header + Navigation
      ├── +page.svelte                  # Overview (UI)
      ├── +page.server.js               # Overview (load: Monat, Total, perCategory)
      ├── add/+page.svelte              # Add (UI)
      ├── add/+page.server.js           # Add (load: Kategorien; action: create)
      ├── history/+page.svelte          # History (UI)
      ├── history/+page.server.js       # History (load: alles; action: delete)
      ├── categories/+page.svelte       # Categories (UI)
      └── categories/+page.server.js    # Categories (load; actions: create, delete)
  ```

  **Wichtige Komponenten:**
  - `CategoryBadge.svelte` — rendert `<i class="bi bi-{icon}"></i>` plus den Kategorie-Namen. Fallback auf `tag`-Icon und „Unbekannt", wenn keine Kategorie übergeben wird (z. B. nach Löschen).
  - `Money.svelte` — formatiert eine Zahl als `12.50 CHF`, optional mit Minus-Präfix (`negative`-Prop für History).
  - `DeleteButton.svelte` — generischer Lösch-Button mit konfigurierbarem `action`-Endpoint und `confirmText`. Verwendet als POST-Form mit verstecktem `id`-Feld.

  **State Management:** Bewusst **kein eigener Store** (`writable`/`readable`). Alle Daten werden serverseitig in der `load`-Funktion geladen und über `$props()` (Svelte 5 Runes) an die Komponenten gereicht. Nach Form-Submit invalidiert SvelteKit die Seite automatisch und ruft `load` erneut auf — die UI ist nach jeder Aktion sofort aktuell, ohne dass Client-State synchronisiert werden muss.

- **Daten & Schnittstellen:** Die Datenhaltung erfolgt in einer **MongoDB-Atlas-Cluster-Instanz** mit zwei Collections:

  ```js
  // categories
  { _id: ObjectId, name: string, icon: string }

  // transactions
  { _id: ObjectId, amount: number, categoryId: string, date: string, note: string }
  ```

  Die Verbindung wird in `src/lib/db.js` einmalig beim Modul-Load mit Top-Level-`await` aufgebaut (`new MongoClient(DB_URI).connect()`). Der `DB_URI` kommt über `$env/static/private` aus den Environment Variables.

  **Zugriffsmuster:** Pro Route liegt eine `+page.server.js`-Datei. Diese exportiert zwei Dinge:
  - eine **`load`-Funktion**, die Daten aus der DB holt und als Object an die `+page.svelte` zurückgibt,
  - ein **`actions`-Object** mit Server-Actions (`create`, `delete`), die Form-Submissions verarbeiten.

  Damit gibt es **keine eigenen REST-API-Endpoints** — alle Mutationen laufen über SvelteKit-Form-Actions, was Validierung, Fehlerbehandlung und Progressive Enhancement vereinfacht.

  **Schreib-Operationen** in `db.js`:
  - `createCategory({ name, icon })` → `insertOne`
  - `createTransaction({ amount, categoryId, date, note })` → `insertOne`
  - `deleteCategory(id)` → **kaskadierend**: löscht erst alle `transactions` mit dieser `categoryId`, dann die Kategorie
  - `deleteTransaction(id)` → `deleteOne`

  **Lese-Operationen** geben Arrays zurück, in denen `_id` jeweils in einen String konvertiert wird, damit SvelteKit beim Serialisieren zwischen Server und Client keine Probleme mit `ObjectId`-Instanzen hat.

  **Monatsfilterung** erfolgt aktuell **client-seitig im Server-Load** (`transactions.filter(tx => tx.date.startsWith(month))`). Das ist für die Prototyp-Datenmenge unkritisch; bei höheren Datenmengen wäre eine MongoDB-Aggregation effizienter (siehe „Besondere Entscheidungen").

  **Validierung** geschieht ausschliesslich serverseitig in den Form-Actions (`if (!amount || amount <= 0) return { error: ... }`). HTML-`required`-Attribute geben Browser-seitiges Vor-Feedback, die Wahrheit liegt aber im Server.

- **Deployment:**
  - **URL:** https://budgettrackerforschool.netlify.app

- **Besondere Entscheidungen / Trade-offs:**
  - **Keine Authentifizierung in V1.** Alle Tester teilen sich dieselbe DB. Das hält den Prototyp einfach und erlaubt Off-Site-Tester ohne Account; Multi-User-Login ist als Erweiterungs-Kandidat in Kap. 4 dokumentiert.
  - **Bootstrap via CDN statt npm-Bundle.** Spart Build-Zeit und Setup, koppelt die App jedoch an die Verfügbarkeit von `cdn.jsdelivr.net`. Für ein Schulprojekt ein akzeptables Risiko.
  - **Client-seitiger Monatsfilter im Server-Load.** Aktuell werden bei jedem Overview-Aufruf alle Transaktionen geladen und in JavaScript gefiltert. Funktional bis ca. 1000 Einträge tadellos, danach würde eine `find({ date: { $regex: ^YYYY-MM } })`- oder Aggregation-Pipeline-Lösung skalieren. Bewusste Vereinfachung im Prototyp-Stadium.
  - **`ObjectId` → String an der Modul-Grenze.** Vereinheitlicht den Datentyp im UI und vermeidet Serialisierungs-Probleme. Nachteil: Bei jeder Schreib-Aktion muss wieder `new ObjectId(id)` gebaut werden.
  - **Kaskadierendes Löschen ohne Bestätigungs-Detail.** Das Löschen einer Kategorie entfernt alle Transaktionen dieser Kategorie. Der Confirm-Dialog warnt davor, aber zeigt nicht die Anzahl. Im Test wurde das nicht als Problem wahrgenommen.
  - **Keine Edit-Funktion.** Bewusste Reduktion auf Create/Read/Delete im Prototyp. Im Usability-Test (Kap. 3.5) wurde diese Lücke als grösster Schmerzpunkt identifiziert und ist erste Quick-Win-Verbesserung.
  - **Top-Level-`await` in `db.js`.** Funktioniert dank ESM + Node 20+. Vereinfacht den Setup, könnte bei Cold-Starts der Netlify-Function aber theoretisch zu Latenz-Spitzen führen — bisher kein beobachtetes Problem.
  - **`adapter-netlify` mit `split: false`.** Alle Server-Routen laufen als **eine** Function statt pro Route eine eigene. Reduziert Cold-Starts auf einen einzigen Function-Container.

### 3.5 Validate

- **URL der getesteten Version:** https://budgettrackerforschool.netlify.app

- **Ziele der Prüfung:** Mit dem Usability-Test sollen drei Leitfragen beantwortet werden:
  1. Finden Studierende ohne Anleitung durch die vier Bildschirme (Overview / Add / History / Categories)?
  2. Lassen sich Alltagsaufgaben (Erfassen, Korrigieren, Auswerten) effizient lösen?
  3. Welche Funktionen fehlen oder wirken unfertig und sollen als Nächstes umgesetzt werden?

- **Vorgehen:** Drei moderierte Tests vor Ort mit Mitstudierenden nach der Think-Aloud-Methode inkl. Beobachtungsprotokoll, sowie zwei unmoderierte Remote-Tests mit Kollegen anhand eines schriftlichen Test-Hefts (als PDF zugestellt, vollständig im Anhang). Die App wurde unter https://budgettrackerforschool.netlify.app produktiv bereitgestellt, damit Off-Site-Tester ohne Installation teilnehmen konnten. Dauer pro Person ca. 10 Minuten. Erhoben wurden 8 standardisierte Aufgaben mit Bewertungsskala 1–7, ein SUS-Fragebogen (10 Items) sowie 8 offene Abschluss-Fragen.

- **Stichprobe:** Insgesamt 5 Testpersonen.

  | # | Rolle | Modus | Profil |
  |---|---|---|---|
  | T1 | Mitstudierender | on-Site | 23 J., Wirtschaftsinformatik |
  | T2 | Mitstudierende | on-Site | 22 J., BWL |
  | T3 | Mitstudierender | on-Site | 24 J., Informatik |
  | T4 | Kollege | off-Site (remote) | 28 J., IT-Support |
  | T5 | Kollegin | off-Site (remote) | 31 J., Buchhaltung |

- **Aufgaben/Szenarien:** Die 8 Aufgaben des Test-Hefts entsprechen typischen Alltagssituationen Schweizer Studierender:
  1. Eine Ausgabe erfassen (Mensa CHF 12.50)
  2. Mehrere Ausgaben hintereinander erfassen (ÖV-Ticket, Kaffee, Buch)
  3. Den aktuellen Monat verstehen (höchste Kategorie + Total)
  4. Einen anderen Monat anschauen (ÖV-Ausgaben letzter Monat)
  5. Einen Fehler korrigieren (doppelte Buchung löschen)
  6. Eine eigene Kategorie anlegen und darin erfassen
  7. Sind deine Daten sicher? (Reload-Test)
  8. Bonus: Ausgabe ohne Betrag zu speichern versuchen

  Für eine zweite Testrunde nach Umsetzung der Verbesserungen wären folgende zusätzliche Aufgaben sinnvoll: eine bereits erfasste Ausgabe nachträglich korrigieren (validiert die geplante Edit-Funktion), alle Ausgaben für „Lebensmittel" im letzten Monat finden (validiert Suche/Filter), ein monatliches Limit von CHF 200 für „Freizeit" setzen (validiert Budget-Limits), den ÖV-Abo (CHF 49) als wiederkehrende Ausgabe anlegen (validiert wiederkehrende Transaktionen) und Ausgaben in Mai mit April vergleichen (validiert Monatsvergleich).

- **Kennzahlen & Beobachtungen:** Erhoben wurden Erfolgsquote pro Aufgabe (Skala ≥ 5/7 = erfolgreich), der durchschnittliche SUS-Score, die Bearbeitungsdauer on-site sowie qualitative Findings aus den Kommentar- und Verbesserungsvorschlag-Feldern. Wiederkehrende Beobachtungen über alle Tester: Die Datums-Eingabe wird als zu umständlich empfunden (Wunsch: „Heute"-Button), die reine Zahlen-Übersicht wirkt unübersichtlich (Wunsch: Grafik), die History ist ohne Filter bei vielen Einträgen mühsam, der Bootstrap-Icon-Klassenname für Kategorien ist nicht selbsterklärend, eine Edit-Funktion fehlt komplett, und wiederkehrende Fixkosten manuell zu erfassen empfinden mehrere als unnötigen Aufwand.

- **Zusammenfassung der Resultate:** Die App löst die Kern-Use-Cases (Erfassen, Löschen, einfache Monatsübersicht) zuverlässig; Hauptkritik konzentriert sich auf drei Bereiche: fehlende Bearbeitungsmöglichkeit für bestehende Einträge, schwache Auswertung (keine Visualisierung, kein Vergleich, kein Filter) und unintuitive Kategorie-Anlage. Die schwächsten Aufgaben sind A4 (anderer Monat, Ø 4.2/7) und A6 (Kategorie anlegen, Ø 4.6/7) — beide bestätigen die priorisierten Verbesserungen.

  *Tabelle 1 — Bewertungen und Aussagen pro Aufgabe* (Skala 1 = sehr schwierig, 7 = sehr einfach)

  | Aufgabe | T1 | T2 | T3 | T4 | T5 | Ø |
  |---|---|---|---|---|---|---|
  | **A1** Ausgabe erfassen | 6 — *„Selbsterklärend, aber Heute-Button fehlt"* | 6 — *„Datum heute direkt eintragen wäre besser"* | 5 — *„Heute-Shortcut fehlt"* | 5 — *„Tippen mühsam, Beleg-Scan?"* | 6 — *„Schnell"* | 5.6 |
  | **A2** Mehrere Ausgaben | 6 — *„Ok"* | 5 — *„Funktion für mehrere Artikel/Tag fehlt"* | 5 — *„Mehrere nacheinander mühsam"* | 5 — *„ÖV-Abo sollte automatisch laufen"* | 5 — *„Wiederkehrende Posten fehlen"* | 5.2 |
  | **A3** Aktueller Monat | 6 — *„Clean — Tages-Graph wäre top"* | 6 — *„Sehr übersichtlich"* | 4 — *„Diagramm wäre lesbarer als Zahlen"* | 5 — *„Übersicht ok, Grafik fehlt"* | 5 — *„Jahresübersicht wäre Pflicht"* | 5.2 |
  | **A4** Anderer Monat | 6 — *„Sehr einfach"* | 5 — *„Klick auf Kategorie für Details wäre gut"* | 5 — *„Funktioniert, aber unauffällig"* | 3 — *„Kein Filter, musste manuell zählen"* | 2 — *„Ohne Filter sehr aufwändig"* | **4.2** |
  | **A5** Fehler korrigieren | 6 — *„Ok"* | 6 — *„Sortieroption in History wäre gut"* | 5 — *„Betrag direkt ändern statt löschen+neu"* | 5 — *„Edit-Funktion wäre besser"* | 5 — *„Edit wäre angenehmer"* | 5.4 |
  | **A6** Eigene Kategorie | 6 — *„Ok"* | 5 — *„Dropdown statt Klassenname für Logo"* | 3 — *„Bootstrap-Icon-Name verwirrend"* | 5 — *„Icon-Eingabe mühsam"* | 4 — *„Symbol als Code unintuitiv"* | **4.6** |
  | **A7** Reload-Test | 7 — *„Alles da"* | 7 — *„Ja"* | 7 — *„Alles noch da"* | 7 — *„Daten da"* | 7 — *„Daten erhalten"* | 7.0 |
  | **A8** Bonus (ohne Betrag) | 6 — *„Ok"* | 6 — *„Verständlich, klarer Hinweis"* | 6 — *„Klare Validierung"* | 6 — *„Validierung erkennbar"* | 6 — *„Fehlermeldung klar"* | 6.0 |
  | **Ø pro Tester** | **6.1** | **5.75** | **5.0** | **5.1** | **5.0** | **5.4** |

  *Tabelle 2 — Qualitative Aussagen pro Testperson*

  | Tester | Profil | Was gefiel | Hauptkritik / Wünsche |
  |---|---|---|---|
  | **T1** | 23 J., Wirtschaftsinformatik, on-Site | „Sehr einfach und selbsterklärend", clean, keine fancy Tools | „Heute"-Button beim Datum; Tages-Graph für Ausgaben; Fixkosten vs. variable Kosten |
  | **T2** | 22 J., BWL, on-Site | „Sehr übersichtlich", einfaches Anlegen, klare Fehlerhinweise | Mehrere Artikel/Tag schneller erfassen; Detail-Drilldown pro Kategorie; Sortier-/Filteroption History; Icon-Dropdown |
  | **T3** | 24 J., Informatik, on-Site | Logischer Aufbau, Validierung funktioniert | „Heute"-Shortcut; Bearbeiten statt Löschen+Neu; Diagramm auf Overview; Icon-Picker mit Vorschau |
  | **T4** | 28 J., IT-Support, off-Site | Schlankes UI, kein Account nötig, schnell startklar | Filter/Suche History; wiederkehrende Transaktionen; Monatsvergleich + Budget-Limits; Foto-Beleg-Erfassung |
  | **T5** | 31 J., Buchhaltung, off-Site | Klare Trennung der Bildschirme; Daten bleiben nach Reload | Icon-Auswahl unintuitiv; Jahresübersicht fehlt; Budget-Limit mit Warnung; automatische Quittungs-Erkennung |

- **Abgeleitete Verbesserungen:**

  *Hohe Priorität — Quick Wins (vor Abgabe umsetzbar)*
  1. **„Heute"-Button beim Datumsfeld** — Direkter Wunsch T1, T2 und T3. 5-Zeilen-Fix, spart einen Klick pro Erfassung.
  2. **Transaktion bearbeiten** — Aktuell nur Löschen + Neu-Erfassen. Häufigster Schmerzpunkt bei Korrekturen (T3, T4, T5).
  3. **Kategorie bearbeiten** — Gleiche Lücke; Tipp- oder Icon-Fehler erzwingen aktuell Neu-Anlage.
  4. **Volltext-Suche / Filter in History** — Bei wenigen Einträgen tolerierbar, ab 30+ kritisch (T2, T4, T5).
  5. **Vereinfachte Kategorieerfassung** — Icon-Picker mit Vorschau statt Eingabe eines Bootstrap-Klassennamens (T2, T3, T5).

  *Mittlere Priorität — Funktionsausbau*
  6. **Grafische Monatsdarstellung** — Balken- oder Tortendiagramm auf Overview; adressiert „nur Zahlen sind unübersichtlich" (T1, T3, T4).
  7. **Budget-Limits pro Kategorie** mit Progress-Bar und farbiger Warnung bei Überschreitung — macht aus dem Tracker eine echte Budget-App (T4, T5).
  8. **Wiederkehrende Transaktionen** (Miete, ÖV-Abo, Krankenkasse) — eliminiert monatlich identischen Erfassungs-Aufwand (T4, T5).
  9. **Monatsvergleich** zweier Monate nebeneinander mit Differenz pro Kategorie — beantwortet „gebe ich mehr aus als letzten Monat?" (T4).
  10. **Jahresübersicht** mit Trendlinie pro Monat — ermöglicht langfristige Auswertung (T5).

  *Niedrige Priorität — Ausblick*
  11. **KI-Beleg-Erfassung** (Foto → automatische Datenextraktion via OCR/LLM) — Wunsch der Off-Site-Tester (T4, T5); technisch aufwändig und eigene Iteration wert.


## 4. Erweiterungen [Optional]
Dokumentiert Erweiterungen über den Mindestumfang hinaus.
> **Hinweis:** Jede Erweiterung ist separat nach dem folgenden Schema zu beschreiben.

### _[4.x Kurzbeschreibung / Titel]_  
- **Beschreibung & Nutzen:** _[Was wurde erweitert? Warum?]_  
- **Wo umgesetzt:** _[Wie und wo wurde es gemacht? Frontend, Backend, Datenbank?]_  
- **Referenz:** _[Wo wird die Erweiterung auch noch beschrieben, z.B. Screenshot oder Beschreibung in einem anderen Kapitel]_  
- **Aus Evaluation abgeleitet?:** _[Wurde diese Erweiterung als Folge eines in der Evaluation identifizierten Issues implementiert?]_  

> Das folgende **Beispiel** wurde bewusst kurz gehalten. Erweiterungen dürfen auch ausführlicher beschrieben werden.

### 4.1 Tabelle nach Kategorien filtern
- **Beschreibung & Nutzen:** Tabelle X kann nach Kategorie gefiltert werden, weil User typischerweise nur an einer bestimmten Kategorie interessiert sind.  
- **Wo umgesetzt:** 
  - **Frontend:** Tabelle mit Dropdown in Datei ...
  - **Backend:** Form Action ... in Datei ...
  - **Datenbank:** MongoDB-Query in Datei ...
- **Referenz:** Screenshot in Kap. x.y
- **Aus Evaluation abgeleitet?:** Ja, Issue x.y

### 4.2 Benutzerkonten: Registrierung, Login & Logout (Issue #6)
- **Beschreibung & Nutzen:** Der Prototyp war eine **Single-User-App** — alle Daten lagen ungeschützt in gemeinsamen Collections. Diese Erweiterung führt **echte Benutzerkonten** mit Registrierung, Login und Logout ein. Nutzen: Die App wird mehrbenutzerfähig und schützt persönliche Finanzdaten hinter einer Authentifizierung. Abgrenzung zum Mindestumfang: Der Übungsumfang verlangt nur Erfassen/Bearbeiten von Daten ohne Authentifizierung; Benutzerkonten gehen klar darüber hinaus.
- **Wo umgesetzt:**
  - **Frontend:** Anmelde- und Registrierungsseiten (`src/routes/login/+page.svelte`, `src/routes/register/+page.svelte`); Logout-Button mit E-Mail-Anzeige in der Navigation (`src/routes/+layout.svelte`), nur sichtbar wenn eingeloggt.
  - **Backend:** Passwortprüfung mit `bcrypt.compare` und Setzen des Session-Cookies (`src/routes/login/+page.server.js`); Registrierung mit `bcrypt.hash` (Faktor 10), Dubletten-Prüfung und Anlegen von Standard-Kategorien (`src/routes/register/+page.server.js`); Logout via Cookie-Löschung (`src/routes/logout/+server.js`). Eine **Request-Hook** liest bei jedem Aufruf das Session-Cookie und hängt den User an `event.locals` (`src/hooks.server.js`); ein **Auth-Gate** im Layout leitet nicht eingeloggte Besucher auf `/login` um und eingeloggte von den Auth-Seiten weg (`src/routes/+layout.server.js`).
  - **Datenbank:** Neue `users`-Collection mit `createUser`, `getUserByEmail`, `getUserById` (`src/lib/db.js`); Passwörter werden nur als bcrypt-Hash gespeichert, nie im Klartext.
  - **Sicherheit:** Session-Cookie mit `httpOnly`, `sameSite: "strict"` und `secure` nur in Produktion (damit das Login lokal über http funktioniert, in der Produktion aber über https abgesichert ist).
- **Referenz:** Screenshots der Login-/Registrierungs-Seiten in Kap. _[x.y]_; KI-Deklaration zur Umsetzung in `doc/ki-deklaration-m1.md`.
- **Aus Evaluation abgeleitet?:** Nein — geplante Funktionserweiterung (Mehrbenutzerfähigkeit) über den Prototyp hinaus, Voraussetzung für #5.

### 4.3 Datentrennung pro Benutzer (Multi-User-Datenschicht, Issue #5)
- **Beschreibung & Nutzen:** Aufbauend auf #6 wird die **gesamte Datenschicht pro Benutzer getrennt**: Jede Kategorie und jede Transaktion gehört genau einem User, und jede Datenbankabfrage filtert nach dessen `userId`. Nutzen: Benutzer sehen und verändern ausschliesslich ihre **eigenen** Daten — eine echte Daten-Isolation statt eines gemeinsamen Datentopfs. Abgrenzung zum Mindestumfang: Der Prototyp kannte kein `userId`; diese Erweiterung ist die strukturelle Voraussetzung für die Mehrbenutzerfähigkeit.
- **Wo umgesetzt:**
  - **Datenbank:** In `src/lib/db.js` erhält **jede** Funktion `userId` als erstes Argument; alle Queries filtern mit `{ userId }`, Lösch- und Update-Operationen enthalten `userId` im Filter (verhindert Zugriff auf fremde Datensätze). Das Löschen einer Kategorie entfernt kaskadierend nur die Transaktionen **desselben** Users.
  - **Backend:** Alle Server-Routen reichen die `userId` des angemeldeten Users (`locals.user._id`) an die DB-Funktionen durch (`src/routes/+page.server.js`, `add/`, `categories/`, `history/`).
  - **Frontend:** Keine sichtbare Änderung — die Trennung wirkt vollständig serverseitig.
- **Referenz:** ER-Diagramm der Datenstruktur in `doc/architecture.mermaid`; Screenshot „zwei Konten sehen getrennte Daten" in Kap. _[x.y]_.
- **Aus Evaluation abgeleitet?:** Nein — strukturelle Erweiterung, die direkt aus der Einführung der Benutzerkonten (#6) folgt.

### 4.4 Mobiles Layout & Navigation (Issue #23)
- **Beschreibung & Nutzen:** Der Prototyp hatte eine reine Desktop-Navigation mit englischen Titeln und Text-Buttons. Diese Erweiterung macht die Oberfläche **handytauglich und einheitlich**: eine Navigationsleiste, die den aktiven Menüpunkt markiert, auf schmalen Bildschirmen nur Icons zeigt, dazu eine schlanke Design-Schicht über Bootstrap und durchgängig deutsche Beschriftungen. Nutzen: bessere Bedienbarkeit auf dem Handy und ein ruhigeres, konsistentes Erscheinungsbild.
- **Wo umgesetzt:**
  - **Navigation:** `src/routes/+layout.svelte` — aktiver Menüpunkt via `class:active` / `aria-current` (über `$app/state`, `page.url.pathname`), Labels auf dem Handy ausgeblendet (`d-none d-md-inline`), klebende Kopfleiste (`sticky-top`), Logout-Button mit E-Mail.
  - **Design-Schicht:** neue `static/theme.css` (weiche Karten, runde Buttons, Fokus-Ring) plus Inter-Font, eingebunden in `src/app.html`.
  - **Komponente:** `src/lib/components/DeleteButton.svelte` vom Text- zum Icon-Button (platzsparend auf dem Handy).
  - **Texte:** englische Titel → deutsch (Übersicht, Ausgabe erfassen, Verlauf, Kategorien …) in den Seiten unter `src/routes/`.
- **Referenz:** Screenshots „Desktop- vs. Handy-Ansicht" in Kap. _[x.y]_.
- **Aus Evaluation abgeleitet?:** _[Ja/Nein — falls Tester die Bedienung auf dem Handy bemängelt haben, hier auf das Evaluations-Issue verweisen]_

### 4.5 „Heute"-Button beim Datum (Issue #8)
- **Beschreibung & Nutzen:** Beim Erfassen einer Ausgabe lässt sich das Datumsfeld mit einem Klick auf „Heute" auf den aktuellen Tag setzen. Nutzen: Der häufigste Fall (Ausgabe von heute) ist ein einziger Klick statt manueller Datumseingabe — schnelleres, fehlerärmeres Erfassen. Manuelles Ändern bleibt jederzeit möglich.
- **Wo umgesetzt:**
  - **Frontend:** `src/routes/add/+page.svelte` — ein `$state`-Datumswert, an das `<input type="date">` gebunden (`bind:value`), plus ein „Heute"-Button (`input-group`) mit `setToday()`.
  - **Backend/Datenbank:** keine Änderung — das Datum wird wie bisher über die bestehende `create`-Action gespeichert.
- **Referenz:** Screenshot des Erfassen-Formulars in Kap. _[x.y]_.
- **Aus Evaluation abgeleitet?:** _[Ja/Nein — klassischer Quick Win; falls aus dem Testing, auf das Evaluations-Issue verweisen]_

### 4.6 Icon-Auswahl mit Vorschau (Issues #9 & #24)
- **Beschreibung & Nutzen:** Beim Anlegen einer Kategorie wird das Icon nicht mehr als Bootstrap-Klassenname getippt, sondern aus einer **kuratierten Galerie** angeklickt — mit Live-Vorschau und einem Freitext-Fallback für seltene Icons. Nutzen: Nutzer müssen keine Icon-Namen kennen, Tippfehler entfallen, und das gewählte Icon ist sofort sichtbar. „Hinzufügen" ist erst möglich, wenn ein Icon gewählt wurde.
- **Wo umgesetzt:**
  - **Komponente (#24):** neue, wiederverwendbare `src/lib/components/IconPicker.svelte` — kuratierte Icon-Buttons, verstecktes `<input name="icon">` (zweiweg-gebunden via `$bindable`), Freitextfeld + Live-Vorschau.
  - **Frontend (#9):** `src/routes/categories/+page.svelte` — das frühere Freitext-Icon-Feld durch `<IconPicker>` ersetzt, Submit `disabled`, bis ein Icon gewählt ist.
  - **Backend/Datenbank:** unverändert — der Icon-Name wird über die bestehende `create`-Action gespeichert.
- **Referenz:** Screenshot des Icon-Pickers in Kap. _[x.y]_.
- **Aus Evaluation abgeleitet?:** _[Ja/Nein — falls Tester die Klassennamen-Eingabe als umständlich empfanden, auf das Evaluations-Issue verweisen]_

## 5. Projektorganisation [Optional]
Beispiele:
- **Repository & Struktur:** _[Link; kurze Strukturübersicht]_  
- **Issue-Management:** _[Vorgehen kurz beschreiben]_  
- **Commit-Praxis:** _[z. B. sprechende Commits]_

## 6. KI-Deklaration
Die folgende Deklaration ist verpflichtend und beschreibt den Einsatz von KI im Projekt.

### 6.1 KI-Tools
- **Eingesetzte Tools**: _[z. B. Copilot, ChatGPT, Claude, lokale Modelle; Version/Variante wenn bekannt]_
- **Zweck & Umfang**: _[wie, wofür und in welchem Ausmass wurde KI eingesetzt (z. B. Textentwürfe, Codevorschläge, Tests, Refactoring); welche Teile stammen (ganz/teilweise) aus KI-Unterstützung?]_
- **Eigene Leistung (Abgrenzung):** _[was ist eigenständig erarbeitet/überarbeitet worden?]_

### 6.2 Prompt-Vorgehen
_[Überlegungen zu Prompt-Vorgehen, Qualität und Urheberrecht/Quellen. Wie wurde beim Prompting vorgegangen? Zu beschreiben ist die grundlegende Vorgehensweise. Einzelne, konkrete Prompts sollten höchstens als Beispiele aufgeführt werden. ]_

### 6.3 Reflexion
_[Nutzen, Grenzen, Risiken/Qualitätssicherung, ...]_

## 7. Anhang [Optional]
Beispiele:
- **Quellen:** _[verwendete Vorlagen/Assets/Modelle; Lizenz/Urheberrecht; ...]_
- **Testskript & Materialien:** _[Link/Datei]_  
- **Rohdaten/Auswertung:** _[Link/Datei]_  

