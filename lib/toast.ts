/** A tiny stand-in for a toast library: components call notify(), and <Toaster /> shows the message. */
export const TOAST_EVENT = "site:toast";
export type ToastKind = "success" | "error";
export type ToastDetail = { id: number; kind: ToastKind; message: string };

let next = 1;
function notify(kind: ToastKind, message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<ToastDetail>(TOAST_EVENT, { detail: { id: next++, kind, message } }));
}

const toast = {
  success: (message: string) => notify("success", message),
  error: (message: string) => notify("error", message),
};
export default toast;
