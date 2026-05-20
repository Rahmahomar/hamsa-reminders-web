import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import { Layout } from "./components/Layout";
import { TokenCard } from "./components/TokenCard";
import { ReminderForm } from "./components/ReminderForm";
import { ReminderList } from "./components/ReminderList";
import { FiredReminderOverlay } from "./components/FiredReminderOverlay";
import { EditReminderModal } from "./components/EditReminderModal";
import { NextReminderPulse } from "./components/NextReminderPulse";
import { Toast } from "./components/Toast";

import "./styles/modal.css";

import {
  cancelReminder,
  createReminder,
  getReminders,
  updateReminder,
} from "./api/reminders.api";

import type { CreateReminderPayload, Reminder } from "./types/reminder";
import { NOTIFICATION_SOUND, SOCKET_URL } from "./environment";

function App() {
  const [token, setToken] = useState("");
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [message, setMessage] = useState("");
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [firedReminder, setFiredReminder] = useState<Reminder | null>(null);
  const [connected, setConnected] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const knownFiredIdsRef = useRef<Set<string>>(new Set());
  const previousStatusesRef = useRef<Map<string, string>>(new Map());

  const notifyReminderFired = (reminder: Reminder) => {
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
    setMessage(`Reminder fired: ${reminder.title}`);
  };

  const loadReminders = async () => {
    if (!token) return;

    try {
      const data = await getReminders(token);
      setConnected(true);

      data.forEach((reminder) => {
        const previousStatus = previousStatusesRef.current.get(reminder.id);

        if (
          reminder.status === "FIRED" &&
          previousStatus === "PENDING"
        ) {
          notifyReminderFired(reminder);
        }

        previousStatusesRef.current.set(reminder.id, reminder.status);
      });

      setReminders(data);
    } catch {
      setConnected(false);
      setMessage("Failed to fetch reminders");
    }
  };

  const handleConnect = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }

    await loadReminders();
  };

  const handleCreate = async (payload: CreateReminderPayload) => {
    if (!token) {
      setMessage("Please add JWT token first");
      return;
    }

    try {
      await createReminder(token, payload);
      setMessage("Reminder created successfully");
      setCelebrate(true);
      window.setTimeout(() => setCelebrate(false), 700);
      await loadReminders();
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Create failed");
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelReminder(token, id);
      setMessage("Reminder cancelled");
      await loadReminders();
    } catch {
      setMessage("Cancel failed");
    }
  };

  const handleUpdate = async (
    id: string,
    payload: {
      title?: string;
      body?: string;
      fireAt?: string;
    }
  ) => {
    try {
      await updateReminder(token, id, payload);
      setMessage("Reminder updated successfully");
      setEditingReminder(null);
      await loadReminders();
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Update failed");
    }
  };

  useEffect(() => {
    if (!token) return;

    loadReminders();

    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });

    socket.on("reminder:fired", (event) => {
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

      notifyReminderFired(fired);
      loadReminders();
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    const fallbackInterval = setInterval(() => {
      loadReminders();
    }, 30000);

    return () => {
      socket.disconnect();
      clearInterval(fallbackInterval);
    };
  }, [token]);

  return (
    <Layout>
      {editingReminder && (
        <EditReminderModal
          reminder={editingReminder}
          onClose={() => setEditingReminder(null)}
          onSave={(payload) => handleUpdate(editingReminder.id, payload)}
        />
      )}

      <FiredReminderOverlay
        reminder={firedReminder}
        onClose={() => setFiredReminder(null)}
      />

      <section className="hero">
        <div className="reveal">
          <p className="hero-eyebrow">WE BUILD</p>
          <h1 className="hero-title">
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
          onTokenChange={(value) => {
            setToken(value);
            if (!value.trim()) setConnected(false);
          }}
          onConnect={handleConnect}
        />
      </section>

      <NextReminderPulse reminders={reminders} connected={connected} />

      <main className="dashboard">
        <div className="dashboard__col">
          <ReminderForm celebrate={celebrate} onCreate={handleCreate} />
        </div>

        <div className="dashboard__col">
          <ReminderList
            reminders={reminders}
            onCancel={handleCancel}
            onEdit={setEditingReminder}
          />
        </div>
      </main>

      {message && (
        <Toast
          message={message}
          tone="success"
          onClose={() => setMessage("")}
        />
      )}
    </Layout>
  );
}

export default App;