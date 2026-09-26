# Automation Strategy — Cellular Automata Visualizer

## 1. Filosofia e Principi Guida

La strategia di automazione del progetto si fonda su tre pilastri:
1. **User-Centric Testing**: I test devono rispecchiare fedelmente l'esperienza reale dell'utente finale.
2. **Determinismo e Affidabilità**: Un test che fallisce deve indicare un reale bug applicativo o una regressione, mai instabilità dell'infrastruttura di test (zero tolleranza per flaky test non investigati).
3. **Mantenibilità e No Overengineering**: Il codice di test deve essere lineare, auto-esplicativo e privo di astrazioni premature.

---

## 2. Cosa Automatizzare vs Cosa Lasciare Manuale

### Automatizzato (E2E con Playwright)
- Smoke test critici di caricamento e rendering base.
- Flussi funzionali dei controlli interattivi (Start, Pause, Dark Mode, Toggle grafici, Slider).
- Transizioni tra modalità 2D e 3D.
- Caricamento dei preset di regole con aggiornamento parametri a cascata.
- Interazioni fisiche con la visuale 3D (drag orbit e wheel zoom con Three.js OrbitControls).
- Regression testing continuo via pipeline CI/CD.

### Lasciato al Testing Manuale / Esplorativo
- Valutazione estetica dell'antialiasing e del bloom shader.
- Piacevolezza del gradiente cromatico e delle palette colori.
- Benchmark di fluidità a 60 FPS con carichi estremi (es. griglia 90x90).
- Verifica visiva esplorativa di decine di configurazioni di pattern caotici complessi.

---

## 3. Strategia dei Locator (Selettori)

Per garantire la massima robustezza contro modifiche al layout o refactoring CSS (es. classi generate dinamicamente da Chakra UI):

1. **Priorità 1 - Ruoli Accessibili ARIA (`getByRole`)**:
   - `page.getByRole('button', { name: 'Start' })`
   - `page.getByRole('slider')`
2. **Priorità 2 - Etichette dei Form (`getByLabel`)**:
   - `page.getByLabel('Dimension:')`
   - `page.getByLabel('Select Rule:')`
3. **Priorità 3 - Testo Visibile Utente (`getByText`)**:
   - `page.getByText(/Speed: \d+ ms/)`
4. **Elementi Speciali (Canvas WebGL)**:
   - `page.locator('canvas')` combinato con asserzioni esplicite su dimensioni (`boundingBox`) per attendere il resize asincrono di Three.js.

❌ **Anti-pattern vietati**: selettori XPath rigidi (`/html/body/div[1]/...`), classi CSS casuali (`.css-1f4r8z`), ID generati a runtime.

---

## 4. Gestione dei Dati di Test (Test Data)

- **Configurazioni Statiche**: L'applicazione include un catalogo predefinito in `src/config/rules.json`. I test sfruttano i preset noti (es. *"Diamond - 2D"*) come benchmark deterministici per verificare le relazioni causa-effetto tra regole e parametri.
- **Isolamento dei Test**: Ogni test gira in un **Browser Context separato**, garantendo che non vi sia interferenza di stato residuo o cache cross-test.

---

## 5. Prevenzione e Risoluzione dei Flaky Test

Durante lo sviluppo della suite sono state affrontate e risolte due tipiche problematiche di flakiness in ambito WebGL:

### A. La "Weak Assertion" sul Canvas HTML5
- **Problema**: `expect(canvas).toBeVisible()` passava in 29ms mentre il canvas era ancora al formato di fallback HTML5 (300x150px), prima che React Three Fiber completasse il ridimensionamento a tutto schermo.
- **Soluzione applicata**: Uso di `toPass()` per verificare che il bounding box del canvas superi le dimensioni 300x150, garantendo che il motore 3D sia effettivamente agganciato e scalato al viewport.

### B. GPU Contention con Worker Paralleli Multipli
- **Problema**: Eseguire 6 browser headless con Three.js e shader Bloom contemporaneamente ha causato saturazione della scheda video locale, portando test complessi come `TC-CAM-03` a superare il timeout di 30s.
- **Soluzione applicata**: Limitare la concorrenza locale a 2 worker (`workers: 2`) e timeout esteso a 45s. Risultato: tempi di esecuzione crollati da 25s a 2-7s a test e stabilità al 100%.

---

## 6. Strategia di Reporting e Debugging

In caso di fallimento, la suite è configurata per generare:
1. **Trace Viewer Playwright (`retain-on-failure`)**: Esamina l'intero log temporale, le chiamate API, la console e gli stati del DOM prima e dopo ogni click.
2. **Screenshot on Failure (`only-on-failure`)**: Cattura l'immagine esatta dello schermo all'istante del fallimento.
3. **Video on Failure (`retain-on-failure`)**: Registrazione video del browser durante l'esecuzione fallita.
4. **HTML Report**: Report sintetico interattivo fruibile in locale con `npm run test:e2e:report` e pubblicato come artefatto scaricabile in CI.

---

## 7. Strategia Cross-Browser

- **Fase Attuale**: Chromium come browser primario per rapidità ed esecuzione standard WebGL.
- **Fase Futura**: Estensione della matrice a Firefox e WebKit (Safari) in ambiente headless tramite progetti mirati in `playwright.config.ts`.

---

## 8. Strategia CI/CD (GitHub Actions)

- **Trigger**: Esecuzione automatica a ogni `push` e `pull_request` sul branch `main`.
- **Ambiente**: Runner Ubuntu Latest con installazione di Node.js, dipendenze npm e binari browser con relative dipendenze di sistema (`npx playwright install --with-deps chromium`).
- **Artefatti**: Salvataggio garantito (`if: always()`) della cartella `playwright-report/` per consentire l'ispezione immediata delle run remote.
