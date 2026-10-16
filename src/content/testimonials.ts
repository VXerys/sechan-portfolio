// Kept apart from portfolio.ts because a client component imports that module; only Server Components read this
// one, so an entry still waiting for approval never ships to the browser (BR-008).

export type Testimonial = {
  quote: string; // the person's own approved words, in the language they wrote them (BR-003)
  language: string; // BCP 47 tag of `quote`, such as "id" or "en"
  translation: string | null; // English version the person approved (BR-007); null when `quote` is already English
  attribution:
    | { showName: true; name: string; role: string; organization: string | null }
    // Without consent to be named, no name is stored at all (BR-006), only a label such as
    // "Owner of a primary care clinic in Sukabumi".
    | { showName: false; label: string };
  projectSlug: string | null; // null for work outside the project list, such as the wedding invitation site
  excerpt: string | null; // verbatim part of the shown text for the project's case study; null shows none there
  consentDate: string | null; // YYYY-MM-DD the person approved this entry as written; null keeps it off the site
};

// Filled only with quotes the person wrote and approved; the section stays hidden while none has a consent date (A-003).
export const testimonials: Testimonial[] = [];
