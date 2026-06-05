<script>
  import CategoryBadge from '$lib/components/CategoryBadge.svelte';
  import Money from '$lib/components/Money.svelte';
  import DeleteButton from '$lib/components/DeleteButton.svelte';

  let { data, form } = $props();

  function getCategory(id) {
    return data.categories.find((c) => c._id === id);
  }
</script>

<h1 class="h3 mb-2">Wiederkehrende Transaktionen</h1>
<p class="text-muted">
  Trage hier deine monatlichen Fixkosten ein (Miete, ÖV-Abo, Krankenkasse).
  Sie werden automatisch jeden Monat einmal erzeugt.
</p>

{#if form?.error}
  <div class="alert alert-danger">{form.error}</div>
{/if}

{#if data.recurring.length === 0}
  <div class="alert alert-info">Noch keine wiederkehrenden Transaktionen.</div>
{:else}
  <div class="card border-0 shadow-sm mb-4">
    <ul class="list-group list-group-flush">
      {#each data.recurring as r}
        <li class="list-group-item d-flex justify-content-between align-items-center gap-2">
          <div class="text-truncate">
            <CategoryBadge category={getCategory(r.categoryId)} />
            <small class="text-muted ms-2">am {r.dayOfMonth}.{#if r.note} · {r.note}{/if}</small>
          </div>
          <div class="d-flex align-items-center gap-3 flex-shrink-0">
            <span class="fw-semibold"><Money amount={r.amount} /></span>
            <DeleteButton id={r._id} confirmText="Diese wiederkehrende Transaktion löschen?" />
          </div>
        </li>
      {/each}
    </ul>
  </div>
{/if}

<h2 class="h4 mb-3">Neue wiederkehrende Transaktion</h2>
<div class="card border-0 shadow-sm">
  <div class="card-body p-4">
    <form method="POST" action="?/create">
      <div class="row g-3">
        <div class="col-12 col-md-3">
          <label for="amount" class="form-label">Betrag (CHF)</label>
          <input id="amount" name="amount" class="form-control" type="number" step="0.01" min="0.01" required />
        </div>
        <div class="col-12 col-md-3">
          <label for="categoryId" class="form-label">Kategorie</label>
          <select id="categoryId" name="categoryId" class="form-select" required>
            <option value="">— wählen —</option>
            {#each data.categories as c}
              <option value={c._id}>{c.name}</option>
            {/each}
          </select>
        </div>
        <div class="col-6 col-md-2">
          <label for="dayOfMonth" class="form-label">Tag im Monat</label>
          <input id="dayOfMonth" name="dayOfMonth" class="form-control" type="number" min="1" max="28" value="1" required />
        </div>
        <div class="col-6 col-md-4">
          <label for="note" class="form-label">Notiz</label>
          <input id="note" name="note" class="form-control" type="text" placeholder="z. B. ÖV-Abo" />
        </div>
      </div>
      <button type="submit" class="btn btn-primary mt-3 w-100 w-md-auto">
        <i class="bi bi-plus-lg"></i> Hinzufügen
      </button>
    </form>
  </div>
</div>
