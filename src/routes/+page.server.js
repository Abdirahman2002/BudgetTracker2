import db from "$lib/db.js";

export async function load({ locals, url }) {
  const userId = locals.user._id;

  // Aktueller oder gewählter Monat ("YYYY-MM")
  const today = new Date();
  const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const month = url.searchParams.get("month") || defaultMonth;

  const categories = await db.getCategories(userId);
  const summary = await db.getMonthlySummary(userId, month);

  // Summe je Kategorie als einfaches Objekt
  const sumByCat = {};
  for (const s of summary) {
    sumByCat[s._id] = s.amount;
  }

  // Jede Kategorie mit ihrem Monatsbetrag ergänzen (0, wenn keine Ausgaben)
  const perCategory = categories.map((c) => ({
    ...c,
    amount: sumByCat[c._id] || 0,
  }));

  // Gesamtsumme + Anzahl Transaktionen
  let total = 0;
  let txCount = 0;
  for (const s of summary) {
    total += s.amount;
    txCount += s.count;
  }

  // Auswählbare Monate (genutzte + aktueller), neueste zuerst
  const months = await db.getUsedMonths(userId);
  if (!months.includes(defaultMonth)) {
    months.push(defaultMonth);
    months.sort();
    months.reverse();
  }

  return { month, total, txCount, perCategory, months };
}
