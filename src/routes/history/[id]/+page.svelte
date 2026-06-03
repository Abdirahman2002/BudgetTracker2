<script>
  let { data, form } = $props();
</script>

<a href="/history" class="btn btn-outline-secondary btn-sm mb-3">
  <i class="bi bi-arrow-left"></i> Zurück zum Verlauf
</a>

<h1 class="h3 mb-4">Transaktion bearbeiten</h1>

{#if form?.error}
  <div class="alert alert-danger">{form.error}</div>
{/if}

<div class="row justify-content-center">
  <div class="col-12 col-lg-7">
    <div class="card border-0 shadow-sm">
      <div class="card-body p-4">
        <form method="POST" action="?/update">
          <div class="mb-3">
            <label for="amount" class="form-label">Betrag (CHF)</label>
            <input id="amount" name="amount" class="form-control" type="number" step="0.01" min="0.01"
                   value={data.transaction.amount} required />
          </div>
          <div class="mb-3">
            <label for="category" class="form-label">Kategorie</label>
            <select id="category" name="categoryId" class="form-select" required>
              {#each data.categories as c}
                <option value={c._id} selected={c._id === data.transaction.categoryId}>{c.name}</option>
              {/each}
            </select>
          </div>
          <div class="mb-3">
            <label for="date" class="form-label">Datum</label>
            <input id="date" name="date" class="form-control" type="date"
                   value={data.transaction.date} required />
          </div>
          <div class="mb-3">
            <label for="note" class="form-label">Notiz</label>
            <input id="note" name="note" class="form-control" type="text"
                   value={data.transaction.note} />
          </div>
          <button type="submit" class="btn btn-primary w-100">
            <i class="bi bi-check-lg"></i> Speichern
          </button>
        </form>
      </div>
    </div>
  </div>
</div>
