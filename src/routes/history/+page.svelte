<script>
  import CategoryBadge from '$lib/components/CategoryBadge.svelte';
  import Money from '$lib/components/Money.svelte';
  import DeleteButton from '$lib/components/DeleteButton.svelte';

  let { data } = $props();

  function getCategory(id) {
    return data.categories.find(function (c) {
      return c._id === id;
    });
  }
</script>

<h1 class="mb-4">
  History
  <span class="badge text-bg-secondary fs-6 align-middle">{data.transactions.length}</span>
</h1>

{#if data.transactions.length === 0}
  <div class="alert alert-info">Keine Transaktionen vorhanden.</div>
{:else}
  <ul class="list-group">
    {#each data.transactions as tx}
      <li class="list-group-item">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <div class="fw-semibold">
              <CategoryBadge category={getCategory(tx.categoryId)} />
            </div>
            <small class="text-muted">
              {tx.date}{#if tx.note} · {tx.note}{/if}
            </small>
          </div>
          <div class="d-flex align-items-center gap-3">
            <span class="fw-semibold">
              <Money amount={tx.amount} negative />
            </span>
            <DeleteButton id={tx._id} confirmText="Diese Transaktion wirklich löschen?" />
          </div>
        </div>
      </li>
    {/each}
  </ul>
{/if}
