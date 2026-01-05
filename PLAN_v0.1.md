# PLAN_v0.1.md

## Goal (one sentence)

Build v0.1 in 7 days so a solo copywriter can, in <20 seconds, generate & copy a revision-limit message after final delivery and log revision requests (manual + public link) for real feedback.

## Deadline

v0.1 release: **12.01.2026 (end of day)**

## Scope (v0.1 must-have)

1. Projects

- create project: name, client_name, included_limit
- project view: meter X/N

2. Requests

- manual add request (body) → auto round_number
- auto classify: included if round<=limit else extra
- request log list

3. Messages

- generate included + extra message templates (based on project)
- Copy button for each template

4. Public link

- generate token link per project
- public form (1 textarea) → creates request on that project

5. Telemetry (minimal)

- project_created
- link_generated
- message_copied
- request_created (manual vs client, included vs extra)

## Non-goals (hard cuts)

- auth/accounts
- payments
- AI
- integrations
- dashboards/stats beyond bare meter

## Day plan (D1–D7)

D1 (06.01): copy + data model + routes skeleton
D2: projects CRUD minimal + storage
D3: requests (manual) + classification
D4: messages + copy button
D5: token link + public form
D6: cleanup + deploy
D7: buffer + outreach start

## Validation (starts immediately after v0.1 release)

Window: **12.01–19.01**
Target: 3 testers with active clients now.

What we do:

- DM 3–5 people (Discord/FB/1-on-1)
- Give 30s instruction + link
- Ask them to use it on the next real “small change” after final

What we measure (truth):

- > =10 message_copied total
- > =10 request_created total
- > =3 extra requests after limit (or clear evidence the limit changes the conversation)

If weak:

- iterate friction + copy (not features)
