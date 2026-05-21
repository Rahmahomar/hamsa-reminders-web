import {
  STORAGE_JWT,
  STORAGE_PROJECT_ID,
  STORAGE_PROJECT_IDS,
} from "../constants/storage";
import { DEFAULT_PROJECT_ID } from "../environment";

export function loadToken(): string {
  try {
    return localStorage.getItem(STORAGE_JWT) ?? "";
  } catch {
    return "";
  }
}

export function saveToken(token: string): void {
  try {
    if (token.trim()) {
      localStorage.setItem(STORAGE_JWT, token.trim());
    } else {
      localStorage.removeItem(STORAGE_JWT);
    }
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearAuthStorage(): void {
  try {
    localStorage.removeItem(STORAGE_JWT);
  } catch {
    /* ignore */
  }
}

export function loadProjectId(): string {
  try {
    return localStorage.getItem(STORAGE_PROJECT_ID) ?? DEFAULT_PROJECT_ID;
  } catch {
    return DEFAULT_PROJECT_ID;
  }
}

export function saveProjectId(projectId: string): void {
  try {
    localStorage.setItem(STORAGE_PROJECT_ID, projectId.trim());
    rememberProjectId(projectId);
  } catch {
    /* ignore */
  }
}

export function loadProjectIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_PROJECT_IDS);
    if (!raw) return [DEFAULT_PROJECT_ID];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [DEFAULT_PROJECT_ID];
    const ids = parsed.filter(
      (id): id is string => typeof id === "string" && id.trim().length > 0
    );
    return ids.length > 0 ? ids : [DEFAULT_PROJECT_ID];
  } catch {
    return [DEFAULT_PROJECT_ID];
  }
}

export function rememberProjectId(projectId: string): string[] {
  const trimmed = projectId.trim();
  if (!trimmed) return loadProjectIds();

  const existing = loadProjectIds();
  const next = [trimmed, ...existing.filter((id) => id !== trimmed)].slice(0, 12);

  try {
    localStorage.setItem(STORAGE_PROJECT_IDS, JSON.stringify(next));
  } catch {
    /* ignore */
  }

  return next;
}
