/**
 * One shared player for the real Orpheus TTS sample, plus a small analyser so visuals can follow the actual
 * audio. Created only after a click (browsers require a gesture), and only ever one copy plays at a time.
 */
const SRC = "/audio/orpheus-demo.wav";

type Levels = { level: number; bass: number; high: number };

let el: HTMLAudioElement | null = null;
let ctx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let td: Uint8Array<ArrayBuffer>;
let fd: Uint8Array<ArrayBuffer>;
let playing = false;
const listeners = new Set<() => void>();
const smooth: Levels = { level: 0, bass: 0, high: 0 };

function set(next: boolean) {
  if (playing === next) return;
  playing = next;
  listeners.forEach((l) => l());
}

function ensure() {
  if (el) return;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  el = new Audio(SRC);
  el.preload = "auto";
  ctx = new AC();
  analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = 0.55;
  ctx.createMediaElementSource(el).connect(analyser);
  analyser.connect(ctx.destination);
  td = new Uint8Array(analyser.fftSize);
  fd = new Uint8Array(analyser.frequencyBinCount);
  el.addEventListener("ended", () => set(false));
  el.addEventListener("pause", () => set(false));
}

export function isPlaying() {
  return playing;
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export async function toggle() {
  ensure();
  if (!el || !ctx) return;
  if (playing) {
    el.pause();
    el.currentTime = 0;
    return;
  }
  try {
    await ctx.resume();
    await el.play();
    set(true);
  } catch {
    set(false); // blocked or unsupported: stay quiet
  }
}

/** Smoothed loudness (0–1), bass and treble energy of what is playing right now. Zeros when silent. */
export function levels(): Levels {
  let level = 0;
  let bass = 0;
  let high = 0;
  if (playing && analyser) {
    analyser.getByteTimeDomainData(td);
    let sum = 0;
    for (let i = 0; i < td.length; i++) {
      const v = (td[i] - 128) / 128;
      sum += v * v;
    }
    level = Math.min(1, Math.sqrt(sum / td.length) * 3.2);
    analyser.getByteFrequencyData(fd);
    for (let i = 1; i < 8; i++) bass += fd[i];
    for (let i = 40; i < 120; i++) high += fd[i];
    bass = Math.min(1, bass / 7 / 190);
    high = Math.min(1, high / 80 / 120);
  }
  const k = (to: number, from: number) => from + (to - from) * (to > from ? 0.45 : 0.1); // quick attack, slow release
  smooth.level = k(level, smooth.level);
  smooth.bass = k(bass, smooth.bass);
  smooth.high = k(high, smooth.high);
  return smooth;
}
