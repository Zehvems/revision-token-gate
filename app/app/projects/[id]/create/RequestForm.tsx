"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RequestForm({ projectId }: { projectId: string }) {
  const [body, setBody] = useState("");
  const router = useRouter();
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
            
          router.push("/projects/" + projectId);
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
