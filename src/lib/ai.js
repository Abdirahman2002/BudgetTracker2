
import { env } from "$env/dynamic/private";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini"; // kann Bilder lesen (Vision), günstig

export function isConfigured() {
  return Boolean(env.OPEN_AI_KEY);
}

// Liest einen Beleg aus
export async function readReceipt(imageDataUrl, categoryNames = []) {
  if (!imageDataUrl) {
    return { error: "Kein Bild übergeben." };
  }
  if (!env.OPEN_AI_KEY) {
    return { error: "KI ist nicht konfiguriert." };
  }

  const kategorien = categoryNames.length
    ? categoryNames.join(", ")
    : "(keine Kategorien vorhanden)";

  try {
    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPEN_AI_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Du bist ein Assistent einer Haushaltsbudget-App. " +
              "Lies aus dem Foto eines Kassenbelegs den Gesamtbetrag, das Datum und den Händler aus " +
              "und schlage anhand des Händlers die am besten passende Kategorie vor. " +
              'Antworte ausschliesslich als JSON mit den Feldern "amount" (Zahl), ' +
              '"date" (Format "YYYY-MM-DD"), "merchant" (Text) und "category" (Text). ' +
              "Wähle category ausschliesslich aus dieser Liste: " +
              kategorien +
              ". Wenn ein Wert nicht erkennbar ist, setze ihn auf null.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Hier ist der Beleg:" },
              { type: "image_url", image_url: { url: imageDataUrl } },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      return { error: "KI-Dienst nicht erreichbar (" + response.status + ")." };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content);

    return {
      amount: parsed.amount ?? null,
      date: parsed.date ?? null,
      merchant: parsed.merchant ?? null,
      category: parsed.category ?? null,
    };
  } catch (ex) {
    return { error: "Fehler beim Auslesen: " + ex.message };
  }
}
