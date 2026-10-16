import { About } from "@/components/sections/about";
import { Capabilities } from "@/components/sections/capabilities";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { Testimonials } from "@/components/sections/testimonials";
import { Work } from "@/components/sections/work";
import { Header } from "@/components/site/header";
import { achievements, experience, profile, projects, skills } from "@/content/portfolio";
import { testimonials } from "@/content/testimonials";
import { showTestimonials } from "@/lib/testimonials";

const MARQUEE = ["Flutter", "Next.js", "Supabase", "React Native", "PostgreSQL", "Applied AI", "TypeScript", "Appwrite"];

export default function Home() {
  // Filtered here, on the server, so entries still waiting for approval never reach a client prop (BR-008).
  const quotes = showTestimonials(testimonials);
  const contactNumber = quotes.length > 0 ? "07" : "06";

  return (
    <>
      <a href="#main" className="label sr-only z-[80] bg-accent px-4 py-3 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Header name={profile.name} />
      <main id="main">
        <Hero profile={profile} />
        {/* One rounded sheet slides over the pinned hero and lifts off the footer; overflow-clip keeps sticky columns working. */}
        <div className="relative z-10 overflow-clip rounded-[28px] bg-ink shadow-[0_-30px_60px_rgba(0,0,0,0.45)] md:rounded-[56px]">
          <Marquee items={MARQUEE} />
          <About profile={profile} />
          <Work projects={projects} quotes={quotes} />
          <Experience entries={experience} />
          <Capabilities skills={skills} achievements={achievements} />
          <Testimonials testimonials={quotes} projects={projects} number="06" />
        </div>
      </main>
      <Contact profile={profile} number={contactNumber} />
    </>
  );
}
