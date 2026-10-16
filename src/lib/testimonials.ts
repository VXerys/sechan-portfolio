import type { Testimonial } from "../content/testimonials.ts";

// Display-ready and already filtered, so it is the only testimonial shape allowed to cross into a client component.
export type TestimonialView = {
  key: string;
  text: string; // what the visitor reads first: the approved translation, or the quote as written
  lang: string;
  original: { text: string; lang: string; languageName: string } | null;
  person: string; // the name, or the anonymous label when the person did not agree to be named
  detail: string | null;
  projectSlug: string | null;
  excerpt: string | null;
};

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const languageNames = new Intl.DisplayNames(["en"], { type: "language" });

// "2026-02-30" matches the pattern but is not a day anyone approved anything, so the date must round-trip.
export function isConsentDate(value: string | null): value is string {
  if (value === null || !DATE.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function showTestimonials(items: Testimonial[]): TestimonialView[] {
  return items
    .filter((item) => isConsentDate(item.consentDate))
    .map((item, index) => {
      const { attribution } = item;
      const named = attribution.showName;
      return {
        key: `${item.projectSlug ?? "general"}-${index}`,
        text: item.translation ?? item.quote,
        lang: item.translation === null ? item.language : "en",
        original:
          item.translation === null
            ? null
            : { text: item.quote, lang: item.language, languageName: languageNames.of(item.language) ?? item.language },
        person: named ? attribution.name : attribution.label,
        detail: named ? [attribution.role, attribution.organization].filter(Boolean).join(", ") : null,
        projectSlug: item.projectSlug,
        excerpt: item.excerpt,
      };
    });
}

export function quoteForProject(views: TestimonialView[], slug: string): TestimonialView | null {
  return views.find((view) => view.projectSlug === slug && view.excerpt !== null) ?? null;
}
