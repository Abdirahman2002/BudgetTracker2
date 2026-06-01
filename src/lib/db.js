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
// Categories (pro User)
//////////////////////////////////////////

async function getCategories(userId) {
  const list = await categories.find({ userId }).sort({ name: 1 }).toArray();
  list.forEach((c) => (c._id = c._id.toString()));
  return list;
}

async function createCategory(userId, { name, icon }) {
  const result = await categories.insertOne({ userId, name, icon });
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

async function getTransactions(userId) {
  const list = await transactions.find({ userId }).sort({ date: -1 }).toArray();
  list.forEach((t) => (t._id = t._id.toString()));
  return list;
}

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

export default {

  getUserByEmail,
  getUserById,
  createUser,
  getCategories,
  createCategory,
  deleteCategory,
  getTransactions,
  createTransaction,
  deleteTransaction,
};
