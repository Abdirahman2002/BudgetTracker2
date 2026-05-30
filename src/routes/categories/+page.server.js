import db from "$lib/db.js";

export async function load() {
  return {
    categories: await db.getCategories(),
  };
}

export const actions = {
  async create({ request }) {
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

    await db.createCategory({ name, icon });
    return { success: true };
  },
  async delete({ request }) {
    const data = await request.formData();
    const id = data.get("id");
    await db.deleteCategory(id);
    return { success: true };
  },
};
