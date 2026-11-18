import "server-only";
import { getAuth } from "firebase-admin/auth";
import { getAdminDb, getAdminStorage } from "./admin";

export function getAdminAuth() {
  return getAuth();
}

export { getAdminDb, getAdminStorage };
