<script>
  import favicon from '$lib/assets/favicon.svg';

  let { data, children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<header class="bg-white border-bottom">
  <div class="container-fluid d-flex align-items-center justify-content-between py-3 px-4">
    <a href="/" class="text-decoration-none text-dark">
      <h1 class="h4 m-0 fw-semibold">Budget Tracker</h1>
      <p class="m-0"><i>Deine Ausgaben im Blick</i></p>
    </a>

    {#if data.user}
      <nav class="d-flex gap-2 align-items-center">
        <a href="/add" class="btn btn-primary d-inline-flex align-items-center gap-2">
          <i class="bi bi-plus-lg"></i>
          Add
        </a>
        <a href="/history" class="btn btn-dark d-inline-flex align-items-center gap-2">
          <i class="bi bi-clock-history"></i>
          History
        </a>
        <a href="/categories" class="btn btn-dark d-inline-flex align-items-center gap-2">
          <i class="bi bi-folder"></i>
          Categories
        </a>
        <form method="POST" action="/logout" class="d-inline">
          <button type="submit" class="btn btn-outline-secondary d-inline-flex align-items-center gap-2"
                  title="Abmelden ({data.user.email})">
            <i class="bi bi-box-arrow-right"></i>
            Abmelden
          </button>
        </form>
      </nav>
    {/if}
  </div>
</header>

<div class="container mt-3">
  {@render children()}
</div>
