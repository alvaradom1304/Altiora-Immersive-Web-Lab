---
name: orca-orchestration
description: "Use when managing multi-agent tasks, workspaces, gates, and handoffs in Orca."
---

# Orca orchestration

Orchestration is Orca's structured coordination layer. It records who owns work,
which attempt is authoritative, and when supervised work has settled.

## Outcome

**Result:** every in-scope Task has one explicit outcome and every settled worker
terminal has a next owner or cleanup decision. **Next consumer:** the user who
requested supervision. **Done:** all expected Dispatches have settled, every
delivered message was processed before acknowledgment, each settled worker was
reused, explicitly retained, or released, and the turn ends only when the report
to that user names, per Task, its outcome, the evidence behind it, and any
unresolved blocker.

**Safe failure:** preserve work and authority and report the state as unknown or
`unverifiable`. Only positive proof of exit authorizes stop, abandon, or retry,
and only an accepted settlement authorizes release. Every other observation,
absence included, is a checkpoint.

## Classify the role

| Current context                                                                                                                                | Role                    | Route                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------ |
| The user explicitly asks to supervise, monitor, wait for results, track completion, coordinate a DAG, use a decision gate, or manage ask/reply | Coordinator             | Use the supervised loop below                                                  |
| The current prompt contains a live injected preamble with Task and Dispatch IDs                                                                | Dispatched worker       | Follow the preamble and the worker obligations below                           |
| The user asks to hand off ownership or start another agent/worktree without supervision                                                        | Handoff owner           | Use `orca-cli`; create no Run, Task, or Dispatch and do not monitor completion |
| A message carries a legacy authority label                                                                                                     | Compatibility operator  | Load the legacy contract reference before any lifecycle mutation               |
| No live preamble and no explicit supervision                                                                                                   | Ordinary terminal agent | Do not emit lifecycle messages; use `orca-cli` for terminal/worktree work      |

Model or effort selection does not make a handoff supervised: `orca-cli`'s
`worktree create --agent` and `agent launch` take `--model` and `--effort`, and
open a chat or a terminal per the user's Chat UI setting, as `worker-start` does.
Never substitute a non-Orca subagent tool when Orca orchestration provenance was
requested.

## Authority and safety floor

- A Run is a durable namespace and coordinator inbox; it does not schedule or
  place workers. A Task is work. A Dispatch is one authoritative Task attempt.
- Lifecycle authority comes from the active Dispatch, not a terminal title,
  copied ID, old database row, provider transcript, or visible pane.
- Workers use the exact executable, handle, Task ID, and Dispatch ID in the live
  preamble, plus any other flag it carries. Never reconstruct, translate, or
  broaden those arguments.
- After remote start, address the worker by Dispatch ID. The execution host owns
  process, filesystem, transcript, stop, and cleanup facts. Preserve the verdicts
  `live` / `unverifiable` / `exited`; contact loss is not process death.
- Liveness is layered: `worker-list`'s `projection.liveness` is the fleet verdict
  for the agent; `worker-show`'s `observation.status` is PTY liveness only. A live
  terminal can still hold a dead or stuck agent.
- Folder workspaces are valid; never require Git or assume a worktree.
- Clients and remote servers update independently. Treat unknown optional fields
  as absent. A new stream operation requires advertised capability because old
  decoders may silently drop unknown opcodes. Never fall back to local execution
  when remote authority or capability is unproven.
- Use the executable you used to run `skills get` for the entire run. In the
  examples below, replace `ORCA` with it; do not create a shell variable or run
  `ORCA` literally. If it fails, report that exact error instead of switching.
- `ORCA status --json` shows your Orca session ID as `caller.orcaSessionId` when you have one.
- A successful `orchestration send` proves durable enqueue; its wake or nudge is
  best-effort attention only and does not prove the recipient read or accepted it.

## Worker obligations

The injected preamble is authoritative. A dispatched worker must:

1. Do only the current Task and use the preamble's `ask` command for a blocking
   coordinator question. Never open a local question TUI the coordinator cannot
   answer. Resume the same message ID after an ask timeout.
2. Send heartbeats only at the cadence in the preamble. A heartbeat proves
   liveness, not completion. If a background loop sends them, restart it if it
   expires mid-task, and stop it before `worker_done`.
3. Read coordinator follow-ups at each natural checkpoint ÔÇö before starting a
   new file, after a test run ÔÇö and once more immediately before `worker_done`:
   `ORCA orchestration check --terminal <your_handle> --json`.
   After processing every message, ack the batch, which returns the next one, and
   repeat until `count` is 0; an unacked batch replays and hides newer mail:
   `ORCA orchestration check --terminal <your_handle> --ack <delivery_id> --json`.
4. Send `worker_done` exactly once, from the dispatched terminal, with a
   three-sentence executive summary, both lifecycle IDs, and explicit
   `--outcome succeeded` or `--outcome failed`. Never encode failure only in prose.
5. Append `--files-modified` and `--report-path` only with real values when
   applicable. After `worker_done`, end the dispatched turn and idle; do not poll
   or start new work.

A direct user instruction after completion starts new user-owned work and takes
precedence over the idle rule. Do not reuse the settled lifecycle IDs.

## Canonical supervised loop

Confirm the runtime, bind one Run, and start the full independent wave before
waiting. `worker-start --spec` creates the Task and its attempt in one call:

```text
ORCA status --json
ORCA orchestration run-create --objective "<objective>" --json
ORCA orchestration worker-start --spec "<worker A task>" --worktree current --agent codex --json
ORCA orchestration worker-start --spec "<worker B task>" --worktree current --agent claude --json
ORCA orchestration check --wait --types "worker_done,escalation,question" --timeout-ms 900000 --json
```

After a restart, resume your own Run with `run-use --id <run_id>`. A worker
cannot bind the Run it works for or an ancestor, and cannot use
`--takeover-legacy`; an already-bound no-op remains allowed. When its
coordinator directs a handoff, a replacement worker may resume a separate Run
with plain `run-use`.

If `worker-start` exits non-zero, do not relaunch. Read the receipt's
`failedStage` and `residualResources`, then load
`references/recovery-and-cleanup.md`.

Use `task-create` plus `worker-start --task <task_id>` for planned fan-out with
dependencies or a retry of a known Task. Use dependencies only for real ordering
and prefer parallel waves over chains deeper than three or four steps; nested
workers obey the depth limit, and a new Run does not reset the caller's depth.
A dispatched worker starts its own helpers with `worker-start --spec` on the Run
it works for, without `run-create`; the helpers report to that worker.

A consuming `check` names its caller with `--terminal <handle>`, never `--from`;
omit it inside the coordinator's own Orca terminal. It returns the bound Run's
oldest FIFO Delivery and replays that batch until acknowledged. Process every
message: reply to questions, validate each `worker_done` against the expected
active Dispatch, and decide each settled terminal's next owner before the ack:

```text
ORCA orchestration reply --id <message_id> --body "<answer>" --json
ORCA orchestration worker-release --dispatch <dispatch_id> --json
ORCA orchestration check --ack <delivery_id> --wait --types "worker_done,escalation,question" --timeout-ms 900000 --json
```

Keep waiting until every expected Dispatch settles. A timeout or empty result is
a checkpoint, not a failure. Do not stop, retry, release, or launch a duplicate
editor without the positive proof `## Outcome` requires.

After three consecutive empty waits, stop waiting blindly and enumerate with
`ORCA orchestration worker-list --include-remote --json` (defaults to the bound
Run; `--run <run_id>` overrides; the receipt's `scope` names which), acting on
each row's `projection.attention` categories, `projection.attention.requiresAction`, and literal `projection.nextAction` argv.
Rows come newest first and page at 100: while `page.hasMore`, follow `page.nextCursor` with `--cursor <value>`.
A `none` `nextAction` has no argv to run: read `liveness.reason` and keep waiting
with `check --wait`. Absence never earns an argv; settlement and pending work still do.
Leave the wait only on positive proof the agent stopped: `exited` liveness, the
worker's own observation of process exit, or a transcript whose final agent turn
sent no `worker_done`. Then load `references/recovery-and-cleanup.md` and choose
`worker-stop` or `worker-abandon` explicitly. `unverifiable` is absence,
including when `worker-show` reports `agentWait` null. Absence never authorizes
stop, abandon, retry, or release; keep waiting or inspect.

`worker-start` is the normal path, composing placement, terminal readiness,
prompt injection, and supervised resource ownership. `dispatch --inject` leaves
an operator-created process unsupervised and is only for an expressiveness gap.

## Task-spec contract

Every Task spec must be self-contained and name:

- **Target:** the files, component, or environment in scope.
- **Change:** the concrete result to produce.
- **Constraints:** invariants, compatibility rules, and do-not-touch boundaries.
- **Ownership:** what this worker may edit and any coordination boundary.
- **Observable acceptance:** the test, output, or evidence that proves completion.

## Completion accounting

After an accepted success or failure report, immediately do exactly one:

1. Reuse the same proven agent terminal for an immediate follow-up Dispatch.
2. Record user-requested retention with `worker-retain`.
3. Run `worker-release`.

Release is post-settlement cleanup, not cancellation. Only an accepted
settlement authorizes it; no other observation does. If release is uncertain,
follow its exact recovery receipt and never substitute `terminal close`.

A valid `worker_done` settles the Task and Dispatch automatically; do not follow
it with `task-update --status completed`. Enumerate the terminals still owing a
decision with `worker-list --run <run_id> --terminal-state reclaimable --json`,
and do not end the coordinator turn until it returns none.

## Conditional references

This compact guide is sufficient for the normal local loop. At an action gate
below, run `ORCA skills get orchestration --reference references/<file>.md` and
read only that document; `--references` lists the names. If the CLI rejects
`--reference`, run `ORCA skills get orchestration --full` once instead: it
returns this exact kernel and every reference, so read only the named one. If an
older CLI rejects `--full`, keep this kernel's safety floor, use that command's
`--help`, and never guess newer flags.

| Action gate                                                                                                   | Bundled reference                         |
| ------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Expanded DAG waves, launch model/effort, same-terminal reuse, or review ownership                             | `references/coordinator-loop.md`          |
| You are a dispatched worker and the live preamble does not answer your question, or `check` returned an error | `references/worker-contract.md`           |
| New worktree, exact workspace, SSH, WSL, or connected-server placement                                        | `references/placement-and-remote.md`      |
| Inbox replay, follow-up messages, group addresses, or decision gates                                          | `references/messaging-and-gates.md`       |
| Failed/stopped/unknown attempts, retry, stop, abandon, retain, or uncertain release                           | `references/recovery-and-cleanup.md`      |
| Custom argv or terminal topology that `worker-start` cannot express                                           | `references/low-level-topology.md`        |
| Any legacy label, adopted Run, compatibility receipt, or takeover                                             | `references/legacy-contract-migration.md` |

Retired scheduler commands are not aliases for Run creation. Recovery commands
must provide their exact next action; follow it with the same selected executable.

---

## Bundled references

These references belong to the version-matched guide above. Read only the documents named by its action gates.

<!-- bundled-reference: references/coordinator-loop.md -->

## Coordinator loop

Load this reference for expanded DAG waves, per-invocation launch preferences,
same-terminal reuse, or review ownership. The compact guide remains the source
of truth for the loop order and completion boundary.

## Ready waves

Create independent Tasks before the first wait. Encode only real dependencies,
then use the ready view as external memory:

```text
ORCA orchestration task-create --spec "<dependent work>" --deps <json_array> --json
ORCA orchestration task-list --ready --brief --json
```

`--brief` collapses whitespace and caps echoed specs at 160 characters;
`spec_truncated` identifies shortened rows. Omit it when full specs are needed or
when an older CLI rejects the flag. A nested worker must respect
`nested_worker_depth_exceeded`; creating another Run does not reset depth.
Helpers a worker starts appear in this Run's `worker-list` with their
`creatorDispatchId`, and report to that worker rather than to you.

## Launch preferences

For a fresh Claude, Codex, Cursor, Antigravity, or Muse terminal, `--model`
accepts an opaque provider model ID. Pass it only when the user named a model;
otherwise omit it so the worker inherits the user's configured agent default.
Add `--effort` only when that model supports it:

```text
ORCA orchestration worker-start --task <task_id> --worktree current --agent claude --model opus --effort high --json
ORCA orchestration worker-start --task <task_id> --worktree current --agent muse --model muse-spark-1.3 --json
```

OpenCode also accepts `--model` in an existing worktree when the execution host
verifies its CLI version and model availability. Creating a new worktree with an
OpenCode model override is unsupported; use `--worktree current` or an existing
worktree selector, or omit `--model`. OpenCode effort is unsupported. Omit the
model to inherit its configuration; unsupported or unknown hosts refuse the
override explicitly.

`--effort` requires `--model`; neither option combines with `--terminal`. A
connected worker server must advertise launch-preference support before Orca
forwards either field. Compare `launch.requested` with `launch.effective`; never
claim a model or effort from requested arguments alone.

## Reuse after settlement

Choose the terminal's next owner before acknowledging the Delivery. When the
same exact agent has immediate follow-up work, recover the proven handle and
transfer cleanup ownership to the new Dispatch:

```text
ORCA orchestration worker-show --dispatch <dispatch_id> --json
ORCA orchestration worker-start --task <next_task_id> --terminal <agent_terminal_handle> --json
```

Otherwise explicitly retain or release the settled worker. Do not leave it live
only to inspect output; archived output remains available through `worker-read`.

## Review ownership

A review-only `worker_done` authorizes synthesis of findings, not coordinator
file edits. Dispatch or hand off fixes unless the user explicitly assigned them
to the coordinator. If the user's plan names a next owner, post-review fixes and
PR preparation remain with that owner; the coordinator routes and synthesizes.

<!-- bundled-reference: references/legacy-contract-migration.md -->

## Legacy contract migration

Load this reference only for an authority label, adopted Run, compatibility or
recovery receipt, or explicit legacy takeover. A newly created attempt always
uses the current grammar.

## Authority labels

- `[LEGACY COMPATIBILITY]` is live and attested. Run only the exact supported
  command printed with the message, using the same selected executable and
  arguments supplied by the original prompt.
- `[LEGACY RECOVERY REPLAY ÔÇö MAY HAVE BEEN SEEN]` is one bounded,
  at-least-once cutover replay. Process it idempotently and acknowledge only
  through the exact displayed guidance.
- `[LEGACY READ-ONLY]` is inspection-only. It has no reply, acknowledgment, or
  lifecycle mutation.
- An unlabeled current message uses the current guide and grammar.

An explicitly selected current Run, attested current binding, current Dispatch,
or federated attachment takes precedence over legacy fallback. A retained
adoption record alone does not grant mutation authority. If liveness, principal
ownership, capability, or the exact legacy contract is unproven, degrade to
read-only inspection and never fall back to local execution.

Adoption preserves the live agent process, PTY/session, terminal handle,
tab/pane, worktree or folder workspace, Task, and Dispatch. It never restarts or
replaces the worker and never revives the retired scheduler. Loss of lifecycle
authority does not invalidate the existing process, assignment, or filesystem
work. Exact recovery may restore the same PTY once in its original inactive
background tab; it must not spawn, write, signal, stop, switch, focus, split, or
inject a terminal.

## Compatibility recovery

When a compatibility response returns structured next-step arguments, execute
those exact arguments with the same selected CLI executable. Do not translate
from memory, broaden the recipient, or retry as a current mutation unless the
receipt explicitly authorizes it.

A pending ask, reply, final Dispatch settlement, and consuming check have
durable recovery identities. Heartbeat and escalation remain at-least-once
across a manual contract-boundary retry. If an ask may already have been
answered, run the exact non-consuming recovery check printed by Orca before
creating any new question. Never guess among identical question threads.

On packaged Windows, a legacy ask uses a two-step commit/resume protocol. The
initial command commits the question, prints its exact
`ask --resume <message_id>` command, and exits with launcher status `75`. Run
that exact resume after the launcher or update boundary. For an attested WSL
launch, preserve the printed `orca-ide` executable and distro route. Older WSL
workers without launch proof remain lifecycle read-only even while their
terminal and filesystem work continue.

## Read-only inspection and takeover

Read-only inspection does not consume mail:

```text
ORCA orchestration run-list --json
ORCA orchestration run-show --id run_legacy_local --json
ORCA orchestration run-show --id <adopted_run_id> --json
ORCA orchestration task-list --run <adopted_run_id> --json
ORCA orchestration inbox --full --json
ORCA orchestration check --terminal <legacy_handle> --peek --format --json
ORCA terminal read --terminal <legacy_handle> --json
ORCA terminal wait --terminal <legacy_handle> --for tui-idle --timeout-ms 60000 --json
```

`run_legacy_local` is an empty audit tombstone after adoption. Find the ordinary
Run whose objective is `Recovered orchestration work from a contract update`.

Only when the original coordinator is unavailable or cannot prove retained
authority may a new live coordinator take over from its own terminal:

```text
ORCA orchestration run-use --id <adopted_run_id> --takeover-legacy --json
ORCA orchestration check --run <adopted_run_id> --json
```

Takeover binds the authenticated invoking terminal; `--from` cannot nominate
another coordinator. It fences only the old coordinator and moves pending mail
into current Run delivery. It preserves live workers, Tasks, Dispatches, processes, and files.
Never take over while the original coordinator is actively coordinating.

Do not launch a replacement editor merely because Orca updated or authority is
unclear. Keep the original worker as the only editor until a stable handoff
point, then use a fresh current Dispatch in a conflict-free placement.

<!-- bundled-reference: references/low-level-topology.md -->

## Low-level topology

Load this reference only when `worker-start` cannot express required custom argv
or terminal topology. It is not the normal supervised loop and is never a full
handoff recipe. A model or effort is not custom argv: `worker-start --model
--effort` carries them and keeps the user's Chat UI setting.

```text
ORCA terminal create --worktree active --title <task_name> --command "<agent_command>" --json
ORCA terminal wait --terminal <handle> --for tui-idle --timeout-ms 60000 --json
ORCA orchestration dispatch --task <task_id> --to <handle> --inject --json
```

Wait for readiness only when startup could lose injected input. Prefer
agent-first `worker-start` whenever its argv and topology are sufficient.

`dispatch --inject` creates authoritative Task/Dispatch context but deliberately
keeps an operator-created process unsupervised: it creates no supervised worker
resource row. `worker-show`, `worker-read`, and `worker-list` report the lane as
`unsupervised`; `worker-stop` and `worker-abandon` do not close that process, and
settled retain/release take no process action.

Use `worker-start --terminal <handle>` when lifecycle ownership of an existing
agent terminal is required. Never imply that low-level dispatch retroactively
owns a process, never use it to route around the nested-depth limit, and never
use it for an ownership handoff.

<!-- bundled-reference: references/messaging-and-gates.md -->

## Messaging and gates

Load this reference for inbox replay, attempt-specific guidance, group
addresses, blocking questions, or coordinator-managed DAG decisions.

A successful `send` proves durable enqueue. Wake and nudge are best-effort
attention only: neither proves the recipient read the message, began a turn, or
accepted steering.

## Coordinator delivery loop

`check` names its caller with `--terminal <handle>` and is the only verb that
rejects `--from`. Omit `--terminal` inside an Orca terminal, where Orca resolves
the caller; pass it explicitly from anywhere else, including a dispatched
worker reading coordinator follow-ups.

A consuming coordinator `check` returns the bound Run's oldest FIFO Delivery,
up to 50 messages, and replays that exact batch until acknowledged or all its
messages are marked read. Concurrent waits on one Run inbox are allowed; they
share the outstanding batch and reserve nothing, and acknowledging the same
Delivery twice is a no-op. Process every row and required terminal ownership
decision before `--ack`. Type filters decide when a waiter wakes; they do not
authorize skipping older actionable mail. A Delivery therefore always carries
the whole FIFO batch whatever its types, and a `check` without `--wait` hands
that batch over unfiltered.
`--peek` and `--all` are read-only inspection, not progress through the
coordinator inbox.

An empty wait or timeout is a checkpoint. Continue rolling waits until every
expected Dispatch settles. Heartbeat or visible activity means alive, not done.

## Addresses

Use a stable Dispatch address for attempt-specific coordinator guidance:

```text
ORCA orchestration send --to dispatch:<dispatch_id> --subject "Follow-up" --body "<guidance>" --json
```

Do not substitute a remote terminal handle. Omit `--from` for ordinary
coordinator calls; a dispatched worker instead copies the exact `--from` and
other arguments in its preamble. `check` is the exception: it identifies
its caller with `--terminal`, never `--from`.

Group addresses include `@all`, `@idle`, `@claude`, `@codex`, `@opencode`,
`@gemini`, `@droid`, `@grok`, `@cursor`, and `@worktree:<id>`. Every group but
`@worktree:<id>` means the live Dispatches of the sender's own Run. Mail goes
to each `dispatch:<id>` mailbox, except a worker coordinating a child Run
receives it in that `run:<id>` mailbox. A sender bound to no Run is refused;
`--run` must match the group audience and never grants membership.
A Run group excludes its owning coordinator; a worker raising a blocker sends
to `run:<id>`. A worker that created its own Run addresses that Run's workers,
not its siblings. `@worktree:<id>` reaches matching workspace terminals,
including coordinators. Use groups only for intentional fan-out status or
questions. `worker_done`, heartbeat, and other
Dispatch lifecycle messages never target groups.

## Questions and gates

A worker uses `ask`; its timeout leaves one durable question pending, which the
worker resumes by message ID. The coordinator answers that message with `reply`;
a helper's question goes to the worker that started it, which answers it the
same way.

Use a gate only for a coordinator-owned Task-DAG decision:

```text
ORCA orchestration gate-create --task <task_id> --question "<decision>" --options <json_array> --json
ORCA orchestration gate-resolve --id <gate_id> --resolution "<choice>" --json
ORCA orchestration gate-list --task <task_id> --json
```

Pass `json_array` using the quoting rules of the active shell; do not copy POSIX
single-quote syntax into PowerShell or `cmd.exe`.

Do not create a gate merely to answer a worker's `ask`.

## Referencia Adicional

Consultar [placement-and-remote.md](references/placement-and-remote.md) para detalles sobre colocación y ejecución remota.
