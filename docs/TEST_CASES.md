# Test Cases — Cellular Automata Visualizer

Questo documento traccia i casi di test funzionali ed E2E progettati per l'applicazione, specificando le precondizioni, i passi di esecuzione, l'esito atteso, la priorità e lo stato di automazione.

---

## 1. Smoke Tests (`tests/smoke/`)

| ID | Titolo | Priorità | Stato Automazione | File di Riferimento |
| :--- | :--- | :--- | :--- | :--- |
| **TC-SMK-01** | Caricamento dell'applicazione e rendering del canvas Three.js a tutto schermo | Critica (P0) | Automated | `tests/smoke/app-load.spec.ts` |
| **TC-SMK-02** | Presenza dei controlli primari dell'interfaccia utente | Alta (P1) | Automated | `tests/smoke/app-load.spec.ts` |
| **TC-SMK-03** | Assenza di errori non gestiti o crash console all'avvio | Alta (P1) | Automated | `tests/smoke/app-load.spec.ts` |

---

## 2. Controlli della Simulazione (`tests/simulation/`)

| ID | Titolo | Priorità | Stato Automazione | File di Riferimento |
| :--- | :--- | :--- | :--- | :--- |
| **TC-CTL-01** | Alternanza dello stato della simulazione tra Start e Pause | Critica (P0) | Automated | `tests/simulation/controls.spec.ts` |
| **TC-CTL-02** | Commutazione tema visivo tra Dark Mode e Light Mode | Media (P2) | Automated | `tests/simulation/controls.spec.ts` |
| **TC-CTL-03** | Attivazione opzioni grafiche e monitor performance (Stats) | Media (P2) | Automated | `tests/simulation/controls.spec.ts` |
| **TC-CTL-04** | Aggiornamento valore velocità tramite interazione con lo Slider | Alta (P1) | Automated | `tests/simulation/controls.spec.ts` |

---

## 3. Modalità Dimensionali 2D / 3D (`tests/simulation/`)

| ID | Titolo | Priorità | Stato Automazione | File di Riferimento |
| :--- | :--- | :--- | :--- | :--- |
| **TC-MOD-01** | Selezione della modalità bidimensionale (2D) | Alta (P1) | Automated | `tests/simulation/modes.spec.ts` |
| **TC-MOD-02** | Transizione bidirezionale 3D -> 2D -> 3D senza crash di rendering | Alta (P1) | Automated | `tests/simulation/modes.spec.ts` |
| **TC-MOD-03** | Esecuzione e controllo della simulazione in modalità 2D | Critica (P0) | Automated | `tests/simulation/modes.spec.ts` |
| **TC-MOD-04** | Coerenza e persistenza dello stato UI dopo il cambio di dimensione | Media (P2) | Automated | `tests/simulation/modes.spec.ts` |

---

## 4. Configurazione Regole e Neighborhood (`tests/configuration/`)

| ID | Titolo | Priorità | Stato Automazione | File di Riferimento |
| :--- | :--- | :--- | :--- | :--- |
| **TC-CFG-01** | Caricamento preset di regole e aggiornamento parametri a cascata | Alta (P1) | Automated | `tests/configuration/rules.spec.ts` |
| **TC-CFG-02** | Safety Check: arresto automatico della simulazione al cambio regola | Alta (P1) | Automated | `tests/configuration/rules.spec.ts` |
| **TC-CFG-03** | Commutazione vicinato tra Moore e Von Neumann | Media (P2) | Automated | `tests/configuration/rules.spec.ts` |
| **TC-CFG-04** | Modifica dimensione griglia (Size) tramite Slider | Media (P2) | Automated | `tests/configuration/rules.spec.ts` |

---

## 5. Controlli Camera 3D e OrbitControls (`tests/simulation/`)

| ID | Titolo | Priorità | Stato Automazione | File di Riferimento |
| :--- | :--- | :--- | :--- | :--- |
| **TC-CAM-01** | Rotazione orbitale 3D tramite drag del mouse sul canvas | Alta (P1) | Automated | `tests/simulation/camera.spec.ts` |
| **TC-CAM-02** | Zoom in e zoom out tramite rotellina del mouse (Wheel) | Alta (P1) | Automated | `tests/simulation/camera.spec.ts` |
| **TC-CAM-03** | Manipolazione della visuale durante simulazione attiva | Alta (P1) | Automated | `tests/simulation/camera.spec.ts` |

---

### Dettaglio Casi di Test Smoke

#### TC-SMK-01: Caricamento dell'applicazione e rendering del canvas Three.js a tutto schermo
- **Priorità**: Critica (P0)
- **Stato Automazione**: Automated (`tests/smoke/app-load.spec.ts`)
- **Precondizioni**: L'ambiente locale o di staging è attivo e raggiungibile.
- **Passi**:
  1. Aprire il browser e navigare all'URL di base dell'applicazione (`/`).
  2. Attendere che il canvas WebGL entri nel DOM e diventi visibile.
  3. Verificare che il motore React Three Fiber completi il ridimensionamento a tutto schermo (superando i 300x150px di fallback standard HTML5).
- **Risultato Atteso**:
  - La pagina risponde con status HTTP 200.
  - L'elemento `<canvas>` (viewport di rendering Three.js) è presente nel DOM, visibile e ridimensionato alle proporzioni della viewport (>300px larghezza, >150px altezza).

#### TC-SMK-02: Presenza dei controlli primari dell'interfaccia utente
- **Priorità**: Alta (P1)
- **Stato Automazione**: Automated (`tests/smoke/app-load.spec.ts`)
- **Precondizioni**: Applicazione avviata con successo e canvas inizializzato.
- **Passi**:
  1. Navigare all'URL di base (`/`).
  2. Verificare la visibilità dei pulsanti principali nel pannello laterale.
  3. Verificare i valori di default dei controlli di configurazione iniziale.
- **Risultato Atteso**:
  - Il pulsante `Start` è visibile.
  - Il pulsante per il tema `Dark Mode` è visibile.
  - Il selettore della dimensione `Dimension:` è visibile e impostato di default su `3D`.

#### TC-SMK-03: Assenza di eccezioni JavaScript o crash console all'avvio
- **Priorità**: Alta (P1)
- **Stato Automazione**: Automated (`tests/smoke/app-load.spec.ts`)
- **Precondizioni**: Il listener per gli eventi `pageerror` è registrato prima della navigazione.
- **Passi**:
  1. Avviare l'ascolto degli errori di runtime del browser (`pageerror`).
  2. Eseguire la navigazione a `/`.
  3. Attendere che il canvas sia completamente dimensionato.
- **Risultato Atteso**:
  - Nessuna eccezione JavaScript non gestita viene generata durante il ciclo di vita di montaggio del componente React o durante l'inizializzazione del contesto WebGL.

---

### Dettaglio Casi di Test Controlli Simulazione

#### TC-CTL-01: Alternanza dello stato della simulazione tra Start e Pause
- **Priorità**: Critica (P0)
- **Stato Automazione**: Automated (`tests/simulation/controls.spec.ts`)
- **Precondizioni**: Applicazione caricata con simulazione ferma.
- **Passi**:
  1. Verificare che il pulsante mostri il testo iniziale `Start`.
  2. Cliccare sul pulsante `Start`.
  3. Verificare che il testo del pulsante cambi in `Pause`.
  4. Cliccare sul pulsante `Pause`.
  5. Verificare che il testo torni `Start`.
  6. Eseguire click multipli per confermare l'assenza di race condition sullo stato React.
- **Risultato Atteso**:
  - L'etichetta del pulsante si alterna coerentemente a ogni interazione senza blocchi dello stato.

#### TC-CTL-02: Commutazione tema visivo tra Dark Mode e Light Mode
- **Priorità**: Media (P2)
- **Stato Automazione**: Automated (`tests/simulation/controls.spec.ts`)
- **Precondizioni**: Applicazione caricata in modalità Light (default).
- **Passi**:
  1. Verificare che il pulsante mostri `Dark Mode`.
  2. Cliccare sul pulsante.
  3. Verificare che il pulsante commuti la dicitura in `Light Mode`.
  4. Cliccare nuovamente e verificare il ripristino di `Dark Mode`.
- **Risultato Atteso**:
  - Il tema commuta regolarmente e la label del pulsante riflette l'azione disponibile.

#### TC-CTL-03: Attivazione opzioni grafiche e monitor performance (Stats)
- **Priorità**: Media (P2)
- **Stato Automazione**: Automated (`tests/simulation/controls.spec.ts`)
- **Precondizioni**: Applicazione caricata.
- **Passi**:
  1. Verificare la presenza dei pulsanti `Wireframe`, `Grid`, `Stats`.
  2. Cliccare sul pulsante `Stats` per attivare il monitor FPS WebGL.
  3. Cliccare su `Wireframe` e `Grid`.
- **Risultato Atteso**:
  - I controlli rimangono interattivi e non provocano eccezioni a runtime nel context Three.js.

#### TC-CTL-04: Aggiornamento valore velocità tramite Slider
- **Priorità**: Alta (P1)
- **Stato Automazione**: Automated (`tests/simulation/controls.spec.ts`)
- **Precondizioni**: Applicazione caricata con slider velocità al valore di default (50 -> 1050 ms).
- **Passi**:
  1. Verificare la label iniziale `Speed: 1050 ms`.
  2. Portare il focus sullo slider tramite ruolo accessibile.
  3. Inviare eventi di pressione tastiera (`ArrowRight`).
  4. Verificare l'aggiornamento del testo della label.
- **Risultato Atteso**:
  - La label numerica visualizza in tempo reale il nuovo valore calcolato in millisecondi.

---

### Dettaglio Casi di Test Modalità 2D / 3D

#### TC-MOD-01: Selezione della modalità bidimensionale (2D)
- **Priorità**: Alta (P1)
- **Stato Automazione**: Automated (`tests/simulation/modes.spec.ts`)
- **Precondizioni**: Applicazione caricata in modalità 3D (default).
- **Passi**:
  1. Verificare che la dropdown `Dimension:` abbia valore `3D`.
  2. Selezionare l'opzione `2D` via `selectOption('2D')`.
  3. Verificare che la dropdown rifletta il nuovo valore `2D`.
- **Risultato Atteso**:
  - Il valore viene aggiornato e la nuova vista 2D viene calcolata.

#### TC-MOD-02: Transizione bidirezionale 3D -> 2D -> 3D
- **Priorità**: Alta (P1)
- **Stato Automazione**: Automated (`tests/simulation/modes.spec.ts`)
- **Precondizioni**: Applicazione caricata e listener errori di runtime attivo.
- **Passi**:
  1. Commutare la dimensione da `3D` a `2D`.
  2. Commutare nuovamente da `2D` a `3D`.
  3. Eseguire un terzo cambio a `2D`.
  4. Verificare l'assenza di eccezioni JavaScript o WebGL.
- **Risultato Atteso**:
  - Le matrici si rigenerano senza produrre errori di rendering o blocchi di esecuzione.

#### TC-MOD-03: Esecuzione e controllo della simulazione in modalità 2D
- **Priorità**: Critica (P0)
- **Stato Automazione**: Automated (`tests/simulation/modes.spec.ts`)
- **Precondizioni**: Modalità 2D impostata.
- **Passi**:
  1. Verificare che il pulsante mostri `Start`.
  2. Cliccare su `Start`.
  3. Verificare che il testo diventi `Pause`.
  4. Cliccare su `Pause` e verificare che torni `Start`.
- **Risultato Atteso**:
  - Il ciclo di vita della simulazione risponde ai comandi dell'utente anche nello spazio 2D.

#### TC-MOD-04: Coerenza e persistenza dello stato UI dopo il cambio di dimensione
- **Priorità**: Media (P2)
- **Stato Automazione**: Automated (`tests/simulation/modes.spec.ts`)
- **Precondizioni**: Applicazione caricata.
- **Passi**:
  1. Attivare la Dark Mode.
  2. Cambiare la dimensione in `2D`.
  3. Verificare che la Dark Mode rimanga attiva e che gli slider e label rimangano visibili.
- **Risultato Atteso**:
  - Il cambio di dimensione non azzera inaspettatamente lo stato degli altri controlli UI.

---

### Dettaglio Casi di Test Configurazione Regole

#### TC-CFG-01: Caricamento preset di regole e aggiornamento parametri a cascata
- **Priorità**: Alta (P1)
- **Stato Automazione**: Automated (`tests/configuration/rules.spec.ts`)
- **Precondizioni**: Applicazione caricata con valori predefiniti.
- **Passi**:
  1. Selezionare il preset "Diamond - 2D" dalla dropdown `Select Rule:`.
  2. Verificare l'aggiornamento automatico della dimensione in `2D`.
  3. Verificare l'aggiornamento della dimensione griglia a `Size: 18`.
  4. Verificare l'impostazione del parametro `Birth: 3`.
- **Risultato Atteso**:
  - Tutti i controlli riflettono fedelmente i dati definiti nel file `rules.json`.

#### TC-CFG-02: Safety Check: arresto automatico della simulazione al cambio regola
- **Priorità**: Alta (P1)
- **Stato Automazione**: Automated (`tests/configuration/rules.spec.ts`)
- **Precondizioni**: Simulazione avviata (`Pause`).
- **Passi**:
  1. Cliccare sul selettore delle regole.
  2. Verificare che la simulazione venga fermata (`Start`).
- **Risultato Atteso**:
  - Il sistema arresta la simulazione per prevenire race conditions nel rendering dei nuovi punti di spawn.

#### TC-CFG-03: Commutazione vicinato tra Moore e Von Neumann
- **Priorità**: Media (P2)
- **Stato Automazione**: Automated (`tests/configuration/rules.spec.ts`)
- **Precondizioni**: Applicazione caricata con vicinato Moore (M).
- **Passi**:
  1. Selezionare l'opzione Von Neumann (`VN`).
  2. Verificare il valore selezionato.
  3. Selezionare nuovamente Moore (`M`).
- **Risultato Atteso**:
  - Il vicinato viene aggiornato senza eccezioni.

#### TC-CFG-04: Modifica dimensione griglia (Size) tramite Slider
- **Priorità**: Media (P2)
- **Stato Automazione**: Automated (`tests/configuration/rules.spec.ts`)
- **Precondizioni**: Applicazione caricata con Size = 4.
- **Passi**:
  1. Selezionare lo slider della dimensione griglia.
  2. Modificare il valore tramite input tastiera.
  3. Verificare l'aggiornamento della label `Size: X`.
- **Risultato Atteso**:
  - La dimensione viene modificata e la label visualizza il nuovo valore.

---

### Dettaglio Casi di Test Camera 3D e OrbitControls

#### TC-CAM-01: Rotazione orbitale 3D tramite drag del mouse sul canvas
- **Priorità**: Alta (P1)
- **Stato Automazione**: Automated (`tests/simulation/camera.spec.ts`)
- **Precondizioni**: Canvas 3D renderizzato.
- **Passi**:
  1. Spostare il puntatore al centro del viewport 3D.
  2. Eseguire `mouse.down()`.
  3. Tracciare un movimento con interpolazione di step (`steps: 15`).
  4. Eseguire `mouse.up()`.
- **Risultato Atteso**:
  - OrbitControls applica la rotazione senza generare eccezioni WebGL.

#### TC-CAM-02: Zoom in e zoom out tramite rotellina del mouse (Wheel)
- **Priorità**: Alta (P1)
- **Stato Automazione**: Automated (`tests/simulation/camera.spec.ts`)
- **Precondizioni**: Canvas 3D renderizzato.
- **Passi**:
  1. Spostare il mouse sul canvas.
  2. Inviare un evento wheel negativo (zoom in).
  3. Inviare un evento wheel positivo (zoom out).
- **Risultato Atteso**:
  - Il viewport risponde alle variazioni di zoom senza crash.

#### TC-CAM-03: Manipolazione della visuale durante simulazione attiva
- **Priorità**: Alta (P1)
- **Stato Automazione**: Automated (`tests/simulation/camera.spec.ts`)
- **Precondizioni**: Simulazione avviata (`Start` -> `Pause`).
- **Passi**:
  1. Ruotare la telecamera tramite drag del mouse mentre la simulazione evolve.
  2. Eseguire zoom in/out durante il rendering dei cubi.
  3. Fermare la simulazione.
- **Risultato Atteso**:
  - Concorrenza fluida tra loop grafico, simulazione cellulare e interazione utente.
