import { memo, useMemo } from "react";
import type { ReminderListProps } from "../types/reminder-list";
import { useNow } from "../hooks/useNow";
import { EmptyReminders } from "./EmptyReminders";
import { ReminderCard } from "./ReminderCard";
import { ReminderListSkeleton } from "./ReminderListSkeleton";
import { ScheduleLocked } from "./ScheduleLocked";

export const ReminderList = memo(function ReminderList({
  reminders,
  connected = false,
  connecting = false,
  filtered = false,
  listLoading = false,
  hasLoadedOnce = false,
  actionLoading = false,
  onCancel,
  onEdit,
  onDuplicate,
}: ReminderListProps) {
  const needsClock = useMemo(
    () =>
      connected &&
      reminders.some((r) => {
        if (r.status !== "PENDING") return false;
        return new Date(r.fireAt).getTime() > Date.now();
      }),
    [connected, reminders]
  );

  const now = useNow(needsClock);
  const hasScrollableList = connected && reminders.length > 0;

  return (
    <div
      className={`reminders-list${hasScrollableList ? " reminders-list--scrollable" : ""}`}
      aria-live="polite"
    >
      {listLoading && !hasLoadedOnce ? (
        <div role="status" aria-busy="true">
          <p className="sr-only">Loading reminders…</p>
          <ReminderListSkeleton />
        </div>
      ) : null}

      {!connected && !connecting && !(listLoading && !hasLoadedOnce) ? (
        <ScheduleLocked />
      ) : null}

      {connected && !(listLoading && !hasLoadedOnce) && reminders.length === 0 ? (
        <EmptyReminders filtered={filtered} />
      ) : null}

      {connected && reminders.length > 0 ? (
        <ul className="reminders-list__items">
          {reminders.map((reminder) => {
            const isPending = reminder.status === "PENDING";
            const fireAt = new Date(reminder.fireAt).getTime();
            const showCountdown = isPending && needsClock && fireAt > now;

            return (
              <li key={reminder.id}>
                <ReminderCard
                  reminder={reminder}
                  countdownNow={showCountdown ? now : undefined}
                  actionLoading={actionLoading}
                  onCancel={onCancel}
                  onEdit={onEdit}
                  onDuplicate={onDuplicate}
                />
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
});
