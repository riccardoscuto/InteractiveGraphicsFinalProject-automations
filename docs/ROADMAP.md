# Automation Testing — Log di Progetto e Roadmap Approfondita

**Data di aggiornamento:** 26 settembre 2026  
**Autore:** Riccardo Scuto  
**Ruolo target:** QA Engineer / Technical QA Engineer / QA Automation Engineer  
**Applicazione testata:** Interactive Cellular Automata 2D/3D Visualizer  
**Repository:** `InteractiveGraphicsFinalProject-automations`  
**Stack attuale:** Playwright · TypeScript · GitHub Actions · React/Three.js/WebGL  
**Stato CI/CD:** ✅ Passing

---

# 1. Scopo del progetto

Questo progetto nasce per colmare il principale gap del profilo professionale attuale: la mancanza di esperienza concreta e dimostrabile in **test automation moderna**.

Il punto di partenza è un profilo con oltre 3 anni di esperienza professionale in:

- functional testing;
- regression testing;
- integration testing;
- end-to-end testing;
- API / HTTP / JSON;
- SSO / OIDC / autenticazione;
- SQL e verifiche dati;
- troubleshooting;
- Jira;
- release validation;
- smoke e post-deploy verification.

L'obiettivo è evolvere il profilo verso:

> **QA Engineer / Technical QA Engineer con competenze reali di automation**

senza presentare come esperienza lavorativa ciò che nasce invece come progetto personale.

---

# 2. Stato attuale

## 2.1 Configurazione Playwright

È stato riscritto e compreso da zero `playwright.config.ts`, includendo:

- `testDir`;
- `baseURL`;
- `webServer`;
- reporter terminale;
- report HTML;
- screenshot on failure;
- video on failure;
- trace on failure;
- timeout;
- worker differenziati tra locale e CI.

## 2.2 Copertura attuale

Totale:

**18 test E2E automatizzati**

Aree coperte:

1. Smoke
2. Simulation Controls
3. 2D / 3D Modes
4. Rules / Neighborhood
5. 3D Camera

---

# 3. Log tecnico delle attività svolte

## 3.1 Smoke testing

File:

`tests/smoke/app-load.spec.ts`

Copertura:

- caricamento applicazione;
- inizializzazione canvas WebGL;
- presenza controlli principali;
- assenza di errori JavaScript/WebGL all'avvio.

---

## 3.2 Caso di studio — Canvas readiness

### Problema

L'asserzione:

```ts
expect(canvas).toBeVisible()
```

passava quando il canvas era ancora nelle dimensioni HTML5 di default:

`300 × 150 px`

prima che React Three Fiber completasse il resize.

### Rischio

Falso positivo.

Il test verificava che il canvas esistesse, ma non che l'ambiente grafico fosse realmente pronto.

### Soluzione

È stata introdotta un'asserzione con polling:

```ts
await expect(async () => {
  const box = await canvas.boundingBox();
  expect(box!.width).toBeGreaterThan(300);
  expect(box!.height).toBeGreaterThan(150);
}).toPass({ timeout: 5000 });
```

### Competenza dimostrata

- synchronization;
- asynchronous UI readiness;
- weak assertion analysis;
- false-positive prevention.

---

# 4. Simulation Controls

File:

`tests/simulation/controls.spec.ts`

Copertura:

- Start / Pause;
- click consecutivi;
- Dark / Light mode;
- Wireframe;
- Grid;
- Stats;
- Speed slider.

È stato introdotto `test.beforeEach` per ridurre duplicazioni mantenendo test isolati.

---

# 5. Modalità 2D / 3D

File:

`tests/simulation/modes.spec.ts`

Copertura:

- selezione 2D;
- transizione 3D → 2D → 3D;
- Start / Pause in modalità 2D;
- persistenza dello stato UI durante il cambio modalità.

Utilizzato `locator.selectOption()` per i controlli `<select>`.

---

# 6. Rules e Neighborhood

File:

`tests/configuration/rules.spec.ts`

Copertura:

- selezione preset;
- aggiornamento della configurazione;
- stop automatico al cambio regola;
- Moore neighborhood;
- Von Neumann neighborhood;
- dimensione griglia.

---

# 7. Camera 3D

File:

`tests/simulation/camera.spec.ts`

Automatizzati input su WebGL:

- mouse drag per rotazione;
- mouse wheel per zoom;
- interazioni con OrbitControls.

---

# 8. Caso di studio — GPU contention

## Problema

Playwright eseguiva inizialmente 6 worker paralleli.

Ogni browser eseguiva Three.js, WebGL, shader, Bloom e rendering continuo.

Questo saturava le risorse GPU e produceva timeout.

## Soluzione

Configurazione aggiornata:

- `workers: 2` in locale;
- `workers: 1` in CI;
- timeout portato a 45 secondi.

## Competenza dimostrata

- resource contention analysis;
- parallel execution tuning;
- test-infrastructure troubleshooting;
- root-cause analysis.

---

# 9. Documentazione QA

Sono stati creati:

- `docs/TEST_PLAN.md`
- `docs/TEST_CASES.md`
- `docs/AUTOMATION_STRATEGY.md`
- `README.md`

La documentazione include:

- scope;
- out-of-scope;
- browser;
- risk analysis;
- entry / exit criteria;
- locator strategy;
- test data;
- anti-flakiness policy;
- reporting;
- istruzioni di esecuzione.

---

# 10. CI/CD

Workflow:

`.github/workflows/playwright.yml`

La pipeline:

1. crea un runner Ubuntu;
2. installa Node;
3. installa dipendenze;
4. installa Chromium e dipendenze Playwright;
5. avvia l'app;
6. esegue la suite;
7. genera il report;
8. pubblica l'artefatto `playwright-report`.

---

# 11. Caso di studio — CI environment mismatch

## Problema

Prima pipeline fallita con:

```text
You are running Node.js 18.20.8.
Playwright requires Node.js 20 or higher.
```

## Diagnosi

Analisi tramite:

```bash
gh run view
```

## Soluzione

Aggiornamento workflow:

```yaml
node-version: 20
```

## Risultato

Pipeline:

✅ PASSING

## Competenza dimostrata

- CI troubleshooting;
- log analysis;
- dependency compatibility;
- environment debugging.

---

# 12. Valutazione dello stato attuale

Il progetto ha superato la fase tutorial.

Dimostra già:

- test design;
- E2E automation;
- Playwright;
- TypeScript applicato ai test;
- debugging;
- browser interaction;
- WebGL testing;
- CI;
- troubleshooting;
- documentazione QA.

Il prossimo obiettivo non è aumentare semplicemente il numero dei test.

Il prossimo obiettivo è migliorare:

> **affidabilità, architettura, profondità e maturità della suite.**

---

# 13. Correzioni di linguaggio professionale

Nel portfolio evitare affermazioni non sufficientemente misurate.

## Da evitare

```text
0 flaky test
```

dopo poche esecuzioni.

Preferire:

```text
No flakiness observed in the current test runs.
```

oppure una metrica reale:

```text
30 consecutive regression runs completed without failures.
```

Anche:

```text
Enterprise-level documentation
```

è meglio sostituirlo con:

```text
Structured QA documentation including Test Plan, Test Cases and Automation Strategy.
```

---

# 14. Roadmap Automation — Fase successiva

La roadmap seguente rimane esclusivamente nel campo **QA Automation**.

---

# FASE A — Reliability Hardening

## Obiettivo

Dimostrare che la suite è affidabile nel tempo.

### A.1 Esecuzioni ripetute

Eseguire la regression suite:

- 10 volte;
- poi 20 volte;
- idealmente 30 volte.

Registrare:

- run totali;
- test execution totali;
- failure;
- retry;
- durata;
- test più instabili.

Esempio:

```text
30 runs × 18 test = 540 individual executions
```

### A.2 Non introdurre retry immediatamente

Se un test fallisce:

1. riprodurre;
2. raccogliere trace;
3. identificare la causa;
4. classificare il failure;
5. correggere;
6. ripetere.

Categorie utili:

- application defect;
- automation defect;
- environment issue;
- resource contention;
- timing / synchronization;
- infrastructure issue.

### Deliverable

`docs/RELIABILITY_REPORT.md`

---

# FASE B — Cross-Browser Testing

## Obiettivo

Passare da Chromium-only a una strategia browser reale.

Browser:

- Chromium;
- Firefox;
- WebKit.

## Strategia proposta

### Pull Request

```text
Chromium Smoke
```

### Main branch

```text
Chromium Full Regression
```

### Scheduled / Manual

```text
Chromium
Firefox
WebKit
```

### Deliverable

`docs/CROSS_BROWSER_STRATEGY.md`

---

# FASE C — Negative e Boundary Testing

## Obiettivo

Ridurre l'eccessiva dipendenza dagli happy path.

Esempi:

### Simulation controls

- Start/Pause molto rapidi;
- click ripetuti;
- cambio modalità durante simulazione;
- reset mentre la simulazione è attiva.

### Grid

- valore minimo;
- massimo;
- cambio rapido dimensione;
- sequenza min → max → min.

### Rules

- cambio preset durante esecuzione;
- cambio neighborhood durante esecuzione;
- più cambi consecutivi.

### UI State

- Dark Mode + cambio dimensione;
- Wireframe + cambio modalità;
- Stats + reset;
- combinazioni multiple.

Non generare una matrice combinatoria enorme.

Automatizzare scenari con:

- rischio;
- regressione plausibile;
- valore funzionale.

---

# FASE D — Test Architecture

## Obiettivo

Passare da suite funzionante a suite mantenibile.

## D.1 Analisi duplicazioni

Cercare codice ripetuto come:

- page navigation;
- canvas readiness;
- selezione modalità;
- start simulation;
- common assertions.

## D.2 Helper

Un helper come:

```text
waitForWebGLReady()
```

può diventare condiviso.

## D.3 Fixtures

Introdurre fixture solo dove migliorano realmente:

- setup;
- stato;
- test isolation;
- readability.

## D.4 Page Object

Introdurre Page Object solo se:

- molte azioni UI sono duplicate;
- i locator sono sparsi;
- la manutenzione è diventata difficile.

### Deliverable

`docs/TEST_ARCHITECTURE.md`

---

# FASE E — Test Data e Determinismo

## Obiettivo

Controllare la casualità.

Analizzare:

- quali test dipendono da random state;
- quali test richiedono seed;
- quali test possono verificare soltanto proprietà generali.

Strategie:

- usare seed deterministici quando possibile;
- usare preset noti;
- evitare assertion su risultati casuali specifici;
- controllare input;
- controllare stato iniziale.

### Deliverable

`docs/TEST_DATA_STRATEGY.md`

---

# FASE F — CI/CD Maturity

## Obiettivo

Trasformare GitHub Actions da semplice runner remoto a vera pipeline QA.

## F.1 Quality Gates

Aggiungere prima degli E2E, se applicabili:

```text
npm ci
typecheck
lint
build
```

## F.2 Pipeline differenziate

### PR Pipeline

```text
Install
Build
Smoke
```

### Main Pipeline

```text
Install
Build
Full Chromium Regression
```

### Nightly / Scheduled

```text
Cross Browser Regression
```

## F.3 Artifacts

Su failure conservare:

- HTML report;
- trace;
- screenshot;
- video;
- log.

## F.4 Status badge

Mostrare nel README:

- CI status.

---

# FASE G — API Automation

Questa fase collega bene il nuovo percorso automation all'esperienza professionale già posseduta.

## Obiettivo

Non limitare il portfolio all'automazione UI.

Studiare:

- Playwright `request`;
- REST API testing;
- status code;
- JSON response;
- headers;
- negative API scenarios;
- schema / contract validation;
- auth;
- API + UI flow.

Se il progetto Cellular Automata non espone API significative, creare una piccola sezione separata di portfolio usando un'API demo affidabile.

Test da imparare:

```text
GET
POST
PUT/PATCH
DELETE
```

Verificare:

- status;
- payload;
- response headers;
- error response;
- invalid input;
- authorization.

Obiettivo professionale:

```text
UI E2E + API Automation
```

---

# FASE H — Network Interception e Mocking

## Obiettivo

Imparare a controllare dipendenze esterne.

Playwright permette di:

- intercettare request;
- modificare response;
- simulare failure;
- mockare servizi.

Scenari:

- API restituisce 500;
- timeout;
- response incompleta;
- network failure;
- slow response.

Competenze:

- resilience testing;
- error handling;
- deterministic testing.

---

# FASE I — Authentication e Session Management

Studiare:

- authentication state;
- storageState;
- cookie;
- localStorage;
- session;
- setup autenticato;
- test isolation;
- role-based testing.

Creare test che dimostrino:

```text
login → authenticated state → protected flow
```

senza ripetere il login inutilmente in ogni test.

---

# FASE J — Parallelism, Sharding e Scalabilità

Approfondire:

- workers;
- fullyParallel;
- serial execution;
- `test.describe.configure`;
- sharding;
- CI parallelism.

Obiettivo:

capire quando parallelizzare e quando non farlo.

Non cercare il massimo parallelismo.

Cercare:

> **il miglior rapporto tra velocità e affidabilità.**

---

# FASE K — Reporting e Observability

Approfondire:

- HTML Reporter;
- Trace Viewer;
- attachments;
- custom annotations;
- console logs;
- browser logs;
- network logs.

Possibile futura integrazione:

- Allure

solo se aggiunge valore concreto.

---

# FASE L — Visual Regression

Da trattare con cautela per WebGL.

Studiare:

- screenshot comparison;
- tolerance;
- masking;
- dynamic regions.

Non iniziare dal canvas WebGL completo.

Prima applicare visual regression a:

- menu;
- pannelli;
- controlli;
- layout statico.

---

# FASE M — Accessibility Automation

Opzionale ma utile per web QA.

Possibile integrazione:

```text
axe-core
```

Automatizzare:

- WCAG violations;
- semantic structure;
- accessibility regressions.

Non sostituisce accessibility testing manuale.

---

# FASE N — Performance-oriented Checks

Non trasformare Playwright in un tool di load testing.

È possibile però registrare controlli leggeri:

- page load;
- rendering readiness;
- interaction latency;
- regressioni macroscopiche.

Per performance/load testing reale si potrà valutare successivamente:

```text
k6
```

come progetto separato.

---

# FASE O — Code Quality della Suite

Applicare alla suite le stesse regole del software.

Obiettivi:

- naming consistente;
- test leggibili;
- no magic numbers non spiegati;
- commenti solo quando necessari;
- helper piccoli;
- no duplicazione significativa;
- TypeScript strict dove sostenibile;
- lint;
- formatting.

---

# 15. Roadmap temporale consigliata

## Settimana 1

Reliability:

- 20–30 regression run;
- analisi failure;
- reliability report.

## Settimana 2

Cross-browser:

- Chromium;
- Firefox;
- WebKit;
- browser matrix.

## Settimana 3

Negative / boundary:

- aggiungere circa 6–10 test ad alto valore.

## Settimana 4

Architecture:

- refactoring;
- helper;
- fixture;
- eliminazione duplicazione.

## Settimana 5

CI maturity:

- smoke pipeline;
- regression pipeline;
- nightly cross-browser;
- artifacts.

## Settimana 6

API automation:

- REST;
- assertions;
- negative scenarios.

## Settimana 7

Network mocking:

- failure;
- timeout;
- response manipulation.

## Settimana 8

Authentication / state management:

- storage state;
- cookie/session;
- authenticated fixture.

## Settimana 9

Advanced execution:

- parallelism;
- sharding;
- CI scaling.

## Settimana 10

Portfolio hardening:

- README;
- metrics;
- release;
- interview preparation.

---

# 16. Milestone v1.0

La suite può essere taggata:

```text
v1.0.0
```

quando:

- [ ] test core stabili;
- [ ] cross-browser verificato;
- [ ] reliability run completato;
- [ ] negative/boundary coverage presente;
- [ ] CI differenziata;
- [ ] trace/report automatici;
- [ ] documentazione aggiornata;
- [ ] nessun flaky test noto non documentato;
- [ ] README professionale;
- [ ] release Git creata.

---

# 17. Milestone v2.0

Possibili obiettivi:

- API automation;
- mocking;
- auth state;
- test data strategy avanzata;
- visual regression limitata;
- accessibility automation;
- sharding.

---

# 18. Competenze da poter dimostrare a fine percorso

## Automation

- Playwright;
- TypeScript;
- E2E automation;
- API automation;
- test architecture.

## Reliability

- flaky test analysis;
- synchronization;
- deterministic testing;
- timeout analysis.

## CI/CD

- GitHub Actions;
- quality gates;
- scheduled runs;
- artifacts.

## Debugging

- trace;
- screenshot;
- video;
- browser console;
- network analysis.

## Engineering

- Git;
- test maintainability;
- parallel execution;
- environment troubleshooting.

---

# 19. Possibile formulazione CV

A percorso consolidato:

```text
Test Automation
Playwright · TypeScript · E2E Testing · API Testing
GitHub Actions · CI/CD · Cross-browser Testing
```

Nel progetto:

> Built and maintained an E2E automation suite for an interactive React/Three.js WebGL application using Playwright and TypeScript, covering functional workflows, state transitions, 3D interactions and regression scenarios.

> Implemented CI execution through GitHub Actions with automated reporting and debugging artifacts, and investigated reliability issues related to asynchronous WebGL initialization, GPU resource contention and CI environment compatibility.

Successivamente, solo quando realmente implementato:

> Extended the automation suite with cross-browser coverage, API validation, network mocking and reliability monitoring.

---

# 20. Domande da colloquio che il progetto deve permettere di affrontare

## Playwright

- Perché Playwright?
- Come funzionano locator e auto-waiting?
- Quando usare `toPass()`?
- Come gestire elementi asincroni?

## Test architecture

- Quando usare un Page Object?
- Quando usare una fixture?
- Come evitare duplicazione?
- Come mantenere test indipendenti?

## Reliability

- Cos'è un flaky test?
- Come identificarlo?
- Come distinguere test bug da application bug?
- Perché evitare `waitForTimeout()`?

## CI

- Come funziona la pipeline?
- Cosa succede quando un test fallisce?
- Quali artefatti vengono salvati?
- Come distinguere smoke da regression?

## Parallelism

- Perché ridurre i worker?
- Quando la parallelizzazione peggiora i tempi?
- Come scalare una suite molto grande?

## API

- Come testare una REST API?
- Come verificare error handling?
- Come combinare API e UI testing?

---

# 21. Regola fondamentale

Non inseguire tecnologie da aggiungere al CV.

Per ogni nuovo strumento chiedere:

> Quale problema di testing sto risolvendo?

Se non c'è una risposta chiara, probabilmente non serve ancora.

---

# 22. Prossimo task consigliato

## Reliability Baseline

1. eseguire la suite 20 volte consecutive;
2. salvare i risultati;
3. individuare eventuali failure;
4. classificare ogni failure;
5. correggere eventuali instabilità;
6. creare `RELIABILITY_REPORT.md`.

Subito dopo:

## Cross-Browser Baseline

eseguire la stessa suite su:

- Chromium;
- Firefox;
- WebKit.

Queste due attività aumentano molto più il valore del progetto rispetto all'aggiunta immediata di altri 20 test.

---

# 23. Obiettivo finale del percorso automation

Il progetto sarà riuscito quando il repository dimostrerà non soltanto:

> "so scrivere test Playwright"

ma:

> **"so progettare, automatizzare, eseguire, investigare, stabilizzare e mantenere una suite di test professionale."**

Questo è il passaggio da semplice conoscenza di un framework a una reale competenza di **QA Automation Engineering**.
