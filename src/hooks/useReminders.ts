import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { computeReminderCounts } from "../utils/computeReminderCounts";
import type { ReminderFilterState } from "../utils/filterReminders";
import { reminderQueryKey, hasActiveReminderFilters } from "../utils/reminderQueryParams";
import { useDebounce } from "./useDebounce";
import { isAbortError, isAuthError, isNotFoundError } from "../utils/apiError";
import {
  clearAuthStorage,
  loadToken,
  saveToken,
} from "../utils/storage";

type UseRemindersOptions = {
  onToast: (message: string, tone: "success" | "danger" | "info") => void;
  filter: ReminderFilterState;
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

export function useReminders({ onToast, filter }: UseRemindersOptions) {
  const savedOnMount = loadToken();
  const [token, setTokenState] = useState(savedOnMount);
  const [sessionToken, setSessionToken] = useState(savedOnMount);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [allReminders, setAllReminders] = useState<Reminder[]>([]);
  const [connected, setConnected] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [firedReminder, setFiredReminder] = useState<Reminder | null>(null);
  const [celebrate, setCelebrate] = useState(false);

  const debouncedQuery = useDebounce(filter.query, 400);

  const apiFilter = useMemo<ReminderFilterState>(
    () => ({
      status: filter.status,
      query: debouncedQuery,
      sort: filter.sort,
    }),
    [filter.status, filter.sort, debouncedQuery]
  );

  const counts = useMemo(
    () => computeReminderCounts(allReminders),
    [allReminders]
  );

  const onToastRef = useRef(onToast);
  onToastRef.current = onToast;

  const knownFiredIdsRef = useRef<Set<string>>(new Set());
  const previousStatusesRef = useRef<Map<string, string>>(new Map());
  const bootstrapDoneRef = useRef(false);
  const socketRef = useRef<Socket | null>(null);
  const socketTokenRef = useRef("");
  const listAbortRef = useRef<AbortController | null>(null);
  const apiFilterRef = useRef(apiFilter);
  apiFilterRef.current = apiFilter;

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

  const trackStatusTransitions = useCallback((data: Reminder[]) => {
    data.forEach((reminder) => {
      const previousStatus = previousStatusesRef.current.get(reminder.id);

      if (reminder.status === "FIRED" && previousStatus === "PENDING") {
        notifyReminderFired(reminder);
      }

      previousStatusesRef.current.set(reminder.id, reminder.status);
    });
  }, [notifyReminderFired]);

  const refreshAllReminders = useCallback(
    async (options?: LoadRemindersOptions) => {
      const activeToken = (options?.tokenOverride ?? sessionToken).trim();
      if (!activeToken) return;

      try {
        const data = await getReminders(activeToken);
        trackStatusTransitions(data);
        setAllReminders(data);
        setConnected(true);
      } catch (err: unknown) {
        if (isAuthError(err)) {
          setConnected(false);
        }
      }
    },
    [sessionToken, trackStatusTransitions]
  );

  const loadFilteredReminders = useCallback(
    async (options?: LoadRemindersOptions) => {
      const activeToken = (options?.tokenOverride ?? sessionToken).trim();
      if (!activeToken) return;

      const silent = options?.silent ?? false;
      const activeFilter = apiFilterRef.current;

      listAbortRef.current?.abort();
      const controller = new AbortController();
      listAbortRef.current = controller;

      if (!silent) {
        setListLoading(true);
        setListError(null);
      }

      try {
        const data = await getReminders(activeToken, {
          filter: activeFilter,
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        setReminders(data);
        setConnected(true);
        setHasLoadedOnce(true);
        setListError(null);
      } catch (err: unknown) {
        if (isAbortError(err)) return;

        setHasLoadedOnce(true);

        if (isNotFoundError(err)) {
          setReminders([]);
          setListError(null);
          return;
        }

        const activeFilter = apiFilterRef.current;
        const hasFilters = hasActiveReminderFilters(activeFilter);

        setReminders([]);
        setListError(null);

        if (!hasFilters && !silent) {
          onToastRef.current("Failed to fetch reminders", "danger");
        }
      } finally {
        if (!controller.signal.aborted && !silent) {
          setListLoading(false);
        }
      }
    },
    [sessionToken]
  );

  const refreshReminders = useCallback(
    async (options?: LoadRemindersOptions) => {
      await Promise.all([
        loadFilteredReminders(options),
        refreshAllReminders(options),
      ]);
    },
    [loadFilteredReminders, refreshAllReminders]
  );

  const refreshRemindersRef = useRef(refreshReminders);
  refreshRemindersRef.current = refreshReminders;

  const notifyReminderFiredRef = useRef(notifyReminderFired);
  notifyReminderFiredRef.current = notifyReminderFired;

  const setToken = useCallback((value: string) => {
    setTokenState(value);
    saveToken(value);
  }, []);

  const logout = useCallback(() => {
    listAbortRef.current?.abort();
    clearAuthStorage();
    setTokenState("");
    setSessionToken("");
    setConnected(false);
    setReminders([]);
    setAllReminders([]);
    setHasLoadedOnce(false);
    setListError(null);
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
      await refreshReminders({ tokenOverride: trimmed });
    } finally {
      setConnecting(false);
    }
  }, [token, refreshReminders]);

  const handleCreate = useCallback(
    async (payload: CreateReminderPayload) => {
      if (!sessionToken.trim()) {
        onToastRef.current("Please add JWT token first", "danger");
        return;
      }

      setActionLoading(true);
      try {
        await createReminder(sessionToken, payload);

        onToastRef.current("Reminder created successfully", "success");
        setCelebrate(true);
        window.setTimeout(() => setCelebrate(false), 700);
        await refreshReminders({ silent: true });
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ?? "Create failed";
        onToastRef.current(msg, "danger");
      } finally {
        setActionLoading(false);
      }
    },
    [sessionToken, refreshReminders]
  );

  const handleCancel = useCallback(
    async (id: string) => {
      setActionLoading(true);
      try {
        await cancelReminder(sessionToken, id);
        onToastRef.current("Reminder cancelled", "success");
        await refreshReminders({ silent: true });
      } catch {
        onToastRef.current("Cancel failed", "danger");
      } finally {
        setActionLoading(false);
      }
    },
    [sessionToken, refreshReminders]
  );

  const handleUpdate = useCallback(
    async (id: string, payload: UpdateReminderPayload) => {
      setActionLoading(true);
      try {
        await updateReminder(sessionToken, id, payload);
        onToastRef.current("Reminder updated successfully", "success");
        await refreshReminders({ silent: true });
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
    [sessionToken, refreshReminders]
  );

  useEffect(() => {
    if (bootstrapDoneRef.current) return;
    bootstrapDoneRef.current = true;

    const saved = loadToken().trim();
    if (!saved) return;

    setSessionToken(saved);
  }, []);

  useEffect(() => {
    const activeToken = sessionToken.trim();
    if (!activeToken) return;

    void loadFilteredReminders();
  }, [sessionToken, apiFilter, loadFilteredReminders]);

  useEffect(() => {
    const activeToken = sessionToken.trim();
    if (!activeToken) return;

    void refreshAllReminders();
  }, [sessionToken, refreshAllReminders]);

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
      void refreshRemindersRef.current({ silent: true });
    };

    socket.on("reminder:fired", onFired);

    const fallbackInterval = window.setInterval(
      () => void refreshRemindersRef.current({ silent: true }),
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

  useEffect(
    () => () => {
      listAbortRef.current?.abort();
    },
    []
  );

  return {
    token,
    setToken,
    logout,
    reminders,
    allReminders,
    counts,
    connected,
    listLoading,
    listError,
    connecting,
    hasLoadedOnce,
    actionLoading,
    firedReminder,
    setFiredReminder,
    celebrate,
    debouncedQuery,
    apiFilterKey: reminderQueryKey(apiFilter),
    handleConnect,
    handleCreate,
    handleCancel,
    handleUpdate,
  };
}
