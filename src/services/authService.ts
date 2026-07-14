import crypto from "crypto";
import { query } from "../db/index.js";
import { GET_USER_BY_EMAIL } from "../queries/userQueries.js";

export async function loginUser(email: string, password: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const result = await query(GET_USER_BY_EMAIL, [normalizedEmail]);
  const user = result.rows[0];

  if (!user) {
    return null;
  }

  if (!isValidPassword(password, user.password)) {
    return null;
  }

  return {
    id: user.id,
    schoolId: user.school_id,
    name: user.name,
    email: user.email,
    role: normalizeRole(user.role),
    phone: user.phone,
    avatar: user.avatar_url,
    isActive: user.is_active,
  };
}

function normalizeRole(role: string) {
  if (role === "super_admin" || role === "school_admin") {
    return "admin";
  }
  return role;
}

function isValidPassword(inputPassword: string, storedPassword: string | null) {
  if (!storedPassword) {
    return false;
  }

  if (storedPassword.startsWith("sha256:")) {
    return storedPassword === `sha256:${sha256(inputPassword)}`;
  }

  return storedPassword === inputPassword;
}

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
