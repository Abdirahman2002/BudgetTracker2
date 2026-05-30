import db from "$lib/db.js";

export async function load({ url }) {
  const categories = await db.getCategories();
  const transactions = await db.getTransactions();

  // Monat aus URL (z.B. ?month=2026-05) oder aktueller Monat
  const today = new Date();
  const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const month = url.searchParams.get("month") || defaultMonth;

  // Transaktionen dieses Monats
  const monthTx = transactions.filter(function (tx) {
    return tx.date.startsWith(month);
  });
  const total = monthTx.reduce(function (sum, tx) {
    return sum + Number(tx.amount);
  }, 0);

  // Pro Kategorie aufsummieren
  const perCategory = categories.map(function (c) {
    const txOfCat = monthTx.filter(function (tx) {
      return tx.categoryId === c._id;
    });
    const amount = txOfCat.reduce(function (sum, tx) {
      return sum + Number(tx.amount);
    }, 0);
    return { ...c, amount };
  });

  // Auswahl-Liste der Monate
  const monthSet = new Set(
    transactions.map(function (tx) {
      return tx.date.slice(0, 7);
    })
  );
  monthSet.add(defaultMonth);
  const months = [...monthSet].sort().reverse();

  return { month, total, perCategory, months };
}
