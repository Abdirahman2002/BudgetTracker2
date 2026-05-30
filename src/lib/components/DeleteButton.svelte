<script>
  let { id, action = "?/delete", confirmText = "" } = $props();

  function handleSubmit(e) {
    if (confirmText && !confirm(confirmText)) {
      e.preventDefault();
    }
  }
</script>

<form method="POST" {action} class="d-inline" onsubmit={handleSubmit}>
  <input type="hidden" name="id" value={id} />
  <button type="submit" class="btn btn-sm btn-danger">Löschen</button>
</form>
