<script>
  import CategoryBadge from '$lib/components/CategoryBadge.svelte';
  import DeleteButton from '$lib/components/DeleteButton.svelte';
  import IconPicker from '$lib/components/IconPicker.svelte';

  let { data, form } = $props();

  // Icon-Picker statt freier Klassennamen-Eingabe.
  let selectedIcon = $state("");
</script>

<h1 class="mb-4">Kategorien</h1>

{#if form?.error}
  <div class="alert alert-danger" role="alert">{form.error}</div>
{/if}
{#if form?.success}
  <div class="alert alert-success" role="alert">Kategorie hinzugefügt.</div>
{/if}

{#if data.categories.length === 0}
  <div class="alert alert-info">Noch keine Kategorien angelegt.</div>
{:else}
  <ul class="list-group mb-5">
    {#each data.categories as c}
      <li class="list-group-item d-flex justify-content-between align-items-center gap-2">
        <div class="text-truncate">
          <CategoryBadge category={c} />
          {#if c.monthlyBudget}
            <small class="text-muted ms-2">Budget: {Number(c.monthlyBudget).toFixed(2)} CHF</small>
          {/if}
        </div>
        <DeleteButton
          id={c._id}
          confirmText="Kategorie {c.name} wirklich löschen? Alle zugehörigen Transaktionen werden ebenfalls entfernt."
        />
      </li>
    {/each}
  </ul>
{/if}

<hr class="my-4" />

<h2 class="h4 mb-3">Kategorie hinzufügen</h2>
<div class="card">
  <div class="card-body">
    <form method="POST" action="?/create">
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input id="name" name="name" class="form-control" type="text" required />
      </div>
      <div class="mb-3">
        <span class="form-label d-block">Icon</span>
        <IconPicker bind:value={selectedIcon} />
      </div>
      <div class="mb-3">
        <label for="monthlyBudget" class="form-label">Monats-Budget (optional, CHF)</label>
        <input id="monthlyBudget" name="monthlyBudget" class="form-control" type="number"
               step="0.01" min="0" placeholder="z. B. 200" />
      </div>
      <button type="submit" class="btn btn-primary" disabled={!selectedIcon}>
        <i class="bi bi-plus-lg"></i> Kategorie hinzufügen
      </button>
    </form>
  </div>
</div>
