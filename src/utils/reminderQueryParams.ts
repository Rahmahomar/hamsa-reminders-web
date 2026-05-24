import type { ReminderFilterState } from "./filterReminders";
import { mapSortToApi } from "../constants/reminder-api-sort";
import type { ReminderListQuery } from "../types/reminder-list-query";

export function buildReminderQueryParams(
  filter: ReminderFilterState
): URLSearchParams {
  const params = new URLSearchParams();

  if (filter.status !== "ALL") {
    params.set("status", filter.status);
  }

  const search = filter.query.trim();
  if (search) {
    params.set("search", search);
  }

  params.set("sort", mapSortToApi(filter.sort));

  return params;
}

export function buildReminderListQuery(
  filter: ReminderFilterState
): ReminderListQuery {
  const query: ReminderListQuery = {
    sort: mapSortToApi(filter.sort),
  };

  if (filter.status !== "ALL") {
    query.status = filter.status;
  }

  const search = filter.query.trim();
  if (search) {
    query.search = search;
  }

  return query;
}

export function reminderQueryKey(filter: ReminderFilterState): string {
  return buildReminderQueryParams(filter).toString();
}

export function hasActiveReminderFilters(filter: ReminderFilterState): boolean {
  return filter.status !== "ALL" || filter.query.trim().length > 0;
}
