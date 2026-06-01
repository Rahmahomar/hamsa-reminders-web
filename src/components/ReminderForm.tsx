import { type FormEvent, useCallback, useEffect, useState } from "react";
import { FireAtPicker } from "./FireAtPicker";
import { parseLocalDatetimeValue } from "../utils/datetimeLocal";
import { validateFutureFireAt } from "../utils/validateFireAt";
import type { ReminderFormProps } from "../types/reminder-form";

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
    setTitle(duplicateSeed.title);
    setBody(duplicateSeed.body);
    setProjectId(duplicateSeed.projectId);
    setFireAt("");
    setFireAtError("");
    setError("");
  }, [duplicateSeed]);

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
      setError("Title is required");
      return;
    }

    const trimmedProjectId = projectId.trim();
    if (!trimmedProjectId) {
      setError("Project ID is required");
      return;
    }

    const trimmedBody = body.trim();
    if (!trimmedBody) {
      setError("Body is required");
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
          <h2 id="create-sidebar-title">Create Reminder</h2>
          <p className="create-sidebar__subtitle">
            Add a new reminder to your schedule.
          </p>
        </div>
        <button
          type="button"
          className="create-sidebar__clear"
          onClick={clearForm}
        >
          Clear
        </button>
      </header>

      <div className="create-sidebar__body">
        <div className="create-sidebar__field">
          <label htmlFor="reminder-title">Title</label>
          <input
            id="reminder-title"
            placeholder="Enter reminder title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
            disabled={loading}
          />
          {error === "Title is required" && (
            <p className="create-sidebar__error" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="create-sidebar__field">
          <label htmlFor="reminder-body">Body</label>
          <textarea
            id="reminder-body"
            placeholder="Enter reminder details..."
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              if (error === "Body is required") setError("");
            }}
            disabled={loading}
          />
          {error === "Body is required" && (
            <p className="create-sidebar__error">{error}</p>
          )}
        </div>

        <div className="create-sidebar__field">
          <label htmlFor="project-id">Project ID</label>
          <input
            id="project-id"
            list="project-id-options"
            value={projectId}
            onChange={(e) => {
              handleProjectChange(e.target.value);
              if (error === "Project ID is required") setError("");
            }}
            placeholder="Enter project ID"
            disabled={loading}
          />
          <datalist id="project-id-options">
            {projectIds.map((id) => (
              <option key={id} value={id} />
            ))}
          </datalist>
          {error === "Project ID is required" && (
            <p className="create-sidebar__error">{error}</p>
          )}
        </div>

        <div className="create-sidebar__field create-sidebar__fire-at">
          <FireAtPicker
            value={fireAt}
            onChange={(next) => {
              setFireAt(next);
              if (fireAtError) setFireAtError("");
            }}
            error={fireAtError}
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
          Cancel
        </button>
        <button type="submit" className="create-sidebar__submit" disabled={loading}>
          {loading ? "Creating…" : "Create Reminder"}
        </button>
      </footer>
    </form>
  );
}
