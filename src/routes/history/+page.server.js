import db from "$lib/db.js";

export async function load() {
  return {
    categories: await db.getCategories(),
    transactions: await db.getTransactions(),
  };
}

export const actions = {
  async delete({ request }) {
    const data = await request.formData();
    const id = data.get("id");
    await db.deleteTransaction(id);
    return { success: true };
  },
};
