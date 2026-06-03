<script>
  import IconPicker from '$lib/components/IconPicker.svelte';

  let { data, form } = $props();

  let selectedIcon = $state(data.category.icon);
</script>

<a href="/categories" class="btn btn-outline-secondary btn-sm mb-3">
  <i class="bi bi-arrow-left"></i> Zurück
</a>

<h1 class="h3 mb-4">Kategorie bearbeiten</h1>

{#if form?.error}
  <div class="alert alert-danger">{form.error}</div>
{/if}

<div class="row justify-content-center">
  <div class="col-12 col-lg-7">
    <div class="card border-0 shadow-sm">
      <div class="card-body p-4">
        <form method="POST" action="?/update">
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input id="name" name="name" class="form-control" type="text"
                   value={data.category.name} required />
          </div>
          <div class="mb-3">
            <span class="form-label d-block">Icon</span>
            <IconPicker bind:value={selectedIcon} />
          </div>
          <div class="mb-3">
            <label for="monthlyBudget" class="form-label">Monats-Budget (optional, CHF)</label>
            <input id="monthlyBudget" name="monthlyBudget" class="form-control" type="number"
                   step="0.01" min="0" value={data.category.monthlyBudget || ''} />
            <div class="form-text">Leer lassen, um kein Limit zu setzen.</div>
          </div>
          <button type="submit" class="btn btn-primary w-100" disabled={!selectedIcon}>
            <i class="bi bi-check-lg"></i> Speichern
          </button>
        </form>
      </div>
    </div>
  </div>
</div>
