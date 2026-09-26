import { test, expect } from '@playwright/test';

/**
 * SUITE: 3D Camera Controls & Orbit Interactions
 * 
 * Obiettivo: Validare l'interattività dello spazio 3D tramite Three.js OrbitControls,
 * simulando rotazioni (orbit drag), zoom (mouse wheel) e interazioni con la visuale
 * mentre la simulazione è in esecuzione.
 */
test.describe('3D Camera Controls & Orbit Interactions', () => {

  /**
   * Precondizione comune:
   * Carica la pagina e attende che il canvas sia pronto a tutto schermo.
   */
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    await expect(async () => {
      const box = await canvas.boundingBox();
      expect(box!.width).toBeGreaterThan(300);
    }).toPass({ timeout: 5000 });
  });

  /**
   * TC-CAM-01: Rotazione della telecamera (Orbit Drag con tasto sinistro)
   * Simula il click e trascinamento per ruotare la prospettiva della visuale 3D.
   */
  test('TC-CAM-01: dovrebbe consentire la rotazione orbitale 3D tramite drag del mouse sul canvas', async ({ page }) => {
    const errorLogs: string[] = [];
    page.on('pageerror', (err) => errorLogs.push(err.message));

    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();

    // Calcoliamo il centro del canvas per evitare di cliccare sopra al menu laterale
    const startX = box!.x + box!.width * 0.4;
    const startY = box!.y + box!.height * 0.5;

    // 1. Spostiamo il mouse al centro del viewport 3D
    await page.mouse.move(startX, startY);

    // 2. Premiamo il tasto sinistro del mouse
    await page.mouse.down();

    // 3. Trasciniamo il cursore generando eventi intermedi (steps) per azionare l'inerzia di OrbitControls
    await page.mouse.move(startX + 180, startY + 90, { steps: 15 });

    // 4. Rilasciamo il tasto
    await page.mouse.up();

    // Verifichiamo che l'interazione grafica non abbia generato eccezioni nel motore 3D
    expect(errorLogs).toEqual([]);
  });

  /**
   * TC-CAM-02: Zoom In e Zoom Out tramite rotellina del mouse (Wheel)
   * Simula eventi di wheeling per avvicinare e allontanare la telecamera dalla griglia cellulare.
   */
  test('TC-CAM-02: dovrebbe consentire lo zoom in e zoom out tramite rotellina del mouse', async ({ page }) => {
    const errorLogs: string[] = [];
    page.on('pageerror', (err) => errorLogs.push(err.message));

    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();

    const targetX = box!.x + box!.width * 0.4;
    const targetY = box!.y + box!.height * 0.5;

    await page.mouse.move(targetX, targetY);

    // Zoom In (rotellina avanti, delta negativo)
    await page.mouse.wheel(0, -350);

    // Breve pausa naturale per simulare l'utente
    await page.waitForTimeout(200);

    // Zoom Out (rotellina indietro, delta positivo)
    await page.mouse.wheel(0, 350);

    expect(errorLogs).toEqual([]);
  });

  /**
   * TC-CAM-03: Manipolazione della visuale durante l'esecuzione attiva della simulazione
   * Verifica che muovere e ruotare la camera mentre i cubi 3D si generano
   * non provochi crash, lock del rendering loop o errori di stato.
   */
  test('TC-CAM-03: dovrebbe consentire il movimento della camera mentre la simulazione è attiva', async ({ page }) => {
    const errorLogs: string[] = [];
    page.on('pageerror', (err) => errorLogs.push(err.message));

    const playPauseBtn = page.getByRole('button', { name: /^(Start|Pause)$/ });
    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();

    const startX = box!.x + box!.width * 0.4;
    const startY = box!.y + box!.height * 0.5;

    // 1. Avviamo la simulazione (cubi in evoluzione)
    await playPauseBtn.click();
    await expect(playPauseBtn).toHaveText('Pause');

    // 2. Ruotiamo la telecamera mentre le cellule sono in vita
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX - 120, startY + 60, { steps: 10 });
    await page.mouse.up();

    // 3. Eseguiamo uno zoom durante l'animazione
    await page.mouse.wheel(0, -200);

    // 4. Mettiamo in pausa la simulazione
    await playPauseBtn.click();
    await expect(playPauseBtn).toHaveText('Start');

    expect(errorLogs).toEqual([]);
  });

});
