import { useEffect, useState } from "react";
import { useTranslation } from "../context/LocaleContext";
import type {
  EditReminderModalPayload,
  EditReminderModalProps,
} from "../types/edit-reminder-modal";
import {
  localDatetimeInputValueToISO,
  toLocalDatetimeInputValue,
} from "../utils/datetimeLocal";
import { validateFutureFireAt } from "../utils/validateFireAt";
import { FireAtPicker } from "./FireAtPicker";

export function EditReminderModal({
  reminder,
  onClose,
  onSave,
}: EditReminderModalProps) {
  const t = useTranslation();
  const [title, setTitle] = useState(reminder.title ?? "");
  const [body, setBody] = useState((reminder.body as string | undefined) ?? "");
  const [fireAtLocal, setFireAtLocal] = useState(
    toLocalDatetimeInputValue(reminder.fireAt)
  );
  const [titleError, setTitleError] = useState("");
  const [bodyError, setBodyError] = useState("");
  const [fireAtError, setFireAtError] = useState("");

  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setTitle(reminder.title ?? "");
    setBody((reminder.body as string | undefined) ?? "");
    setFireAtLocal(toLocalDatetimeInputValue(reminder.fireAt));
    setTitleError("");
    setBodyError("");
    setFireAtError("");
  }, [reminder]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();
    let valid = true;

    if (!trimmedTitle) {
      setTitleError("editReminder.error.titleRequired");
      valid = false;
    } else {
      setTitleError("");
    }

    if (!trimmedBody) {
      setBodyError("editReminder.error.bodyRequired");
      valid = false;
    } else {
      setBodyError("");
    }

    const fireAtValidation = validateFutureFireAt(fireAtLocal);
    if (fireAtValidation) {
      setFireAtError(fireAtValidation);
      valid = false;
    } else {
      setFireAtError("");
    }

    if (!valid) return;

    const payload: EditReminderModalPayload = {
      title: trimmedTitle,
      body: trimmedBody,
    };

    const isoFireAt = localDatetimeInputValueToISO(fireAtLocal);
    if (isoFireAt) payload.fireAt = isoFireAt;

    const result = await onSave(payload);
    if (result !== false) {
      setIsOpen(false);
      onClose();
    }
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
          <h2>{t("editReminder.title")}</h2>
          <button
            type="button"
            className="modalClose"
            onClick={onClose}
            aria-label={t("editReminder.close")}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modalForm edit-modal-form" noValidate>
          <label className="field">
            <span>{t("editReminder.fieldTitle")}</span>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError("");
              }}
              placeholder={t("editReminder.titlePlaceholder")}
              aria-invalid={titleError ? true : undefined}
            />
            {titleError ? (
              <p className="message message--error" role="alert">
                {t(titleError)}
              </p>
            ) : null}
          </label>

          <label className="field">
            <span>{t("editReminder.fieldBody")}</span>
            <textarea
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                if (bodyError) setBodyError("");
              }}
              placeholder={t("editReminder.bodyPlaceholder")}
              rows={3}
              aria-invalid={bodyError ? true : undefined}
            />
            {bodyError ? (
              <p className="message message--error" role="alert">
                {t(bodyError)}
              </p>
            ) : null}
          </label>

          <div className="field field--fire-at">
            <FireAtPicker
              value={fireAtLocal}
              onChange={(next) => {
                setFireAtLocal(next);
                if (fireAtError) setFireAtError("");
              }}
              error={fireAtError ? t(fireAtError) : undefined}
            />
          </div>

          <div className="modalActions">
            <button type="button" className="secondary" onClick={onClose}>
              {t("common.cancel")}
            </button>
            <button type="submit" className="primary">
              {t("editReminder.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
