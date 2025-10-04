// src/lib/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
});

// mici helperi
export async function findUserByEmail(email: string) {
  const { data } = await api.get(`/users`, { params: { email } });
  return (data as any[])[0] || null;
}

export async function createUser(payload: any) {
  const { data } = await api.post(`/users`, payload);
  return data;
}

export async function updateUser(id: number, patch: any) {
  const { data } = await api.patch(`/users/${id}`, patch);
  return data;
}

export async function getUserById(id: number) {
  const { data } = await api.get(`/users/${id}`);
  return data;
}
