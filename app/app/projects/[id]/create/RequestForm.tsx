"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Props = { projectId: string };

// MVP-safe constraints (tanie, ale robią robotę)
const MIN_LEN = 3;
const MAX_LEN = 1000;      // żeby nikt nie wkleił biblii i nie rozjebał UI
const COOLDOWN_MS = 900;   // minimalny anti-spam po sukcesie

export default function RequestForm({ projectId }: Props) {
  const router = useRouter();

  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // do cancelowania requestu jeśli user kliknie 6x / zmieni stronę
  const abortRef = useRef<AbortController | null>(null);

  const trimmed = useMemo(() => body.trim(), [body]);
  const remaining = MAX_LEN - body.length;

  const inCooldown = Date.now() < cooldownUntil;

  const validationError = useMemo(() => {
    if (!trimmed) return "Treść jest wymagana.";
    if (trimmed.length < MIN_LEN) return `Minimum ${MIN_LEN} znaki.`;
    if (trimmed.length > MAX_LEN) return `Maksymalnie ${MAX_LEN} znaków.`;
    return null;
  }, [trimmed]);

  async function submit() {
    // HARD GUARDS (anty-spam)
    if (isSubmitting || inCooldown) return;

    setError(null);
    setSuccess(null);

    if (validationError) {
      setError(validationError);
      return;
    }

    // anuluj poprzedni request (gdyby coś poszło w tle)
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: trimmed }),
        signal: ac.signal,
      });

      if (!res.ok) {
        // spróbuj wyciągnąć sensowny komunikat z API
        const text = await res.text().catch(() => "");
        setError(
          `Błąd: ${res.status}. ${
            text ? text.slice(0, 180) : "Nie udało się dodać requestu."
          }`
        );
        return;
      }

      // success
      setBody("");
      setSuccess("Dodano request ✅");
      setCooldownUntil(Date.now() + COOLDOWN_MS);

      // Stabilniej niż push (mniej edge-case’ów w dev/prod)
      router.replace(`/projects/${projectId}`);
      router.refresh();
    } catch (e: unknown) {
      const isAbortError =
        typeof e === "object" &&
        e !== null &&
        "name" in e &&
        typeof (e as { name?: unknown }).name === "string" &&
        (e as { name: string }).name === "AbortError";
      if (isAbortError) return;
      setError("Network error: nie udało się połączyć z serwerem.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section style={{ display: "grid", gap: 10, maxWidth: 720 }}>
      <label style={{ display: "grid", gap: 6 }}>
        <span style={{ fontWeight: 600 }}>Nowa poprawka</span>
        <textarea
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            // czyścimy błędy jak user zaczyna poprawiać
            if (error) setError(null);
            if (success) setSuccess(null);
          }}
          onKeyDown={(e) => {
            // CTRL+Enter = submit
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
          rows={6}
          placeholder="Wklej treść poprawki (np. „Zmień nagłówek na bardziej konkretny…”)"
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            outline: "none",
            resize: "vertical",
          }}
        />
      </label>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6b7280" }}>
        <span>{validationError ? validationError : "CTRL+Enter żeby wysłać"}</span>
        <span>{remaining} znaków</span>
      </div>

      {error && (
        <div
          style={{
            padding: 10,
            borderRadius: 10,
            border: "1px solid #fecaca",
            background: "#fff1f2",
            color: "#991b1b",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            padding: 10,
            borderRadius: 10,
            border: "1px solid #bbf7d0",
            background: "#f0fdf4",
            color: "#166534",
          }}
        >
          {success}
        </div>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={isSubmitting || inCooldown || !!validationError}
        aria-busy={isSubmitting}
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid #e5e7eb",
          background: isSubmitting || inCooldown ? "#f3f4f6" : "white",
          color: "#111827",
          cursor: isSubmitting || inCooldown ? "not-allowed" : "pointer",
          fontWeight: 600,
        }}
      >
        {isSubmitting ? "Dodaję…" : inCooldown ? "Chwila…" : "Add request"}
      </button>
    </section>
  );
}
