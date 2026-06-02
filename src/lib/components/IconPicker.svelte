<script>
  // Kuratierte Icon-Auswahl mit Live-Vorschau.
  // Fallback: Wer nichts Passendes findet, gibt einen beliebigen
  // Bootstrap-Icon-Namen frei ein.
  let { name = "icon", value = $bindable("") } = $props();

  // Häufig benutzte Icons. Erweiterbar.
  const icons = [
    "basket", "cart", "egg-fried", "cup-hot", "cup-straw",
    "train-front", "bus-front", "car-front", "bicycle", "fuel-pump",
    "house", "lightbulb", "wifi", "phone", "tv",
    "heart-pulse", "hospital", "capsule", "bandaid",
    "controller", "book", "mortarboard", "music-note-beamed",
    "shop", "bag", "gift", "ticket-perforated",
    "scissors", "tools", "wrench", "paint-bucket",
    "cash-coin", "credit-card", "piggy-bank", "tag"
  ];

  function pick(i) {
    value = i;
  }
</script>

<!-- Wert für das Formular -->
<input type="hidden" {name} bind:value />

<!-- Kuratierte Auswahl -->
<div class="border rounded p-2" style="max-height: 220px; overflow-y: auto;">
  <div class="d-flex flex-wrap gap-1">
    {#each icons as i}
      <button
        type="button"
        class="btn btn-sm {value === i ? 'btn-primary' : 'btn-outline-secondary'}"
        title={i}
        onclick={() => pick(i)}
      >
        <i class="bi bi-{i}"></i>
      </button>
    {/each}
  </div>
</div>

<!-- Fallback: eigener Icon-Name -->
<div class="input-group input-group-sm mt-2">
  <span class="input-group-text" style="min-width: 2.4rem; justify-content: center;">
    <i class="bi bi-{value || 'question-lg'}"></i>
  </span>
  <input
    type="text"
    class="form-control"
    bind:value
    placeholder="Eigener Icon-Name, z. B. airplane"
    aria-label="Eigener Bootstrap-Icon-Name"
  />
</div>

<div class="form-text">
  {#if value}
    Ausgewählt: <i class="bi bi-{value}"></i> <code>{value}</code>.
  {:else}
    Bitte ein Icon wählen.
  {/if}
  Nichts Passendes dabei? Alle Icons findest du auf
  <a href="https://icons.getbootstrap.com/" target="_blank" rel="noopener noreferrer">icons.getbootstrap.com</a>.
</div>
