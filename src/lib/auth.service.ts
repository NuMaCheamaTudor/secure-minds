// src/lib/auth.service.ts
import { createUser, findUserByEmail, updateUser, getUserById } from "./api";

export type Role = "patient" | "doctor";
export interface User {
  id: number;
  role: Role;
  email: string;
  password: string;
  fullName?: string;
  // doctor fields
  specialty?: string;
  bio?: string;
  phone?: string;
  city?: string;
}

export async function registerUser(input: {
  role: Role;
  email: string;
  password: string;
  fullName?: string;
  // doctor extra
  specialty?: string;
  bio?: string;
  phone?: string;
  city?: string;
}) {
  const exists = await findUserByEmail(input.email);
  if (exists) {
    throw new Error("Email deja folosit");
  }
  const user = await createUser(input);
  // mock „token”
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", "mock-token");
  return user as User;
}

export async function login(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) {
    const err = new Error("Utilizator inexistent");
    (err as any).code = "NO_USER";
    throw err;
  }
  if (user.password !== password) {
    const err = new Error("Parolă incorectă");
    (err as any).code = "BAD_PASS";
    throw err;
  }
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", "mock-token");
  return user as User;
}

export async function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}

export async function loadCurrentUser(): Promise<User | null> {
  try { return JSON.parse(localStorage.getItem("user") || "null"); }
  catch { return null; }
}

// doctor profile
export async function getDoctorProfile(): Promise<User> {
  const current = await loadCurrentUser();
  if (!current) throw new Error("Neautentificat");
  return await getUserById(current.id);
}

export async function updateDoctorProfile(patch: Partial<User>) {
  const current = await loadCurrentUser();
  if (!current) throw new Error("Neautentificat");
  const updated = await updateUser(current.id, patch);
  // sincronizează localStorage
  localStorage.setItem("user", JSON.stringify(updated));
  return updated as User;
}
