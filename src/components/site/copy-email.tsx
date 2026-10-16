"use client";

import { useEffect, useState } from "react";

import { PillButton } from "@/components/motion/pill";

type Status = "idle" | "copied" | "failed";

// For visitors without a mail app, where a mailto link silently does nothing.
export function CopyEmail({ email }: { email: string }) {
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
    <PillButton onClick={copy}>
      {label}
      <span aria-hidden="true">{status === "copied" ? "✓" : "⧉"}</span>
      <span className="sr-only" aria-live="polite">
        {status === "copied" ? "Email address copied" : status === "failed" ? `Copy failed, the address is ${email}` : ""}
      </span>
    </PillButton>
  );
}
