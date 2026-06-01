<script>
  let { form } = $props();
</script>

<div class="row justify-content-center mt-4 mt-md-5">
  <div class="col-12 col-sm-9 col-md-6 col-lg-5">
    <div class="text-center mb-4">
      <div class="display-6 text-primary mb-2"><i class="bi bi-person-plus"></i></div>
      <h1 class="h3 mb-0">Registrieren</h1>
      <p class="text-muted">Erstelle dein Budget-Tracker-Konto</p>
    </div>

    {#if form?.error}
      <div class="alert alert-danger">{form.error}</div>
    {/if}

    <div class="card border-0 shadow-sm">
      <div class="card-body p-4">
        <form method="POST">
          <div class="mb-3">
            <label for="email" class="form-label">E-Mail</label>
            <input id="email" name="email" type="email" class="form-control"
                   value={form?.email || ''} required />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Passwort</label>
            <input id="password" name="password" type="password" class="form-control"
                   minlength="6" required />
            <div class="form-text">Mindestens 6 Zeichen.</div>
          </div>
          <button type="submit" class="btn btn-primary w-100">
            <i class="bi bi-person-plus"></i> Konto erstellen
          </button>
        </form>
      </div>
    </div>

    <p class="text-center mt-3 mb-0">
      Schon registriert? <a href="/login">Anmelden</a>
    </p>
  </div>
</div>
