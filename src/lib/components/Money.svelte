<script>
  let { amount, negative = false } = $props();
</script>

<span>{negative ? '-' : ''}{Number(amount).toFixed(2)} CHF</span>
