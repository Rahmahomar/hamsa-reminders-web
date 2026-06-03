export type LoginShowcaseSlide = {
  id: 1 | 2 | 3 | 4;
  imageSrc: string;
};

export const LOGIN_SHOWCASE_SLIDES: LoginShowcaseSlide[] = [
  {
    id: 1,
    imageSrc: "/login-slides/dashboard-screenshot-en-light-B9DQrRvx.webp",
  },
  {
    id: 2,
    imageSrc: "/login-slides/voices-screenshot-en-light-DbXhlu81.webp",
  },
  {
    id: 3,
    imageSrc: "/login-slides/prompt-editor-screenshot-en-light-Dt7UNbzJ.webp",
  },
  {
    id: 4,
    imageSrc: "/login-slides/flow-builder-screenshot-en-light-BViuedU7.webp",
  },
];

export const LOGIN_SHOWCASE_AUTOPLAY_MS = 7000;
export const LOGIN_SHOWCASE_SWIPE_THRESHOLD = 48;

export function loginShowcaseSlideKey(
  id: LoginShowcaseSlide["id"],
  field: "title" | "description"
): string {
  return `loginShowcase.slide${id}.${field}`;
}
