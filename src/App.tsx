import { useCallback, useMemo, useState } from "react";

import { Layout } from "./components/Layout";
import { TokenCard } from "./components/TokenCard";
import { ReminderForm } from "./components/ReminderForm";
import { ReminderList } from "./components/ReminderList";
import { ReminderFilters } from "./components/ReminderFilters";
import { FiredReminderOverlay } from "./components/FiredReminderOverlay";
import { EditReminderModal } from "./components/EditReminderModal";
import { NextReminderPulse } from "./components/NextReminderPulse";
import { Toast } from "./components/Toast";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { NotificationBanner } from "./components/NotificationBanner";

import "./styles/modal.css";
import "./styles/features.css";

import { useReminders } from "./hooks/useReminders";
import { usePageTitle } from "./hooks/usePageTitle";
import { useToast } from "./hooks/useToast";
import type { Reminder } from "./types/reminder";
import type { ReminderDuplicateSeed } from "./types/reminder-form";
import {
  DEFAULT_REMINDER_FILTER,
  filterAndSortReminders,
} from "./utils/filterReminders";
import {
  loadProjectId,
  loadProjectIds,
  saveProjectId,
} from "./utils/storage";

const NOTIFICATION_DISMISS_KEY = "hamsa_notification_banner_dismissed";

function App() {
  const toast = useToast();
  const onToast = useCallback(
    (message: string, tone: "success" | "danger" | "info") => {
      toast.show(message, tone);
    },
    [toast.show]
  );

  const {
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
    handleConnect,
    handleCreate,
    handleCancel,
    handleUpdate,
  } = useReminders({ onToast });

  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [filter, setFilter] = useState(DEFAULT_REMINDER_FILTER);
  const [projectId, setProjectId] = useState(loadProjectId);
  const [projectIds, setProjectIds] = useState(loadProjectIds);
  const [duplicateSeed, setDuplicateSeed] = useState<ReminderDuplicateSeed | null>(
    null
  );
  const [bannerDismissed, setBannerDismissed] = useState(
    () => localStorage.getItem(NOTIFICATION_DISMISS_KEY) === "1"
  );

  const showNotificationBanner =
    !bannerDismissed &&
    typeof Notification !== "undefined" &&
    Notification.permission === "default";

  const filteredReminders = useMemo(
    () => filterAndSortReminders(reminders, filter, newlyCreatedId),
    [reminders, filter, newlyCreatedId]
  );

  const counts = useMemo(
    () => ({
      all: reminders.length,
      pending: reminders.filter((r) => r.status === "PENDING").length,
      fired: reminders.filter((r) => r.status === "FIRED").length,
      cancelled: reminders.filter((r) => r.status === "CANCELLED").length,
    }),
    [reminders]
  );

  usePageTitle(connected, counts.pending);

  const handleProjectIdChange = useCallback((id: string) => {
    setProjectId(id);
    saveProjectId(id);
    setProjectIds(loadProjectIds());
  }, []);

  const handleDuplicate = (reminder: Reminder) => {
    setProjectId(reminder.projectId);
    saveProjectId(reminder.projectId);
    setProjectIds(loadProjectIds());
    setDuplicateSeed({
      title: `${reminder.title} (copy)`,
      body: reminder.body ?? "",
      projectId: reminder.projectId,
    });
    document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" });
    toast.show("Form prefilled — pick a new Fire At time", "info");
  };

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

  return (
    <Layout>
      {editingReminder && (
        <EditReminderModal
          reminder={editingReminder}
          onClose={() => setEditingReminder(null)}
          onSave={(payload) => handleEditSave(editingReminder.id, payload)}
        />
      )}

      {cancelTargetId && (
        <ConfirmDialog
          title="Cancel reminder?"
          message="This reminder will be marked as cancelled and will not fire."
          confirmLabel="Cancel reminder"
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

      <section className="hero" aria-labelledby="hero-title">
        <div className="reveal">
          <p className="hero-eyebrow">WE BUILD</p>
          <h1 id="hero-title" className="hero-title">
            Smart Reminders
            <br />
            For Project Teams
          </h1>
          <p className="hero-subtitle">
            Schedule reminders tied to your projects and let background workers
            fire them at the perfect time.
          </p>
        </div>

        <TokenCard
          token={token}
          connected={connected}
          connecting={connecting}
          onTokenChange={setToken}
          onConnect={handleConnect}
          onLogout={logout}
        />
      </section>

      <NextReminderPulse reminders={reminders} connected={connected} />

      <section id="dashboard" className="dashboard" aria-label="Reminders dashboard">
        <ReminderForm
          celebrate={celebrate}
          loading={actionLoading}
          initialProjectId={projectId}
          projectIds={projectIds}
          duplicateSeed={duplicateSeed}
          onProjectIdChange={handleProjectIdChange}
          onCreate={async (payload) => {
            await handleCreate(payload);
            setFilter((f) => ({ ...f, status: "ALL", sort: "created-desc" }));
            setDuplicateSeed(null);
          }}
        />
        <div className="dashboard__schedule">
          {connected ? (
            <ReminderFilters filter={filter} counts={counts} onChange={setFilter} />
          ) : null}
          <ReminderList
            reminders={filteredReminders}
            connected={connected}
            totalCount={reminders.length}
            listLoading={listLoading}
            hasLoadedOnce={hasLoadedOnce}
            actionLoading={actionLoading}
            onCancel={(id) => setCancelTargetId(id)}
            onEdit={setEditingReminder}
            onDuplicate={handleDuplicate}
          />
        </div>
      </section>

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
