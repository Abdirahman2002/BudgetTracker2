import db from "$lib/db.js";

export async function load({ locals, url }) {
  const userId = locals.user._id;
  const categories = await db.getCategories(userId);
  const transactions = await db.getTransactions(userId);

  // Monat aus URL (z.B. ?month=2026-05) oder aktueller Monat
  const today = new Date();
  const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const month = url.searchParams.get("month") || defaultMonth;

  // Transaktionen dieses Monats
  const monthTx = transactions.filter((tx) => tx.date.startsWith(month));
  const total = monthTx.reduce((sum, tx) => sum + Number(tx.amount), 0);

  // Pro Kategorie aufsummieren
  const perCategory = categories.map((c) => {
    const amount = monthTx
      .filter((tx) => tx.categoryId === c._id)
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
    return { ...c, amount };
  });

  // Auswahl-Liste der Monate
  const monthSet = new Set(transactions.map((tx) => tx.date.slice(0, 7)));
  monthSet.add(defaultMonth);
  const months = [...monthSet].sort().reverse();

  return { month, total, perCategory, months };
}
