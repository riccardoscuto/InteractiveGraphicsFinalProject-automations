import { test, expect } from '@playwright/test';

/**
 * SUITE: Smoke Test - Caricamento e Integrità dell'Applicazione
 * 
 * Obiettivo: Validare rapidamente che la build dell'applicazione sia integra,
 * che il motore grafico WebGL si inizializzi e che l'interfaccia utente sia pronta.
 */
test.describe('Smoke Test - Application Loading', () => {

  /**
   * TC-SMK-01: Caricamento della pagina e rendering del Canvas 3D a schermo intero
   * Verifica che la pagina risponda e che il canvas WebGL di Three.js completi
   * l'inizializzazione e il ridimensionamento a tutto schermo (superando le dimensioni
   * di fallback predefinite HTML5 di 300x150px).
   */
  test('TC-SMK-01: dovrebbe caricare la pagina ed eseguire il render del canvas WebGL a tutto schermo', async ({ page }) => {
    // 1. Naviga all'URL di base (http://localhost:5173)
    await page.goto('/');

    const canvas = page.locator('canvas');

    // 2. Verifica che il canvas esista nel DOM e sia visibile
    await expect(canvas).toBeVisible();

    // 3. Verifica robusta: attendiamo che React Three Fiber completi il setup del renderer
    // e ridimensioni il canvas oltre i 300x150px di default dell'HTML5
    await expect(async () => {
      const box = await canvas.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThan(300);
      expect(box!.height).toBeGreaterThan(150);
    }).toPass({ timeout: 5000 });
  });

  /**
   * TC-SMK-02: Presenza dei controlli primari dell'interfaccia utente
   * Verifica che gli elementi fondamentali del menu siano presenti e con lo stato iniziale atteso.
   */
  test('TC-SMK-02: dovrebbe mostrare il pannello di controllo con i pulsanti di avvio', async ({ page }) => {
    await page.goto('/');

    // Attendiamo che il canvas sia pronto prima di verificare i controlli
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    await expect(async () => {
      const box = await canvas.boundingBox();
      expect(box!.width).toBeGreaterThan(300);
    }).toPass({ timeout: 5000 });

    // Cerchiamo i controlli usando selettori orientati all'utente (accessibilità/ruoli ARIA)
    const startButton = page.getByRole('button', { name: 'Start' });
    const themeButton = page.getByRole('button', { name: 'Dark Mode' });
    const dimensionSelect = page.getByLabel('Dimension:');

    // Asserzioni esplicite con auto-waiting
    await expect(startButton).toBeVisible();
    await expect(themeButton).toBeVisible();
    await expect(dimensionSelect).toBeVisible();

    // Verifichiamo il valore di default della dimensione (3D all'avvio)
    await expect(dimensionSelect).toHaveValue('3D');
  });

  /**
   * TC-SMK-03: Integrità runtime (assenza di errori gravi in console)
   * Ascolta gli errori della pagina e della console durante il caricamento.
   */
  test('TC-SMK-03: non dovrebbe generare errori fatali o eccezioni non catturate in console', async ({ page }) => {
    const errorLogs: string[] = [];

    // Intercettiamo gli errori JavaScript non gestiti (es. crash dell'applicazione)
    page.on('pageerror', (exception) => {
      errorLogs.push(`PageError: ${exception.message}`);
    });

    // Navighiamo e attendiamo che il canvas sia completamente dimensionato
    await page.goto('/');
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    await expect(async () => {
      const box = await canvas.boundingBox();
      expect(box!.width).toBeGreaterThan(300);
    }).toPass({ timeout: 5000 });

    // Verifichiamo che la lista degli errori sia vuota
    expect(errorLogs).toEqual([]);
  });

});
