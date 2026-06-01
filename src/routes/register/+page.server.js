import { redirect, fail } from "@sveltejs/kit";
import bcrypt from "bcryptjs";
import db from "$lib/db.js";

export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = (data.get("email") || "").toString().trim();
    const password = (data.get("password") || "").toString();

    if (!email || !password) {
      return fail(400, { error: "Bitte E-Mail und Passwort eingeben.", email });
    }
    if (password.length < 6) {
      return fail(400, { error: "Passwort muss mindestens 6 Zeichen lang sein.", email });
    }

    const existing = await db.getUserByEmail(email);
    if (existing) {
      return fail(400, { error: "Diese E-Mail ist bereits registriert.", email });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = await db.createUser({ email, passwordHash });

    // Standard-Kategorien für neuen User anlegen
    const defaults = [
      { name: "Lebensmittel", icon: "basket" },
      { name: "ÖV", icon: "train-front" },
      { name: "Freizeit", icon: "controller" },
      { name: "Miete", icon: "house" },
      { name: "Krankenkasse", icon: "heart-pulse" },
    ];
    for (const c of defaults) {
      await db.createCategory(userId, c);
    }

    cookies.set("session", userId, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });

    throw redirect(303, "/");
  },
};
