import { type FormEvent, useCallback, useEffect, useState } from "react";
import { useLocale, useTranslation } from "../context/LocaleContext";
import type { ReminderFormProps } from "../types/reminder-form";
import { parseLocalDatetimeValue } from "../utils/datetimeLocal";
import { validateFutureFireAt } from "../utils/validateFireAt";
import { FireAtPicker } from "./FireAtPicker";

function resetFormFields() {
  return {
    title: "",
    body: "",
    fireAt: "",
    fireAtError: "",
    error: "",
  };
}

export function ReminderForm({
  celebrate = false,
  loading = false,
  initialProjectId,
  projectIds,
  duplicateSeed,
  onProjectIdChange,
  onCreate,
}: ReminderFormProps) {
  const { locale } = useLocale();
  const t = useTranslation();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [projectId, setProjectId] = useState(initialProjectId);
  const [fireAt, setFireAt] = useState("");
  const [fireAtError, setFireAtError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setProjectId(initialProjectId);
  }, [initialProjectId]);

  useEffect(() => {
    if (!duplicateSeed) return;
    setTitle(`${duplicateSeed.sourceTitle} ${t("common.copySuffix")}`);
    setBody(duplicateSeed.body);
    setProjectId(duplicateSeed.projectId);
    setFireAt("");
    setFireAtError("");
    setError("");
  }, [duplicateSeed, locale, t]);

  const clearForm = useCallback(() => {
    const cleared = resetFormFields();
    setTitle(cleared.title);
    setBody(cleared.body);
    setFireAt(cleared.fireAt);
    setFireAtError(cleared.fireAtError);
    setError(cleared.error);
  }, []);

  const handleProjectChange = (value: string) => {
    setProjectId(value);
    onProjectIdChange(value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("reminderForm.error.titleRequired");
      return;
    }

    const trimmedProjectId = projectId.trim();
    if (!trimmedProjectId) {
      setError("reminderForm.error.projectIdRequired");
      return;
    }

    const trimmedBody = body.trim();
    if (!trimmedBody) {
      setError("reminderForm.error.bodyRequired");
      return;
    }

    const fireAtValidation = validateFutureFireAt(fireAt);
    if (fireAtValidation) {
      setFireAtError(fireAtValidation);
      return;
    }

    setFireAtError("");
    const fireAtDate = parseLocalDatetimeValue(fireAt)!;

    await onCreate({
      title: trimmedTitle,
      body: trimmedBody,
      projectId: trimmedProjectId,
      fireAt: fireAtDate.toISOString(),
    });

    clearForm();
  };

  return (
    <form
      id="create-reminder-sidebar"
      className={`create-sidebar${celebrate ? " create-sidebar--celebrate" : ""}`}
      onSubmit={handleSubmit}
      aria-labelledby="create-sidebar-title"
    >
      <header className="create-sidebar__head">
        <div>
          <h2 id="create-sidebar-title">{t("reminderForm.title")}</h2>
          <p className="create-sidebar__subtitle">{t("reminderForm.subtitle")}</p>
        </div>
        <button type="button" className="create-sidebar__clear" onClick={clearForm}>
          {t("reminderForm.clear")}
        </button>
      </header>

      <div className="create-sidebar__body">
        <div className="create-sidebar__field">
          <label htmlFor="reminder-title">{t("reminderForm.fieldTitle")}</label>
          <input
            id="reminder-title"
            placeholder={t("reminderForm.titlePlaceholder")}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
            disabled={loading}
          />
          {error === "reminderForm.error.titleRequired" && (
            <p className="create-sidebar__error" role="alert">
              {t(error)}
            </p>
          )}
        </div>

        <div className="create-sidebar__field">
          <label htmlFor="reminder-body">{t("reminderForm.fieldBody")}</label>
          <textarea
            id="reminder-body"
            placeholder={t("reminderForm.bodyPlaceholder")}
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              if (error === "reminderForm.error.bodyRequired") setError("");
            }}
            disabled={loading}
          />
          {error === "reminderForm.error.bodyRequired" && (
            <p className="create-sidebar__error">{t(error)}</p>
          )}
        </div>

        <div className="create-sidebar__field">
          <label htmlFor="project-id">{t("reminderForm.fieldProjectId")}</label>
          <input
            id="project-id"
            list="project-id-options"
            value={projectId}
            onChange={(e) => {
              handleProjectChange(e.target.value);
              if (error === "reminderForm.error.projectIdRequired") setError("");
            }}
            placeholder={t("reminderForm.projectIdPlaceholder")}
            disabled={loading}
          />
          <datalist id="project-id-options">
            {projectIds.map((id) => (
              <option key={id} value={id} />
            ))}
          </datalist>
          {error === "reminderForm.error.projectIdRequired" && (
            <p className="create-sidebar__error">{t(error)}</p>
          )}
        </div>

        <div className="create-sidebar__field create-sidebar__fire-at">
          <FireAtPicker
            value={fireAt}
            onChange={(next) => {
              setFireAt(next);
              if (fireAtError) setFireAtError("");
            }}
            error={fireAtError ? t(fireAtError) : undefined}
            defaultExpanded
          />
        </div>
      </div>

      <footer className="create-sidebar__footer">
        <button
          type="button"
          className="create-sidebar__cancel"
          disabled={loading}
          onClick={clearForm}
        >
          {t("reminderForm.cancel")}
        </button>
        <button type="submit" className="create-sidebar__submit" disabled={loading}>
          {loading ? t("reminderForm.creating") : t("reminderForm.submit")}
        </button>
      </footer>
    </form>
  );
}
