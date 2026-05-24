import { describe, expect, it } from "vitest";
import {
  buildReminderListQuery,
  buildReminderQueryParams,
  hasActiveReminderFilters,
} from "./reminderQueryParams";
import { mapSortToApi } from "../constants/reminder-api-sort";
import { DEFAULT_REMINDER_FILTER } from "./filterReminders";

describe("reminderQueryParams", () => {
  it("maps sort values to API params", () => {
    expect(mapSortToApi("created-desc")).toBe("newest");
    expect(mapSortToApi("fireAt-asc")).toBe("soonest");
    expect(mapSortToApi("fireAt-desc")).toBe("latest");
  });

  it("builds status-only query", () => {
    const params = buildReminderQueryParams({
      ...DEFAULT_REMINDER_FILTER,
      status: "PENDING",
    });
    expect(params.toString()).toBe("status=PENDING&sort=newest");
  });

  it("builds search-only query", () => {
    const params = buildReminderQueryParams({
      ...DEFAULT_REMINDER_FILTER,
      query: "test",
    });
    expect(params.toString()).toBe("search=test&sort=newest");
  });

  it("builds combined query", () => {
    const params = buildReminderQueryParams({
      status: "PENDING",
      query: "meeting",
      sort: "fireAt-desc",
    });
    expect(params.toString()).toBe(
      "status=PENDING&search=meeting&sort=latest"
    );
  });

  it("omits ALL status from query", () => {
    const query = buildReminderListQuery(DEFAULT_REMINDER_FILTER);
    expect(query.status).toBeUndefined();
    expect(query.search).toBeUndefined();
    expect(query.sort).toBe("newest");
  });

  it("detects active filters", () => {
    expect(hasActiveReminderFilters(DEFAULT_REMINDER_FILTER)).toBe(false);
    expect(
      hasActiveReminderFilters({ ...DEFAULT_REMINDER_FILTER, status: "FIRED" })
    ).toBe(true);
    expect(
      hasActiveReminderFilters({ ...DEFAULT_REMINDER_FILTER, query: "x" })
    ).toBe(true);
  });
});
