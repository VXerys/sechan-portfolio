import { Reveal } from "@/components/motion/reveal";
import type { Achievement, SkillGroup } from "@/content/portfolio";

export function Capabilities({ skills, achievements }: { skills: SkillGroup[]; achievements: Achievement[] }) {
  return (
    <section aria-labelledby="capabilities-title" className="bg-paper px-4 py-28 text-ink md:px-8 md:py-40">
      <div className="grid gap-20 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="label text-ink/50">(04) Capabilities</p>
          <Reveal as="h2" id="capabilities-title" mode="words" className="display mt-6 text-[17vw] md:text-[8vw] lg:text-[6vw]">
            Toolkit
          </Reveal>
          <dl className="mt-12">
            {skills.map((group) => (
              <Reveal key={group.group} className="grid gap-3 border-t border-ink/15 py-6 sm:grid-cols-[10rem_1fr]">
                <dt className="label text-ink/50">{group.group}</dt>
                <dd className="text-lg leading-snug">{group.items.join(", ")}</dd>
              </Reveal>
            ))}
          </dl>
        </div>

        <div>
          <p className="label text-ink/50">(05) Recognition</p>
          <Reveal as="h2" mode="words" className="display mt-6 text-[17vw] md:text-[8vw] lg:text-[6vw]">
            Proof
          </Reveal>
          <ul className="mt-12">
            {achievements.map((item) => (
              <li key={item.title}>
                <Reveal className="grid gap-2 border-t border-ink/15 py-6 sm:grid-cols-[4rem_1fr]">
                  <span className="label text-ink/50">{item.year}</span>
                  <div>
                    <h3 className="text-lg font-semibold leading-snug">{item.title}</h3>
                    <p className="mt-1 text-sm text-ink/60">{item.issuer}</p>
                    {item.note && <p className="mt-2 font-serif text-lg italic leading-snug text-ink/80">{item.note}</p>}
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
