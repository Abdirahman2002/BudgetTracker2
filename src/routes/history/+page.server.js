import db from "$lib/db.js";

export async function load({ locals }) {
  return {
    categories: await db.getCategories(locals.user._id),
    transactions: await db.getTransactions(locals.user._id),
  };
}

export const actions = {
  async delete({ request, locals }) {
    const data = await request.formData();
    const id = data.get("id");
    await db.deleteTransaction(locals.user._id, id);
    return { success: true };
  },
};
