# 📝 Diario di Bordo — Sessione di Test Automation (Playwright + TypeScript)

- **Data**: 26 Settembre 2026
- **Autore**: Riccardo Scuto
- **Ruolo Target**: QA Engineer / Technical QA Engineer
- **Applicazione Testata**: [Interactive Cellular Automata 2D/3D Visualizer](https://interactive-cellular-automata.netlify.app/)
- **Repository GitHub**: [InteractiveGraphicsFinalProject-automations](https://github.com/riccardoscuto/InteractiveGraphicsFinalProject-automations)
- **Stato CI/CD**: ✅ Passing (GitHub Actions)

---

## 1. Obiettivo della Sessione

Evolvere il profilo professionale da **QA Analyst / Software Tester** (con oltre 3 anni di esperienza nel testing manuale, funzionale, API/HTTP, SQL, Jira e troubleshooting) verso quello di **Technical QA Engineer / QA Automation Engineer**.

L'obiettivo non era studiare teoria astratta, ma costruire un **progetto di portfolio concreto, difendibile e verificabile**, sviluppando da zero una suite di test end-to-end (E2E) con **Playwright**, **TypeScript** e **GitHub Actions**.

---

## 2. Fase 0: Pulizia Architetturale (Tabula Rasa)

All'avvio, il workspace conteneva file parziali generati da sessioni precedenti con Page Object prematuri e configurazioni non comprese. 

**Azione eseguita**:
- Cancellazione integrale della vecchia cartella `e2e/`.
- Ripartenza da zero assoluto per comprendere ogni singola riga di codice, evitando l'overengineering e le astrazioni premature.

---

## 3. Fase 1: Configurazione di Playwright (`playwright.config.ts`)

Abbiamo riscritto da zero [`playwright.config.ts`](playwright.config.ts) comprendendo il ruolo di ciascuna proprietà:

- **`testDir: './tests'`**: Indica a Playwright dove risiedono i file di test.
- **`baseURL: 'http://localhost:5173'`**: Evita di dover digitare l'URL completo nei test (si usa semplicemente `page.goto('/')`).
- **`webServer`**: Automatizza l'avvio del server di sviluppo (`npm run dev`) prima dei test e lo spegne al termine.
- **`reporter`**: Configurato sia per l'output da terminale (`list`) che per il report interattivo HTML (`html`).
- **Artefatti di debug**:
  - `screenshot: 'only-on-failure'`
  - `video: 'retain-on-failure'`
  - `trace: 'retain-on-failure'` (Time-travel debugging)

---

## 4. Fase 2: Smoke Tests e il Caso di Studio "Race Condition"

File: [`tests/smoke/app-load.spec.ts`](tests/smoke/app-load.spec.ts)

### Test Implementati
- **`TC-SMK-01`**: Caricamento pagina e montaggio canvas WebGL a tutto schermo.
- **`TC-SMK-02`**: Presenza e visibilità dei controlli primari (Start, Dark Mode, Dimension).
- **`TC-SMK-03`**: Integrità runtime (ascolto `pageerror` per escludere eccezioni JavaScript e WebGL all'avvio).

### 🔍 Caso di Studio 1: Weak Assertion vs Race Condition sul Canvas HTML5
- **Il Problema Rilevato dal QA**: Durante l'ispezione visiva dei primi test, il canvas appariva come un rettangolino di soli 300×150 pixel in alto a sinistra. L'asserzione iniziale `expect(canvas).toBeVisible()` dava esito positivo in appena 29ms!
- **La Causa Tecnica**: Nello standard HTML5, ogni tag `<canvas>` appena inserito nel DOM ha dimensioni predefinite di 300×150px. React Three Fiber impiega circa 80-100ms per calcolare le dimensioni della finestra e ridimensionare il canvas a tutto schermo (`100vw × 100vh`). Il test valutava prima del ridimensionamento, producendo un falso positivo.
- **La Soluzione**: Implementata un'asserzione dinamica con auto-polling tramite `toPass()`:
  ```typescript
  await expect(async () => {
    const box = await canvas.boundingBox();
    expect(box!.width).toBeGreaterThan(300);
    expect(box!.height).toBeGreaterThan(150);
  }).toPass({ timeout: 5000 });
  ```
  In questo modo Playwright attende che Three.js abbia realmente completato il ridimensionamento a tutto schermo.

---

## 5. Fase 3: Controlli della Simulazione (`tests/simulation/controls.spec.ts`)

Introduzione del hook **`test.beforeEach`** per evitare duplicazione di codice (`page.goto('/')` e attesa canvas) mantenendo i test isolati in Browser Context indipendenti.

### Test Implementati
- **`TC-CTL-01`**: Alternanza dello stato Start/Pause e test di robustezza con click consecutivi.
- **`TC-CTL-02`**: Commutazione tema Dark Mode / Light Mode.
- **`TC-CTL-03`**: Attivazione opzioni grafiche (Wireframe, Grid) e monitor di performance (`Stats` con `r3f-perf`).
- **`TC-CTL-04`**: Interazione con lo slider della velocità (`Speed: 1050 ms`) tramite eventi tastiera simulati (`ArrowRight`).

---

## 6. Fase 4: Modalità 2D / 3D (`tests/simulation/modes.spec.ts`)

Approfondimento del metodo atomico **`locator.selectOption()`** per i controlli dropdown `<select>`.

### Test Implementati
- **`TC-MOD-01`**: Selezione della modalità bidimensionale (`2D`).
- **`TC-MOD-02`**: Transizione ciclica bidirezionale (`3D -> 2D -> 3D`) senza errori di rendering.
- **`TC-MOD-03`**: Esecuzione della simulazione vitale (Start -> Pause) nello spazio 2D.
- **`TC-MOD-04`**: Persistenza dello stato UI (es. Dark Mode e slider) dopo il cambio di dimensione.

---

## 7. Fase 5: Configurazione Regole e Neighborhood (`tests/configuration/rules.spec.ts`)

Analisi delle strutture dati di `rules.json` e verifica delle logiche di business dell'interfaccia.

### Test Implementati
- **`TC-CFG-01`**: Selezione preset da catalogo (es. *"Diamond - 2D"*) e verifica aggiornamento a cascata di `Dimension`, `Size: 18` e parametri `Birth`.
- **`TC-CFG-02`**: **Safety Check UX**: verifica che la selezione di una nuova regola arresti automaticamente una simulazione attiva, prevenendo race conditions sullo spawn dei punti.
- **`TC-CFG-03`**: Commutazione del vicinato tra Moore (`M`, max 26 vicini) e Von Neumann (`VN`, max 6 vicini).
- **`TC-CFG-04`**: Modifica del parametro dimensione griglia tramite slider `Size`.

---

## 8. Fase 6: Camera 3D e il Caso di Studio "GPU Contention"

File: [`tests/simulation/camera.spec.ts`](tests/simulation/camera.spec.ts)

Automazione di gesti fisici non convenzionali su Three.js `<OrbitControls />`:
- Rotazione 3D via mouse drag:
  ```typescript
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 180, startY + 90, { steps: 15 });
  await page.mouse.up();
  ```
- Zoom in / Zoom out tramite rotellina:
  ```typescript
  await page.mouse.wheel(0, -350); // zoom in
  await page.mouse.wheel(0, 350);  // zoom out
  ```

### 🔍 Caso di Studio 2: GPU Contention su WebGL e Calibrazione Worker
- **Il Problema**: Durante la prima esecuzione dei 18 test, Playwright ha lanciato automaticamente 6 finestre Chrome parallele (6 worker). Ciascuna finestra eseguiva un motore grafico Three.js completo con shader Bloom a 60 FPS.
- **La Causa Tecnica**: 6 motori grafici contemporanei hanno saturato la scheda video (GPU contention), facendo crollare il framerate e causando il timeout (30s) sul test di camera in movimento (`TC-CAM-03`).
- **La Soluzione**: In `playwright.config.ts`:
  1. Impostato `workers: 2` in locale (e `1` in CI).
  2. Esteso il timeout a 45 secondi (`timeout: 45 * 1000`).
  
  **Risultato**: Carico GPU normalizzato, tempi dei singoli test ridotti da ~28s a 2-7s, **18 test su 18 passati in verde in 57 secondi**.

---

## 9. Fase 7: Documentazione QA Formale

Creazione dell'infrastruttura documentale per il portfolio:

1. **[`docs/TEST_PLAN.md`](docs/TEST_PLAN.md)**: Master Test Plan con Scope, Out-of-Scope, Browser supportati, Analisi dei Rischi e Criteri di Ingresso/Uscita.
2. **[`docs/TEST_CASES.md`](docs/TEST_CASES.md)**: Matrice completa dei 18 casi di test con ID univoci (`TC-SMK-*`, `TC-CTL-*`, `TC-MOD-*`, `TC-CFG-*`, `TC-CAM-*`), priorità, passi operativi ed esiti attesi.
3. **[`docs/AUTOMATION_STRATEGY.md`](docs/AUTOMATION_STRATEGY.md)**: Strategia dei locator (User-Facing ARIA roles), gestione dei dati di test, policy anti-flakiness e reportistica.
4. **[`README.md`](README.md)**: Presentazione professionale del progetto con case study, stack, istruzioni di esecuzione locale e dettagli CI/CD.

---

## 10. Fase 8: Integrazione CI/CD su GitHub Actions

Creazione del workflow [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml).

### 🔍 Caso di Studio 3: Troubleshooting CI in Tempo Reale
- **Il Problema**: Al primo push su GitHub, la pipeline è fallita dopo appena 19 secondi (`Exit Code 1`).
- **L'Indagine con la CLI (`gh run view`)**: L'analisi dei log remoti ha evidenziato l'errore esatto:
  ```text
  You are running Node.js 18.20.8.
  Playwright requires Node.js 20 or higher.
  ```
  Playwright v1.63 richiede Node.js ≥ 20.
- **La Risoluzione**: Modificato il workflow impostando `node-version: 20`, committato e inviato il push.
- **Esito Finale**: GitHub Actions ha creato il runner Ubuntu, installato Chromium con librerie grafiche di sistema, eseguito i 18 test e generato l'artefatto scaricabile `playwright-report`.
- **Badge di Esito**: **✅ PASSING in 3m 49s**.

---

## 11. Riepilogo Numerico del Progetto

- **18 Casi di Test E2E Automatizzati**
- **5 Aree Funzionali Coperte** (Smoke, Controls, Modes, Rules, Camera)
- **100% Pass Rate**
- **Nessuna instabilità (flakiness) rilevata nelle esecuzioni di baseline**
- **4 Documenti QA Strutturati** (Test Plan, Test Cases, Automation Strategy, Roadmap)
- **1 Pipeline CI/CD Attiva su GitHub**

---

## 12. Competenze Dimostrabili Acquisite

1. **Test Design per Applicazioni Complesse**: identificazione degli scenari critici, test di concorrenza e transizioni dimensionali.
2. **Playwright & TypeScript**: uso di fixture, isolated browser context, `getByRole`, `getByLabel`, `toPass`, `page.mouse` e asserzioni web-first con auto-waiting.
3. **Performance & Concurrency Tuning**: bilanciamento dei worker paralleli per carichi grafici 3D e prevenzione di GPU thrashing.
4. **Troubleshooting CI/CD**: diagnosi e risoluzione di problemi di ambiente di esecuzione tramite log remoti di GitHub Actions.
5. **Comunicazione Tecnica e Documentazione**: capacità di spiegare e difendere le scelte architetturali in sede di colloquio tecnico.
