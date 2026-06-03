import { error, redirect } from "@sveltejs/kit";
import db from "$lib/db.js";

export async function load({ params, locals }) {
  const transaction = await db.getTransaction(locals.user._id, params.id);
  if (!transaction) throw error(404, "Transaktion nicht gefunden.");
  return {
    transaction,
    categories: await db.getCategories(locals.user._id),
  };
}

export const actions = {
  update: async ({ request, params, locals }) => {
    const data = await request.formData();
    const amount = Number(data.get("amount"));
    const categoryId = data.get("categoryId");
    const date = data.get("date");
    const note = data.get("note");

    if (!amount || amount <= 0) return { error: "Bitte einen Betrag grösser als 0 eingeben." };
    if (!categoryId) return { error: "Bitte eine Kategorie auswählen." };
    if (!date) return { error: "Bitte ein Datum auswählen." };

    await db.updateTransaction(locals.user._id, params.id, { amount, categoryId, date, note });
    throw redirect(303, "/history");
  },
};
