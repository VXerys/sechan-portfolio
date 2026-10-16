"use client";

import { useSyncExternalStore } from "react";

const formatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
});

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(id);
}

// Minute precision keeps the snapshot stable between ticks, so React does not re-render in a loop.
const getSnapshot = () => formatter.format(new Date());
const getServerSnapshot = () => "--:--";

export function LocalTime({ className }: { className?: string }) {
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return (
    <span className={className}>
      Sukabumi, ID <span aria-hidden="true">·</span> {time} WIB
    </span>
  );
}
