"use client";

import { useState } from "react";

import type { Project } from "@/content/portfolio";

const pad = (n: number) => String(n).padStart(2, "0");

export function ProjectIndex({ projects, offset }: { projects: Project[]; offset: number }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <ul className="border-b border-line">
      {projects.map((project, index) => {
        const open = openSlug === project.slug;
        const panelId = `${project.slug}-panel`;
        return (
          <li key={project.slug} className="border-t border-line">
            <h4>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenSlug(open ? null : project.slug)}
                className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-6 text-left md:grid-cols-[4rem_1fr_14rem_5rem_2rem] md:py-8"
              >
                <span className="label text-muted">{pad(offset + index + 1)}</span>
                <span className="display text-[11vw] transition-colors duration-300 group-hover:text-accent md:text-[4.4vw]">
                  {project.title}
                </span>
                <span className="label hidden text-muted md:block">{project.category}</span>
                <span className="label hidden text-muted md:block">{project.year}</span>
                <span
                  aria-hidden="true"
                  className={`text-2xl leading-none transition-transform duration-500 ease-[var(--ease-expo)] ${open ? "rotate-45 text-accent" : ""}`}
                >
                  +
                </span>
              </button>
            </h4>
            <div
              id={panelId}
              className={`grid transition-[grid-template-rows] duration-700 ease-[var(--ease-expo)] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden" inert={!open}>
                <div className="grid gap-8 pb-10 md:grid-cols-[4rem_1fr_1fr] md:gap-10">
                  <div className="hidden md:block" />
                  <div>
                    <p className="font-serif text-2xl italic leading-tight">{project.summary}</p>
                    <p className="mt-4 text-[1.0625rem] leading-relaxed text-paper/75">{project.problem}</p>
                    <p className="label mt-6 text-muted">
                      {project.role} <span aria-hidden="true">·</span> {project.status}
                    </p>
                  </div>
                  <div>
                    <ul className="space-y-3 text-[1.0625rem] leading-relaxed text-paper/80">
                      {project.contribution.map((item) => (
                        <li key={item} className="grid grid-cols-[1rem_1fr] gap-2">
                          <span aria-hidden="true" className="text-muted">
                            –
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <ul className="mt-6 flex flex-wrap gap-2" aria-label="Stack">
                      {project.stack.map((tool) => (
                        <li key={tool} className="label rounded-full border border-line px-3 py-1.5 text-paper/80">
                          {tool}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
