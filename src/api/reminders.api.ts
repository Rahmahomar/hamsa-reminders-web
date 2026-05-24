import { apiClient, authHeaders } from "./client";
import { REMINDERS_ENDPOINT } from "../constants/api";
import type { CreateReminderPayload, Reminder } from "../types/reminder";
import type { ApiResponse } from "../types/api";
import type { UpdateReminderPayload } from "../types/update-reminder-payload";
import { normalizeReminder, normalizeReminders } from "../utils/normalizeReminder";
import type { ReminderListQuery } from "../types/reminder-list-query";
import { buildReminderQueryParams } from "../utils/reminderQueryParams";
import type { ReminderFilterState } from "../utils/filterReminders";

export type GetRemindersOptions = {
  signal?: AbortSignal;
  filter?: ReminderFilterState;
  query?: ReminderListQuery;
};

export const getReminders = async (
  token: string,
  options?: GetRemindersOptions
) => {
  let url = REMINDERS_ENDPOINT;

  if (options?.filter) {
    const params = buildReminderQueryParams(options.filter);
    const qs = params.toString();
    if (qs) url = `${REMINDERS_ENDPOINT}?${qs}`;
  } else if (options?.query) {
    const params = new URLSearchParams();
    if (options.query.status) params.set("status", options.query.status);
    if (options.query.search) params.set("search", options.query.search);
    if (options.query.sort) params.set("sort", options.query.sort);
    const qs = params.toString();
    if (qs) url = `${REMINDERS_ENDPOINT}?${qs}`;
  }

  const res = await apiClient.get<ApiResponse<Reminder[]>>(url, {
    headers: authHeaders(token),
    signal: options?.signal,
  });

  return normalizeReminders(res.data.data ?? []);
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
