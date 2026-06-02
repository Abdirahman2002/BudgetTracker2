import { MongoClient, ObjectId } from "mongodb";
import { DB_URI } from "$env/static/private";

const client = new MongoClient(DB_URI);
await client.connect();
const db = client.db("BudgetTrackDB");

const users = db.collection("users");
const categories = db.collection("categories");
const transactions = db.collection("transactions");

//////////////////////////////////////////
// Users
//////////////////////////////////////////

async function getUserByEmail(email) {
  const u = await users.findOne({ email: email.toLowerCase() });
  if (u) u._id = u._id.toString();
  return u;
}

async function getUserById(id) {
  const u = await users.findOne({ _id: new ObjectId(id) });
  if (u) u._id = u._id.toString();
  return u;
}

async function createUser({ email, passwordHash }) {
  const result = await users.insertOne({
    email: email.toLowerCase(),
    passwordHash,
    createdAt: new Date(),
  });
  return result.insertedId.toString();
}

//////////////////////////////////////////
// Categories (pro User, mit optionalem Budget)
//////////////////////////////////////////

async function getCategories(userId) {
  const list = await categories.find({ userId }).sort({ name: 1 }).toArray();
  list.forEach((c) => (c._id = c._id.toString()));
  return list;
}

async function createCategory(userId, { name, icon, monthlyBudget }) {
  const result = await categories.insertOne({
    userId,
    name,
    icon,
    monthlyBudget: monthlyBudget ? Number(monthlyBudget) : null,
  });
  return result.insertedId.toString();
}

async function deleteCategory(userId, id) {
  // Kaskadierend: nur Transaktionen dieses Users mit dieser Kategorie löschen
  await transactions.deleteMany({ userId, categoryId: id });
  await categories.deleteOne({ _id: new ObjectId(id), userId });
  return id;
}

//////////////////////////////////////////
// Transactions (pro User)
//////////////////////////////////////////

async function createTransaction(userId, { amount, categoryId, date, note }) {
  await transactions.insertOne({
    userId,
    amount: Number(amount),
    categoryId,
    date,
    note: note || "",
  });
}

async function deleteTransaction(userId, id) {
  await transactions.deleteOne({ _id: new ObjectId(id), userId });
  return id;
}

// Transaktionen mit optionalem Filter: Kategorie, Zeitraum, Betragsbereich, Notiz-Suche.
async function findTransactions(userId, { categoryId, from, to, minAmount, maxAmount, search } = {}) {
  const query = { userId };

  if (categoryId) query.categoryId = categoryId;

  // Zeitraum
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = from;
    if (to) query.date.$lte = to;
  }

  // Betragsbereich.
  if (minAmount || maxAmount) {
    query.amount = {};
    if (minAmount) query.amount.$gte = Number(minAmount);
    if (maxAmount) query.amount.$lte = Number(maxAmount);
  }

  // Textsuche in der Notiz
  if (search) query.note = { $regex: search, $options: "i" };

  const list = await transactions.find(query).sort({ date: -1 }).toArray();
  list.forEach((t) => (t._id = t._id.toString()));
  return list;
}

//////////////////////////////////////////
// Auswertungen
//////////////////////////////////////////

// Summe + Anzahl pro Kategorie für einen Monat ("YYYY-MM").
async function getMonthlySummary(userId, month) {
  const list = await transactions.find({ userId }).toArray();

  const summary = {}; // { categoryId: { _id, amount, count } }
  for (const t of list) {
    if (!t.date.startsWith(month)) continue;
    if (!summary[t.categoryId]) {
      summary[t.categoryId] = { _id: t.categoryId, amount: 0, count: 0 };
    }
    summary[t.categoryId].amount += t.amount;
    summary[t.categoryId].count += 1;
  }
  return Object.values(summary);
}

// Alle Monate ("YYYY-MM") mit Transaktionen — neueste zuerst.
async function getUsedMonths(userId) {
  const list = await transactions.find({ userId }).toArray();

  const months = [];
  for (const t of list) {
    const month = t.date.slice(0, 7);
    if (!months.includes(month)) months.push(month);
  }
  months.sort();
  months.reverse();
  return months;
}

export default {
  // Users
  getUserByEmail,
  getUserById,
  createUser,
  // Categories
  getCategories,
  createCategory,
  deleteCategory,
  // Transactions
  createTransaction,
  deleteTransaction,
  findTransactions,
  // Auswertungen
  getMonthlySummary,
  getUsedMonths,
};
