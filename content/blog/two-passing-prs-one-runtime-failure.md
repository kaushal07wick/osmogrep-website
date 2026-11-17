---
title: "Two passing PRs. One runtime failure."
date: "2026-11-17"
author: "OsmoGrep"
category: "Measured experiments"
excerpt: "A controlled cross-PR experiment: the same generated test passes on the base and each change alone, then fails on their combination. Revisions, logs, tokens and limitations included."
cover: "/blog/pr-interaction.svg"
---

A capacity change can be valid against today's worker count. A worker change can be valid against today's capacity. Reviewing those changes separately leaves a different question unanswered: what happens when both coexist?

We tested that question with two deliberately constructed PRs in a public repository. Catcher generated one experiment and executed the identical test on four revisions. It passed on the common base, passed on each PR independently, and failed on the combined revision.

This is a controlled interaction demonstration, not a representative benchmark or a discovery in a customer's production system. The [capacity PR](https://github.com/kaushal07wick/osmogrep-mcp/pull/6), [worker PR](https://github.com/kaushal07wick/osmogrep-mcp/pull/7) and [downloadable evidence](/data/pr-interaction.json) expose the inputs and recorded outcomes.

## The contract comes before the test

The fixture has a resource pool and a worker batch. Its base README requires `runBatch` to serve every configured worker immediately, without queueing. The pool's `acquireBatch` must reject requests above capacity. This deliberately strict contract makes incompatible configuration observable without simulating an entire database.

PR A lowers capacity. PR B increases worker concurrency. Each change fits the other component at the common base. Together, they configure six workers against four available slots. `runBatch` asks the pool for more slots than it can provide, and the pool throws `capacity exhausted`.

The constraint is a property of this fixture. Real applications may deliberately queue, throttle, retry or allow more workers than available connections. A generic rule that concurrency must never exceed pool size would produce false alarms. The question is whether a particular workload and its documented behavior remain compatible.

## Four revisions, one experiment

| Revision | Generated experiment | Existing declared checks | Original tests |
| --- | --- | --- | --- |
| Common base | Pass, exit 0 | Passed | Unchanged |
| Capacity PR alone | Pass, exit 0 | Passed | Unchanged |
| Workers PR alone | Pass, exit 0 | Passed | Unchanged |
| Combined revision | Fail, exit 1 | Passed | Unchanged |

The existing checks remained green on all four revisions. The generated experiment exercised the missing relationship between configured workers and capacity. It also checked that the pool still rejected an allocation above capacity; removing that guard would not satisfy the original contract.

The same test source was used throughout. Its SHA-256 is:

```text
1b4e3b7f1c04f26aef74ca59422a8f6c50bf1c1cefea58918ada4f93c28f681c
```

The combined run recorded an assertion failure, rather than an installation error or import failure:

```text
not ok 1 - runBatch serves every configured worker immediately (no throw)
error: 'OSMOGREP_REGRESSION: runBatch unexpectedly threw: capacity exhausted'
code: 'ERR_ASSERTION'
# tests 2
# pass 1
# fail 1
```

Those distinctions matter. A test that cannot import its dependencies has not demonstrated a runtime regression. A test that fails against the base has not isolated the effect of the proposed changes. A test with an invented expectation can pass and fail differentially while still being wrong.

## What Catcher executed

The experiment used the existing change dispatcher and isolated execution path. Related changes were composed into a temporary merge inside a VM. The workflow retained the common base and the individual PR heads, rather than attributing the combined failure to either change alone.

The captured inputs were:

| Input | Commit |
| --- | --- |
| Common base | `7b3caa0d61db2a283b3e6b2be363ebff2193ca7c` |
| Capacity PR | `4d320b70de95b41bf34028ebcb31ba68b40c09d3` |
| Workers PR | `d36443d3e5f6fde86a17c0ff18d7a5d409fceca3` |
| Temporary combined revision | `bb44695c5dbea45fe5e82c8cee0ef104b61ef431` |

The combined commit was created inside the sandbox. It is recorded for provenance, but is not presented as a published GitHub commit. The public PRs provide the source changes needed to construct the combined tree again.

Each revision ran the declared installation and original checks. The generated test then ran with:

```sh
node --test .osmogrep-catcher/reproducer.mjs
```

The evidence download includes the complete generated source, exact commands, environment versions, phase outputs, original-test hashes and revision identities. To replay it, use a disposable environment, check out each recorded revision, install the declared dependencies and place the downloaded experiment source at its recorded path. Construct the combined tree from both PR heads. Preserve the test bytes across runs and compare the recorded hash before execution.

## Recorded computation

| Measurement | Recorded value |
| --- | ---: |
| Model requests | 3 |
| Input tokens | 16,475 |
| Output tokens | 533 |
| Total reported tokens | 17,008 |
| Recorded run duration | 116.287 seconds |
| Target sandbox starts | 4 |
| Target sandboxes closed | 4 |
| Verified repairs | 0 |

These are measurements of this run, not estimates of an average PR. The summary did not retain per-call model identities, cached-input usage or the engine build SHA. We therefore do not assign a model-price estimate or claim exact engine reproducibility from this artifact alone. A token total is not a credit invoice, and elapsed time is not billed sandbox time.

The run used real GitHub inputs, OpenAI calls and E2B target VMs, coordinated through a local test database. It did not exercise the production queue or publish a GitHub review. The captured environment was Linux x86-64 with Node 20.9.0, Python 3.11.6 and Git 2.39.5. Installation logged an engine warning because the package declared Node 22.18 or newer. Checks completed despite that warning; this is not a supported-runtime compatibility result.

## Reproduction and repair are separate results

The recorded decision is `reproduced`, with `verifiedFix: false`. This interaction run did not repair the combined branch. Claiming a fix would require a justified correction, the same reproducer passing afterward, and the original checks remaining intact.

A [separate single-PR experiment](/blog/from-pull-request-to-runtime-regression) did exercise that repair chain: base pass, candidate fail, repaired candidate pass. It used a different fixture, engine build and execution scope. Its 70,873 tokens and 108.604 seconds must not be combined with this run or treated as a like-for-like speed comparison.

## What this result establishes

For these captured changes, execution identified a specific compatibility failure that neither individual revision exhibited under the same experiment. The failure is visible before deploying their combination. That is a useful, bounded form of proactive regression analysis.

It does not establish broad detection accuracy, false-positive rates, arbitrary service setup, production telemetry coverage or an advantage over another reviewer. There is one selected interaction case, no negative-control population and no statistical estimate. No Greptile result is included.

The next evaluation question is whether the same process finds legitimate interactions in independent repositories under a fixed budget. Those results should retain failed setups, invalid hypotheses and unsuccessful repairs alongside successes. [Inspect the complete interaction evidence](/data/pr-interaction.json).
