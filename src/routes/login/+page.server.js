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

    const user = await db.getUserByEmail(email);
    if (!user) {
      return fail(400, { error: "E-Mail oder Passwort falsch.", email });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return fail(400, { error: "E-Mail oder Passwort falsch.", email });
    }

    cookies.set("session", user._id, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 Tage
    });

    throw redirect(303, "/");
  },
};
