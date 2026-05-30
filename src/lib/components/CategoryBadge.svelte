<script>
  let { category } = $props();
</script>

<span class="d-inline-flex align-items-center gap-2">
  <i class="bi bi-{category?.icon || 'tag'}"></i>
  <span>{category?.name || 'Unbekannt'}</span>
</span>
