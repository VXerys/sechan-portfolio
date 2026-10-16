import { About } from "@/components/sections/about";
import { Capabilities } from "@/components/sections/capabilities";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { Testimonials } from "@/components/sections/testimonials";
import { Work } from "@/components/sections/work";
import { Header } from "@/components/site/header";
import { achievements, experience, profile, projects, skills, testimonials } from "@/content/portfolio";

const MARQUEE = ["Flutter", "Next.js", "Supabase", "React Native", "PostgreSQL", "Applied AI", "TypeScript", "Appwrite"];

export default function Home() {
  return (
    <>
      <a href="#main" className="label sr-only z-[80] bg-accent px-4 py-3 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Header name={profile.name} />
      <main id="main">
        <Hero profile={profile} />
        <Marquee items={MARQUEE} />
        <About profile={profile} />
        <Work projects={projects} />
        <Experience entries={experience} />
        <Capabilities skills={skills} achievements={achievements} />
        <Testimonials testimonials={testimonials} projects={projects} />
      </main>
      <Contact profile={profile} number={testimonials.length > 0 ? "07" : "06"} />
    </>
  );
}
