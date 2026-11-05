/** Lets full-screen overlays (the project panel) tell background effects to pause while they cover the page. */
export const OVERLAY_EVENT = "site:overlay";

export function setOverlay(on: boolean) {
  if (typeof document === "undefined") return;
  if (on) document.documentElement.dataset.overlay = "on";
  else delete document.documentElement.dataset.overlay;
  window.dispatchEvent(new Event(OVERLAY_EVENT));
}

export const overlayOpen = () => typeof document !== "undefined" && document.documentElement.dataset.overlay === "on";
