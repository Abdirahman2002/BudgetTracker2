<script>
  let { data, form } = $props();

  // „Heute"-Button füllt das Datumsfeld auf den heutigen Tag.
  let dateValue = $state(new Date().toISOString().slice(0, 10));
  function setToday() {
    dateValue = new Date().toISOString().slice(0, 10);
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
    <form method="POST" action="?/create">
      <div class="mb-3">
        <label for="amount" class="form-label">Betrag (CHF)</label>
        <input id="amount" name="amount" class="form-control" type="number" step="0.01" min="0.01" required />
        <div class="form-text">Betrag in CHF, z. B. 12.50</div>
      </div>
      <div class="mb-3">
        <label for="category" class="form-label">Kategorie</label>
        <select id="category" name="categoryId" class="form-select" required>
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
        <input id="note" name="note" class="form-control" type="text" placeholder="z. B. Coop Mittagessen" />
      </div>
      <button type="submit" class="btn btn-primary">
        <i class="bi bi-check-lg"></i> Speichern
      </button>
    </form>
  </div>
</div>
