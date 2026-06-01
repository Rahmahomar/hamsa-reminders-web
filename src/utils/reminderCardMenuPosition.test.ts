import { describe, expect, it, vi } from "vitest";

import { computeReminderCardMenuPosition } from "./reminderCardMenuPosition";

describe("computeReminderCardMenuPosition", () => {
  it("places menu below the anchor by default", () => {
    vi.stubGlobal("window", { innerWidth: 400, innerHeight: 800 });

    const anchor = {
      getBoundingClientRect: () => ({
        top: 100,
        left: 200,
        right: 236,
        bottom: 136,
        width: 36,
        height: 36,
      }),
    } as HTMLElement;

    const menu = { offsetWidth: 168, offsetHeight: 88 } as HTMLElement;

    const pos = computeReminderCardMenuPosition(anchor, menu);
    expect(pos.top).toBe(144);
    expect(pos.left).toBe(68);
  });

  it("flips above the anchor when there is no room below", () => {
    vi.stubGlobal("window", { innerWidth: 400, innerHeight: 200 });

    const anchor = {
      getBoundingClientRect: () => ({
        top: 120,
        left: 200,
        right: 236,
        bottom: 156,
        width: 36,
        height: 36,
      }),
    } as HTMLElement;

    const menu = { offsetWidth: 168, offsetHeight: 88 } as HTMLElement;

    const pos = computeReminderCardMenuPosition(anchor, menu);
    expect(pos.top).toBe(24);
  });
});
