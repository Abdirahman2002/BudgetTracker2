import { MongoClient, ObjectId } from "mongodb";
import { DB_URI } from "$env/static/private";

const client = new MongoClient(DB_URI);
await client.connect();
const db = client.db("BudgetTrackerDB");

//////////////////////////////////////////
// Categories
//////////////////////////////////////////

async function getCategories() {
  let categories = [];
  try {
    const collection = db.collection("categories");
    categories = await collection.find({}).toArray();
    categories.forEach(function (c) {
      c._id = c._id.toString();
    });
  } catch (error) {
    console.log(error);
  }
  return categories;
}

async function createCategory(category) {
  try {
    const collection = db.collection("categories");
    const result = await collection.insertOne(category);
    return result.insertedId.toString();
  } catch (error) {
    console.log(error);
  }
  return null;
}

async function deleteCategory(id) {
  try {
    // Auch alle Transaktionen dieser Kategorie löschen
    await db.collection("transactions").deleteMany({ categoryId: id });
    await db.collection("categories").deleteOne({ _id: new ObjectId(id) });
    return id;
  } catch (error) {
    console.log(error);
  }
  return null;
}

//////////////////////////////////////////
// Transactions
//////////////////////////////////////////

async function getTransactions() {
  let transactions = [];
  try {
    const collection = db.collection("transactions");
    transactions = await collection.find({}).sort({ date: -1 }).toArray();
    transactions.forEach(function (t) {
      t._id = t._id.toString();
    });
  } catch (error) {
    console.log(error);
  }
  return transactions;
}

async function createTransaction(transaction) {
  try {
    const collection = db.collection("transactions");
    const result = await collection.insertOne(transaction);
    return result.insertedId.toString();
  } catch (error) {
    console.log(error);
  }
  return null;
}

async function deleteTransaction(id) {
  try {
    const collection = db.collection("transactions");
    await collection.deleteOne({ _id: new ObjectId(id) });
    return id;
  } catch (error) {
    console.log(error);
  }
  return null;
}

export default {
  getCategories,
  createCategory,
  deleteCategory,
  getTransactions,
  createTransaction,
  deleteTransaction,
};
