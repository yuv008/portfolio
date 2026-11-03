/** Ask the page-wide Wisp guide to fly to an element and introduce itself. */
export const WISP_MEET_EVENT = "wisp:meet";

export type WispMeetDetail = { left: number; top: number; width: number; height: number };

export function meetWisp(el?: Element | null) {
  if (typeof window === "undefined") return;
  const r = el?.getBoundingClientRect();
  const detail: WispMeetDetail = r
    ? { left: r.left, top: r.top, width: r.width, height: r.height }
    : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
  window.dispatchEvent(new CustomEvent<WispMeetDetail>(WISP_MEET_EVENT, { detail }));
}

/** Ask the guide to explain one project (by its id in projectData). */
export const WISP_EXPLAIN_EVENT = "wisp:explain";

export function explainProject(id: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<{ id: string }>(WISP_EXPLAIN_EVENT, { detail: { id } }));
}
