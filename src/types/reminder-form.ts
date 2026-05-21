import type { CreateReminderPayload } from "./reminder";

export type ReminderDuplicateSeed = {
  title: string;
  body: string;
  projectId: string;
};

export type ReminderFormProps = {
  celebrate?: boolean;
  loading?: boolean;
  initialProjectId: string;
  projectIds: string[];
  duplicateSeed?: ReminderDuplicateSeed | null;
  onProjectIdChange: (projectId: string) => void;
  onCreate: (payload: CreateReminderPayload) => Promise<void>;
};
