import type { Project } from "@/content/portfolio";

type PosterTone = { background: string; foreground: string; muted: string };

// A typographic stand-in until the owner supplies a cleared screenshot; it never imitates a real UI.
const TONES: Record<string, PosterTone> = {
  cartify: { background: "#d4ff3a", foreground: "#0c0c0b", muted: "rgba(12,12,11,0.6)" },
  "clinic-information-system": { background: "#efede6", foreground: "#0c0c0b", muted: "rgba(12,12,11,0.55)" },
  fluxa: { background: "#d4ff3a", foreground: "#0c0c0b", muted: "rgba(12,12,11,0.6)" },
  artconnect: { background: "#2a2a27", foreground: "#efede6", muted: "rgba(239,237,230,0.55)" },
  "webgis-gunung-puyuh": { background: "#efede6", foreground: "#0c0c0b", muted: "rgba(12,12,11,0.55)" },
  welling: { background: "#efede6", foreground: "#0c0c0b", muted: "rgba(12,12,11,0.55)" },
  "visualkain-finance": { background: "#1d1d1a", foreground: "#efede6", muted: "rgba(239,237,230,0.55)" },
  "inztamoto-erp": { background: "#2a2a27", foreground: "#d4ff3a", muted: "rgba(239,237,230,0.55)" },
};
const FALLBACK: PosterTone = { background: "#161614", foreground: "#efede6", muted: "rgba(239,237,230,0.55)" };

type Props = { project: Project; size?: "sm" | "lg" };

export function ProjectPoster({ project, size = "lg" }: Props) {
  const tone = TONES[project.slug] ?? FALLBACK;
  const small = size === "sm";

  return (
    <div
      className={`flex h-full w-full flex-col justify-between ${small ? "p-5" : "p-6 md:p-10"}`}
      style={{ background: tone.background, color: tone.foreground }}
    >
      <div className="label flex justify-between gap-4" style={{ color: tone.muted }}>
        <span>{project.category}</span>
        <span>{project.client ?? "Own venture"}</span>
      </div>
      <p className={`display ${small ? "text-[3.4rem]" : "text-[16vw] md:text-[7.5vw]"}`}>{project.title}</p>
      <div className="flex items-end justify-between gap-4">
        <p className={`statement italic ${small ? "text-lg" : "text-2xl md:text-3xl"}`}>{project.status}</p>
        <p className="label text-right" style={{ color: tone.muted }}>
          {project.stack.slice(0, 3).join(" · ")}
        </p>
      </div>
    </div>
  );
}
