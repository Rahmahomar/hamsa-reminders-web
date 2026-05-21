import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

import {
  cancelReminder,
  createReminder,
  getReminders,
  updateReminder,
} from "../api/reminders.api";
import { NOTIFICATION_SOUND, SOCKET_URL } from "../environment";
import type { CreateReminderPayload, Reminder } from "../types/reminder";
import type { UpdateReminderPayload } from "../types/update-reminder-payload";
import {
  clearAuthStorage,
  loadToken,
  saveToken,
} from "../utils/storage";

type UseRemindersOptions = {
  onToast: (message: string, tone: "success" | "danger" | "info") => void;
};

type LoadRemindersOptions = {
  silent?: boolean;
  tokenOverride?: string;
};

type ReminderFiredEvent = {
  reminderId: string;
  userId: string;
  projectId: string;
  title: string;
  body?: string;
  fireAt: string;
  firedAt: string;
};

export function useReminders({ onToast }: UseRemindersOptions) {
  const savedOnMount = loadToken();
  const [token, setTokenState] = useState(savedOnMount);
  const [sessionToken, setSessionToken] = useState(savedOnMount);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [connected, setConnected] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [firedReminder, setFiredReminder] = useState<Reminder | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [newlyCreatedId, setNewlyCreatedId] = useState<string | null>(null);

  const onToastRef = useRef(onToast);
  onToastRef.current = onToast;

  const knownFiredIdsRef = useRef<Set<string>>(new Set());
  const clearNewlyCreatedTimerRef = useRef<number | null>(null);
  const previousStatusesRef = useRef<Map<string, string>>(new Map());
  const bootstrapDoneRef = useRef(false);
  const socketRef = useRef<Socket | null>(null);
  const socketTokenRef = useRef("");

  const notifyReminderFired = useCallback((reminder: Reminder) => {
    if (knownFiredIdsRef.current.has(reminder.id)) return;

    knownFiredIdsRef.current.add(reminder.id);

    const audio = new Audio(NOTIFICATION_SOUND);
    audio.play().catch(() => {
      console.log("Audio play was blocked by browser");
    });

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Reminder fired", {
        body: reminder.title,
      });
    }

    setFiredReminder(reminder);
    onToastRef.current(`Reminder fired: ${reminder.title}`, "success");
  }, []);

  const loadReminders = useCallback(async (options?: LoadRemindersOptions) => {
    const activeToken = (options?.tokenOverride ?? sessionToken).trim();
    if (!activeToken) return;

    const silent = options?.silent ?? false;
    if (!silent) setListLoading(true);

    try {
      const data = await getReminders(activeToken);
      setConnected(true);
      setHasLoadedOnce(true);

      data.forEach((reminder) => {
        const previousStatus = previousStatusesRef.current.get(reminder.id);

        if (reminder.status === "FIRED" && previousStatus === "PENDING") {
          notifyReminderFired(reminder);
        }

        previousStatusesRef.current.set(reminder.id, reminder.status);
      });

      setReminders(data);
    } catch {
      setConnected(false);
      setHasLoadedOnce(true);
      if (!silent) {
        onToastRef.current("Failed to fetch reminders", "danger");
      }
    } finally {
      if (!silent) setListLoading(false);
    }
  }, [sessionToken, notifyReminderFired]);

  const loadRemindersRef = useRef(loadReminders);
  loadRemindersRef.current = loadReminders;

  const notifyReminderFiredRef = useRef(notifyReminderFired);
  notifyReminderFiredRef.current = notifyReminderFired;

  const setToken = useCallback((value: string) => {
    setTokenState(value);
    saveToken(value);
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setTokenState("");
    setSessionToken("");
    setConnected(false);
    setReminders([]);
    setHasLoadedOnce(false);
    onToastRef.current("Logged out", "info");
  }, []);

  const handleConnect = useCallback(async () => {
    const trimmed = token.trim();
    if (!trimmed) {
      onToastRef.current("Please add JWT token first", "danger");
      return;
    }

    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }

    setConnecting(true);
    setSessionToken(trimmed);
    saveToken(trimmed);

    try {
      await loadReminders({ tokenOverride: trimmed });
    } finally {
      setConnecting(false);
    }
  }, [token, loadReminders]);

  const handleCreate = useCallback(
    async (payload: CreateReminderPayload) => {
      if (!sessionToken.trim()) {
        onToastRef.current("Please add JWT token first", "danger");
        return;
      }

      setActionLoading(true);
      try {
        const created = await createReminder(sessionToken, payload);

        if (clearNewlyCreatedTimerRef.current !== null) {
          window.clearTimeout(clearNewlyCreatedTimerRef.current);
        }
        setNewlyCreatedId(created.id);
        clearNewlyCreatedTimerRef.current = window.setTimeout(() => {
          setNewlyCreatedId(null);
          clearNewlyCreatedTimerRef.current = null;
        }, 60_000);

        onToastRef.current("Reminder created successfully", "success");
        setCelebrate(true);
        window.setTimeout(() => setCelebrate(false), 700);
        await loadReminders({ silent: true });
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ?? "Create failed";
        onToastRef.current(msg, "danger");
      } finally {
        setActionLoading(false);
      }
    },
    [sessionToken, loadReminders]
  );

  const handleCancel = useCallback(
    async (id: string) => {
      setActionLoading(true);
      try {
        await cancelReminder(sessionToken, id);
        onToastRef.current("Reminder cancelled", "success");
        await loadReminders({ silent: true });
      } catch {
        onToastRef.current("Cancel failed", "danger");
      } finally {
        setActionLoading(false);
      }
    },
    [sessionToken, loadReminders]
  );

  const handleUpdate = useCallback(
    async (id: string, payload: UpdateReminderPayload) => {
      setActionLoading(true);
      try {
        await updateReminder(sessionToken, id, payload);
        onToastRef.current("Reminder updated successfully", "success");
        await loadReminders({ silent: true });
        return true;
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ?? "Update failed";
        onToastRef.current(msg, "danger");
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    [sessionToken, loadReminders]
  );

  useEffect(() => {
    if (bootstrapDoneRef.current) return;
    bootstrapDoneRef.current = true;

    const saved = loadToken().trim();
    if (!saved) return;

    setSessionToken(saved);
    void loadRemindersRef.current({ tokenOverride: saved });
  }, []);

  useEffect(() => {
    const activeToken = sessionToken.trim();

    if (!activeToken) {
      setConnected(false);
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
        socketTokenRef.current = "";
      }
      return;
    }

    if (socketRef.current && socketTokenRef.current === activeToken) {
      return;
    }

    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    socketTokenRef.current = activeToken;

    const socket = io(SOCKET_URL, {
      auth: { token: activeToken },
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: 8,
    });

    socketRef.current = socket;

    const onFired = (event: ReminderFiredEvent) => {
      const fired: Reminder = {
        id: event.reminderId,
        userId: event.userId,
        projectId: event.projectId,
        title: event.title,
        body: event.body,
        fireAt: event.fireAt,
        status: "FIRED",
        createdAt: event.firedAt,
        updatedAt: event.firedAt,
      };

      notifyReminderFiredRef.current(fired);
      void loadRemindersRef.current({ silent: true });
    };

    socket.on("reminder:fired", onFired);

    const fallbackInterval = window.setInterval(
      () => void loadRemindersRef.current({ silent: true }),
      30000
    );

    return () => {
      window.clearInterval(fallbackInterval);
      socket.off("reminder:fired", onFired);
      socket.disconnect();
      if (socketRef.current === socket) {
        socketRef.current = null;
        socketTokenRef.current = "";
      }
    };
  }, [sessionToken]);

  return {
    token,
    setToken,
    logout,
    reminders,
    connected,
    listLoading,
    connecting,
    hasLoadedOnce,
    actionLoading,
    firedReminder,
    setFiredReminder,
    celebrate,
    newlyCreatedId,
    loadReminders,
    handleConnect,
    handleCreate,
    handleCancel,
    handleUpdate,
  };
}
