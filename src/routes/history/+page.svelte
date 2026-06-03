<script>
  import CategoryBadge from '$lib/components/CategoryBadge.svelte';
  import Money from '$lib/components/Money.svelte';
  import DeleteButton from '$lib/components/DeleteButton.svelte';

  let { data, form } = $props();

  // Wenn gefiltert wurde, das Ergebnis der Form Action zeigen — sonst alle.
  const transactions = $derived(form?.transactions ?? data.transactions);
  const filters = $derived(
    form?.filters ?? { categoryId: "", from: "", to: "", minAmount: "", maxAmount: "", search: "" }
  );

  function getCategory(id) {
    return data.categories.find((c) => c._id === id);
  }
</script>

<div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
  <h1 class="h3 m-0">
    Verlauf
    <span class="badge text-bg-secondary fs-6 align-middle">{transactions.length}</span>
  </h1>
  <a href="/add" class="btn btn-primary btn-sm"><i class="bi bi-plus-lg"></i> Neu</a>
</div>


<div class="card border-0 shadow-sm mb-4">
  <div class="card-body">
    <form method="POST" action="?/filter">
      <div class="row g-2 align-items-end">
        <div class="col-12 col-md-3">
          <label for="categoryId" class="form-label">Kategorie</label>
          <select id="categoryId" name="categoryId" class="form-select">
            <option value="">— alle —</option>
            {#each data.categories as c}
              <option value={c._id} selected={c._id === filters.categoryId}>{c.name}</option>
            {/each}
          </select>
        </div>
        <div class="col-6 col-md-2">
          <label for="from" class="form-label">Von</label>
          <input id="from" name="from" type="date" class="form-control" value={filters.from} />
        </div>
        <div class="col-6 col-md-2">
          <label for="to" class="form-label">Bis</label>
          <input id="to" name="to" type="date" class="form-control" value={filters.to} />
        </div>
        <div class="col-6 col-md-2">
          <label for="minAmount" class="form-label">Min (CHF)</label>
          <input id="minAmount" name="minAmount" type="number" step="0.01" min="0"
                 class="form-control" placeholder="0" value={filters.minAmount} />
        </div>
        <div class="col-6 col-md-2">
          <label for="maxAmount" class="form-label">Max (CHF)</label>
          <input id="maxAmount" name="maxAmount" type="number" step="0.01" min="0"
                 class="form-control" placeholder="10" value={filters.maxAmount} />
        </div>
        <div class="col-12 col-md-3">
          <label for="search" class="form-label">Notiz enthält</label>
          <input id="search" name="search" type="text" class="form-control"
                 placeholder="z. B. Coop" value={filters.search} />
        </div>
        <div class="col-12 col-md-2 d-flex gap-2">
          <button type="submit" class="btn btn-primary flex-fill">
            <i class="bi bi-funnel"></i> Filter
          </button>
          <a href="/history" class="btn btn-outline-secondary" aria-label="Filter zurücksetzen" title="Zurücksetzen">
            <i class="bi bi-arrow-counterclockwise"></i>
          </a>
        </div>
      </div>
    </form>
  </div>
</div>

{#if transactions.length === 0}
  <div class="alert alert-info">Keine Transaktionen gefunden.</div>
{:else}
  <div class="card border-0 shadow-sm">
    <ul class="list-group list-group-flush">
      {#each transactions as tx}
        <li class="list-group-item">
          <div class="d-flex justify-content-between align-items-center gap-2">
            <div class="text-truncate">
              <div class="fw-semibold text-truncate">
                <CategoryBadge category={getCategory(tx.categoryId)} />
              </div>
              <small class="text-muted">
                {tx.date}{#if tx.note} · {tx.note}{/if}
              </small>
            </div>
            <div class="d-flex align-items-center gap-2 gap-md-3 flex-shrink-0">
              <span class="fw-semibold text-danger">
                <Money amount={tx.amount} negative />
              </span>
              <a href="/history/{tx._id}" class="btn btn-sm btn-outline-primary"
                 aria-label="Transaktion bearbeiten" title="Bearbeiten">
                <i class="bi bi-pencil"></i>
              </a>
              <DeleteButton id={tx._id} confirmText="Diese Transaktion wirklich löschen?" />
            </div>
          </div>
        </li>
      {/each}
    </ul>
  </div>
{/if}
