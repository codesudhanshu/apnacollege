import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export function getErrorMessage(err) {
  return err?.response?.data?.message || err?.message || "Something went wrong.";
}
