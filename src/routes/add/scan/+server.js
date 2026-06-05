

import { json } from "@sveltejs/kit";
import { readReceipt } from "$lib/ai.js";
import db from "$lib/db.js";

export async function POST({ request, locals }) {
  if (!locals.user) {
    return json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("receipt");
  if (!file || typeof file === "string" || file.size === 0) {
    return json({ error: "Kein Beleg hochgeladen." }, { status: 400 });
  }

  // Bild als Data-URL aufbereiten und an die KI übergeben.
  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;

  // Kategorien laden, damit die KI eine davon vorschlagen kann.
  const categories = await db.getCategories(locals.user._id);
  const result = await readReceipt(dataUrl, categories.map((c) => c.name));

  // Fehler als normale Antwort (Status 200), damit das Formular sie anzeigen kann.
  if (result.error) {
    return json({ error: result.error });
  }

  // Vorgeschlagenen Kategorie-Namen auf eine echte Kategorie-ID abbilden.
  let categoryId = null;
  if (result.category) {
    const match = categories.find(
      (c) => c.name.toLowerCase() === String(result.category).toLowerCase()
    );
    if (match) categoryId = match._id;
  }

  return json({
    amount: result.amount,
    date: result.date,
    merchant: result.merchant,
    categoryId,
  });
}
