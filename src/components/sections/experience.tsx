import { Reveal } from "@/components/motion/reveal";
import type { Experience as Entry } from "@/content/portfolio";

export function Experience({ entries }: { entries: Entry[] }) {
  return (
    <section id="experience" aria-labelledby="experience-title" className="px-4 py-28 md:px-8 md:py-40">
      <div className="mb-16 grid gap-6 md:mb-20 md:grid-cols-12">
        <p className="label text-muted md:col-span-3">(03) Experience</p>
        <Reveal as="h2" id="experience-title" mode="words" className="display text-[17vw] md:col-span-9 md:text-[9vw]">
          Where I build
        </Reveal>
      </div>

      <ol>
        {entries.map((entry) => (
          <li key={entry.company} className="border-t border-line">
            <Reveal className="grid gap-6 py-10 md:grid-cols-12 md:gap-8 md:py-14">
              <p className="label text-muted md:col-span-3">{entry.period}</p>
              <div className="md:col-span-4">
                <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">{entry.company}</h3>
                <p className="mt-2 font-serif text-xl italic text-paper/80">{entry.role}</p>
              </div>
              <ul className="space-y-3 text-[0.95rem] leading-relaxed text-paper/75 md:col-span-5">
                {entry.points.map((point) => (
                  <li key={point} className="grid grid-cols-[1rem_1fr] gap-2">
                    <span aria-hidden="true" className="text-accent">
                      –
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
