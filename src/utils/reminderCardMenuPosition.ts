const MENU_GAP = 8;
const VIEWPORT_PAD = 8;
const MENU_MIN_WIDTH = 168;

export type ReminderCardMenuPosition = {
  top: number;
  left: number;
  minWidth: number;
};

export function computeReminderCardMenuPosition(
  anchor: HTMLElement,
  menu: HTMLElement
): ReminderCardMenuPosition {
  const rect = anchor.getBoundingClientRect();
  const menuWidth = Math.max(menu.offsetWidth, MENU_MIN_WIDTH);
  const menuHeight = menu.offsetHeight;

  let top = rect.bottom + MENU_GAP;
  if (top + menuHeight > window.innerHeight - VIEWPORT_PAD) {
    top = rect.top - MENU_GAP - menuHeight;
  }
  top = Math.max(VIEWPORT_PAD, top);

  let left = rect.right - menuWidth;
  left = Math.max(
    VIEWPORT_PAD,
    Math.min(left, window.innerWidth - menuWidth - VIEWPORT_PAD)
  );

  return { top, left, minWidth: MENU_MIN_WIDTH };
}
