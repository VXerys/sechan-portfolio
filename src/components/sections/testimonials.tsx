import { DriftTitle } from "@/components/motion/drift-title";
import { LineRows } from "@/components/motion/line-rows";
import { Scramble } from "@/components/motion/scramble";
import type { Project } from "@/content/portfolio";
import type { TestimonialView } from "@/lib/testimonials";

const pad = (n: number) => String(n).padStart(2, "0");

type Props = { testimonials: TestimonialView[]; projects: Project[]; number: string };

// Renders nothing until someone has approved a quote (A-003); an empty section would read as missing proof.
export function Testimonials({ testimonials, projects, number }: Props) {
  if (testimonials.length === 0) return null;
  const titleFor = (slug: string | null) => projects.find((project) => project.slug === slug)?.title ?? null;
  const count = `${pad(testimonials.length)} ${testimonials.length === 1 ? "quote" : "quotes"}`;

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="overflow-x-clip px-4 py-16 md:px-8 md:py-24">
      <div className="mb-16 md:mb-24">
        <p className="label mb-6 text-muted">
          <Scramble text={`(${number}) Kind words · ${count}`} />
        </p>
        <DriftTitle id="testimonials-title" lines={["In their", "words"]} accentLine={1} className="display text-[22vw] md:text-[13vw]" />
      </div>

      <LineRows as="ul">
        {testimonials.map((item, index) => {
          const project = titleFor(item.projectSlug);
          return (
            <li key={item.key} data-row className="relative overflow-hidden">
              <span data-line className="absolute inset-x-0 top-0 h-px bg-line" />
              <figure data-row-content className="grid gap-6 py-10 md:grid-cols-12 md:gap-8 md:py-16">
                <p className="label text-muted md:col-span-3 md:pt-3">
                  {pad(index + 1)}
                  {project && <> / {project}</>}
                </p>
                <div className="md:col-span-9">
                  {/* One fluid size instead of breakpoint steps, which jumped from 2.6rem at 768 px down to 2.6vw at 1024 px. */}
                  <blockquote lang={item.lang} className="statement text-[length:clamp(1.9rem,1rem_+_1.8vw,2.8rem)]">
                    <span aria-hidden="true" className="text-accent">
                      “
                    </span>
                    {item.text}
                    <span aria-hidden="true" className="text-accent">
                      ”
                    </span>
                  </blockquote>
                  {item.original && (
                    <div className="mt-8 max-w-2xl border-l border-line pl-4 md:pl-6">
                      <p className="label text-muted">Translated from {item.original.languageName}. Original:</p>
                      <p lang={item.original.lang} className="mt-2 leading-relaxed text-paper/60">
                        {item.original.text}
                      </p>
                    </div>
                  )}
                  <figcaption className="mt-10 flex flex-col gap-1 border-t border-line pt-5 md:flex-row md:items-baseline md:justify-between md:gap-8">
                    <span className="font-semibold">{item.person}</span>
                    {item.detail && <span className="text-sm text-paper/70 md:text-right">{item.detail}</span>}
                  </figcaption>
                </div>
              </figure>
            </li>
          );
        })}
      </LineRows>
      <span aria-hidden="true" className="block h-px bg-line" />
    </section>
  );
}
