import { ClipSheet } from "@/components/motion/clip-sheet";
import { DriftTitle } from "@/components/motion/drift-title";
import { LineRows } from "@/components/motion/line-rows";
import type { Achievement, SkillGroup } from "@/content/portfolio";

export function Capabilities({ skills, achievements }: { skills: SkillGroup[]; achievements: Achievement[] }) {
  return (
    <ClipSheet labelledBy="capabilities-title" className="overflow-hidden bg-paper px-4 py-28 text-ink md:px-8 md:py-40">
      <p className="label mb-6 text-ink/50">(04) Capabilities</p>
      <DriftTitle id="capabilities-title" lines={["Tool", "kit"]} className="display text-[24vw] md:text-[14vw]" />

      {/* Full-width rows in both lists, so neither column ends early and leaves a block of empty paper. */}
      <LineRows as="dl" className="mt-16 md:mt-24">
        {skills.map((group) => (
          <div key={group.group} data-row className="group relative overflow-hidden">
            <span data-line className="absolute inset-x-0 top-0 h-px bg-ink/20" />
            <div data-row-content className="grid gap-3 py-6 md:grid-cols-12 md:gap-8 md:py-8">
              <dt className="label pt-2 text-ink/50 md:col-span-3">{group.group}</dt>
              <dd className="flex flex-wrap gap-x-3 gap-y-1 text-2xl leading-tight tracking-tight md:col-span-9 md:text-[2.4vw]">
                {group.items.map((item, index) => (
                  <span key={item} className="transition-colors duration-300 hover:text-ink/40">
                    {item}
                    {index < group.items.length - 1 && <span className="text-ink/30">,</span>}
                  </span>
                ))}
              </dd>
            </div>
          </div>
        ))}
      </LineRows>

      <p className="label mb-6 mt-28 text-ink/50 md:mt-40">(05) Recognition</p>
      <DriftTitle lines={["Proof"]} className="display text-[24vw] md:text-[14vw]" />

      <LineRows as="ul" className="mt-16 md:mt-24">
        {achievements.map((item) => (
          <li key={item.title} data-row className="group relative overflow-hidden">
            <span data-line className="absolute inset-x-0 top-0 z-10 h-px bg-ink/20" />
            <span
              aria-hidden="true"
              className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-y-100"
            />
            <div data-row-content className="relative grid gap-2 py-6 md:grid-cols-12 md:gap-8 md:px-4 md:py-8">
              <span className="label pt-1 text-ink/50 md:col-span-1">{item.year}</span>
              <div className="md:col-span-6">
                <h3 className="text-xl font-semibold leading-snug md:text-2xl">{item.title}</h3>
                <p className="mt-1 text-sm text-ink/60">{item.issuer}</p>
              </div>
              {item.note && <p className="statement text-xl italic leading-snug text-ink/80 md:col-span-5 md:text-2xl">{item.note}</p>}
            </div>
          </li>
        ))}
      </LineRows>
      <span aria-hidden="true" className="block h-px bg-ink/20" />
    </ClipSheet>
  );
}
