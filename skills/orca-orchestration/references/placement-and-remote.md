## Placement and remote execution

Load this reference before creating a new worktree or placing work through SSH,
WSL, or another connected Orca server.

## Placement choices

A fresh worker means a fresh agent terminal, not a new Git worktree. Use the
current or an exact existing workspace by default. Create a worktree only when
the user requested one or a concrete checkout or filesystem conflict makes
sharing unsafe.

```text
  # Current workspace; setup is not rerun.
ORCA orchestration worker-start --task <task_id> --worktree current --agent codex --json

  # Stacked child worktree.
ORCA orchestration worker-start --task <task_id> --worktree new-child --agent codex --setup run --json

  # Independent top-level worktree.
ORCA orchestration worker-start --task <task_id> --worktree new-top-level --agent codex --setup run --json
```

`--name` is optional: without it Orca picks a name as it does for an unnamed
workspace, and the start output names the workspace it created.

Current and exact existing workspaces create a fresh terminal unless
`--terminal` is explicit. Folder workspaces are first-class; do not invoke Git
or require worktree lineage when the selected workspace is a folder.

Register a folder workspace through project setup. `repo add --path <dir>`
requires a valid Git repository and rejects a plain directory:

```text
ORCA project setup-existing-folder --project <project_id> --host <host_id> --path <abs_path> --kind folder --json
```

Then place work on the returned workspace with an exact selector. A worktree
selector needs the full `<repo-id>::<path>` value Orca returned, passed as
`id:<newFullWorktreeId>`; a bare repo id is not a worktree id. `new-child` and
`new-top-level` are worktree creation and do not apply to a folder.

New worktrees use agent-first creation and run setup by default. Preserve the
repository's startup policy: `start-immediately` can report setup as `running`,
while `wait-for-setup` gates prompt delivery on success. Orca lineage, Git base,
filesystem isolation, coordination parentage, UI grouping, and execution host
are separate decisions.

## Connected servers

The Run and Tasks remain authoritative on the current server. `--on` selects
only the worker's execution server and appears only on `worker-start`:

```text
ORCA orchestration worker-start --task <task_id> --on <environment> --worktree new-top-level --repo <exact_remote_repo_selector> --name <name> --agent codex --setup run --json
```

Remote `current` and `new-child` are invalid because they are ambiguous across
servers. Use an exact discovered remote workspace, or `new-top-level` with an
exact remote repository selector. After start, route every follow-up, read,
stop, and cleanup by Dispatch ID; never repeat `--on` or substitute a remote
terminal handle.

```text
ORCA orchestration worker-show --dispatch <dispatch_id> --json
ORCA orchestration worker-read --dispatch <dispatch_id> --limit 50 --json
ORCA orchestration send --to dispatch:<dispatch_id> --subject "Follow-up" --body "<guidance>" --json
ORCA orchestration worker-list --run <run_id> --include-remote --json
```

`worker-list` reads local fleet state only; enumerate remote workers with
`--include-remote` or every one of them reads `unverifiable`. Scope every list
with `--run <run_id>`: unscoped, it reports every Dispatch this runtime has
recorded, and the workers you are waiting on are lost in that history.

## Execution-host and mixed-version floor

The execution host owns process, filesystem, transcript, stop, and cleanup
facts. Render only `live`, `unverifiable`, or `exited`. Connection loss, relay
absence, missing client inventory, or timeout yields `unverifiable`, never
synthetic exit and never a client-local substitute action.

Clients and servers update independently. Optional response fields may be
absent. Forward model/effort, transcript reads, cleanup, or another new remote
operation only when the peer advertises the relevant capability; unknown stream
opcodes can be silently dropped. A narrow unsupported response may degrade to a
documented older path, but must not broaden the target or cross the execution
boundary. Changing host-published content reaches old clients even without a
wire-shape change, so preserve established semantics or negotiate the behavior.

For WSL, use the exact executable and arguments returned by Orca so the distro
and packaged launcher remain bound. Do not translate a printed `orca-ide`
recovery command into a PATH-resolved local command.

<!-- bundled-reference: references/recovery-and-cleanup.md -->

## Recovery and cleanup

Load this reference only after a failed/stopped/unknown attempt, explicit retry
decision, stop/abandon request, retention request, or uncertain release.

| Proven state            | Safe action                                                        |
| ----------------------- | ------------------------------------------------------------------ |
| `ready` or active       | Keep waiting; optionally read bounded output                       |
| `failed` or `stopped`   | Start a replacement with `--retry-of`; repeat placement explicitly |
| `outcome_unknown`       | Inspect, then choose `worker-stop` or explicit `worker-abandon`    |
| Accepted `worker_done`  | Reuse, retain, or release                                          |
| Remote contact lost     | Preserve `unverifiable`; do not stop or retry from absence alone   |
| `unverifiable` liveness | Keep waiting or inspect; never stop, abandon, retry, or release    |
| Proven `exited` agent   | Enumerate with `worker-list`; follow its `nextAction`              |

## Inspect before acting

```text
ORCA orchestration worker-list --run <run_id> --json
ORCA orchestration worker-list --run <run_id> --include-remote --json
ORCA orchestration worker-show --dispatch <dispatch_id> --json
ORCA orchestration worker-read --dispatch <dispatch_id> --limit 50 --json
```

`worker-list` is the enumerating command and the authority on agent liveness:
each row carries `projection.liveness`, `projection.attention.categories`,
`projection.attention.requiresAction`, and a literal `projection.nextAction`
argv to run. Always scope it with `--run <run_id>`; an unscoped list reports
every Dispatch this runtime has ever recorded and buries the live ones.
`worker-show`'s `observation.status` is PTY liveness only, so a `live` terminal
whose agent died at a trust prompt still reads `live` there.

When the two disagree, the fleet verdict decides ÔÇö unless the fleet row is
`unverifiable` for a reason that names a gap on this client rather than a fact
about the worker. `missing_status`, `host_unavailable`, and
`capability_unsupported` are such gaps: the first means this runtime holds no
status row, the second that it could not ask the execution host at all, and the
third that a stale peer answered but lacks the fleet-snapshot capability.
Against any of them, a `worker-show` verdict sourced from the execution host is
the better evidence and outranks the row. Only `host_unavailable` is contact
loss; the other two mean the host was never asked or answered without the
capability.

This never promotes absence. `unverifiable` from either command still authorizes
nothing ÔÇö only a positive `live` or `exited` verdict does.

A worker started with `--on <environment>` reads `unverifiable` until you
enumerate with `--include-remote`, which asks its execution host for the
verdict. Rows come newest first and past 100 the response pages, so follow
`page.nextCursor` with `--cursor <value>` until `page.hasMore` is false.

## Stall needs positive evidence

Leave the wait only on positive proof the agent stopped: `exited` liveness, the
worker's own observation of process exit, or a transcript whose final agent turn
sent no `worker_done`. Only then choose `worker-stop` or `worker-abandon`.

`unverifiable` is always absence ÔÇö `missing_status`, `stale_status`,
`restored_unconfirmed`, or a remote worker with no connection ÔÇö and a null
`agentWait` or an unchanged `worker-read` tail is that same absence seen again.
Absence never authorizes stop, abandon, retry, or release: keep waiting, or
inspect until you hold one of the positive signals above. A `nextAction` that
names an inspecting command is asking for evidence, not for cleanup.

`worker-read --source auto` uses a proven provider transcript when available and
otherwise returns bounded terminal output with a typed `fallbackReason`.
Continue with its top-level cursor, which is pinned to that source. If Orca
reports `source_changed`, restart without the old cursor. A bounded initial
transcript tail can return an EOF cursor that follows only newly appended records;
read `contentComplete`, `clipping`, and `warnings` before assuming omitted older
records are pageable. Never guess a provider session ID, transcript path, or
remote terminal handle.

## Was the mutation applied?

When a mutation's response was lost and named no Dispatch, do not replay blind.
Every orchestration mutation accepts `--retry-request <id>`, which reuses one
operation identity so Orca can replay, join, or recover it instead of starting a
duplicate. Ask what happened first:

```text
ORCA orchestration request-show --request <request_id> --json
```

`completed` means the mutation already took effect; read its recorded receipt
instead of rerunning. `pending` means the original mutation is still running or
Orca restarted before recording its outcome; replay the original command with
`--retry-request <request_id>`. `absent` means this runtime holds no receipt
under your caller identity ÔÇö that is not proof nothing happened, so inspect the
affected Task, Dispatch, and terminal before deciding whether to retry.

When a worker's terminal accepted input but the submit is unconfirmed, use
`terminal send --wait-submit <seconds>`: it observes the accepted prompt for that
long and, on timeout, returns the input-accepted receipt without resending.

## Refused starts

`dispatch` and `worker-start` refuse the following preflight cases with a stable
`error.code`; read it before choosing a recovery, and treat `error.data.nextSteps`
as the exact recovery text. Older hosts may omit `data`, so treat every field as
optional.

| Code                 | Meaning                                                                                                               | Recovery                                                                                                                       |
| -------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `task_not_found`     | No Task with that id, or not in the bound Run (`data.taskId`, `data.runId`)                                           | Check `task-list --json`; create the Task with `task-create` if it does not exist                                              |
| `task_not_startable` | Task cannot start now: not `ready`, or invalid `--retry-of` (`data.status`, `data.unmetDependencies`, `data.retryOf`) | Wait for running dependencies with `check --wait`; retry or unblock failed ones; inspect `dispatch-show` if already dispatched |
| `inject_rejected`    | `--inject` refused because no recognized agent runs in the target (`data.terminal`, `data.reason`)                    | Start a recognized agent there or pick another terminal; or dispatch without `--inject` and use `terminal send`                |
| `runtime_error`      | Any other failure, including a target terminal that already owns an active Dispatch                                   | Read the message, inspect state, and do not retry unchanged                                                                    |

## Retry, stop, and abandon

Retry only a positively proven failed or stopped attempt. Name the failed Task
with `--task`, since `--spec` creates a new one. Placement is never silently
inherited:

```text
ORCA orchestration worker-start --task <task_id> --retry-of <dispatch_id> --worktree <explicit_placement> --agent <agent> --json
```

After three consecutive failures for one Task, its dispatch context
circuit-breaks and the Task is failed. Failed `worker-start` attempts count
across `--retry-of`; a worker's own `failed` report does not. `--retry-of` a
circuit-broken Dispatch is refused with `task_not_startable`: report the failure
to the user instead. Do not route around that boundary with a new Run, Task, or
unrelated Dispatch.

For `outcome_unknown`, inspect first, then make an explicit choice:

```text
ORCA orchestration worker-stop --dispatch <dispatch_id> --json
ORCA orchestration worker-abandon --dispatch <dispatch_id> --json
```

`worker-stop` closes only the exact proven supervised agent terminal. It never
deletes the worktree, setup terminal, configured tabs, or unrelated processes.
Its receipt's `processAction` reports what it did:

- `closed_agent_terminal`: Orca issued that close; do not follow it with
  `terminal close`.
- `none`: this call issued no close (for example, already settled or
  unsupervised).
- `unknown`: Orca could not attempt or confirm a close.

`stop_unknown` exits 1 and can still report `closed_agent_terminal` when the
agent's exit was not proven; inspect `worker-show` before acting further.

`worker-abandon` fences orchestration while accepting that resources may remain
live; it performs no remote, process, or filesystem action. When it settles a
worker, it retains an owned terminal by the same rule as `worker-retain`, so Orca
stops owing its release; a release already committed (`releasing`,
`release_unknown`) is left as it is. An already-settled worker is left untouched.

To cancel a Task, settle its worker with `worker-stop` or `worker-abandon`, then
record the reason. A cancelled Task is `failed`, so its dependents stay blocked
until a `--retry-of` replacement completes it:

```text
ORCA orchestration task-update --id <task_id> --status failed --result cancelled --json
```

## Retain and release

```text
ORCA orchestration worker-retain --dispatch <dispatch_id> --json
ORCA orchestration worker-release --dispatch <dispatch_id> --json
```

Retain only when the user explicitly wants the settled terminal kept live.
Release works after succeeded and failed reports, archives readable output, and
closes only the exact terminal owned by that settled Dispatch. Replays may call
release again safely. Reused, pre-existing, setup, coordinator, active,
user-taken-over, and unproven terminals are retained.

A `worker-start` that failed before its agent was ready still owns the terminal
it created. Its receipt names `worker-release`, and `worker-list` reports that
row as `reclaimable`; release it there rather than closing the terminal by hand.
A `--retry-of` replacement for a `failed` worker releases the terminal that
worker still owns the same way.

Never release because of timeout, TUI idle, heartbeat, status, question,
escalation, or stale/rejected completion. If the receipt says `release_pending`
or `release_unknown`, follow its exact recovery action. Never substitute
`terminal close`.

`orchestration reset` is destructive recovery. Do not run it during active
coordination unless the user explicitly abandons that state.

<!-- bundled-reference: references/worker-contract.md -->

## Worker contract

The injected preamble is authoritative. Copy its command rather than
reconstructing flags. In particular, preserve the exact executable, worker
handle, Task ID, and Dispatch ID, and keep any other flag it carries (an older
Orca host adds `--dispatch-capability`).

## Heartbeat

Send heartbeats only at the cadence required by the live preamble. Skip them
while blocked inside `ask` or `check --wait`; those calls are liveness signals.

```text
ORCA orchestration send --from <worker_handle> --type heartbeat --subject "alive" --task-id <task_id> --dispatch-id <dispatch_id> --phase "<investigating|implementing|reviewing|waiting>"
```

Use typed lifecycle flags, not a hand-written JSON payload. A heartbeat proves
liveness, never completion.

## Ask and resume

Use Orca `ask` whenever the coordinator must answer. Never open a local question
TUI the coordinator cannot answer.

```text
ORCA orchestration ask --from <worker_handle> --question "<question>" --options "<choice-a>,<choice-b>" --timeout-ms 600000

ORCA orchestration ask --from <worker_handle> --resume <message_id> --timeout-ms 600000
```

Each wait defaults to 600000 ms (10 minutes). `--timeout-ms` accepts a positive
integer up to 1800000 ms (30 minutes); larger values are rejected before creating
or resuming a question. For decisions that take longer, resume the same question
after each timeout.

A timeout or disconnect leaves the original question pending. Resume its
message ID; do not create a duplicate question.

## Reading coordinator follow-ups

The coordinator steers a running worker with `send --to dispatch:<id>`. That
enqueue is durable but does not interrupt you, so nothing arrives unless you
look:

```text
ORCA orchestration check --terminal <worker_handle> --json
```

Run it at each natural checkpoint ÔÇö before starting a new file, after a test
run ÔÇö and once more immediately before `worker_done`, so a redirect or a
cancellation lands before the Task settles. `check` names its caller with
`--terminal`, never `--from`. Stop checking after `worker_done`.

Process every message in the batch, then acknowledge it with the returned
`deliveryId`, which also reads the next batch; repeat until `count` is 0. An
unacknowledged batch replays and hides newer mail:

```text
ORCA orchestration check --terminal <worker_handle> --ack <delivery_id> --json
```

Do not use `run-use` to check your Dispatch's mail or bind the Run you work for.
You may resume a separate Run when your coordinator directs a handoff, but you
cannot use `--takeover-legacy`. Plain `check` returns your Dispatch's mail
unless you are coordinating a Run; report to your coordinator with `send`.

If a plain `check` (no `--run`) returns `consumer_fenced`, this process no longer owns its Dispatch:
the Attempt was re-attached to another worker or settled without you. Stop, do
not send `worker_done`, and do not retry the check. An empty `check` never means
you were replaced; `consumer_fenced` is the only way you learn that.
If `send` or `ask` returns `consumer_fenced`, the command ran from another
party's terminal (a coordinator or another worker); run it from your own terminal.

## Helper workers

When the preamble has a SUB-DISPATCH section, start helpers on your own
Dispatch's Run. Do not `run-create` or `run-use` for them.

```text
ORCA orchestration worker-start --from <worker_handle> --spec "<sub-task>" --worktree current --agent <agent> --json
ORCA orchestration reply --from <worker_handle> --id <message_id> --body "<answer>"
```

Their questions, escalations, and `worker_done` arrive in your own `check`, next
to your coordinator's mail. Answer their questions with `reply`, and wait for
every helper's `worker_done` before sending yours. After you settle, a helper
still running reports to your coordinator's Run.

## Escalation

Escalate only before completion and only when the coordinator must intervene:

```text
ORCA orchestration send --from <worker_handle> --type escalation --subject "Blocked: <reason>" --body "<details>" --task-id <task_id> --dispatch-id <dispatch_id>
```

## Completion

Send exactly one terminal report. `--body` is three sentences: what changed,
what was found, and what remains. Use `--outcome failed` when the requested work
is not complete; never hide failure in prose or silently exit.

Append `--files-modified` or `--report-path` only when applicable, using actual
paths. Do not send documentation placeholders as metadata.

```text
ORCA orchestration send --from <worker_handle> --type worker_done --subject "<short status>" --body "<three sentences: work, findings, remaining>" --task-id <task_id> --dispatch-id <dispatch_id> --outcome succeeded
```

After `worker_done`, end the dispatched turn and idle. Do not poll, close your
own terminal, or begin unrelated work. A later direct user instruction is new
user-owned work and must not reuse settled lifecycle IDs; a supervised follow-up
arrives with a fresh preamble and Task block.
