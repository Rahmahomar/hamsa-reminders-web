import { describe, expect, it } from "vitest";
import { validateFutureFireAt } from "./validateFireAt";
import { buildLocalDatetimeValue } from "./datetimeLocal";

describe("validateFutureFireAt", () => {
  it("rejects empty value", () => {
    expect(validateFutureFireAt("")).toBe("Fire At is required");
  });

  it("rejects past datetime", () => {
    const past = new Date(Date.now() - 60_000);
    const local = buildLocalDatetimeValue(
      past.getFullYear(),
      past.getMonth() + 1,
      past.getDate(),
      past.getHours(),
      past.getMinutes()
    );
    expect(validateFutureFireAt(local)).toBe("Fire At must be in the future");
  });

  it("accepts future datetime", () => {
    const future = new Date(Date.now() + 3600_000);
    const local = buildLocalDatetimeValue(
      future.getFullYear(),
      future.getMonth() + 1,
      future.getDate(),
      future.getHours(),
      future.getMinutes()
    );
    expect(validateFutureFireAt(local)).toBeNull();
  });
});
