import db from "$lib/db.js";

// Wird bei jedem Request ausgeführt.
// Liest das Session-Cookie, lädt den User und hängt ihn an event.locals.
export async function handle({ event, resolve }) {
  const userId = event.cookies.get("session");
  if (userId) {
    const user = await db.getUserById(userId);
    if (user) {
      event.locals.user = { _id: user._id, email: user.email };
    }
  }
  return resolve(event);
}
