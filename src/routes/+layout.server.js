import { redirect } from "@sveltejs/kit";

// Schützt alle Routen ausser /login und /register.
// Wer nicht eingeloggt ist, wird umgeleitet; wer eingeloggt ist, wird von den
// Auth-Seiten weggeleitet.
export async function load({ locals, url }) {
  const isAuthRoute = url.pathname === "/login" || url.pathname === "/register";

  if (!locals.user && !isAuthRoute) {
    throw redirect(303, "/login");
  }

  if (locals.user && isAuthRoute) {
    throw redirect(303, "/");
  }

  return { user: locals.user ?? null };
}
