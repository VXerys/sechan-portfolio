export function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="flex items-center whitespace-nowrap">
          <span className="display px-6 text-[9vw] md:text-[5.5vw]">{item}</span>
          <span className="text-accent" aria-hidden="true">
            ✳
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee overflow-hidden border-y border-line py-4" role="region" aria-label="Tools I work with">
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
