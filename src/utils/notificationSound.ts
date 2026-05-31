import { NOTIFICATION_SOUND } from "../environment";

let audio: HTMLAudioElement | null = null;

function getNotificationAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio(NOTIFICATION_SOUND);
    audio.preload = "auto";
  }
  return audio;
}

export function playNotificationSound(): void {
  const clip = getNotificationAudio();
  clip.currentTime = 0;
  void clip.play().catch(() => {
    console.log("Audio play was blocked by browser");
  });
}
