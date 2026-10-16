import { Reveal } from "@/components/motion/reveal";
import { Scramble } from "@/components/motion/scramble";
import { ProjectIndex } from "@/components/sections/project-index";
import { ProjectMedia } from "@/components/sections/project-media";
import type { Project } from "@/content/portfolio";
import { projectMedia } from "@/content/media";

const pad = (n: number) => String(n).padStart(2, "0");

function ExternalLinks({ project }: { project: Project }) {
  if (project.links.length === 0) return null;
  return (
    <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
      {project.links.map((link) => (
        <li key={link.href}>
          <a href={link.href} target="_blank" rel="noopener noreferrer" className="label link-underline text-accent">
            {link.label} <span aria-hidden="true">↗</span>
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
    <article aria-labelledby={`${project.slug}-title`} className="grid gap-8 border-t border-line pt-8 md:grid-cols-12 md:gap-10 md:pt-10">
      <div className="self-start md:sticky md:top-24 md:col-span-5">
        <p className="label text-muted">
          <Scramble text={`${pad(index + 1)} / ${project.category}`} />
        </p>
        <Reveal as="h3" id={`${project.slug}-title`} mode="words" className="display mt-4 text-[17vw] md:text-[6.2vw]">
          {project.title}
        </Reveal>
        <p className="statement mt-6 max-w-md text-[1.9rem] text-paper/90">{project.summary}</p>
        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6">
          {meta.map((item) => (
            <div key={item.term}>
              <dt className="label text-muted">{item.term}</dt>
              <dd className="mt-1 text-sm leading-snug">{item.value}</dd>
            </div>
          ))}
        </dl>
        <ExternalLinks project={project} />
      </div>

      <div className="md:col-span-7">
        <ProjectMedia
          media={projectMedia[project.slug]}
          title={project.title}
          category={project.category}
          year={project.year}
          href={project.links[0]?.href}
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <Reveal>
            <h4 className="label text-accent">The problem</h4>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-paper/80">{project.problem}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h4 className="label text-accent">What I built</h4>
            <ul className="mt-4 space-y-3 text-[1.0625rem] leading-relaxed text-paper/80">
              {project.contribution.map((item) => (
                <li key={item} className="grid grid-cols-[1rem_1fr] gap-2">
                  <span aria-hidden="true" className="text-muted">
                    –
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-line pt-6 lg:flex-row lg:justify-between">
          <ul className="flex flex-wrap gap-2" aria-label="Stack">
            {project.stack.map((tool) => (
              <li key={tool} className="label rounded-full border border-line px-3 py-1.5 text-paper/80">
                {tool}
              </li>
            ))}
          </ul>
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
    </article>
  );
}

export function Work({ projects }: { projects: Project[] }) {
  const featured = projects.filter((project) => project.featured);
  const more = projects.filter((project) => !project.featured);

  return (
    <section id="work" aria-labelledby="work-title" className="px-4 py-28 md:px-8 md:py-40">
      <div className="mb-16 flex items-end justify-between gap-6 md:mb-24">
        <Reveal as="h2" id="work-title" mode="words" className="display text-[20vw] md:text-[12vw]">
          Selected work
        </Reveal>
        <p className="label hidden text-muted md:block">
          <Scramble text={`(02) ${pad(projects.length)} projects`} />
        </p>
      </div>

      <div className="space-y-28 md:space-y-40">
        {featured.map((project, index) => (
          <CaseStudy key={project.slug} project={project} index={index} />
        ))}
      </div>

      {more.length > 0 && (
        <div className="mt-28 md:mt-40">
          <h3 className="label mb-6 text-muted">More work</h3>
          <ProjectIndex projects={more} offset={featured.length} />
        </div>
      )}
    </section>
  );
}
