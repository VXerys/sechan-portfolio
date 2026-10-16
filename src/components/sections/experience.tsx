import { DriftTitle } from "@/components/motion/drift-title";
import { LineRows } from "@/components/motion/line-rows";
import { Scramble } from "@/components/motion/scramble";
import type { Experience as Entry } from "@/content/portfolio";

const pad = (n: number) => String(n).padStart(2, "0");

export function Experience({ entries }: { entries: Entry[] }) {
  return (
    <section id="experience" aria-labelledby="experience-title" className="overflow-x-clip px-4 py-16 md:px-8 md:py-24">
      <div className="mb-16 md:mb-24">
        <p className="label mb-6 text-muted">
          <Scramble text="(03) Experience" />
        </p>
        <DriftTitle id="experience-title" lines={["Where", "I build"]} accentLine={1} className="display text-[22vw] md:text-[13vw]" />
      </div>

      <LineRows as="ol">
        {entries.map((entry) => (
          <li key={entry.company} data-row className="group relative overflow-hidden">
            <span data-line className="absolute inset-x-0 top-0 z-10 h-px bg-line" />
            {/* Hover fills the row from the bottom; the rest of the motion stays on scroll. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 origin-bottom scale-y-0 bg-ink-2 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-y-100"
            />
            <div data-row-content className="relative py-10 md:px-4 md:py-14">
              <div className="grid gap-2 md:grid-cols-12 md:items-baseline md:gap-8">
                <p className="label text-muted transition-colors duration-500 group-hover:text-paper md:col-span-3">{entry.period}</p>
                <h3 className="display text-[13vw] transition-[color,translate] duration-700 ease-[var(--ease-expo)] group-hover:translate-x-2 group-hover:text-accent md:col-span-5 md:text-[5vw]">
                  {entry.company}
                </h3>
                <p className="statement text-2xl italic text-paper/80 md:col-span-4 md:text-right md:text-3xl">{entry.role}</p>
              </div>
              <ol className="mt-8 grid gap-x-10 gap-y-4 text-[1.0625rem] leading-relaxed text-paper/75 md:ml-[25%] md:grid-cols-2">
                {entry.points.map((point, index) => (
                  <li key={point} className="grid grid-cols-[2.25rem_1fr] gap-2">
                    <span className="label pt-1 text-accent">{pad(index + 1)}</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ol>
            </div>
          </li>
        ))}
      </LineRows>
      <span aria-hidden="true" className="block h-px bg-line" />
    </section>
  );
}
