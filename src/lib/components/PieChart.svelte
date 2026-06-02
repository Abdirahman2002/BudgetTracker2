<script>
  // Gefülltes Tortendiagramm als Inline-SVG, keine externe Library.
  // Jedes Stück ist ein SVG-Kreissektor (Winkel via Sinus/Cosinus berechnet).
  let { items } = $props(); // [{ name, icon, amount }]

  const palette = [
    '#0d6efd', '#6610f2', '#d63384', '#fd7e14', '#198754',
    '#0dcaf0', '#dc3545', '#20c997', '#ffc107', '#6f42c1',
    '#495057', '#e83e8c'
  ];

  const total = $derived(items.reduce((sum, i) => sum + i.amount, 0));

  function buildSlices(list, total) {
    const cx = 21, cy = 21, r = 20;
    const withSpending = list.filter((i) => i.amount > 0).sort((a, b) => b.amount - a.amount);

    const slices = [];
    let startAngle = -Math.PI / 2; // oben (12 Uhr) beginnen

    for (let i = 0; i < withSpending.length; i++) {
      const item = withSpending[i];
      const fraction = total > 0 ? item.amount / total : 0;
      const endAngle = startAngle + fraction * 2 * Math.PI;

      const startX = cx + r * Math.cos(startAngle);
      const startY = cy + r * Math.sin(startAngle);
      const endX = cx + r * Math.cos(endAngle);
      const endY = cy + r * Math.sin(endAngle);
      const bigArc = endAngle - startAngle > Math.PI ? 1 : 0;
      const middleAngle = (startAngle + endAngle) / 2;

      slices.push({
        name: item.name,
        color: palette[i % palette.length],
        percent: fraction * 100,
        path: `M ${cx} ${cy} L ${startX} ${startY} A ${r} ${r} 0 ${bigArc} 1 ${endX} ${endY} Z`,
        labelX: cx + r * 0.6 * Math.cos(middleAngle),
        labelY: cy + r * 0.6 * Math.sin(middleAngle),
      });

      startAngle = endAngle;
    }
    return slices;
  }

  const slices = $derived(buildSlices(items, total));
</script>

{#if total > 0}
  <div class="d-flex justify-content-center">
    <svg viewBox="0 0 42 42" style="max-width: 220px; width: 100%; height: auto;" role="img"
         aria-label="Ausgabenverteilung pro Kategorie">
      {#each slices as slice}
        {#if slice.percent >= 99.99}
          <circle cx="21" cy="21" r="20" fill={slice.color}></circle>
        {:else}
          <path d={slice.path} fill={slice.color}></path>
        {/if}
        {#if slice.percent >= 6}
          <text x={slice.labelX} y={slice.labelY} text-anchor="middle" dominant-baseline="central"
                style="font-size: 3.2px; fill: #fff; font-weight: 500;">{slice.percent.toFixed(0)}%</text>
        {/if}
      {/each}
    </svg>
  </div>

  <ul class="list-unstyled mt-3 mb-0">
    {#each slices as slice}
      <li class="d-flex justify-content-between align-items-center small py-1">
        <span class="d-inline-flex align-items-center gap-2 text-truncate">
          <span class="rounded-circle flex-shrink-0" style="width: 10px; height: 10px; background: {slice.color};"></span>
          <span class="text-truncate">{slice.name}</span>
        </span>
        <span class="text-muted ms-2 flex-shrink-0">{slice.percent.toFixed(0)}%</span>
      </li>
    {/each}
  </ul>
{:else}
  <p class="text-muted text-center mb-0 py-4">Noch keine Ausgaben in diesem Monat.</p>
{/if}
