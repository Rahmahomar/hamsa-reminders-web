export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ?? API_BASE_URL;

export const CONSOLE_URL =
  import.meta.env.VITE_CONSOLE_URL ?? "https://agents.tryhamsa.com/";

export const DEFAULT_PROJECT_ID =
  import.meta.env.VITE_DEFAULT_PROJECT_ID ??
  "550e8400-e29b-41d4-a716-446655440000";

export const NOTIFICATION_SOUND = "/mixkit-happy-bells-notification-937.wav";
