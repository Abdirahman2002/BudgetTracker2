import db from "$lib/db.js";

export async function load({ locals }) {
  return {
    categories: await db.getCategories(locals.user._id),
    transactions: await db.findTransactions(locals.user._id, {}),
  };
}

export const actions = {
  filter: async ({ request, locals }) => {
    const data = await request.formData();
    const filters = {
      categoryId: (data.get("categoryId") || "").toString(),
      from: (data.get("from") || "").toString(),
      to: (data.get("to") || "").toString(),
      minAmount: (data.get("minAmount") || "").toString(),
      maxAmount: (data.get("maxAmount") || "").toString(),
      search: (data.get("search") || "").toString(),
    };

    const transactions = await db.findTransactions(locals.user._id, filters);
    return { transactions, filters };
  },

  delete: async ({ request, locals }) => {
    const data = await request.formData();
    await db.deleteTransaction(locals.user._id, data.get("id"));
    return { success: true };
  },
};
