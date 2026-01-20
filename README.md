# README.md — Revision Token Gate (S6)

Behavior-first micro-MVP for solo copywriters/ghostwriters.

## What this is

A minimal tool that helps a freelancer set a clear revision boundary _after “final delivery”_ using a ready-to-send message + a simple revision meter.

## ICP

Solo copywriter / ghostwriter (3–15 clients/month) working via WhatsApp / Email / Google Docs.

## Moment of truth

When a client asks for a “small change” after the final version was delivered.

## Success signals (behavior)

- `message_copied` (minimum truth)
- `request_created` (manual or client)
- optional gold: message was actually sent in a real client conversation

## Non-goals (for v0.1)

- accounts/auth
- payments
- integrations (WA/Gmail/Docs)
- AI scope classification
- “project management” features

## Versions

### v0.1 (Sprint goal)

Time-to-send < 20 seconds:

- Create a project (name, client, included_limit) — minimal
- Generate “included” + “extra” client message templates
- Copy button (included/extra)
- Manual add request (increments round number, classifies included/extra)
- Public token link (1 text field → creates request)
- Basic event log: project_created, link_generated, message_copied, request_created

Decision Gate: 31.01.2026 (PASS / FREEZE / KILL)
