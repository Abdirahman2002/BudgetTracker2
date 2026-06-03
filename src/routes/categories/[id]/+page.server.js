import { error, redirect } from "@sveltejs/kit";
import db from "$lib/db.js";

export async function load({ params, locals }) {
  const category = await db.getCategory(locals.user._id, params.id);
  if (!category) throw error(404, "Kategorie nicht gefunden.");
  return { category };
}

export const actions = {
  update: async ({ request, params, locals }) => {
    const data = await request.formData();
    const name = (data.get("name") || "").toString().trim();
    const icon = (data.get("icon") || "").toString().trim();
    const monthlyBudget = data.get("monthlyBudget");

    if (!name) return { error: "Bitte einen Namen eingeben." };
    if (!icon) return { error: "Bitte ein Icon auswählen." };

    await db.updateCategory(locals.user._id, params.id, { name, icon, monthlyBudget });
    throw redirect(303, "/categories");
  },
};
