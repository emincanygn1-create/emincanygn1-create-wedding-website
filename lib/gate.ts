export const GATE_SESSION_KEY = "wedding_invitation_opened";
export const GATE_EVENT = "wedding:open";

/** Davetiye kapısı bu oturumda açıldı mı? */
export function isGateOpen() {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(GATE_SESSION_KEY) === "1";
  } catch {
    return true; // depolama kapalıysa animasyonları bekletme
  }
}

/** Kapı açıldığında haber verir. Temizleme fonksiyonu döner. */
export function onGateOpen(callback: () => void) {
  window.addEventListener(GATE_EVENT, callback);
  return () => window.removeEventListener(GATE_EVENT, callback);
}
