import { defineConfig, devices } from '@playwright/test';

/**
 * FILE DI CONFIGURAZIONE DI PLAYWRIGHT (playwright.config.ts)
 * 
 * Questo file definisce come Playwright esegue i test:
 * - Dove trovare i file di test (testDir)
 * - Come avviare l'applicazione in locale (webServer)
 * - Quali browser utilizzare (projects: Chromium, Firefox, WebKit)
 * - Cosa salvare in caso di fallimento (screenshot, video, trace)
 */
export default defineConfig({
  // Cartella radice in cui Playwright cercherà i file di test (*.spec.ts)
  testDir: './tests',

  // Esegue i test all'interno dello stesso file in parallelo (più veloce)
  fullyParallel: true,

  // Impedisce di lasciare per sbaglio un "test.only" attivo se siamo su GitHub Actions (CI)
  forbidOnly: !!process.env.CI,

  // Se siamo in CI, ripete fino a 2 volte un test fallito (gestione flakiness di rete). In locale: 0.
  retries: process.env.CI ? 2 : 0,

  // Timeout massimo per ciascun singolo test (45 secondi per carichi grafici WebGL/Three.js)
  timeout: 45 * 1000,

  // Numero di worker paralleli: in ambiente 3D/WebGL limitare a 2 evita saturazione di GPU e VRAM
  workers: process.env.CI ? 1 : 2,

  // Tipi di reportistica generati al termine dei test
  reporter: [
    ['list'],                          // Output dettagliato a riga di comando
    ['html', { open: 'never' }]        // Report interattivo in HTML generato in playwright-report/
  ],

  // Configurazioni condivise per tutti i test
  use: {
    // L'URL base dell'applicazione. Ci permette di scrivere page.goto('/') invece dell'URL completo
    baseURL: 'http://localhost:5173',

    // Modalità di cattura artefatti di debug (fondamentali per un QA!)
    trace: 'retain-on-failure',       // Salva il trace completo (passo per passo) solo se il test fallisce
    screenshot: 'only-on-failure',     // Salva uno screenshot della schermata al momento del crash
    video: 'retain-on-failure',        // Salva la registrazione video del test fallito
  },

  // Browser target su cui eseguire i test
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Nota: abiliteremo Firefox e WebKit (Safari) quando faremo cross-browser testing
  ],

  // Avvio automatico del server di sviluppo prima dell'esecuzione dei test
  webServer: {
    command: 'npm run dev',             // Comando per avviare Vite
    url: 'http://localhost:5173',       // URL da attendere prima di far partire i test
    reuseExistingServer: !process.env.CI, // Se il server Vite è già aperto in locale, non riavviarlo
    timeout: 120 * 1000,                // Timeout massimo di attesa (2 minuti)
  },
});
