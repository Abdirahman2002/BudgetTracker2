import { redirect } from "@sveltejs/kit";
import db from "$lib/db.js";

// Schützt alle Routen ausser /login und /register und erzeugt fällige Fixkosten.
export async function load({ locals, url }) {
  const isAuthRoute = url.pathname === "/login" || url.pathname === "/register";

  if (!locals.user && !isAuthRoute) {
    throw redirect(303, "/login");
  }

  if (locals.user && isAuthRoute) {
    throw redirect(303, "/");
  }

  // Wiederkehrende Transaktionen für den aktuellen Monat erzeugen (idempotent).
  if (locals.user) {
    await db.generateRecurringForCurrentMonth(locals.user._id);
  }

  return { user: locals.user ?? null };
}
