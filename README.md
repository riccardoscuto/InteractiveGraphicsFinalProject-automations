# 🧪 QA Automation Portfolio — E2E Test Suite

## Interactive Cellular Automata 2D/3D Visualizer

Suite automatizzata di test end-to-end (E2E) realizzata con **Playwright** e **TypeScript** per l'applicazione interattiva [Interactive Cellular Automata 2D/3D Visualizer](https://interactive-cellular-automata.netlify.app/).

Questo progetto costituisce una dimostrazione pratica di competenze tecniche in **QA Automation** e **Technical QA**: progettazione di test plan e casi di test, architettura della test suite, gestione di race condition e concorrenza hardware su carichi grafici 3D/WebGL (Three.js), pipeline CI/CD con GitHub Actions e documentazione formale.

---

## 📋 Aree di Test e Copertura

La suite comprende **18 test automatizzati** organizzati per dominio funzionale:

| Area | Suite / File | Test | Descrizione |
| :--- | :--- | :---: | :--- |
| 🔥 **Smoke Tests** | [`tests/smoke/app-load.spec.ts`](tests/smoke/app-load.spec.ts) | 3 | Bootstrap applicativo, montaggio canvas WebGL a tutto schermo, assenza di errori in console |
| 🎮 **Controlli Simulazione** | [`tests/simulation/controls.spec.ts`](tests/simulation/controls.spec.ts) | 4 | Ciclo di vita Start/Pause, Dark Mode, toggle opzioni visive (Wireframe, Grid, Stats) e slider velocità |
| 🔄 **Modalità 2D / 3D** | [`tests/simulation/modes.spec.ts`](tests/simulation/modes.spec.ts) | 4 | Selezione 2D, transizione bidirezionale 3D ↔ 2D, esecuzione simulazione e coerenza stato UI |
| ⚙️ **Configurazione Regole** | [`tests/configuration/rules.spec.ts`](tests/configuration/rules.spec.ts) | 4 | Preset da catalogo con aggiornamento a cascata, safety check di stop automatico, vicinato Moore/Von Neumann e slider Size |
| 📷 **Camera 3D & Orbit** | [`tests/simulation/camera.spec.ts`](tests/simulation/camera.spec.ts) | 3 | Rotazione orbitale con mouse drag, zoom in/out con rotellina (wheel) e interazione camera durante simulazione attiva |
| **Totale** | | **18** | **100% Passed** |

---

## 🛠️ Stack Tecnologico

| Tecnologia | Ruolo |
| :--- | :--- |
| **Playwright Test** | Framework di automazione E2E |
| **TypeScript** | Linguaggio fortemente tipizzato per manutenibilità e robustezza del codice di test |
| **Three.js / React Three Fiber** | Motore grafico 3D dell'applicazione target |
| **GitHub Actions** | Pipeline CI/CD per esecuzione e reportistica automatica a ogni commit/PR |
| **Chromium** | Browser target primario per esecuzione headless e accelerata |

---

## 🧠 Problematiche Tecniche e Soluzioni QA (Case Studies)

Durante la progettazione e automazione della suite sono state affrontate e risolte sfide tipiche di applicazioni grafiche complesse:

### 1. Risoluzione della Race Condition su Canvas HTML5 (Weak Assertion Fix)
- **Problema**: L'asserzione iniziale `expect(canvas).toBeVisible()` passava in appena 29 millisecondi, quando il canvas era ancora nel formato di fallback predefinito dello standard HTML5 (300×150 pixel), prima che React Three Fiber completasse il ridimensionamento a tutto schermo (`100vw × 100vh`).
- **Soluzione QA**: Implementata un'asserzione dinamica con `toPass()` che verifica che il bounding box del canvas superi le dimensioni 300×150px, attendendo in modo deterministico che il motore 3D completi il rendering del viewport.

### 2. Risoluzione del Timeout da GPU Contention
- **Problema**: L'esecuzione di 18 test con 6 worker paralleli (6 finestre Chromium che eseguivano contemporaneamente shader Bloom, luci e rendering loop a 60 FPS) ha causato saturazione della VRAM/GPU locale, portando il test di movimento camera (`TC-CAM-03`) a superare il timeout di 30s.
- **Soluzione QA**: Calibrata la concorrenza locale a 2 worker (`workers: 2`) e timeout a 45s. Questa modifica architetturale ha eliminato la contesa sulla scheda video, rendendo l'esecuzione **4 volte più veloce** (i singoli test sono passati da ~28s a 2-7s) e garantendo stabilità al 100%.

### 3. Automazione di Input Fisici Non Convenzionali (Three.js OrbitControls)
- Invece di limitarsi a click su form HTML, la suite automatizza interazioni gestuali complesse:
  - `page.mouse.down()` combinato con `page.mouse.move(..., { steps: 15 })` per generare eventi intermedi realistici e attivare l'inerzia di rotazione della telecamera 3D.
  - `page.mouse.wheel(0, -350)` per simulare eventi di zooming con la rotellina del mouse.

---

## 📁 Struttura del Progetto

```text
├── tests/
│   ├── smoke/
│   │   └── app-load.spec.ts             # Smoke test di vitalità e canvas (3 test)
│   ├── simulation/
│   │   ├── controls.spec.ts             # Start/Pause, Dark Mode, Speed slider (4 test)
│   │   ├── modes.spec.ts                # Switch 2D/3D e consistenza stato (4 test)
│   │   └── camera.spec.ts               # Rotazione orbitale e zoom 3D (3 test)
│   └── configuration/
│       └── rules.spec.ts                # Preset, safety check, vicinati, griglia (4 test)
│
├── docs/
│   ├── TEST_PLAN.md                     # Piano di test master (scope, ambienti, rischi, entry/exit criteria)
│   ├── TEST_CASES.md                    # Matrice dei 18 casi di test con ID, passi ed esiti attesi
│   └── AUTOMATION_STRATEGY.md           # Strategia dei locator, gestione flaky test e reporting
│
├── .github/
│   └── workflows/
│       └── playwright.yml               # Pipeline CI/CD per GitHub Actions
│
├── playwright.config.ts                 # Configurazione Playwright ottimizzata per WebGL
├── package.json                         # Dipendenze e script di esecuzione
└── README.md                            # Panoramica del portfolio
```

---

## 🚀 Istruzioni di Esecuzione Locale

### Prerequisiti
- [Node.js](https://nodejs.org) v18 o superiore
- npm

### Installazione
```bash
# Installa le dipendenze del progetto
npm install

# Installa i binari del browser Playwright
npx playwright install --with-deps chromium
```

### Esecuzione della Suite
```bash
# Esecuzione completa da terminale (output a riga di comando)
npm run test:e2e

# Esecuzione interattiva con Playwright UI (time-travel debugging e ispezione visiva)
npm run test:e2e:ui

# Esecuzione di una singola suite di test (es. camera 3D)
npx playwright test tests/simulation/camera.spec.ts

# Visualizzazione dell'ultimo report HTML generato
npm run test:e2e:report
```

---

## 🔄 Pipeline CI/CD (GitHub Actions)

Il flusso di integrazione continua è configurato in [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) ed esegue automaticamente l'intera suite a ogni `push` e `pull_request` sul branch `main`.

In caso di esecuzione, il workflow:
1. Configura l'ambiente Node.js ed esegue `npm ci`.
2. Installa i binari Chromium e le librerie grafiche OS necessarie.
3. Lancia `npm run test:e2e` avviando il dev server Vite in background.
4. Salva e pubblica il report HTML come artefatto scaricabile conservato per 30 giorni.

---

## 📖 Documentazione Tecnica QA

- 📑 **[Master Test Plan](docs/TEST_PLAN.md)**: Ambito, browser supportati, analisi dei rischi e criteri di exit.
- 📋 **[Test Cases Matrix](docs/TEST_CASES.md)**: Dettaglio di tutti i 18 casi di test con ID, priorità e passi operativi.
- 🎯 **[Automation Strategy](docs/AUTOMATION_STRATEGY.md)**: Criteri di automazione, locator strategy e policy anti-flakiness.

---

**Autore:** QA Automation Engineer Portfolio  
**Stack:** Playwright · TypeScript · Three.js · React · GitHub Actions
