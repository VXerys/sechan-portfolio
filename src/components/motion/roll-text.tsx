// Two stacked copies; hovering the parent link or button rolls the second into place (CSS in globals.css).
export function RollText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`roll relative inline-flex overflow-hidden ${className ?? ""}`}>
      <span className="block">{text}</span>
      <span aria-hidden="true" className="absolute left-0 top-full block">
        {text}
      </span>
    </span>
  );
}
