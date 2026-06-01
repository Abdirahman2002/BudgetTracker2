import db from "$lib/db.js";

export async function load({ locals }) {
  return {
    categories: await db.getCategories(locals.user._id),
  };
}

export const actions = {
  async create({ request, locals }) {
    const data = await request.formData();
    const name = (data.get("name") || "").trim();
    const icon = (data.get("icon") || "").trim();

    // Server-Validierung
    if (!name) {
      return { error: "Bitte einen Namen eingeben." };
    }
    if (!icon) {
      return { error: "Bitte einen Icon-Namen eingeben (z. B. apple, bag, train-front)." };
    }

    await db.createCategory(locals.user._id, { name, icon });
    return { success: true };
  },
  async delete({ request, locals }) {
    const data = await request.formData();
    const id = data.get("id");
    await db.deleteCategory(locals.user._id, id);
    return { success: true };
  },
};
