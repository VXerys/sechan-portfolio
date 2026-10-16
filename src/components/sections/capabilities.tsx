import { ClipSheet } from "@/components/motion/clip-sheet";
import { DriftTitle } from "@/components/motion/drift-title";
import { LineRows } from "@/components/motion/line-rows";
import { ProofTrack } from "@/components/sections/proof-track";
import type { Achievement, SkillGroup } from "@/content/portfolio";

export function Capabilities({ skills, achievements }: { skills: SkillGroup[]; achievements: Achievement[] }) {
  return (
    <ClipSheet id="capabilities" section="04" sectionLabel="Toolkit" labelledBy="capabilities-title" className="overflow-hidden bg-paper px-4 py-28 text-ink md:px-8 md:py-40">
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

      <ProofTrack achievements={achievements} />
    </ClipSheet>
  );
}
