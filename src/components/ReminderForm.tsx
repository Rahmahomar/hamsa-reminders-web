import { type FormEvent, useEffect, useState } from "react";
import { FireAtPicker } from "./FireAtPicker";
import { parseLocalDatetimeValue } from "../utils/datetimeLocal";
import { FIRE_AT_PRESETS, getTimezoneLabel } from "../utils/fireAtPresets";
import { validateFutureFireAt } from "../utils/validateFireAt";
import type { ReminderFormProps } from "../types/reminder-form";

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

    setTitle("");
    setBody("");
    setFireAt("");
  };

  return (
    <form
      className={`panel reveal reveal-delay-2${celebrate ? " panel--celebrate" : ""}`}
      onSubmit={handleSubmit}
    >
      <div className="panel__create-head">
        <p className="eyebrow">CREATE</p>
        <h2>New Reminder</h2>
      </div>

      <div className="panel__create-body">
        <label>Title</label>
        <input
          placeholder="Review project"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError("");
          }}
          disabled={loading}
        />
        {error === "Title is required" && (
          <p className="message message--error" role="alert">
            {error}
          </p>
        )}

        <label>Body</label>
        <textarea
          placeholder="Check final version"
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            if (error === "Body is required") setError("");
          }}
          disabled={loading}
        />
        {error === "Body is required" && (
          <p className="message message--error">{error}</p>
        )}

        <label htmlFor="project-id">Project</label>
        <input
          id="project-id"
          list="project-id-options"
          value={projectId}
          onChange={(e) => {
            handleProjectChange(e.target.value);
            if (error === "Project ID is required") setError("");
          }}
          placeholder="Project UUID"
          disabled={loading}
        />
        <datalist id="project-id-options">
          {projectIds.map((id) => (
            <option key={id} value={id} />
          ))}
        </datalist>
        {error === "Project ID is required" && (
          <p className="message message--error">{error}</p>
        )}

        <div className="fire-at-presets">
          <span className="fire-at-presets__label">Quick schedule</span>
          <div className="fire-at-presets__btns">
            {FIRE_AT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className="fire-at-presets__btn"
                disabled={loading}
                onClick={() => {
                  setFireAt(preset.getValue());
                  setFireAtError("");
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <p className="fire-at-presets__tz">Timezone: {getTimezoneLabel()}</p>
        </div>

        <FireAtPicker
          value={fireAt}
          onChange={(next) => {
            setFireAt(next);
            if (fireAtError) setFireAtError("");
          }}
          error={fireAtError}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Creating…" : "Create Reminder"}
      </button>
    </form>
  );
}
