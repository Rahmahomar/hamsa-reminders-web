import { type FormEvent, useState } from "react";
import { FireAtPicker } from "./FireAtPicker";
import { parseLocalDatetimeValue } from "../utils/datetimeLocal";
import type { ReminderFormProps } from "../types/reminder-form";

export function ReminderForm({ celebrate = false, onCreate }: ReminderFormProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [projectId, setProjectId] = useState(
    "550e8400-e29b-41d4-a716-446655440000"
  );
  const [fireAt, setFireAt] = useState("");
  const [fireAtError, setFireAtError] = useState<string>("");

  const [error, setError] = useState<string>("");

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

    let fireAtIso = "";
    if (!fireAt) {
      setFireAtError("Fire At is required");
      setError("");
      return;
    }

    const fireAtDate = parseLocalDatetimeValue(fireAt);
    if (!fireAtDate) {
      setFireAtError("Fire At is invalid");
      setError("");
      return;
    }

    setFireAtError("");
    fireAtIso = fireAtDate.toISOString();

    await onCreate({
      title: trimmedTitle,
      body: body.trim(),
      projectId: trimmedProjectId,
      fireAt: fireAtIso,
    });

    setTitle("");
    setBody("");
    setProjectId("550e8400-e29b-41d4-a716-446655440000");
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
      />
      {error === "Title is required" && (
        <p className="message" style={{ color: "#d6001c" }}>
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
      />
      {error === "Body is required" && (
        <p className="message" style={{ color: "#d6001c" }}>
          {error}
        </p>
      )}

      <label>Project ID</label>
      <input
        value={projectId}
        onChange={(e) => {
          setProjectId(e.target.value);
          if (error === "Project ID is required") setError("");
        }}
      />
      {error === "Project ID is required" && (
        <p className="message" style={{ color: "#d6001c" }}>
          {error}
        </p>
      )}

      <FireAtPicker
        value={fireAt}
        onChange={(next) => {
          setFireAt(next);
          if (fireAtError) setFireAtError("");
        }}
        error={fireAtError}
      />
      </div>

      <button type="submit">Create Reminder</button>
    </form>
  );
}