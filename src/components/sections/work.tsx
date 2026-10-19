import { BEATS } from "@/components/motion/beats";
import { CaseBeats } from "@/components/motion/case-beats";
import { LineRows } from "@/components/motion/line-rows";
import { Reveal } from "@/components/motion/reveal";
import { RollText } from "@/components/motion/roll-text";
import { ProjectIndex } from "@/components/sections/project-index";
import { ProjectMedia } from "@/components/sections/project-media";
import { ProjectQuote } from "@/components/sections/project-quote";
import type { Project } from "@/content/portfolio";
import { quoteForProject, type TestimonialView } from "@/lib/testimonials";

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

function BeatLabel({ index, className = "" }: { index: number; className?: string }) {
  return (
    <h4 className={`label text-accent ${className}`}>
      {pad(index + 1)} {BEATS[index]}
    </h4>
  );
}

// Featured studies alternate paper and ink so each one arrives as its own chapter.
const STUDY_THEMES = ["paper", "ink"] as const;

function CaseStudy({ project, index, quote }: { project: Project; index: number; quote: TestimonialView | null }) {
  const meta = [
    { term: "Role", value: project.role },
    { term: "Year", value: project.year },
    { term: "Client", value: project.client ?? "Own venture" },
    { term: "Status", value: project.status },
  ];

  return (
    // Project chips in Experience jump up to this id, which brings the header back; scroll-mt keeps it off the label.
    // data-section-label names the slice transition; data-section is left off so the header does not treat it as a page section.
    <article
      id={project.slug}
      data-section-label={project.title}
      data-theme={STUDY_THEMES[index % STUDY_THEMES.length]}
      aria-labelledby={`${project.slug}-title`}
      className="grid scroll-mt-24 gap-8 px-4 py-20 md:px-8 md:py-32 lg:grid-cols-12 lg:gap-10"
    >
      {/* overflow-x-clip on the section, not overflow-hidden: a hidden overflow would turn off this sticky column. */}
      <div className="self-start lg:sticky lg:top-24 lg:col-span-5">
        <p className="label text-muted">
          Ch. 02.{index + 1} / {project.category}
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
        <CaseBeats />
      </div>

      <div className="lg:col-span-7">
        <ProjectMedia project={project} />

        {/* Label and body share one grid so a short paragraph never leaves a column-sized gap beside a long list. */}
        <div data-beat="0" className="mt-12 grid gap-4 md:grid-cols-[8.5rem_1fr] md:gap-8">
          <BeatLabel index={0} className="pt-2" />
          <Reveal as="p" className="statement text-[1.6rem] text-paper/90 md:text-[2rem]">
            {project.problem}
          </Reveal>
        </div>

        <div data-beat="1" className="mt-12 grid gap-4 md:grid-cols-[8.5rem_1fr] md:gap-8">
          <BeatLabel index={1} className="pt-5" />
          <div>
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
            <Reveal as="ul" className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((tool) => (
                <li
                  key={tool}
                  className="label rounded-full border border-line px-3 py-1.5 text-paper/80 transition-colors duration-300 hover:border-accent hover:text-accent"
                >
                  {tool}
                </li>
              ))}
            </Reveal>
          </div>
        </div>

        <div data-beat="2" className="mt-12 grid gap-4 md:grid-cols-[8.5rem_1fr] md:gap-8">
          <BeatLabel index={2} className="pt-2" />
          <div>
            <ul className="space-y-3" aria-label="Outcomes">
              {(project.outcomes.length > 0 ? project.outcomes : [project.status]).map((outcome) => (
                <li key={outcome} className="statement text-[1.6rem] leading-tight md:text-[2rem]">
                  <span className="text-accent" aria-hidden="true">
                    ●{" "}
                  </span>
                  {outcome}
                </li>
              ))}
            </ul>
            {quote && <ProjectQuote quote={quote} className="mt-10 border-t border-line pt-8" />}
          </div>
        </div>
      </div>
    </article>
  );
}

export function Work({ projects, quotes }: { projects: Project[]; quotes: TestimonialView[] }) {
  const featured = projects.filter((project) => project.featured);
  const more = projects.filter((project) => !project.featured);

  return (
    <>
      <section
        id="work"
        data-section="02"
        data-section-label="Selected work"
        data-theme="ink"
        aria-labelledby="work-title"
        className="overflow-x-clip pt-24 md:pt-36"
      >
        <div className="px-4 pb-8 md:px-8 md:pb-12">
          <p className="label mb-6 text-muted">
            Ch. 02 · Selected work · {pad(featured.length)} chapters
          </p>
          <Reveal as="h2" id="work-title" mode="words" className="display text-[22vw] md:text-[15vw]">
            Selected <span className="text-accent">work</span>
          </Reveal>
          <p className="mt-8 max-w-xl text-[1.15rem] leading-relaxed text-paper/80 md:ml-[33%]">
            Each project in three beats: the problem it started with, what I built, and what it proved.
          </p>
        </div>

        {featured.map((project, index) => (
          <CaseStudy key={project.slug} project={project} index={index} quote={quoteForProject(quotes, project.slug)} />
        ))}
      </section>

      {more.length > 0 && (
        <section
          id="archive"
          data-section="03"
          data-section-label="Archive"
          data-theme="paper"
          aria-labelledby="archive-title"
          className="overflow-x-clip px-4 py-24 md:px-8 md:py-36"
        >
          <p className="label mb-6 text-muted">
            Ch. 03 · Archive · {pad(more.length)} files
          </p>
          <Reveal as="h2" id="archive-title" mode="words" className="display mb-12 text-[22vw] md:mb-16 md:text-[13vw]">
            Archive
          </Reveal>
          <ProjectIndex projects={more} offset={featured.length} quotes={quotes} />
        </section>
      )}
    </>
  );
}
