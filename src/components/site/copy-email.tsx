"use client";

import { useEffect, useState } from "react";

import { RollText } from "@/components/motion/roll-text";

type Status = "idle" | "copied" | "failed";

// For visitors without a mail app, where a mailto link silently does nothing.
export function CopyEmail({ email, className }: { email: string; className?: string }) {
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (status === "idle") return;
    const id = window.setTimeout(() => setStatus("idle"), status === "copied" ? 2000 : 6000);
    return () => window.clearTimeout(id);
  }, [status]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  };

  const label = status === "copied" ? "Copied" : status === "failed" ? email : "Copy email";

  return (
    <button type="button" onClick={copy} className={`label flex items-center gap-1.5 py-2 ${className ?? ""}`}>
      <RollText text={label} />
      <span aria-hidden="true">{status === "copied" ? "✓" : "⧉"}</span>
      <span className="sr-only" aria-live="polite">
        {status === "copied" ? "Email address copied" : status === "failed" ? `Copy failed, the address is ${email}` : ""}
      </span>
    </button>
  );
}
