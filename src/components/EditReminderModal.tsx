import { useEffect, useMemo, useState } from "react";
import type {
  EditReminderModalPayload,
  EditReminderModalProps,
} from "../types/edit-reminder-modal";
import { FireAtPicker } from "./FireAtPicker";
import {
  localDatetimeInputValueToISO,
  toLocalDatetimeInputValue,
} from "../utils/datetimeLocal";

export function EditReminderModal({
  reminder,
  onClose,
  onSave,
}: EditReminderModalProps) {
  const [title, setTitle] = useState(reminder.title ?? "");
  const [body, setBody] = useState((reminder.body as string | undefined) ?? "");
  const [fireAtLocal, setFireAtLocal] = useState(
    toLocalDatetimeInputValue(reminder.fireAt)
  );

  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setTitle(reminder.title ?? "");
    setBody((reminder.body as string | undefined) ?? "");
    setFireAtLocal(toLocalDatetimeInputValue(reminder.fireAt));
  }, [reminder]);

  const canSave = useMemo(() => title.trim().length > 0, [title]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const handleOverlayMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    const payload: EditReminderModalPayload = {
      title: title.trim(),
      body: body.trim(),
    };

    const isoFireAt = localDatetimeInputValueToISO(fireAtLocal);
    if (isoFireAt) payload.fireAt = isoFireAt;

    onSave(payload);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="modalOverlay"
      onMouseDown={handleOverlayMouseDown}
      role="dialog"
      aria-modal="true"
    >
      <div className="modalContent edit-modal">
        <div className="modalHeader">
          <h2>Edit Reminder</h2>
          <button type="button" className="modalClose" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modalForm edit-modal-form">
          <label className="field">
            <span>Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Reminder title"
              required
            />
          </label>

          <label className="field">
            <span>Body</span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Reminder body"
              rows={3}
            />
          </label>

          <div className="field field--fire-at">
            <FireAtPicker value={fireAtLocal} onChange={setFireAtLocal} />
          </div>

          <div className="modalActions">
            <button type="button" className="secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary" disabled={!canSave}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
