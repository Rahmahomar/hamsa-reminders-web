import { useCallback, useEffect, useState } from "react";

import { Layout } from "./components/Layout";
import { AuthRestoringScreen } from "./components/AuthRestoringScreen";
import { LoginPage } from "./components/LoginPage";
import { ReminderForm } from "./components/ReminderForm";
import { ReminderList } from "./components/ReminderList";
import { ReminderFilters } from "./components/ReminderFilters";
import { RemindersPageHeader } from "./components/RemindersPageHeader";
import { FiredReminderOverlay } from "./components/FiredReminderOverlay";
import { EditReminderModal } from "./components/EditReminderModal";
import { NextReminderPulse } from "./components/NextReminderPulse";
import { Toast } from "./components/Toast";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { NotificationBanner } from "./components/NotificationBanner";

import "./styles/modal.css";
import "./styles/features.css";
import "./styles/dashboard.css";
import "./styles/navbar.css";
import "./styles/responsive.css";
import "./styles/ux.css";
import "./styles/buttons.css";

import { useLocale } from "./context/LocaleContext";
import { useReminders } from "./hooks/useReminders";
import { usePageTitle } from "./hooks/usePageTitle";
import { useToast } from "./hooks/useToast";
import type { Reminder } from "./types/reminder";
import type { ReminderDuplicateSeed } from "./types/reminder-form";
import { DEFAULT_REMINDER_FILTER } from "./utils/filterReminders";
import { hasActiveReminderFilters } from "./utils/reminderQueryParams";
import {
  loadProjectId,
  loadProjectIds,
  saveProjectId,
} from "./utils/storage";

const NOTIFICATION_DISMISS_KEY = "hamsa_notification_banner_dismissed";

function App() {
  const { locale, t } = useLocale();
  const toast = useToast();
  const onToast = useCallback(
    (message: string, tone: "success" | "danger" | "info") => {
      toast.show(message, tone);
    },
    [toast.show]
  );

  const [filter, setFilter] = useState(DEFAULT_REMINDER_FILTER);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [projectId, setProjectId] = useState(loadProjectId);
  const [projectIds, setProjectIds] = useState(loadProjectIds);
  const [duplicateSeed, setDuplicateSeed] = useState<ReminderDuplicateSeed | null>(
    null
  );
  const [bannerDismissed, setBannerDismissed] = useState(
    () => localStorage.getItem(NOTIFICATION_DISMISS_KEY) === "1"
  );

  const {
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
    connecting,
    hasLoadedOnce,
    actionLoading,
    firedReminder,
    setFiredReminder,
    celebrate,
    debouncedQuery,
    handleConnect,
    handleCreate,
    handleCancel,
    handleUpdate,
  } = useReminders({ onToast, filter, t });

  const showNotificationBanner =
    !bannerDismissed &&
    typeof Notification !== "undefined" &&
    Notification.permission === "default";

  const isFilteredEmpty =
    reminders.length === 0 &&
    hasActiveReminderFilters({ ...filter, query: debouncedQuery });

  usePageTitle(connected, counts.pending);

  useEffect(() => {
    toast.clear();
  }, [locale, toast.clear]);

  const handleProjectIdChange = useCallback((id: string) => {
    setProjectId(id);
    saveProjectId(id);
    setProjectIds(loadProjectIds());
  }, []);

  const handleDuplicate = useCallback((reminder: Reminder) => {
    setProjectId(reminder.projectId);
    saveProjectId(reminder.projectId);
    setProjectIds(loadProjectIds());
    setDuplicateSeed({
      sourceTitle: reminder.title,
      body: reminder.body ?? "",
      projectId: reminder.projectId,
    });
    document
      .getElementById("create-reminder-sidebar")
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    document.getElementById("reminder-title")?.focus();
    toast.show(t("toast.duplicatePrefill"), "info");
  }, [t, toast.show]);

  const focusCreateForm = useCallback(() => {
    document
      .getElementById("create-reminder-sidebar")
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    document.getElementById("reminder-title")?.focus();
  }, []);

  const clearFilters = useCallback(() => {
    setFilter(DEFAULT_REMINDER_FILTER);
  }, []);

  const handleCancelRequest = useCallback((id: string) => {
    setCancelTargetId(id);
  }, []);

  const handleEditRequest = useCallback((reminder: Reminder) => {
    setEditingReminder(reminder);
  }, []);

  const handleConfirmCancel = async () => {
    if (!cancelTargetId) return;
    const id = cancelTargetId;
    setCancelTargetId(null);
    await handleCancel(id);
  };

  const handleEditSave = async (
    id: string,
    payload: Parameters<typeof handleUpdate>[1]
  ) => {
    const ok = await handleUpdate(id, payload);
    if (ok) setEditingReminder(null);
    return ok;
  };

  const dismissBanner = () => {
    localStorage.setItem(NOTIFICATION_DISMISS_KEY, "1");
    setBannerDismissed(true);
  };

  const isSignedIn = sessionToken.trim().length > 0;

  if (isRestoringSession) {
    return <AuthRestoringScreen />;
  }

  if (!isSignedIn) {
    return (
      <>
        <LoginPage
          token={token}
          connecting={connecting}
          onTokenChange={setToken}
          onConnect={handleConnect}
        />
        {toast.message && (
          <Toast
            message={toast.message}
            tone={toast.tone}
            onClose={toast.clear}
          />
        )}
      </>
    );
  }

  return (
    <Layout hideFooter={!!firedReminder} onLogout={logout}>
      {editingReminder && (
        <EditReminderModal
          reminder={editingReminder}
          onClose={() => setEditingReminder(null)}
          onSave={(payload) => handleEditSave(editingReminder.id, payload)}
        />
      )}

      {cancelTargetId && (
        <ConfirmDialog
          title={t("confirm.cancelReminderTitle")}
          message={t("confirm.cancelReminderMessage")}
          confirmLabel={t("confirm.cancelReminderConfirm")}
          loading={actionLoading}
          onConfirm={handleConfirmCancel}
          onCancel={() => setCancelTargetId(null)}
        />
      )}

      <FiredReminderOverlay
        reminder={firedReminder}
        onClose={() => setFiredReminder(null)}
      />

      {showNotificationBanner && (
        <NotificationBanner
          onRequestPermission={async () => {
            await Notification.requestPermission();
            dismissBanner();
          }}
          onDismiss={dismissBanner}
        />
      )}

      <section id="dashboard" className="dashboard" aria-label="Reminders dashboard">
        <div className="dashboard__main">
          <RemindersPageHeader onNewReminder={focusCreateForm} />
          {connected ? (
            <ReminderFilters filter={filter} counts={counts} onChange={setFilter} />
          ) : null}
          <ReminderList
            reminders={reminders}
            connected={connected}
            connecting={connecting}
            filtered={isFilteredEmpty}
            listLoading={listLoading}
            hasLoadedOnce={hasLoadedOnce}
            actionLoading={actionLoading}
            onCreateReminder={focusCreateForm}
            onClearFilters={clearFilters}
            onCancel={handleCancelRequest}
            onEdit={handleEditRequest}
            onDuplicate={handleDuplicate}
          />
        </div>

        <aside className="dashboard__sidebar" aria-label={t("dashboard.createAria")}>
          <ReminderForm
            celebrate={celebrate}
            loading={actionLoading}
            initialProjectId={projectId}
            projectIds={projectIds}
            duplicateSeed={duplicateSeed}
            onProjectIdChange={handleProjectIdChange}
            onCreate={async (payload) => {
              await handleCreate(payload);
              setFilter((f) => ({
                ...f,
                status: "ALL",
                query: "",
                sort: "created-desc",
              }));
              setDuplicateSeed(null);
            }}
          />
        </aside>
      </section>

      <NextReminderPulse reminders={allReminders} connected={connected} />

      {toast.message && (
        <Toast
          message={toast.message}
          tone={toast.tone}
          onClose={toast.clear}
        />
      )}
    </Layout>
  );
}

export default App;
