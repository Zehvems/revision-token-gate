"use client";
import { useEffect, useState } from "react";

type Project  = {
  id: string;
  name?: string;
  includedLimit?: number;
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();
        setProjects(data.projects ?? []);
      } catch (err) {
        console.error("fetch projects failed", err);
      }
    }
    loadProjects();
  }, []);

  return (
    <main>
      <h1>Revision Token Gate</h1>
      <p>Projects list</p>
      <ul>
        {projects.map((p, i) => (
          <li key={p.id ?? i}>
            {p.name ?? "Unnamed"} (limit: {p.includedLimit ?? "—"})
          </li>
        ))}
      </ul>
    </main>
  );
}
