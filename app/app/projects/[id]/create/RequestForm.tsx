"use client";

import { useState } from "react";

export default function RequestForm({ projectId }: { projectId: string }) {
  const [body, setBody] = useState("");

  return (
    <section>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        cols={50}
        placeholder="Enter request body here"
      />
      <br />
      <button
        type="button"
        onClick={async () => {
          try {
            const res = await fetch(`/api/projects/${projectId}/requests`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ body }),
            });
            if (!res.ok) {
              console.error("Request failed", res.status, await res.text());
              return;
            }
            const data = await res.json();
            console.log("Request created:", data);
            setBody("");
          } catch (err) {
            console.error("Network error", err);
          }
        }}
      >
        Add request
      </button>
    </section>
  );
}
