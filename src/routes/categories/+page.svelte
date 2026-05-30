<script>
  import CategoryBadge from '$lib/components/CategoryBadge.svelte';
  import DeleteButton from '$lib/components/DeleteButton.svelte';

  let { data, form } = $props();
</script>

<h1 class="mb-4">Categories</h1>

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
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <CategoryBadge category={c} />
        <DeleteButton
          id={c._id}
          confirmText="Kategorie {c.name} wirklich löschen? Alle zugehörigen Transaktionen werden ebenfalls entfernt."
        />
      </li>
    {/each}
  </ul>
{/if}

<hr class="my-4" />

<h2 class="h4 mb-3">Add Category</h2>
<div class="card">
  <div class="card-body">
    <form method="POST" action="?/create">
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input id="name" name="name" class="form-control" type="text" required />
      </div>
      <div class="mb-3">
        <label for="icon" class="form-label">Icon (Bootstrap-Icon-Name)</label>
        <input id="icon" name="icon" class="form-control" type="text" placeholder="z. B. apple, bag, train-front" required />
        <div class="form-text">
          Alle Icons unter <a href="https://icons.getbootstrap.com/" target="_blank" rel="noopener">icons.getbootstrap.com</a>
        </div>
      </div>
      <button type="submit" class="btn btn-primary">
        <i class="bi bi-plus-lg"></i> Add Category
      </button>
    </form>
  </div>
</div>
