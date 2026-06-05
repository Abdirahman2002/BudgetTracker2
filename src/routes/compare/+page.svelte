<script>
  import Money from '$lib/components/Money.svelte';

  let { data } = $props();

  const monthNames = {
    "01": "Januar", "02": "Februar", "03": "März", "04": "April",
    "05": "Mai", "06": "Juni", "07": "Juli", "08": "August",
    "09": "September", "10": "Oktober", "11": "November", "12": "Dezember"
  };

  // "YYYY-MM" -> "Monatsname YYYY"
  function label(key) {
    const [y, m] = key.split("-");
    return `${monthNames[m]} ${y}`;
  }

  function submitForm(e) {
    e.currentTarget.form.submit();
  }
</script>

<h1 class="h3 mb-4">Monatsvergleich</h1>

<div class="card border-0 shadow-sm mb-4">
  <div class="card-body">
    <form method="GET" class="row g-3">
      <div class="col-6">
        <label for="a" class="form-label">Monat A</label>
        <select id="a" name="a" class="form-select" onchange={submitForm}>
          {#each data.allMonths as m}
            <option value={m} selected={m === data.a}>{label(m)}</option>
          {/each}
        </select>
      </div>
      <div class="col-6">
        <label for="b" class="form-label">Monat B</label>
        <select id="b" name="b" class="form-select" onchange={submitForm}>
          {#each data.allMonths as m}
            <option value={m} selected={m === data.b}>{label(m)}</option>
          {/each}
        </select>
      </div>
    </form>
  </div>
</div>

<div class="card border-0 shadow-sm">
  <div class="table-responsive">
    <table class="table table-hover align-middle mb-0">
      <thead class="table-light">
        <tr>
          <th>Kategorie</th>
          <th class="text-end">{label(data.a)}</th>
          <th class="text-end">{label(data.b)}</th>
          <th class="text-end">Differenz</th>
        </tr>
      </thead>
      <tbody>
        {#each data.rows as r}
          <tr>
            <td class="text-nowrap"><i class="bi bi-{r.icon}"></i> {r.name}</td>
            <td class="text-end"><Money amount={r.a} /></td>
            <td class="text-end"><Money amount={r.b} /></td>
            <td class="text-end fw-semibold {r.diff > 0 ? 'text-danger' : 'text-success'}">
              {r.diff > 0 ? '+' : ''}{r.diff.toFixed(2)} CHF
            </td>
          </tr>
        {/each}
        <tr class="table-light">
          <td class="fw-bold">Total</td>
          <td class="text-end fw-bold"><Money amount={data.totalA} /></td>
          <td class="text-end fw-bold"><Money amount={data.totalB} /></td>
          <td class="text-end fw-bold {data.totalDiff > 0 ? 'text-danger' : 'text-success'}">
            {data.totalDiff > 0 ? '+' : ''}{data.totalDiff.toFixed(2)} CHF
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
