<script>
  import CategoryBadge from '$lib/components/CategoryBadge.svelte';
  import Money from '$lib/components/Money.svelte';

  let { data } = $props();

  const monthNames = {
    "01": "Januar",  "02": "Februar", "03": "März",     "04": "April",
    "05": "Mai",     "06": "Juni",    "07": "Juli",     "08": "August",
    "09": "September","10": "Oktober", "11": "November", "12": "Dezember"
  };

  function label(key) {
    const [y, m] = key.split("-");
    return `${monthNames[m]} ${y}`;
  }

  function submitMonthForm(e) {
    e.currentTarget.form.submit();
  }
</script>

<h1 class="mb-4">Übersicht</h1>

<form method="GET" class="mb-4">
  <label for="month-select" class="form-label">Monat</label>
  <select id="month-select" name="month" class="form-select" onchange={submitMonthForm}>
    {#each data.months as m}
      <option value={m} selected={m === data.month}>{label(m)}</option>
    {/each}
  </select>
</form>

<div class="card text-center mb-4">
  <div class="card-body py-4">
    <p class="text-muted mb-1">Gesamtausgaben</p>
    <h2 class="display-5 fw-bold mb-0">
      <Money amount={data.total} />
    </h2>
  </div>
</div>

<h2 class="h5 mb-3">Ausgaben pro Kategorie</h2>
<ul class="list-group">
  {#each data.perCategory as cat}
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <CategoryBadge category={cat} />
      <span class="badge text-bg-light fs-6">
        <Money amount={cat.amount} />
      </span>
    </li>
  {/each}
</ul>
