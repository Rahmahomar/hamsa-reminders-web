import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

import {
  cancelReminder,
  createReminder,
  getReminders,
  updateReminder,
} from "../api/reminders.api";
import { SOCKET_URL } from "../environment";
import type { CreateReminderPayload, Reminder } from "../types/reminder";
import type { UpdateReminderPayload } from "../types/update-reminder-payload";
import { computeReminderCounts } from "../utils/computeReminderCounts";
import {
  DEFAULT_REMINDER_FILTER,
  type ReminderFilterState,
} from "../utils/filterReminders";
import { reminderQueryKey, hasActiveReminderFilters, canUseSingleFetch } from "../utils/reminderQueryParams";
import { useDebounce } from "./useDebounce";
import { isAbortError, isAuthError, isNotFoundError } from "../utils/apiError";
import { playNotificationSound } from "../utils/notificationSound";
import type { TranslateFn } from "../utils/i18n";
import {
  clearAuthStorage,
  loadToken,
  saveToken,
} from "../utils/storage";

type UseRemindersOptions = {
  onToast: (message: string, tone: "success" | "danger" | "info") => void;
  filter: ReminderFilterState;
  t: TranslateFn;
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

const POLL_INTERVAL_CONNECTED_MS = 120_000;
const POLL_INTERVAL_DISCONNECTED_MS = 30_000;

export function useReminders({ onToast, filter, t }: UseRemindersOptions) {
  const [token, setTokenState] = useState(() => loadToken());
  const [sessionToken, setSessionToken] = useState("");
  const [isRestoringSession, setIsRestoringSession] = useState(
    () => loadToken().trim().length > 0
  );
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

  const tRef = useRef(t);
  tRef.current = t;

  const knownFiredIdsRef = useRef<Set<string>>(new Set());
  const previousStatusesRef = useRef<Map<string, string>>(new Map());
  const bootstrapDoneRef = useRef(false);
  const socketRef = useRef<Socket | null>(null);
  const socketTokenRef = useRef("");
  const listAbortRef = useRef<AbortController | null>(null);
  const apiFilterRef = useRef(apiFilter);
  apiFilterRef.current = apiFilter;
  const socketConnectedRef = useRef(false);
  const pollTimeoutRef = useRef<number | null>(null);

  const notifyReminderFired = useCallback((reminder: Reminder) => {
    if (knownFiredIdsRef.current.has(reminder.id)) return;

    knownFiredIdsRef.current.add(reminder.id);
    playNotificationSound();

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(tRef.current("notification.reminderFiredTitle"), {
        body: reminder.title,
      });
    }

    setFiredReminder(reminder);
    onToastRef.current(
      tRef.current("toast.reminderFired", { title: reminder.title }),
      "success"
    );
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
        if (canUseSingleFetch(activeFilter)) {
          trackStatusTransitions(data);
          setAllReminders(data);
        }
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

        if (isAuthError(err)) {
          setConnected(false);
          if (!silent) {
            onToastRef.current(tRef.current("toast.sessionExpired"), "danger");
          }
          clearAuthStorage();
          setSessionToken("");
          setReminders([]);
          setAllReminders([]);
          return;
        }

        if (!hasFilters && !silent) {
          onToastRef.current(tRef.current("toast.fetchFailed"), "danger");
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
      const activeFilter = apiFilterRef.current;
      if (canUseSingleFetch(activeFilter)) {
        await loadFilteredReminders(options);
        return;
      }
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
  }, []);

  /** Validates token with API; updates reminder state. Throws on auth/network failure. */
  const establishSession = useCallback(
    async (activeToken: string) => {
      const trimmed = activeToken.trim();
      if (!trimmed) {
        throw new Error("Token is required");
      }

      const data = await getReminders(trimmed, {
        filter: DEFAULT_REMINDER_FILTER,
      });

      trackStatusTransitions(data);
      setReminders(data);
      setAllReminders(data);
      setConnected(true);
      setHasLoadedOnce(true);
      setListError(null);
      return data;
    },
    [trackStatusTransitions]
  );

  const logout = useCallback(() => {
    listAbortRef.current?.abort();
    clearAuthStorage();
    setTokenState("");
    setSessionToken("");
    setIsRestoringSession(false);
    setConnected(false);
    setReminders([]);
    setAllReminders([]);
    setHasLoadedOnce(false);
    setListError(null);
    onToastRef.current(tRef.current("toast.loggedOut"), "info");
  }, []);

  const handleConnect = useCallback(async () => {
    const trimmed = token.trim();
    if (!trimmed) {
      onToastRef.current(tRef.current("toast.tokenRequired"), "danger");
      return;
    }

    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }

    setConnecting(true);

    try {
      await establishSession(trimmed);
      setSessionToken(trimmed);
      saveToken(trimmed);
    } catch (err: unknown) {
      setSessionToken("");
      setConnected(false);
      setReminders([]);
      setAllReminders([]);
      setHasLoadedOnce(false);
      clearAuthStorage();

      if (isAuthError(err)) {
        onToastRef.current(tRef.current("toast.invalidToken"), "danger");
      } else if (!isAbortError(err)) {
        onToastRef.current(tRef.current("toast.signInFailed"), "danger");
      }
    } finally {
      setConnecting(false);
    }
  }, [token, establishSession]);

  const handleCreate = useCallback(
    async (payload: CreateReminderPayload) => {
      if (!sessionToken.trim()) {
        onToastRef.current(tRef.current("toast.tokenRequired"), "danger");
        return;
      }

      setActionLoading(true);
      try {
        await createReminder(sessionToken, payload);

        onToastRef.current(tRef.current("toast.created"), "success");
        setCelebrate(true);
        window.setTimeout(() => setCelebrate(false), 700);
        await refreshReminders({ silent: true });
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ?? tRef.current("toast.createFailed");
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
        onToastRef.current(tRef.current("toast.cancelled"), "success");
        await refreshReminders({ silent: true });
      } catch {
        onToastRef.current(tRef.current("toast.cancelFailed"), "danger");
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
        onToastRef.current(tRef.current("toast.updated"), "success");
        await refreshReminders({ silent: true });
        return true;
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ?? tRef.current("toast.updateFailed");
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
    if (!saved) {
      setIsRestoringSession(false);
      return;
    }

    void (async () => {
      setConnecting(true);
      try {
        await establishSession(saved);
        setSessionToken(saved);
        setTokenState(saved);
      } catch {
        clearAuthStorage();
        setSessionToken("");
        setTokenState("");
        setConnected(false);
      } finally {
        setConnecting(false);
        setIsRestoringSession(false);
      }
    })();
  }, [establishSession]);

  useEffect(() => {
    const activeToken = sessionToken.trim();
    if (!activeToken) return;

    void loadFilteredReminders();
  }, [sessionToken, apiFilter, loadFilteredReminders]);

  useEffect(() => {
    const activeToken = sessionToken.trim();
    if (!activeToken) return;
    if (canUseSingleFetch(apiFilterRef.current)) return;

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

    const onConnect = () => {
      socketConnectedRef.current = true;
    };
    const onDisconnect = () => {
      socketConnectedRef.current = false;
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    if (socket.connected) {
      socketConnectedRef.current = true;
    }

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

    const schedulePoll = () => {
      pollTimeoutRef.current = window.setTimeout(() => {
        void refreshRemindersRef.current({ silent: true });
        schedulePoll();
      }, socketConnectedRef.current
        ? POLL_INTERVAL_CONNECTED_MS
        : POLL_INTERVAL_DISCONNECTED_MS);
    };

    schedulePoll();

    return () => {
      if (pollTimeoutRef.current !== null) {
        window.clearTimeout(pollTimeoutRef.current);
        pollTimeoutRef.current = null;
      }
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("reminder:fired", onFired);
      socket.disconnect();
      socketConnectedRef.current = false;
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
    sessionToken,
    isRestoringSession,
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
