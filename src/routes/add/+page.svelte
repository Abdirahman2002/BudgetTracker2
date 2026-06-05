<script>
  let { data, form } = $props();

  let amountValue = $state("");
  let dateValue = $state(new Date().toISOString().slice(0, 10));
  let noteValue = $state("");
  let categoryValue = $state("");

  // Beleg-Scan (#19/#20)
  let fileInput;
  let previewUrl = $state("");
  let scanning = $state(false);
  let scanMessage = $state("");
  let scanError = $state(false);

  function setToday() {
    dateValue = new Date().toISOString().slice(0, 10);
  }

  function onFileChange(event) {
    const file = event.target.files?.[0];
    previewUrl = file ? URL.createObjectURL(file) : "";
    scanMessage = "";
    scanError = false;
  }

  async function scanReceipt() {
    const file = fileInput?.files?.[0];
    if (!file) {
      scanError = true;
      scanMessage = "Bitte zuerst ein Belegfoto auswählen.";
      return;
    }
    scanning = true;
    scanError = false;
    scanMessage = "Beleg wird ausgelesen …";
    try {
      const body = new FormData();
      body.append("receipt", file);
      const res = await fetch("/add/scan", { method: "POST", body });
      const result = await res.json();
      if (result.error) {
        scanError = true;
        scanMessage = result.error;
        return;
      }
      // Erkannte Werte vorbelegen — der Nutzer prüft und bestätigt (#21/#22).
      if (result.amount != null) amountValue = String(result.amount);
      if (result.date) dateValue = result.date;
      if (result.merchant) noteValue = result.merchant;
      if (result.categoryId) categoryValue = result.categoryId;
      scanMessage = "Erkannt. Bitte die Werte prüfen und bestätigen.";
    } catch (e) {
      scanError = true;
      scanMessage = "Auslesen fehlgeschlagen. Bitte die Werte von Hand eingeben.";
    } finally {
      scanning = false;
    }
  }
</script>

<a href="/" class="btn btn-outline-secondary btn-sm mb-3">
  <i class="bi bi-arrow-left"></i> Zurück
</a>

<h1 class="mb-4">Ausgabe erfassen</h1>

{#if form?.error}
  <div class="alert alert-danger" role="alert">{form.error}</div>
{/if}
{#if form?.success}
  <div class="alert alert-success" role="alert">Transaktion gespeichert.</div>
{/if}

<div class="card">
  <div class="card-body">


    <div class="mb-4 p-3 border rounded bg-light">
      <label for="receipt" class="form-label fw-semibold">
        <i class="bi bi-camera"></i> Beleg scannen <span class="text-muted fw-normal">(optional)</span>
      </label>
      <input
        id="receipt"
        class="form-control"
        type="file"
        accept="image/*"
        capture="environment"
        bind:this={fileInput}
        onchange={onFileChange}
      />
      <div class="form-text">Foto vom Kassenbeleg — wird automatisch ausgelesen und füllt die Felder vor.</div>

      {#if previewUrl}
        <div class="mt-3 text-center">
          <img src={previewUrl} alt="Beleg-Vorschau" class="img-fluid rounded border" style="max-height: 220px;" />
        </div>
      {/if}

      <button type="button" class="btn btn-outline-primary w-100 mt-3" onclick={scanReceipt} disabled={scanning}>
        {#if scanning}
          <span class="spinner-border spinner-border-sm me-1"></span> Wird ausgelesen …
        {:else}
          <i class="bi bi-magic"></i> Beleg auslesen
        {/if}
      </button>

      {#if scanMessage}
        <div class="alert {scanError ? 'alert-warning' : 'alert-info'} mt-3 mb-0 py-2" role="status">
          {scanMessage}
        </div>
      {/if}
    </div>

    <form method="POST" action="?/create">
      <div class="mb-3">
        <label for="amount" class="form-label">Betrag (CHF)</label>
        <input id="amount" name="amount" class="form-control" type="number" step="0.01" min="0.01"
               bind:value={amountValue} required />
        <div class="form-text">Betrag in CHF, z. B. 12.50</div>
      </div>
      <div class="mb-3">
        <label for="category" class="form-label">Kategorie</label>
        <select id="category" name="categoryId" class="form-select" bind:value={categoryValue} required>
          <option value="">— wählen —</option>
          {#each data.categories as c}
            <option value={c._id}>{c.name}</option>
          {/each}
        </select>
      </div>
      <div class="mb-3">
        <label for="date" class="form-label">Datum</label>
        <div class="input-group">
          <input id="date" name="date" class="form-control" type="date" bind:value={dateValue} required />
          <button type="button" class="btn btn-outline-secondary" onclick={setToday}>
            <i class="bi bi-calendar-event"></i> Heute
          </button>
        </div>
      </div>
      <div class="mb-3">
        <label for="note" class="form-label">Notiz</label>
        <input id="note" name="note" class="form-control" type="text" bind:value={noteValue}
               placeholder="z. B. Coop Mittagessen" />
      </div>
      <button type="submit" class="btn btn-primary">
        <i class="bi bi-check-lg"></i> Speichern
      </button>
    </form>
  </div>
</div>
