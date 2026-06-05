import db from "$lib/db.js";

export async function load({ locals }) {
  return {
    categories: await db.getCategories(locals.user._id),
    recurring: await db.getRecurring(locals.user._id),
  };
}

export const actions = {
  create: async ({ request, locals }) => {
    const data = await request.formData();
    const amount = Number(data.get("amount"));
    const categoryId = data.get("categoryId");
    const dayOfMonth = Number(data.get("dayOfMonth"));
    const note = data.get("note");

    if (!amount || amount <= 0) return { error: "Betrag muss > 0 sein." };
    if (!categoryId) return { error: "Bitte eine Kategorie auswählen." };
    if (!dayOfMonth || dayOfMonth < 1 || dayOfMonth > 28) {
      return { error: "Tag muss zwischen 1 und 28 liegen." };
    }

    await db.createRecurring(locals.user._id, { amount, categoryId, dayOfMonth, note });
    return { success: true };
  },
  delete: async ({ request, locals }) => {
    const data = await request.formData();
    await db.deleteRecurring(locals.user._id, data.get("id"));
    return { success: true };
  },
};
