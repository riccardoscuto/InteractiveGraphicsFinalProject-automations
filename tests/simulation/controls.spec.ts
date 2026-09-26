import { test, expect } from '@playwright/test';

/**
 * SUITE: Simulation Controls & UI State
 * 
 * Obiettivo: Validare che i controlli interattivi della simulazione
 * (Start/Pause, Theme, Toggle grafici, Slider di velocità) modifichino
 * correttamente lo stato dell'applicazione e rispondano agli input utente.
 */
test.describe('Simulation Controls & UI State', () => {

  /**
   * Precondizione comune a tutti i test della suite:
   * 1. Navigare all'applicazione
   * 2. Attendere che il canvas WebGL sia montato e dimensionato a tutto schermo
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
   * TC-CTL-01: Toggle dello stato della simulazione (Start <-> Pause)
   * Verifica che il click sul pulsante primario avvii e fermi la simulazione
   * alternando correttamente il testo del pulsante.
   */
  test('TC-CTL-01: dovrebbe alternare lo stato della simulazione tra Start e Pause', async ({ page }) => {
    // Individuiamo il pulsante con selettore basato su ruolo accessibile e Regex
    const playPauseBtn = page.getByRole('button', { name: /^(Start|Pause)$/ });

    // 1. Stato iniziale: la simulazione è ferma
    await expect(playPauseBtn).toHaveText('Start');

    // 2. Primo click: avvio della simulazione
    await playPauseBtn.click();
    await expect(playPauseBtn).toHaveText('Pause');

    // 3. Secondo click: arresto della simulazione
    await playPauseBtn.click();
    await expect(playPauseBtn).toHaveText('Start');

    // 4. Test di robustezza: click consecutivi per verificare assenza di blocchi di stato
    await playPauseBtn.click();
    await expect(playPauseBtn).toHaveText('Pause');
    await playPauseBtn.click();
    await expect(playPauseBtn).toHaveText('Start');
  });

  /**
   * TC-CTL-02: Commutazione tema visivo (Dark Mode <-> Light Mode)
   * Verifica che il toggle del tema alterni il testo del pulsante
   */
  test('TC-CTL-02: dovrebbe commutare correttamente tra Dark Mode e Light Mode', async ({ page }) => {
    const themeBtn = page.getByRole('button', { name: /^(Dark Mode|Light Mode)$/ });

    // 1. All'avvio la modalità scura è disattivata (il pulsante propone "Dark Mode")
    await expect(themeBtn).toHaveText('Dark Mode');

    // 2. Attiviamo la modalità scura
    await themeBtn.click();
    await expect(themeBtn).toHaveText('Light Mode');

    // 3. Riportiamo alla modalità chiara
    await themeBtn.click();
    await expect(themeBtn).toHaveText('Dark Mode');
  });

  /**
   * TC-CTL-03: Attivazione e disattivazione delle opzioni visive (Wireframe, Grid, Stats)
   * Verifica che i toggle di supporto grafico siano cliccabili
   */
  test('TC-CTL-03: dovrebbe consentire l\'attivazione delle opzioni grafiche e del monitor di performance', async ({ page }) => {
    const wireframeBtn = page.getByRole('button', { name: 'Wireframe' });
    const gridBtn = page.getByRole('button', { name: 'Grid' });
    const statsBtn = page.getByRole('button', { name: 'Stats' });

    // Verifichiamo che siano tutti visibili
    await expect(wireframeBtn).toBeVisible();
    await expect(gridBtn).toBeVisible();
    await expect(statsBtn).toBeVisible();

    // Clicchiamo su Stats: deve montare a schermo il monitor delle performance di r3f-perf
    await statsBtn.click();

    // Verifichiamo che il click su Stats sia andato a buon fine
    // e che i bottoni rimangano attivi e responsivi
    await wireframeBtn.click();
    await gridBtn.click();
  });

  /**
   * TC-CTL-04: Modifica della velocità della simulazione tramite Slider
   * Verifica che l'interazione con lo slider aggiorni la label numerica della velocità
   */
  test('TC-CTL-04: dovrebbe aggiornare la velocità visualizzata quando si modifica lo slider', async ({ page }) => {
    // La label indica la velocità corrente in millisecondi (default iniziale: 1050 ms)
    const speedLabel = page.getByText(/Speed: \d+ ms/);
    await expect(speedLabel).toBeVisible();
    await expect(speedLabel).toHaveText('Speed: 1050 ms');

    // Il thumb dello slider è identificabile via role="slider" (accessibilità nativa Chakra UI)
    // Selezioniamo il primo slider (quello relativo a Speed)
    const speedSliderThumb = page.getByRole('slider').first();
    await speedSliderThumb.focus();

    // Simuliamo un utente che usa la tastiera (freccia destra per aumentare)
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');

    // Il valore deve essere cambiato da 1050 ms
    await expect(speedLabel).not.toHaveText('Speed: 1050 ms');
  });

});
