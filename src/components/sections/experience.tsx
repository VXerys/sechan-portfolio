import type { ReactNode } from "react";

import { LineRows } from "@/components/motion/line-rows";
import { Reveal } from "@/components/motion/reveal";
import { ProjectChip } from "@/components/site/project-chip";
import type { Education, Experience as Entry, Program, Project } from "@/content/portfolio";

const pad = (n: number) => String(n).padStart(2, "0");

type RowProps = { period: string; title: string; label?: string; role: string; children: ReactNode };

// Work entries and the education row share one anatomy, so LineRows draws them in as a single list.
function Row({ period, title, label, role, children }: RowProps) {
  return (
    <li data-row className="group relative overflow-hidden">
      <span data-line className="absolute inset-x-0 top-0 z-10 h-px bg-line" />
      {/* Hover fills the row from the bottom; the rest of the motion stays on scroll. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-bottom scale-y-0 bg-ink-2 transition-[scale] duration-700 ease-[var(--ease-expo)] group-hover:scale-y-100"
      />
      <div data-row-content className="relative py-10 md:px-4 md:py-14">
        <div className="grid gap-2 md:grid-cols-12 md:items-baseline md:gap-8">
          <p className="label text-muted transition-colors duration-500 group-hover:text-paper md:col-span-3">{period}</p>
          <div className="md:col-span-5">
            <h3 className="display text-[13vw] transition-[color,translate] duration-700 ease-[var(--ease-expo)] group-hover:translate-x-2 group-hover:text-accent md:text-[5vw]">
              {title}
            </h3>
            {label && <p className="label mt-3 text-muted">{label}</p>}
          </div>
          <p className="statement text-2xl italic text-paper/80 md:col-span-4 md:text-right md:text-3xl">{role}</p>
        </div>
        <ol className="mt-8 grid gap-x-10 gap-y-4 text-[1.0625rem] leading-relaxed text-paper/75 md:ml-[25%] md:grid-cols-2">{children}</ol>
      </div>
    </li>
  );
}

function Point({ index, className = "", children }: { index: number; className?: string; children: ReactNode }) {
  return (
    <li className={`grid grid-cols-[2.25rem_1fr] gap-2 ${className}`}>
      <span className="label pt-1 text-accent">{pad(index + 1)}</span>
      <div>{children}</div>
    </li>
  );
}

type Props = { entries: Entry[]; program: Program; education: Education; projects: Project[] };

export function Experience({ entries, program, education, projects }: Props) {
  // portfolio.test.ts checks every slug against projects, so a miss is dropped here rather than rendered as a dead link.
  const chips = education.projects.flatMap(({ slug, context }) => {
    const project = projects.find((item) => item.slug === slug);
    return project ? [{ slug, title: project.title, context }] : [];
  });

  return (
    <section
      id="experience"
      data-section="04"
      data-section-label="Path"
      data-theme="ink"
      aria-labelledby="experience-title"
      className="overflow-x-clip px-4 py-24 md:px-8 md:py-36"
    >
      <div className="mb-16 md:mb-24">
        <p className="label mb-6 text-muted">Ch. 04 · Path</p>
        <Reveal as="h2" id="experience-title" mode="words" className="display text-[22vw] md:text-[13vw]">
          Where <span className="text-accent">I build</span>
        </Reveal>
      </div>

      {/* Same 12-column grid and md:px-4 inset as a row, so the card reads as a row that stays filled. */}
      <Reveal mode="clip" className="mb-12 md:mb-16">
        <article aria-labelledby="program-title" className="bg-ink-2 px-4 py-10 md:py-14">
          <div className="grid gap-2 md:grid-cols-12 md:items-baseline md:gap-8">
            <p className="label text-accent md:col-span-3">Highlight</p>
            <div className="md:col-span-5">
              <h3 id="program-title" className="display text-[13vw] md:text-[5vw]">
                {program.name}
              </h3>
              <p className="statement mt-4 text-2xl text-paper/80 md:text-3xl">
                {program.path} <span aria-hidden="true">·</span> <span className="italic">{program.role}</span>
              </p>
            </div>
            <div className="label mt-4 flex flex-wrap gap-x-4 gap-y-2 text-muted md:col-span-4 md:mt-0 md:flex-col md:items-end">
              <p>{program.period}</p>
              <p className="flex items-center gap-2 text-paper">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                {program.status}
              </p>
            </div>
          </div>
        </article>
      </Reveal>

      <LineRows as="ol">
        {entries.map((entry) => (
          <Row key={entry.company} period={entry.period} title={entry.company} label={entry.legalName} role={entry.role}>
            {entry.points.map((point, index) => (
              <Point key={point} index={index}>
                {point}
              </Point>
            ))}
          </Row>
        ))}
        <Row period={education.period} title={education.institution} label={education.label} role={education.degree}>
          <Point index={0}>{`GPA ${education.gpa}`}</Point>
          {/* Spans both columns so each chip keeps its context on one line from md up. */}
          <Point index={1} className="md:col-span-2">
            <p id="education-projects">{education.projectsLabel}</p>
            <ul aria-labelledby="education-projects" className="mt-4 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <li key={chip.slug}>
                  <ProjectChip slug={chip.slug} title={chip.title} context={chip.context} />
                </li>
              ))}
            </ul>
          </Point>
        </Row>
      </LineRows>
      <span aria-hidden="true" className="block h-px bg-line" />
    </section>
  );
}
