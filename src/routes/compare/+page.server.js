import db from "$lib/db.js";

export async function load({ locals, url }) {
  const userId = locals.user._id;

  // Aktueller Monat und Vormonat als Standardwerte ("YYYY-MM").
  const today = new Date();
  const thisMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const prev = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const prevMonth = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}`;

  const a = url.searchParams.get("a") || prevMonth;
  const b = url.searchParams.get("b") || thisMonth;

  // Daten der Reihe nach laden.
  const summaryA = await db.getMonthlySummary(userId, a);
  const summaryB = await db.getMonthlySummary(userId, b);
  const categories = await db.getCategories(userId);
  const usedMonths = await db.getUsedMonths(userId);

  // Summen je Kategorie als einfache Objekte.
  const sumA = {};
  for (const s of summaryA) sumA[s._id] = s.amount;
  const sumB = {};
  for (const s of summaryB) sumB[s._id] = s.amount;

  // Pro Kategorie eine Zeile mit beiden Beträgen und der Differenz.
  let totalA = 0;
  let totalB = 0;
  const rows = categories.map((c) => {
    const valueA = sumA[c._id] || 0;
    const valueB = sumB[c._id] || 0;
    totalA += valueA;
    totalB += valueB;
    return { name: c.name, icon: c.icon, a: valueA, b: valueB, diff: valueB - valueA };
  });

  // Auswählbare Monate: genutzte + die beiden Standardmonate, neueste zuerst.
  const allMonths = [...usedMonths];
  for (const m of [thisMonth, prevMonth]) {
    if (!allMonths.includes(m)) allMonths.push(m);
  }
  allMonths.sort();
  allMonths.reverse();

  return { a, b, rows, totalA, totalB, totalDiff: totalB - totalA, allMonths };
}
