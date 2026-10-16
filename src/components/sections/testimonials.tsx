import { Reveal } from "@/components/motion/reveal";
import type { Project, Testimonial } from "@/content/portfolio";

type Props = { testimonials: Testimonial[]; projects: Project[] };

// Renders nothing until a client has approved a quote (A-003); an empty section would read as missing proof.
export function Testimonials({ testimonials, projects }: Props) {
  if (testimonials.length === 0) return null;
  const titleFor = (slug: string) => projects.find((project) => project.slug === slug)?.title ?? slug;

  return (
    <section aria-labelledby="testimonials-title" className="px-4 py-28 md:px-8 md:py-40">
      <div className="mb-16 grid gap-6 md:mb-20 md:grid-cols-12">
        <p className="label text-muted md:col-span-3">(06) Kind words</p>
        <Reveal as="h2" id="testimonials-title" mode="words" className="display text-[17vw] md:col-span-9 md:text-[9vw]">
          From clients
        </Reveal>
      </div>

      <ul className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
        {testimonials.map((item) => (
          <li key={`${item.name}-${item.projectSlug}`} className="bg-ink">
            <Reveal as="figure" className="flex h-full flex-col justify-between gap-10 p-6 md:p-10">
              <blockquote className="statement text-[1.9rem] md:text-[2.4rem]">
                <span aria-hidden="true" className="text-accent">
                  “
                </span>
                {item.quote}
                <span aria-hidden="true" className="text-accent">
                  ”
                </span>
              </blockquote>
              <figcaption className="flex items-end justify-between gap-6 border-t border-line pt-5">
                <span>
                  <span className="block font-semibold">{item.name}</span>
                  <span className="mt-1 block text-sm text-paper/70">
                    {item.role}, {item.organization}
                  </span>
                </span>
                <span className="label text-right text-muted">{titleFor(item.projectSlug)}</span>
              </figcaption>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
