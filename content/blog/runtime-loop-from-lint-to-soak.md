---
title: "Runtime bug detection with OsmoGrep: a verified repair"
date: "2026-11-13"
updated: "2026-11-14"
author: "OsmoGrep"
excerpt: "What a controlled sandbox trial proved, why the original tests missed the bug, and the next steps toward runtime verification in your terminal and GitHub PR."
cover: "/opengraph-image"
---

OsmoGrep is being built to help developers investigate a code change, reproduce a specific failure, and inspect a proposed repair with executable evidence. Its local MCP workflow already connects coding agents to isolated sandbox VMs. The web console provides GitHub sign-in, repository selection, and a place for review history. Connecting the complete verification loop to hosted pull requests is the next major step.

In a controlled local trial, the agent found a URL-restore regression that the original test suite missed. It wrote a new behavioral check, observed that check pass on the base and fail on the changed code, repaired the source, and replayed the same check in fresh sandboxes.

That is an early engineering milestone. It gives us a concrete behavior to explain, a result to inspect, and a clear list of work still ahead.

## Why a green test suite can miss a runtime bug

A test suite checks the cases its authors wrote. Passing those cases does not establish that an untested behavior is correct. Source review can suggest where to look; running a focused check can show whether the suspected behavior actually happens in that environment.

The useful question is specific: **does this change break an intended behavior that the existing tests do not exercise?**

For this trial, that behavior was restoring saved browser tabs from a JSON backup. An exact duplicate should be skipped. A different full URL should be restored, even when it belongs to the same website.

- An existing tab is already saved at `https://example.com/docs/start`.
- The backup contains that exact duplicate, plus three distinct URLs with a different path, query string, or fragment.
- A correct restore adds three tabs and skips one duplicate.
- Restoring that backup a second time should add nothing.

The working change compared URL origins instead of complete URLs. As a result, all four incoming entries appeared to be duplicates. The restore silently discarded the three distinct pages.

## What the sandbox trial actually found

The original suite passed on the base and working snapshots. Its checks did not cover this restore case. The newly written reproducer exposed the difference before the source was repaired.

![Observed restore behavior: the base and fixed versions each added three distinct URLs; the working regression added zero. Expected result: three new URLs.](/blog/restore-behavior.svg)

The important number is the missing three pages. It is an observable behavior with a precise expectation, rather than a subjective code-quality score.

| Check | Base snapshot | Working change | Repaired snapshot |
| --- | --- | --- | --- |
| Original test suite | Passed | Passed | Passed |
| Focused restore check | Passed | Failed | Passed |
| New URLs added by restore | 3 | 0 | 3 |
| Incoming entries skipped | 1 | 4 | 1 |
| Original tests and recipe | Unchanged | Unchanged | Unchanged |

**Method:** one controlled regression in a personal browser-tab project, using browser API stubs inside local Lima VMs. The original command was `node test_run.js`; the focused check was `node repro_restore_urls.js`. The same reproducer bytes and command were used across versions. This was not a full browser-extension end-to-end test or a benchmark across repositories.

## How we moved from a concern to a verified repair

A useful verification loop needs more than a model finding something suspicious. It needs a behavioral question, a controlled comparison, and a way for another developer to inspect what happened.

![Local verification workflow: capture base and changed snapshots, run an identical reproducer, repair the source without weakening the test, and replay the exported versions.](/blog/verification-workflow.svg)

1. **Capture the change.** The agent received the uncommitted source change, without a prepared diagnosis or patch. Separate workspaces preserved the base and candidate snapshots.
2. **Ask a behavioral question.** The reproducer asserted that distinct full URLs survive restoration and exact duplicates do not multiply.
3. **Compare before repairing.** The identical check passed on the base and failed on the candidate. That comparison tied this observed failure to the change.
4. **Repair the source.** The fix restored full-URL matching. The reproducer, original tests, and test recipe stayed unchanged.
5. **Save and replay the evidence.** The export retained the patch, snapshots, commands, results, and replay inputs. The fresh local sandbox VMs reproduced the base-pass, working-fail, repaired-pass pattern.

> A verified repair is a scoped claim: the same meaningful check failed before the repair and passed afterward. It is not a certificate that the entire application is correct.

The saved replay commands took 292 ms for the base, 290 ms for the working regression, and 276 ms for the repaired version. Those are individual command durations after the replay environment was ready. They exclude VM provisioning, dependency installation, model work, and the rest of the investigation; they should not be read as an end-to-end speed benchmark.

The [sanitized trial data](/blog/runtime-trial.json) contains the counts, replay command durations, exit codes, and reproducer hash used for this article. The [replay guide](/docs/evidence#replay-an-export) explains how an exported verification bundle can be rerun with the local service.

## What OsmoGrep has built so far

The product has several working pieces, with different readiness levels. Keeping those differences visible is part of making the tool useful.

| Surface | What exists | Current boundary |
| --- | --- | --- |
| Local MCP and skill | Codex and Claude Code can use sandbox tools to investigate, reproduce, repair, and export a local verification | Requires the connector and local runtime service |
| Differential evidence | Base/candidate checks, an unchanged reproducer, original-test integrity, and replayable exports | Demonstrated on controlled local cases |
| Web console | GitHub sign-in, repository selection, review-history views, and activity charts | Hosted model and runtime execution still need configuration and acceptance checks |
| Hosted job backend | Persistent jobs, separate source/runtime workers, admission limits, progress events, and result storage | Infrastructure limits are separate from API and VM concurrency |
| GitHub delivery path | Implemented mention handling and result-publication code | Production App credentials and live delivery verification remain outstanding |
| Rust terminal application | A separate local coding agent and verification ledger | It is not the hosted execution worker |

The [MCP connector and skill are public](https://github.com/kaushal07wick/osmogrep-mcp), as is the [Rust application](https://github.com/kaushal07wick/OsmoGrep). Their setup instructions and current limits matter more than a broad claim that every workflow is already available.

## Where terminal work and pull requests should meet

Developers often discover and fix problems while still in a terminal. Reviewers encounter the same change later in a GitHub pull request. The evidence should survive that handoff.

Our goal is one investigation that can be understood from either place:

- **In the terminal:** ask a coding agent to reproduce a concrete concern before pushing. Keep the failing check and patch together.
- **In GitHub:** request an investigation on the relevant PR and receive the findings, verification result, and patch context there.
- **In the dashboard:** inspect the longer execution history when a short PR summary is not enough.

The dashboard should be available when it helps, rather than becoming another mandatory place to read the same answer. A PR comment should remain useful on its own.

Not every change needs a VM. Reading a diff, answering a source question, and reproducing a runtime behavior are different jobs. The hosted design keeps source review separate from explicitly requested execution, with its own time and resource limits.

## What we are building next

The immediate objective is to connect the demonstrated local proof loop to the cloud PR workflow, then validate it on real, varied repositories. These are goals, not a claim that they have shipped.

1. **Carry differential evidence into hosted jobs.** Preserve the base snapshot, unchanged reproducer, patch, and repaired result through the whole cloud execution.
2. **Close the GitHub loop.** Validate installation, scoped repository access, mention-triggered jobs, and result delivery end to end. Keep PR and dashboard views tied to the same recorded job.
3. **Improve environment setup.** Measure checkout, dependency installation, VM startup, and test execution separately. Optimize the slow stage after measuring it.
4. **Build a useful evaluation set.** Record real behavioral regressions, false positives, inconclusive runs, and environment failures. A detection-quality claim needs more than one successful example.
5. **Make the execution layer reusable.** Longer term, give the terminal agent and cloud investigations a dependable foundation for tools, isolation, traces, and replay. Broader harness features should grow from that foundation.

We also want to understand model latency and inference cost as part of the workflow. A fast answer is valuable when its evidence is inspectable; speed alone does not establish correctness.

## Questions developers ask about runtime verification

### Does OsmoGrep replace the existing tests?

No. The local workflow preserves the original suite and its recipe. A new reproducer checks a missing behavioral case; it does not justify weakening an existing assertion to make a patch pass.

### Does every pull request start a sandbox VM?

No. The architecture separates read-only source review from requested runtime execution. The complete hosted differential workflow is still being integrated and validated.

### Does a passing replay prove that production is safe?

No. It establishes the observed check against a captured snapshot in its recorded environment. Coverage gaps, external services, concurrency, deployment configuration, and other production conditions may need separate checks.

### Can I try the local workflow in Codex or Claude Code?

Yes, with the public MCP connector and a running local runtime service. The [coding-agent setup guide](/docs/coding-agents) explains the prerequisites. Hosted sign-in alone does not activate the model or sandbox workers.

## Inspect the work and follow the next steps

Start with the [trial data](/blog/runtime-trial.json), the [evidence contract](/docs/evidence), or the [MCP source and setup](https://github.com/kaushal07wick/osmogrep-mcp). The [architecture guide](/docs/architecture) explains the boundary between local verification and hosted jobs.

The milestone here is concrete: a behavioral regression the original tests missed was reproduced, repaired without weakening those tests, and preserved in replayable evidence. The next task is to make that experience dependable across the terminal, GitHub, and the web console.
