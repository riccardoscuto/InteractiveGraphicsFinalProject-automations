import { test, expect } from '@playwright/test';

/**
 * SUITE: Rules Configuration & Neighborhood
 * 
 * Obiettivo: Validare la configurazione delle regole di simulazione
 * (preset da catalogo, cascata dei parametri, safety check di arresto,
 * vicinati di Moore / Von Neumann e dimensione griglia).
 */
test.describe('Rules Configuration & Neighborhood', () => {

  /**
   * Precondizione comune:
   * Carica la pagina e attende che il canvas sia completamente pronto a schermo intero.
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
   * TC-CFG-01: Caricamento di un preset di regole da catalogo (es. "Diamond - 2D")
   * Verifica che la selezione di un preset aggiorni a cascata la dimensione,
   * la dimensione della griglia (Size) e i parametri vitali delle cellule.
   */
  test('TC-CFG-01: dovrebbe caricare un preset di regole e aggiornare i parametri a cascata', async ({ page }) => {
    const ruleSelect = page.getByLabel('Select Rule:');
    const dimensionSelect = page.getByLabel('Dimension:');
    const sizeLabel = page.getByText(/Size: \d+/);
    const birthLabel = page.getByText(/Birth: \d+/);

    // Verifichiamo lo stato iniziale (default: 3D, Size: 4)
    await expect(dimensionSelect).toHaveValue('3D');
    await expect(sizeLabel).toHaveText('Size: 4');

    // Selezioniamo il preset "Diamond - 2D" dalla select delle regole
    await ruleSelect.selectOption({ label: 'Diamond - 2D' });

    // Verifichiamo che la dimensione sia passata automaticamente a 2D
    await expect(dimensionSelect).toHaveValue('2D');

    // Verifichiamo che la dimensione della griglia (lato) sia diventata 18 come da preset
    await expect(sizeLabel).toHaveText('Size: 18');

    // Verifichiamo che il parametro Birth sia configurato a 3
    await expect(birthLabel).toHaveText('Birth: 3');
  });

  /**
   * TC-CFG-02: Safety Check - arresto automatico della simulazione al cambio regola
   * Verifica che se la simulazione è in esecuzione, l'interazione con il selettore
   * delle regole metta automaticamente in pausa la simulazione per prevenire race conditions.
   */
  test('TC-CFG-02: dovrebbe arrestare automaticamente una simulazione in corso quando si seleziona una nuova regola', async ({ page }) => {
    const playPauseBtn = page.getByRole('button', { name: /^(Start|Pause)$/ });
    const ruleSelect = page.getByLabel('Select Rule:');

    // 1. Avviamo la simulazione (il pulsante diventa "Pause")
    await playPauseBtn.click();
    await expect(playPauseBtn).toHaveText('Pause');

    // 2. L'utente clicca sul selettore delle regole per cambiare configurazione
    await ruleSelect.click();

    // 3. Verifica di sicurezza: il sistema deve aver automaticamente fermato la simulazione (torna "Start")
    await expect(playPauseBtn).toHaveText('Start');
  });

  /**
   * TC-CFG-03: Commutazione del tipo di vicinato (Moore <-> Von Neumann)
   * Verifica che sia possibile alternare tra il vicinato di Moore ('M') e quello di Von Neumann ('VN').
   */
  test('TC-CFG-03: dovrebbe consentire il cambio di vicinato tra Moore e Von Neumann', async ({ page }) => {
    const neighborhoodSelect = page.getByLabel('Neighborhood :');

    // 1. All'avvio il vicinato di default è Moore ('M')
    await expect(neighborhoodSelect).toHaveValue('M');

    // 2. Selezioniamo Von Neumann ('VN')
    await neighborhoodSelect.selectOption('VN');
    await expect(neighborhoodSelect).toHaveValue('VN');

    // 3. Torniamo a Moore ('M')
    await neighborhoodSelect.selectOption('M');
    await expect(neighborhoodSelect).toHaveValue('M');
  });

  /**
   * TC-CFG-04: Modifica della dimensione della griglia (Size) tramite Slider
   * Verifica che muovendo lo slider della dimensione il valore numerico visualizzato si aggiorni.
   */
  test('TC-CFG-04: dovrebbe aggiornare la dimensione della griglia quando si interagisce con lo slider Size', async ({ page }) => {
    const sizeLabel = page.getByText(/Size: \d+/);
    await expect(sizeLabel).toHaveText('Size: 4');

    // Troviamo tutti gli slider e selezioniamo quello dedicato alla Size (il secondo nel pannello)
    const sliders = page.getByRole('slider');
    const sizeSlider = sliders.nth(1);

    await sizeSlider.focus();

    // Inviamo tasti freccia destra per aumentare la dimensione
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');

    // La dimensione deve essere aumentata oltre il valore iniziale 4
    await expect(sizeLabel).not.toHaveText('Size: 4');
  });

});
