import { DriftTitle } from "@/components/motion/drift-title";
import { LineRows } from "@/components/motion/line-rows";
import { Reveal } from "@/components/motion/reveal";
import { RollText } from "@/components/motion/roll-text";
import { Scramble } from "@/components/motion/scramble";
import { ProjectIndex } from "@/components/sections/project-index";
import { ProjectMedia } from "@/components/sections/project-media";
import type { Project } from "@/content/portfolio";

const pad = (n: number) => String(n).padStart(2, "0");

function ExternalLinks({ project }: { project: Project }) {
  if (project.links.length === 0) return null;
  return (
    <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
      {project.links.map((link) => (
        <li key={link.href}>
          <a href={link.href} target="_blank" rel="noopener noreferrer" className="label flex items-center gap-1.5 text-accent">
            <RollText text={link.label} /> <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function CaseStudy({ project, index }: { project: Project; index: number }) {
  const meta = [
    { term: "Role", value: project.role },
    { term: "Year", value: project.year },
    { term: "Client", value: project.client ?? "Own venture" },
    { term: "Status", value: project.status },
  ];

  return (
    <article aria-labelledby={`${project.slug}-title`} className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      {/* overflow-x-clip on the section, not overflow-hidden: a hidden overflow would turn off this sticky column. */}
      <div className="self-start lg:sticky lg:top-24 lg:col-span-5">
        <p className="label text-muted">
          <Scramble text={`${pad(index + 1)} / ${project.category}`} />
        </p>
        <Reveal as="h3" id={`${project.slug}-title`} mode="words" className="display mt-4 text-[17vw] md:text-[11vw] lg:text-[6.2vw]">
          {project.title}
        </Reveal>
        <Reveal as="p" delay={0.1} className="statement mt-6 max-w-md text-[1.9rem] text-paper/90">
          {project.summary}
        </Reveal>
        <LineRows as="dl" className="mt-8 grid grid-cols-2 gap-x-6">
          {meta.map((item) => (
            <div key={item.term} data-row className="relative overflow-hidden py-4">
              <span data-line className="absolute inset-x-0 top-0 h-px bg-line" />
              <div data-row-content>
                <dt className="label text-muted">{item.term}</dt>
                <dd className="mt-1 text-sm leading-snug">{item.value}</dd>
              </div>
            </div>
          ))}
        </LineRows>
        <ExternalLinks project={project} />
      </div>

      <div className="lg:col-span-7">
        <ProjectMedia project={project} />

        {/* Label and body share one grid so a short paragraph never leaves a column-sized gap beside a long list. */}
        <div className="mt-12 grid gap-4 md:grid-cols-[8.5rem_1fr] md:gap-8">
          <h4 className="label pt-2 text-accent">The problem</h4>
          <Reveal as="p" className="statement text-[1.6rem] text-paper/90 md:text-[2rem]">
            {project.problem}
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-[8.5rem_1fr] md:gap-8">
          <h4 className="label pt-5 text-accent">What I built</h4>
          <LineRows as="ol">
            {project.contribution.map((item, itemIndex) => (
              <li key={item} data-row className="relative overflow-hidden">
                <span data-line className="absolute inset-x-0 top-0 h-px bg-line" />
                <div data-row-content className="grid grid-cols-[2.5rem_1fr] gap-3 py-4 text-[1.0625rem] leading-relaxed text-paper/80">
                  <span className="label pt-1 text-muted">{pad(itemIndex + 1)}</span>
                  <span>{item}</span>
                </div>
              </li>
            ))}
          </LineRows>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-[8.5rem_1fr] md:gap-8">
          <h4 className="label pt-2 text-accent">Stack</h4>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <Reveal as="ul" className="flex flex-wrap gap-2">
              {project.stack.map((tool) => (
                <li
                  key={tool}
                  className="label rounded-full border border-line px-3 py-1.5 text-paper/80 transition-colors duration-300 hover:border-accent hover:text-accent"
                >
                  {tool}
                </li>
              ))}
            </Reveal>
            {project.outcomes.length > 0 && (
              <ul className="space-y-2 lg:max-w-xs lg:text-right" aria-label="Outcomes">
                {project.outcomes.map((outcome) => (
                  <li key={outcome} className="text-sm leading-snug">
                    <span className="text-accent" aria-hidden="true">
                      ●{" "}
                    </span>
                    {outcome}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export function Work({ projects }: { projects: Project[] }) {
  const featured = projects.filter((project) => project.featured);
  const more = projects.filter((project) => !project.featured);

  return (
    <section id="work" aria-labelledby="work-title" className="overflow-x-clip px-4 py-16 md:px-8 md:py-24">
      <div className="mb-16 md:mb-24">
        <p className="label mb-6 text-muted">
          <Scramble text={`(02) Selected work · ${pad(projects.length)} projects`} />
        </p>
        <DriftTitle id="work-title" lines={["Selected", "Work"]} accentLine={1} className="display text-[22vw] md:text-[15vw]" />
      </div>

      <div className="space-y-32 md:space-y-48">
        {featured.map((project, index) => (
          <CaseStudy key={project.slug} project={project} index={index} />
        ))}
      </div>

      {more.length > 0 && (
        <div className="mt-32 md:mt-48">
          <h3 className="label mb-6 text-muted">More work</h3>
          <ProjectIndex projects={more} offset={featured.length} />
        </div>
      )}
    </section>
  );
}
