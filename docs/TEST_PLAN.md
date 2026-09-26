# Master Test Plan — Interactive Cellular Automata Visualizer

## 1. Introduzione e Obiettivo del Testing

Il presente documento definisce la strategia, l'ambito e la pianificazione delle attività di testing end-to-end (E2E) e funzionale per l'applicazione **Interactive Cellular Automata 2D/3D Visualizer**.

L'obiettivo primario è verificare l'integrità funzionale dei controlli di simulazione, la correttezza del caricamento dei preset di regole, la stabilità del rendering grafico 3D/WebGL (Three.js / React Three Fiber) e l'interattività dell'interfaccia utente (UI), garantendo assenza di regressioni e continuità del servizio.

---

## 2. Ambito del Testing (Scope)

### 2.1 In Scope (Cosa viene testato)
- **Smoke Tests**: Validazione del bootstrap dell'applicazione, disponibilità del viewport canvas WebGL a tutto schermo e assenza di eccezioni JavaScript o crash console.
- **Controlli di Simulazione**: Ciclo di vita Start, Pause, Resume, commutazione tema chiaro/scuro e toggle di opzioni grafiche (Wireframe, Grid, Stats).
- **Modalità Dimensionali (2D e 3D)**: Switch bidirezionale tra spazio tridimensionale e bidimensionale, persistenza dei controlli e validità delle strutture dati matriciali.
- **Configurazione Regole e Parametri**: Caricamento dei preset da file catalogo (`rules.json`), aggiornamento a cascata di parametri cellulari (Birth, Survival, Overpopulated, Underpopulated) e vicinato (Moore e Von Neumann).
- **Interazioni Telecamera (OrbitControls)**: Rotazione 3D via mouse drag, zoom in/out via rotellina (mouse wheel) e verifica della reattività della visuale durante la simulazione attiva.

### 2.2 Out of Scope (Cosa NON viene testato nella fase corrente)
- **Pixel-perfect visual regression**: Confronto di screenshot pixel per pixel dei singoli cubi generati in WebGL (troppo fragile a causa di differenze di antialiasing tra GPU).
- **Benchmark GPU e framerate stress testing**: Verifica di performance a 60 FPS costanti con griglie oltre i 60x60 nodi.
- **Stress test massivo di tutte le 60+ regole**: Copertura di ogni singolo preset presente nel file JSON (si testano le classi di equivalenza e i preset rappresentativi).
- **Local storage / session persistence**: L'applicazione non prevede autenticazione né persistenza server/storage locale.

---

## 3. Ambienti e Browser Target

### Ambienti
- **Ambiente Locale**: Esecuzione su server di sviluppo Vite (`http://localhost:5173`) con hot-module replacement.
- **Ambiente di CI**: Runner Ubuntu di GitHub Actions con Chromium headless e dipendenze grafiche installate.
- **Ambiente Staging / Produzione (Target futuro)**: `https://interactive-cellular-automata.netlify.app/`.

### Matrice Browser
- **Tier 1 (Default)**: Chromium (Desktop Chrome).
- **Tier 2 (Cross-Browser)**: Mozilla Firefox e WebKit (Safari).

---

## 4. Tipologie di Test

1. **Smoke Tests (P0)**: Suite ad altissima priorità ed esecuzione rapida, propedeutica a qualsiasi deploy o run di regressione.
2. **Functional & State E2E Tests (P1/P2)**: Suite di interazione UI che simula l'utente reale che configura la simulazione, aziona i controlli e manipola la vista 3D.
3. **Robustness / Concurrency Tests (P1)**: Verifica del comportamento sotto stress (click multipli, cambio regola durante simulazione attiva, manipolazione camera concorrente al rendering loop).

---

## 5. Valutazione e Gestione dei Rischi

| Rischio Identificato | Impatto | Probabilità | Strategia di Mitigazione |
| :--- | :--- | :--- | :--- |
| **GPU Contention & Resource Thrashing** | Alto (Timeout/Crash) | Alta | Limitare la concorrenza locale dei worker a 2 (massimo 1 in CI) ed estendere il timeout a 45s per evitare saturazione VRAM con Three.js. |
| **Race condition su Canvas HTML5** | Medio (Falsi positivi) | Alta | Non usare solo `toBeVisible()`. Attendere esplicitamente che il bounding box del canvas superi le dimensioni native di fallback HTML5 (300x150). |
| **Flakiness da animazioni e loop WebGL** | Medio | Media | Usare asserzioni basate su auto-waiting e stati del DOM anziché wait a tempo fisso (`sleep`). |
| **Modifiche al DOM di Chakra UI** | Basso | Bassa | Utilizzare selettori orientati all'utente (`getByRole`, `getByLabel`) che resistono a variazioni di classi CSS o markup interno. |

---

## 6. Criteri di Ingresso e di Uscita (Entry / Exit Criteria)

### Entry Criteria
- Build dell'applicazione compilata con successo (`npm run build`).
- Server di sviluppo avviato e raggiungibile su porta 5173.
- Dipendenze Playwright e browser installati.

### Exit Criteria
- 100% dei test prioritari (P0 e P1) eseguiti e passati.
- Tasso di superamento della suite complessiva ≥ 95%.
- Zero flaky test noti non documentati o non mitigati.
- Generazione automatica di screenshot, video e trace per ciascun eventuale fallimento.
