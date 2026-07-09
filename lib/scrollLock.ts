/**
 * iOS Safari body üzerinde `overflow: hidden`'ı yok sayar.
 * Sayfayı `position: fixed` ile sabitleyip kaydırma konumunu saklıyoruz,
 * kilit açılınca aynı yere geri döndürüyoruz.
 */
let savedScrollY = 0;

export function lockScroll() {
  if (typeof window === "undefined") return;

  savedScrollY = window.scrollY;
  document.body.style.top = `-${savedScrollY}px`;
  document.body.classList.add("gate-locked");
}

export function unlockScroll(restore = true) {
  if (typeof window === "undefined") return;

  document.body.classList.remove("gate-locked");
  document.body.style.top = "";

  if (restore) window.scrollTo(0, savedScrollY);
}
