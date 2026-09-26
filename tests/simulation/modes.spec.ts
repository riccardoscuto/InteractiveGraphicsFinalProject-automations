import { test, expect } from '@playwright/test';

/**
 * SUITE: Simulation Modes (2D / 3D)
 * 
 * Obiettivo: Validare il passaggio tra le modalità dimensionali (3D e 2D),
 * verificando che il cambio di spazio rigeneri correttamente le strutture dati,
 * mantenga stabile l'interfaccia e consenta l'esecuzione della simulazione in 2D.
 */
test.describe('Simulation Modes (2D / 3D)', () => {

  /**
   * Precondizione comune:
   * Carica la pagina e attende che il canvas sia pronto a schermo intero.
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
   * TC-MOD-01: Passaggio da 3D a modalità 2D
   * Verifica che la selezione della modalità bidimensionale aggiorni il valore del dropdown.
   */
  test('TC-MOD-01: dovrebbe consentire la selezione della modalità 2D', async ({ page }) => {
    const dimensionSelect = page.getByLabel('Dimension:');

    // 1. All'avvio la dimensione di default è 3D
    await expect(dimensionSelect).toHaveValue('3D');

    // 2. Selezioniamo 2D usando il metodo atomico selectOption()
    await dimensionSelect.selectOption('2D');

    // 3. Verifichiamo che il valore selezionato sia ora 2D
    await expect(dimensionSelect).toHaveValue('2D');
  });

  /**
   * TC-MOD-02: Transizione bidirezionale 3D -> 2D -> 3D
   * Verifica che il cambio continuo di dimensione non generi crash nel motore di calcolo o in Three.js.
   */
  test('TC-MOD-02: dovrebbe commutare bidirezionalmente tra 3D e 2D senza crash', async ({ page }) => {
    const errorLogs: string[] = [];
    page.on('pageerror', (err) => errorLogs.push(err.message));

    const dimensionSelect = page.getByLabel('Dimension:');

    // Passaggio 3D -> 2D
    await dimensionSelect.selectOption('2D');
    await expect(dimensionSelect).toHaveValue('2D');

    // Passaggio 2D -> 3D
    await dimensionSelect.selectOption('3D');
    await expect(dimensionSelect).toHaveValue('3D');

    // Ulteriore ciclo per testare la stabilità
    await dimensionSelect.selectOption('2D');
    await expect(dimensionSelect).toHaveValue('2D');

    // Nessun errore di rendering sollevato
    expect(errorLogs).toEqual([]);
  });

  /**
   * TC-MOD-03: Esecuzione della simulazione in modalità 2D
   * Verifica che la simulazione possa essere avviata e messa in pausa regolarmente in 2D.
   */
  test('TC-MOD-03: dovrebbe avviare e fermare la simulazione correttamente in modalità 2D', async ({ page }) => {
    const dimensionSelect = page.getByLabel('Dimension:');
    const playPauseBtn = page.getByRole('button', { name: /^(Start|Pause)$/ });

    // 1. Impostiamo lo spazio 2D
    await dimensionSelect.selectOption('2D');
    await expect(dimensionSelect).toHaveValue('2D');

    // 2. Avviamo la simulazione in 2D
    await expect(playPauseBtn).toHaveText('Start');
    await playPauseBtn.click();
    await expect(playPauseBtn).toHaveText('Pause');

    // 3. Fermiamo la simulazione
    await playPauseBtn.click();
    await expect(playPauseBtn).toHaveText('Start');
  });

  /**
   * TC-MOD-04: Coerenza dell'interfaccia dopo il cambio modalità
   * Verifica che cambiare dimensione mantenga intatti gli altri stati UI (es. Dark Mode, slider velocità).
   */
  test('TC-MOD-04: dovrebbe mantenere coerente lo stato degli altri controlli dopo il cambio dimensione', async ({ page }) => {
    const themeBtn = page.getByRole('button', { name: /^(Dark Mode|Light Mode)$/ });
    const dimensionSelect = page.getByLabel('Dimension:');
    const speedLabel = page.getByText(/Speed: \d+ ms/);

    // 1. Attiviamo la Dark Mode prima del cambio dimensione
    await themeBtn.click();
    await expect(themeBtn).toHaveText('Light Mode');

    // 2. Cambiamo dimensione a 2D
    await dimensionSelect.selectOption('2D');
    await expect(dimensionSelect).toHaveValue('2D');

    // 3. Verifichiamo che il tema sia rimasto attivo (Light Mode proposto) e che lo slider esista ancora
    await expect(themeBtn).toHaveText('Light Mode');
    await expect(speedLabel).toBeVisible();
  });

});
