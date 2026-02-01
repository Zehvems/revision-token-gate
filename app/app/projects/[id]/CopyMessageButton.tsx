"use client";

import { useState } from "react";

export default function CopyMessageButton({
  projectId,
  disabled,
}: {
  projectId: string;
  disabled?: boolean;
}) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCopy() {
    setLoading(true);
    setStatus("loading");

    try {
      const res = await fetch(`/api/projects/${projectId}/build_msg`, {
        cache: "no-store",
      });
      const data = await res.json();
      const clientMessage = data.clientMessage as string | null;

      if (!clientMessage) {
        setStatus("No requests yet");
        return;
      }

      await navigator.clipboard.writeText(clientMessage);
      setStatus("copied");
    } catch {
      setStatus("Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleCopy} disabled={disabled || loading}>
      Copy message
      {loading && " (loading...)"}
      {status && ` — ${status}`}
    </button>
  );
}
