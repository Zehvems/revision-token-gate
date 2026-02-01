"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Project  = {
  id: string;
  name?: string;
  clientName?: string;
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
    <Link
      href="/projects/add"
      aria-label="Add project"
      style={{
        display: "inline-block",
        padding: "6px 10px",
        fontSize: 12,
        border: '1px solid #abacae',
    borderRadius: 8,
    background: 'transparent',
    color: '#2b2f36',
    textDecoration: 'none',
    alignItems: 'center',
    userSelect: 'none',
      }}
    >
      Add project
    </Link>
    <ul>
      {projects.map((p, i) => (
        <li key={p.id ?? i}>
          <strong>{p.name ?? "Unnamed project"}</strong>
          {p.clientName && <> — <span>{p.clientName}</span></>}
          <span> | limit: {p.includedLimit ?? "—"}</span>
          {p.id && <> | <a href={`/projects/${p.id}`}>open →</a></>}
        </li>
      ))}
    </ul>
  </main>
);

}
