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

  return (
    <section
      className="panel panel--schedule reveal reveal-delay-3"
      aria-labelledby="schedule-heading"
    >
      <div className="panel__schedule-head">
        <p className="eyebrow">REMINDERS</p>
        <h2 id="schedule-heading">Your Schedule</h2>
      </div>

      <div className="reminder-list-scroll">
        {listLoading && !hasLoadedOnce ? (
          <div role="status" aria-live="polite" aria-busy="true">
            <p className="reminder-list__loading sr-only">Loading reminders…</p>
            <ReminderListSkeleton />
          </div>
        ) : null}

        {!connected && !connecting && !(listLoading && !hasLoadedOnce) ? (
          <ScheduleLocked />
        ) : null}

        <div className="reminder-list">
          {connected &&
          !(listLoading && !hasLoadedOnce) &&
          reminders.length === 0 ? (
            <EmptyReminders filtered={filtered} />
          ) : null}

          {connected &&
            reminders.map((reminder) => {
              const isPending = reminder.status === "PENDING";
              const fireAt = new Date(reminder.fireAt).getTime();
              const showCountdown = isPending && needsClock && fireAt > now;

              return (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  countdownNow={showCountdown ? now : undefined}
                  actionLoading={actionLoading}
                  onCancel={onCancel}
                  onEdit={onEdit}
                  onDuplicate={onDuplicate}
                />
              );
            })}
        </div>
      </div>
    </section>
  );
});
