export type LoginShowcaseSlide = {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
};

export const LOGIN_SHOWCASE_SLIDES: LoginShowcaseSlide[] = [
  {
    id: 1,
    title: "Your Reminders Dashboard",
    description:
      "See pending, fired, and cancelled reminders in one schedule. Filter by status, search by title, and sort by newest or soonest — everything your team needs at a glance.",
    imageSrc: "/login-slides/dashboard-screenshot-en-light-B9DQrRvx.webp",
  },
  {
    id: 2,
    title: "Tied to Your Projects",
    description:
      "Link each reminder to a project ID so work stays organized. Create new items, duplicate existing ones, and keep context clear across your team.",
    imageSrc: "/login-slides/voices-screenshot-en-light-DbXhlu81.webp",
  },
  {
    id: 3,
    title: "Schedule the Perfect Moment",
    description:
      "Set when a reminder should fire with quick presets or the date-time picker. Update pending reminders anytime before they run.",
    imageSrc: "/login-slides/prompt-editor-screenshot-en-light-Dt7UNbzJ.webp",
  },
  {
    id: 4,
    title: "Alerts When They Fire",
    description:
      "Background workers deliver reminders on time while the app keeps you synced — live updates, sound, and browser notifications the moment one fires.",
    imageSrc: "/login-slides/flow-builder-screenshot-en-light-BViuedU7.webp",
  },
];

export const LOGIN_SHOWCASE_AUTOPLAY_MS = 7000;
export const LOGIN_SHOWCASE_SWIPE_THRESHOLD = 48;
