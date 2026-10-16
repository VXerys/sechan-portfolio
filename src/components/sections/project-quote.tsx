import type { TestimonialView } from "@/lib/testimonials";

type Props = { quote: TestimonialView; className?: string };

// No hooks, so both the server-rendered case studies and the client "More work" panel can use it.
export function ProjectQuote({ quote, className }: Props) {
  if (!quote.excerpt) return null;
  return (
    <figure className={className}>
      <blockquote lang={quote.lang} className="statement text-[1.6rem] text-paper/90 md:text-[2rem]">
        <span aria-hidden="true" className="text-accent">
          “
        </span>
        {quote.excerpt}
        <span aria-hidden="true" className="text-accent">
          ”
        </span>
      </blockquote>
      {/* Gap instead of a left margin, so the link starts flush when it wraps under a long attribution. */}
      <figcaption className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm leading-snug">
        <span>
          <span className="font-semibold">{quote.person}</span>
          {quote.detail && <span className="text-paper/60">, {quote.detail}</span>}
        </span>
        <a href="#testimonials" className="label link-underline py-1 text-accent">
          Read in full
        </a>
      </figcaption>
    </figure>
  );
}
