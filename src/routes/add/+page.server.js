import db from "$lib/db.js";

export async function load() {
  return {
    categories: await db.getCategories(),
  };
}

export const actions = {
  async create({ request }) {
    const data = await request.formData();
    const amount = Number(data.get("amount"));
    const categoryId = data.get("categoryId");
    const date = data.get("date");
    const note = data.get("note");

    // Server-Validierung
    if (!amount || amount <= 0) {
      return { error: "Bitte einen Betrag grösser als 0 eingeben." };
    }
    if (!categoryId) {
      return { error: "Bitte eine Kategorie auswählen." };
    }
    if (!date) {
      return { error: "Bitte ein Datum auswählen." };
    }

    await db.createTransaction({ amount, categoryId, date, note });
    return { success: true };
  },
};
