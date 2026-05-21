import { apiClient, authHeaders } from "./client";
import { REMINDERS_ENDPOINT } from "../constants/api";
import type { CreateReminderPayload, Reminder } from "../types/reminder";
import type { ApiResponse } from "../types/api";
import type { UpdateReminderPayload } from "../types/update-reminder-payload";
import { normalizeReminder, normalizeReminders } from "../utils/normalizeReminder";

export const getReminders = async (token: string) => {
  const res = await apiClient.get<ApiResponse<Reminder[]>>(
    REMINDERS_ENDPOINT,
    { headers: authHeaders(token) }
  );

  return normalizeReminders(res.data.data);
};

export const createReminder = async (
  token: string,
  payload: CreateReminderPayload
) => {
  const res = await apiClient.post<ApiResponse<Reminder>>(
    REMINDERS_ENDPOINT,
    payload,
    { headers: authHeaders(token) }
  );

  return normalizeReminder(res.data.data);
};

export const cancelReminder = async (token: string, id: string) => {
  const res = await apiClient.delete<ApiResponse<null>>(
    `${REMINDERS_ENDPOINT}/${id}`,
    { headers: authHeaders(token) }
  );

  return res.data;
};

export const updateReminder = async (
  token: string,
  id: string,
  payload: UpdateReminderPayload
) => {
  const res = await apiClient.patch<ApiResponse<Reminder>>(
    `${REMINDERS_ENDPOINT}/${id}`,
    payload,
    { headers: authHeaders(token) }
  );

  return normalizeReminder(res.data.data);
};
