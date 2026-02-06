"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProjectPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [clientName, setClientName] = useState("");
  const [includedLimit, setIncludedLimit] = useState<number>(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // obsługa submit
  async function handleSubmit() {
    if (!name.trim()) {
      setError("Project name required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          clientName: clientName.trim() || null,
          includedLimit,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Create failed");
      }

      router.push("/");
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(String(e) || "Error");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Create project</h1>

      <div>
        <label>
          Nazwa projektu
          <br />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Nazwa klienta (optional)
          <br />
          <input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Limit poprawek w pakiecie
          <br />
          <input
            type="number"
            min={0}
            value={includedLimit}
            onChange={(e) => setIncludedLimit(Number(e.target.value))}
          />
        </label>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Tworzenie..." : "Stwórz projekt"}
      </button>
    </main>
  );
}
