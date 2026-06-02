<script>
  // Budget-Balken pro Kategorie mit Farbwarnung.
  let { spent, budget } = $props();

  function getPercent() {
    if (!budget || budget <= 0) return 0;
    return Math.min((spent / budget) * 100, 100);
  }

  function getColor() {
    const value = budget > 0 ? (spent / budget) * 100 : 0;
    if (value >= 100) return "danger";   // rot: erreicht/überschritten
    if (value >= 80) return "warning";   // gelb: fast aufgebraucht
    return "success";                    // grün: im Rahmen
  }

  const percent = $derived(getPercent());
  const color = $derived(getColor());
  const over = $derived(budget > 0 && spent > budget);
</script>

{#if budget}
  <div class="progress" style="height: 14px;">
    <div class="progress-bar bg-{color}" style="width: {percent}%">{percent.toFixed(0)}%</div>
  </div>
  <small class="text-muted">
    {spent.toFixed(2)} / {Number(budget).toFixed(2)} CHF
    {#if over}<span class="text-danger fw-semibold">· überschritten</span>{/if}
  </small>
{:else}
  <small class="text-muted">Kein Limit gesetzt</small>
{/if}
