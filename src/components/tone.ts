export type Tone = "accent" | "ok" | "warn" | "bad" | "violet";

export const toneIcon: Record<Tone, string> = {
  accent: "bg-accent text-primary",
  ok: "bg-ok-soft text-ok",
  warn: "bg-warn-soft text-warn",
  bad: "bg-bad-soft text-bad",
  violet: "bg-violet-soft text-violet",
};

export const toneFill: Record<Tone, string> = {
  accent: "bg-primary",
  ok: "bg-ok",
  warn: "bg-warn",
  bad: "bg-bad",
  violet: "bg-violet",
};
