<script>
  import { page } from '$app/state';
  import favicon from '$lib/assets/favicon.svg';

  let { data, children } = $props();

  // Navigationspunkte zentral – damit der aktive Zustand sauber markiert wird.
  const links = [
    { href: '/history',    icon: 'clock-history', label: 'Verlauf' },
    { href: '/categories', icon: 'folder',        label: 'Kategorien' }
  ];

  const path = $derived(page.url.pathname);
  const isActive = (href) => path === href || path.startsWith(href + '/');
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<header class="bg-white border-bottom sticky-top">
  <div class="container-fluid d-flex flex-wrap align-items-center justify-content-between gap-2 py-2 px-3 px-md-4">
    <a href="/" class="text-decoration-none text-dark d-inline-flex align-items-center gap-2">
      <span class="d-inline-flex align-items-center justify-content-center rounded-3"
            style="width:38px;height:38px;background:rgba(37,99,235,.12);color:var(--bs-primary);font-size:1.15rem;">
        <i class="bi bi-wallet2"></i>
      </span>
      <span class="lh-1">
        <span class="h6 m-0 d-block fw-bold">Budget Tracker</span>
        <span class="d-none d-sm-block small text-muted">Deine Ausgaben im Blick</span>
      </span>
    </a>

    {#if data.user}
      <nav class="d-flex gap-1 flex-wrap align-items-center">
        <a href="/add" class="btn btn-primary btn-sm d-inline-flex align-items-center gap-1">
          <i class="bi bi-plus-lg"></i> <span class="d-none d-sm-inline">Hinzufügen</span>
        </a>
        {#each links as l}
          <a href={l.href}
             class="btn btn-outline-dark btn-sm d-inline-flex align-items-center gap-1"
             class:active={isActive(l.href)}
             aria-current={isActive(l.href) ? 'page' : undefined}>
            <i class="bi bi-{l.icon}"></i> <span class="d-none d-md-inline">{l.label}</span>
          </a>
        {/each}
        <form method="POST" action="/logout" class="d-inline ms-1">
          <button type="submit" class="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
                  title="Abmelden ({data.user.email})">
            <i class="bi bi-box-arrow-right"></i> <span class="d-none d-lg-inline">{data.user.email}</span>
          </button>
        </form>
      </nav>
    {/if}
  </div>
</header>

<div class="container py-4">
  {@render children()}
</div>
