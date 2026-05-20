export type ReminderStatus = "PENDING" | "FIRED" | "CANCELLED";

export type Reminder = {
  id: string;
  userId: string;
  projectId: string;
  title: string;
  body?: string;
  fireAt: string;
  status: ReminderStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateReminderPayload = {
  title: string;
  body?: string;
  projectId: string;
  fireAt: string;
};