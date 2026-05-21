import { describe, expect, it } from "vitest";
import { filterAndSortReminders } from "./filterReminders";
import type { Reminder } from "../types/reminder";

const base = (overrides: Partial<Reminder>): Reminder => ({
  id: "1",
  userId: "u",
  projectId: "p",
  title: "Alpha",
  body: "notes",
  fireAt: "2030-01-01T10:00:00.000Z",
  status: "PENDING",
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z",
  ...overrides,
});

describe("filterAndSortReminders", () => {
  const reminders: Reminder[] = [
    base({ id: "1", title: "Alpha", status: "PENDING", fireAt: "2030-06-01T10:00:00.000Z" }),
    base({ id: "2", title: "Beta", status: "FIRED", fireAt: "2030-01-01T10:00:00.000Z" }),
    base({ id: "3", title: "Gamma", status: "CANCELLED", fireAt: "2030-12-01T10:00:00.000Z" }),
  ];

  it("filters by status", () => {
    const result = filterAndSortReminders(reminders, {
      status: "FIRED",
      query: "",
      sort: "fireAt-asc",
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("filters by search query", () => {
    const result = filterAndSortReminders(reminders, {
      status: "ALL",
      query: "gamma",
      sort: "fireAt-asc",
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("3");
  });

  it("sorts by fireAt ascending", () => {
    const result = filterAndSortReminders(reminders, {
      status: "ALL",
      query: "",
      sort: "fireAt-asc",
    });
    expect(result.map((r) => r.id)).toEqual(["2", "1", "3"]);
  });

  it("defaults to newest created first", () => {
    const newer = base({
      id: "4",
      createdAt: "2026-01-02T00:00:00.000Z",
    });
    const older = base({
      id: "5",
      createdAt: "2024-01-01T00:00:00.000Z",
    });
    const result = filterAndSortReminders([older, newer], {
      status: "ALL",
      query: "",
      sort: "created-desc",
    });
    expect(result.map((r) => r.id)).toEqual(["4", "5"]);
  });

  it("pins newly created reminder to top", () => {
    const result = filterAndSortReminders(reminders, {
      status: "ALL",
      query: "",
      sort: "fireAt-asc",
    }, "3");
    expect(result[0].id).toBe("3");
  });
});
