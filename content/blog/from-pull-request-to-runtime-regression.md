---
title: "From a pull request to a reproduced runtime regression"
date: "2026-11-17"
author: "OsmoGrep"
category: "Runtime engineering"
excerpt: "Inside Catcher's context, investigation and sandbox loop: tracing a resource leak past green tests, challenging the hypothesis, and verifying the same experiment before and after repair."
cover: "/blog/runtime-regression-hero.png"
card: "/blog/runtime-regression-card.png"
---

A change can preserve the successful request and break what happens after a failed one. Existing tests stay green. A lease remains held. Later requests encounter a resource shortage that appears far from the original edit.

Finding that path requires more than reading a diff or running the current suite. The reviewer needs the intended contract, the changed control flow, its consumers, and an experiment that can distinguish the old behavior from the new one.

This article follows that process through OsmoGrep Catcher: the TypeScript engine used by the cloud review workflow. A controlled public PR produced a generated test that passed on the base, failed on the candidate, and passed after repair. We will examine what that establishes, where the computation went, and which broader predictions remain unverified.

The case is deliberately constructed, not an untouched open-source benchmark. Its [public PR](https://github.com/kaushal07wick/osmogrep-mcp/pull/11), [usage summary](/data/catcher-acceptance.json), and [sanitized experiment artifacts](/blog/runtime-regression-evidence.json) let readers inspect the evidence behind the result.

## One change, a delayed failure

The fixture wraps a task in a resource lease. Acquiring the lease marks a slot as occupied; releasing it makes that capacity available again. The candidate implementation performed cleanup only after the task succeeded:

```js
export async function runWithLease(pool, task) {
  const release = pool.acquire();
  const result = await task();
  release();
  return result;
}
```

The success path is straightforward. The failure path leaves `await task()` by rejection before reaching `release()`. If the caller uses a finite pool, repeated failures can consume capacity that later work needs. That last consequence depends on the real pool's capacity and acquisition policy; it is a causal prediction, not a measured production outage.

The independent requirement already existed in the base revision: rejected tasks must preserve their error and release the lease before their returned promise settles. Successful tasks must preserve their return value. That contract rules out superficial fixes such as swallowing errors or avoiding acquisition. [Base contract](https://github.com/kaushal07wick/osmogrep-mcp/blob/8f8d9d66bc678c9a9683f7fee38a6b71c467968f/README.md).

The three existing resource tests exercised successful results, successful cleanup, and sequential successful reuse. All three passed on the buggy candidate. The missing case was a task rejection. This is why “the tests passed” and “the changed behavior was tested” are different statements.

<!-- runtime-figure:causal -->

## Capture a revision before building context

Catcher starts with a captured PR: repository identity, PR number, base SHA, candidate SHA, and changed files. Later source reads are bound to those revisions. A moving branch name cannot quietly substitute different code halfway through an investigation.

Before model analysis, deterministic screening decides whether work is justified. Empty complete diffs can skip. Prose-only edits can skip only in server-declared documentation paths known to be non-executable and unreferenced. A `.md` suffix alone is insufficient: documentation can contain executable examples, setup instructions, or inputs consumed by a build. Configuration, dependency changes, incomplete patches, and unknown dependencies retain uncertainty.

For a change that proceeds, the initial context packet assembles bounded evidence rather than copying the repository into a prompt:

| Context | What it helps establish | What it cannot establish alone |
| --- | --- | --- |
| Base-revision purpose and contracts | The behavior the project intends to preserve | That every statement describes actual deployment behavior |
| Changed source at base and candidate | Which control flow or representation changed | The behavior of an unseen consumer |
| Related existing tests | Existing checks and missing cases | Complete behavioral coverage |
| Manifests and runtime recipe | Dependencies and intended execution commands | That services are ready or installation will succeed |
| Conventions and relevant imports | Local coding style and nearby dependencies | A complete semantic call graph |

Each source record retains its revision, path, content hash, available Git blob identity, role, and redaction or excerpt status. A content-derived packet identifier binds the collection. Missing consumers, unresolved imports, partial parses, and exhausted context limits remain recorded gaps.

The initial defaults are **12 source records, 24 attempted reads, and 96,000 source bytes**. The subsequent investigation has a separate allowance of **24 reads and 480,000 source bytes**. These are limits on retrieval stages, not a promise that every repository fits or a count of the eventual model input. Repeated prompt context also contributes to billed input.

## Make the investigation produce a handoff

A long instruction to “look for future bugs” is difficult to audit. Catcher instead records three ordered investigation stages: **map → hypothesize → decide**.

The map describes the intended change, relevant producers and consumers, and behavior that must remain true. It cannot contain hypotheses yet. The hypothesis stage then proposes at most three concrete concerns, each with inspected evidence, triggering conditions, counterevidence, and an observation that could disprove it. The final decision retains a disposition for every earlier hypothesis, including concerns that were disproved or blocked.

The read-only tools can find paths, search selected files, and read explicit base or candidate source ranges. Source searches report their scope; searching five files cannot be represented as searching the entire repository. This investigation cannot execute code or edit the checkout.

The state transitions and evidence references are checked by code. A proposed execution-ready regression needs inspected evidence from both captured revisions. Quoted evidence must match a source that was actually read. These checks limit unsupported handoffs; they do not establish that the model has understood the repository correctly.

For the lease case, a useful handoff connects four facts: acquisition precedes the task, cleanup follows the successful `await`, a rejection bypasses that cleanup, and the original contract requires cleanup on rejection. “Resource handling may be unreliable” would not identify a testable failure.

## Give an advisor a narrower job

The investigator and an advisor have different assignments. The investigator traces behavior. When the assessment contains a finding or a runtime-sensitive signal, the source advisor challenges the claim, reads the relevant guard or consumer, and checks whether the contract supports the expectation. It must retain a disposition for previous hypothesis IDs instead of silently replacing inconvenient claims.

A separate experiment advisor checks the proposed reproducer. Does it execute real relevant code? Is the old consumer genuine? Are required services available? Is it asserting behavior, or merely searching for a string in the implementation? Could an import failure be mistaken for the predicted regression?

In the recorded run, investigation, experiment construction, and repair used **GPT-5.2**. The two advisor requests used **GPT-5.4-mini**. Model selection is configurable. Using another model for a bounded challenge can reduce the work assigned to the larger model, but this case does not measure savings against a single-model control.

Agreement between two models remains source-level reasoning. Both can share a mistaken assumption. The experiment and its independently justified expectation carry the runtime evidence.

## Choose an oracle before a repair

An oracle states what the experiment should observe and why that expectation is legitimate. It must come from the preserved behavior, not from whichever patch the agent would prefer to write.

For this case, the generated plan identified the rejection path and used the base contract as its oracle. The platform retained the contract's base revision, source hash, and matching source quote. The generated test imported the actual `runWithLease` implementation and supplied a small observable pool boundary.

| Plan field | Recorded meaning |
| --- | --- |
| Trigger | The task rejects with a particular error object |
| Expected error behavior | The returned promise rejects with that same object |
| Expected resource behavior | The active lease count returns to zero after rejection settles |
| Observable failure | The active count remains one |
| Counterevidence | The rejection releases the lease and preserves the error |
| Scope | Resource lifecycle in the imported function; no real database or production pool |

The pool boundary was simulated; the function under review was real. That distinction matters. The experiment can establish the cleanup regression without claiming to have load-tested a database, measured queue latency, or observed eventual exhaustion in production.

## The same experiment at three revisions

Catcher first ran the configured original suite, then the identical generated test on base and candidate. Repair followed the captured comparison. The generated test remained frozen while the agent changed candidate source.

The recorded command was:

```sh
node --test .osmogrep-catcher/reproducer.mjs
```

All three observations carry the same generated-source SHA-256: `e92bee2c6108d626ec4ca4152bca8498bf8422f8046b688b1e5091f047126680`. Comparing identical bytes matters: a candidate-only assertion and a different base assertion would not form a differential experiment.

| Captured version | Generated test | Original configured suite | Targeted observation duration |
| --- | --- | --- | --- |
| Base `8f8d9d6` | Pass, exit 0 | Passed; original tests unchanged | 285 ms |
| Candidate `d19fff2` | Assertion failure, exit 1 | Passed; original tests unchanged | 237 ms |
| Candidate plus proposed repair | Pass, exit 0 | Passed; original tests unchanged | 223 ms |

These durations cover the targeted execution and its subsequent integrity checks. They exclude original-suite execution, most of the worker lifecycle, model requests, provisioning, and dependency installation. The repair is an exported patch against the captured candidate, not a claim that a repair commit was merged.

The candidate's actual Node test output included:

```text
not ok 1 - OSMOGREP_REGRESSION: rejecting task releases lease and propagates error
    OSMOGREP_REGRESSION: lease was not released after task rejection
    1 !== 0
  code: 'ERR_ASSERTION'
  expected: 0
  actual: 1
```

This is a selected excerpt; the [published artifact](/blog/runtime-regression-evidence.json) contains the generated test and complete recorded TAP outputs. A dependency download failure or a missing import would have a different meaning from this behavioral assertion failure.

<!-- runtime-figure:experiment -->

## Repair the observed path and preserve the checks

The proposed correction moved cleanup into `finally` while retaining the awaited task's result or rejection. This is the exact source patch exported by the run:

```diff
 export async function runWithLease(pool, task) {
   const release = pool.acquire();
-  const result = await task();
-  release();
-  return result;
+  try {
+    return await task();
+  } finally {
+    release();
+  }
 }
```

Keeping `await` inside `try` is significant. Returning the task's promise without awaiting it would execute `finally` before the asynchronous task settles, changing the lease lifetime. The generated rejection check passed after the patch, and the existing success cases still passed.

The evidence supports this specific repair under the fixture's contract and environment. It does not exhaust behavior if `release()` itself throws, cancellation has additional semantics, or the real resource boundary has a different contract. Those are separate expectations to investigate when relevant, not automatic findings.

## From one changed function to neighboring behavior

The same reasoning pattern applies when one PR changes behavior consumed elsewhere. A writer can produce a new record format while an older worker still reads the previous format. Running base with base and candidate with candidate can pass while the mixed-version deployment fails.

Catcher's experiment format can carry up to **four inspected baseline source files** as immutable fixtures. The platform fetches the pinned base bytes and supplies identical copies to each experiment. That enables a test to exercise an actual older consumer against the candidate producer instead of asking the model to invent the older implementation. It does not automatically provide the external services that consumer requires.

The persistent graph currently stores captured syntax relationships: **`IMPORTS` and `DEFINES`**. Its impact query traverses a bounded import neighborhood up to two hops, with a final path limit of 100. It can retrieve related recorded outcomes and preserve revision identity. It is not a complete call graph, a production resource map, or proof that two services share a live database.

Explicit PR-pair analysis uses captured shared dependencies to decide whether a combined experiment is justified. An unrelated captured neighborhood can be deferred. This is not an autonomous sweep across all open PR combinations. Incomplete graph coverage can miss a real relationship, so a missing edge does not certify independence.

An issue can contribute a symptom, requirement, or intended goal to this investigation. The hosted intake described here still requires a PR number and head SHA. Standalone issue-to-cloud investigation is not implemented.

## Where the compute went

The controlled run used the deployed API, on-demand worker, OpenAI requests, E2B execution, and production job persistence. Worker start to finish took **108.604 seconds**. Two target VMs were recorded and both had cleanup confirmed. The repaired candidate reused its target VM; three observations do not imply three separate VMs.

| Recorded metric | Result |
| --- | --- |
| Model requests | 10 |
| Input tokens | 68,233 |
| Output tokens | 2,640 |
| Total reported tokens | 70,873 |
| Cached input tokens | 37,760, already included in input |
| Target VMs | 2; cleanup confirmed for both |
| Generated experiments | One test, observed at base, candidate and repair |

The distribution helps identify optimization work. Repair consumed **42,500 tokens**, about **60%** of the reported total. Investigation used 11,477; the source advisor 6,486; experiment construction 5,549; and the experiment advisor 4,861. These totals include input and output, not just generated text. They do not establish that advisors reduce total cost or that this latency applies to larger repositories. [Recorded usage](/data/catcher-acceptance.json).

<!-- runtime-figure:compute -->

The engine's default shared ledger allows **10 model requests per captured base/head pair**, scoped to the owner, repository, and PR, with input and output ceilings. Replacing a job identifier does not reset that allowance. Before a request, it reserves a conservative input charge based on request bytes plus framing and the requested output limit; reported usage settles the reservation. Unknown usage remains reserved instead of being treated as free.

A standalone job has a **15-minute** engine limit and a maximum of **three target sandboxes**. Stage-specific limits remain subordinate to the shared ledger. Separate limits apply to explicit interactions and retries. These are execution bounds, not a guarantee of successful analysis within them.

## Keep the observation separate from the explanation

The model supplies a hypothesis and a narrative. The execution path supplies commands, exit codes, logs, revision bindings, generated-source hashes, environment evidence, original-suite outcomes, and the proposed patch. Reviewers need both, with their origins visible.

| Outcome | Evidence that supports it | What must remain unclaimed |
| --- | --- | --- |
| Predicted | A specific source-backed causal concern | A runtime failure has occurred |
| Reproduced | Valid base pass and candidate behavioral failure under the same experiment | Every deployment will fail |
| Repair verified | The frozen experiment and required original checks pass after the patch | Exhaustive correctness or automatic merge approval |
| Not reproduced | The executed workload did not expose the concern | The concern is impossible under other conditions |
| Inconclusive or blocked | Missing oracle, setup, scope, integrity, or usable execution evidence | A confirmed bug or a clean bill of health |

Stored graph facts, hypotheses, and observed outcomes retain different evidence classifications. History can point a later investigation toward an earlier failure; it does not turn that old result into proof for a new version. The Rust terminal agent remains a separate general coding application. Cloud Catcher does not insert this investigation into every ordinary terminal coding turn.

The public artifacts in this article were selected from a public fixture with private-repository, private-context, and chat-memory flags all false. Raw job reports can contain proprietary source and logs; they are not suitable public blog attachments by default.

## What the earlier two-repository pilot exposed

Before this controlled acceptance, a separate pilot examined selected historical cases in Firecrawl and Langfuse. It produced **zero verified fixes**. That result is useful engineering evidence precisely because passing unrelated tests would have made a misleading success story.

| Pilot case | Observed result | What it exposed |
| --- | --- | --- |
| Firecrawl | Two unverified source findings; 22 existing utility tests passed; no regression experiment completed | Insufficient behavioral context and service setup; passing utilities did not test the selected routing regression |
| Langfuse | The selected historical issue was missed; Prisma engine download failed during runtime setup; the integrity guard stopped the run before tests | Missing compatibility context and an incomplete execution environment |

The pilot used 7 model calls and 112,335 reported tokens across its recorded jobs. Those figures describe that pilot, not the later lease fixture. The cases, environments, and implementations differ, so their token totals are not a controlled before-and-after efficiency comparison. No completed competitor review was available, and no comparative win follows from these runs.

The current staged investigation explicitly asks for consumers, state lifetimes, counterevidence, and mixed-version behavior. Its advisors challenge the source claim and the test mechanics. The lease acceptance exercises that wiring. The two historical cases still need successful, repeated reruns before claiming those gaps are solved.

## A prediction becomes useful when it can be challenged

Proactive regression analysis starts before an incident, but its claims should remain tied to observable behavior. In this case, the source suggested a lease leak, the base contract supplied the expectation, and a generated rejection test distinguished the candidate from the base. The repair restored that expectation while the original checks stayed intact.

For a new PR, the useful output is the same chain: captured revisions, relevant context and gaps, a falsifiable causal hypothesis, an independently justified expectation, an isolated experiment, and a scoped result. A missing experiment or failed setup belongs in that result as clearly as a passing repair.

The next evaluation needs varied regressions, safe changes, repeated runs, and meaningful negative controls. Until those exist, one verified resource-lifecycle case establishes one working evidence path—not general detection accuracy.

## Sources and experiment artifacts

- [Controlled public PR and bot result](https://github.com/kaushal07wick/osmogrep-mcp/pull/11): the intentionally faulty change and proposed repair; no merge requested.
- [Pinned base contract](https://github.com/kaushal07wick/osmogrep-mcp/blob/8f8d9d66bc678c9a9683f7fee38a6b71c467968f/README.md): behavioral expectation available before the candidate and repair.
- [Acceptance usage and lifecycle summary](/data/catcher-acceptance.json): reported token totals, stage allocation, observations and cleanup status.
- [Sanitized experiment artifacts](/blog/runtime-regression-evidence.json): generated source, immutable identities, commands, actual outputs and exported patch.
- [Engine architecture](/docs/architecture) and [evidence guide](/docs/evidence): current product boundaries and verification terminology.

Implementation details were checked against the web Catcher source on November 17, 2026. The recorded acceptance identifies engine build `a04485bfeba745d99caef89bd6a6b5a70e2ce78d`; implementation inspection is not a rerun of every supported workflow.
