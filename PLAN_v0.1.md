# PLAN_v0.1.md — UPDATED (11.01.2026)

## Reality check (source of truth)

- Fundament techniczny jest domknięty: Next.js runtime działa, Prisma + SQLite skonfigurowane, model `Project` istnieje i jest w DB (migracja + test w Prisma Studio).
- Pierwotny deadline **12.01 EOD** na pełne v0.1 (z public link + telemetry) jest **nierealny** bez chaosu.
- Robimy **kontrolowany scope shift**: najpierw dowozimy **v0.1-core**, a resztę przesuwamy jako **v0.1.1**.

---

## Goal (one sentence)

Do **15.01.2026 (EOD)** dowieźć **używalne v0.1-core**, które pozwala solo copywriterowi w <20 sekund:
utworzyć projekt, dodać poprawkę manualnie, zobaczyć licznik rund (meter) i skopiować gotowy komunikat (included/extra) — tak, aby dało się przeprowadzić pierwsze testy 1-on-1.

---

## Deadline

- **v0.1-core release:** **15.01.2026 (end of day)**
- **v0.1.1 (optional):** **16–18.01.2026** (tylko jeśli core jest stabilne)

Decision Gate (PASS/FREEZE/KILL): **25.01.2026**

---

## Scope split: v0.1-core vs v0.1.1

### ✅ v0.1-core (MUST — bez tego nie ma testów)

#### 1) Projects

- `POST /api/projects` (create)
- `GET /api/projects` (list)
- Minimal UI:
  - Projects list
  - Project detail
  - meter `X/N`

**Data:**

- `name` (required)
- `clientName` (optional)
- `includedLimit` (required, int >= 0)

#### 2) Requests (manual only)

- Model `Request`
- `POST /api/projects/:id/requests` (manual add)
  - auto `round_number` (kolejny numer)
  - `type`: included jeśli `round_number <= includedLimit`, inaczej extra
- `GET /api/projects/:id/requests` (list)
- UI: request log list

#### 3) Messages (moment prawdy)

- Generacja 2 template’ów na podstawie Project:
  - included message
  - extra message (bez płatności; może być „poza pakietem / do potwierdzenia”)
- Copy button dla obu
- Test flow:
  - client asks → open app → copy → paste/send

---

### ⏸️ v0.1.1 (NIE BLOKUJE WALIDACJI — robimy tylko po core)

#### 4) Public link (token)

- Model `PublicLink` (token → project_id)
- `POST /api/projects/:id/link` (generate token)
- Public form: 1 textarea → tworzy Request na project

#### 5) Telemetry (minimal)

- Najpierw wystarczy log (console).
- Jeśli chcesz „twarde dane”: model `Event` + `POST /api/events` + prosty ekran `/events`.

---

## Non-goals (hard cuts — nie dyskutujemy w tym sprincie)

- auth / konta / role
- płatności
- integracje (WA/Gmail/Docs)
- AI klasyfikacja scope
- kanbany / dashboardy / stats poza meterem

---

## Day plan (11.01 → 15.01)

### D-1 — 11.01 (dzisiaj / końcówka dnia)

**Win condition:** pierwszy realny endpoint działa.

- Gate 1C-B: `POST /api/projects`
- test w Postman/curl
- commit: `feat: add POST /api/projects`

Jeśli dziś dowozisz tylko to → dzień wygrany.

### D0 — 12.01

**Cel:** Projects domknięte + minimalny UI.

- `GET /api/projects`
- minimal Projects list UI
- Project detail UI + meter `X/N`

### D1 — 13.01

**Cel:** Requests (serce produktu).

- model `Request`
- `POST /api/projects/:id/requests` + auto round + included/extra
- `GET /api/projects/:id/requests`
- request list w UI

### D2 — 14.01

**Cel:** Messages + copy (moment “aha”).

- templates included/extra
- Copy button
- test end-to-end na własnym scenariuszu (“drobnostka po finalu”)

### D3 — 15.01

**Cel:** stabilizacja + gotowość do testów.

- cleanup
- friction cuts (czas do skopiowania <20s)
- przygotowanie listy 3 testerów + DM draft
- decyzja: czy robimy v0.1.1 czy startujemy testy core

---

## Validation (real, behavior-based)

### Window

**15.01–22.01** (start w dniu release core)

### Target

3 osoby z ICP z aktywnymi klientami TERAZ (nie “kiedyś”).

### What we do (minimum)

- DM 3–5 osób (Discord/FB/1-on-1)
- 30 sekund instrukcji + link
- prośba o użycie przy następnej “drobnostce” po finalu

### What we measure (truth hierarchy)

- MIN: `message_copied` (twardy sygnał intencji)
- BETTER: `request_created_manual` lub `request_created_public`
- GOLD: realne użycie przy realnej poprawce + krótki cytat “jak poszło”

### If weak

- iterujemy tarcie + copy (nie dorzucamy feature’ów)
- jeśli problem to “brak okazji” → zmiana testerów, nie zmiana produktu

---

## Decision Gate (25.01.2026) — PASS / FREEZE / KILL

PASS (min. 2/3):

1. 3 testerów użyło w realnym kontekście (nie demo)
2. ≥30 requestów łącznie w logach w 2 tygodnie
3. ≥8 extra (lub dowód, że limit realnie zmienia rozmowę)

FREEZE:

- jest użycie, ale mały wolumen / tarcie / problem z kanałem testerów
- stop feature dev, 7 dni tylko dystrybucja + friction cuts

KILL:

- brak realnego użycia mimo 2 iteracji tarcia + właściwych testerów
- jasny sygnał: “nie użyję procesu” + brak zachowań
