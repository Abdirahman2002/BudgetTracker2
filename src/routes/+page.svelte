<script>
  import Money from '$lib/components/Money.svelte';
  import PieChart from '$lib/components/PieChart.svelte';
  import BudgetProgress from '$lib/components/BudgetProgress.svelte';

  let { data } = $props();

  // Nur Kategorien mit Ausgaben, absteigend sortiert.
  const spent = $derived(
    [...data.perCategory].filter((c) => c.amount > 0).sort((a, b) => b.amount - a.amount)
  );

  // Wie viele Kategorien sind über ihrem Budget?
  const overBudget = $derived(
    data.perCategory.filter((c) => c.monthlyBudget && c.amount > c.monthlyBudget).length
  );

  const monthNames = {
    "01": "Januar", "02": "Februar", "03": "März", "04": "April",
    "05": "Mai", "06": "Juni", "07": "Juli", "08": "August",
    "09": "September", "10": "Oktober", "11": "November", "12": "Dezember"
  };

  function label(key) {
    const [y, m] = key.split("-");
    return `${monthNames[m]} ${y}`;
  }

  function submitMonthForm(e) {
    e.currentTarget.form.submit();
  }
</script>

<div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
  <h1 class="h3 m-0">Übersicht</h1>
  <form method="GET" class="ms-auto">
    <label for="month-select" class="visually-hidden">Monat wählen</label>
    <select id="month-select" name="month" class="form-select form-select-sm" onchange={submitMonthForm}>
      {#each data.months as m}
        <option value={m} selected={m === data.month}>{label(m)}</option>
      {/each}
    </select>
  </form>
</div>

<div class="row g-3 mb-4">
  <div class="col-6 col-md-4">
    <div class="card border-0 shadow-sm h-100">
      <div class="card-body">
        <div class="text-muted text-uppercase small mb-1">Ausgegeben</div>
        <div class="fs-4 fw-bold text-truncate"><Money amount={data.total} /></div>
      </div>
    </div>
  </div>
  <div class="col-6 col-md-4">
    <div class="card border-0 shadow-sm h-100">
      <div class="card-body">
        <div class="text-muted text-uppercase small mb-1">Transaktionen</div>
        <div class="fs-4 fw-bold">{data.txCount}</div>
      </div>
    </div>
  </div>
  <div class="col-12 col-md-4">
    <div class="card border-0 shadow-sm h-100">
      <div class="card-body">
        <div class="text-muted text-uppercase small mb-1">Über Budget</div>
        <div class="fs-4 fw-bold {overBudget > 0 ? 'text-danger' : 'text-success'}">
          {overBudget}
          <small class="fs-6 fw-normal text-muted">
            {overBudget === 1 ? 'Kategorie' : 'Kategorien'}
          </small>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="row g-3">
  <div class="col-12 col-lg-6">
    <div class="card border-0 shadow-sm h-100">
      <div class="card-body">
        <h2 class="h6 mb-3">Verteilung</h2>
        <PieChart items={spent} />
      </div>
    </div>
  </div>

  <div class="col-12 col-lg-6">
    <div class="card border-0 shadow-sm h-100">
      <div class="card-body">
        <h2 class="h6 mb-3">Budget-Status</h2>

        {#if spent.length === 0}
          <p class="text-muted mb-0">Noch keine Ausgaben in diesem Monat.</p>
        {:else}
          <ul class="list-group list-group-flush">
            {#each spent as c}
              <li class="list-group-item px-0">
                <div class="d-flex justify-content-between align-items-center gap-2">
                  <span class="d-inline-flex align-items-center gap-2 text-truncate">
                    <i class="bi bi-{c.icon}"></i>
                    <span class="text-truncate">{c.name}</span>
                  </span>
                  <span class="fw-semibold flex-shrink-0"><Money amount={c.amount} /></span>
                </div>
                {#if c.monthlyBudget}
                  <div class="mt-2">
                    <BudgetProgress spent={c.amount} budget={c.monthlyBudget} />
                  </div>
                {:else}
                  <small class="text-muted">Kein Budget gesetzt</small>
                {/if}
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  </div>
</div>
