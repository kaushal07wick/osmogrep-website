---
title: "When a JIT returns yesterday’s input"
date: "2026-11-19"
author: "OsmoGrep Team"
excerpt: "A tinygrad input-buffer repair, checked against 94 tests in OsmoGrep’s cloud runner. What changed, what passed, and where automated repair stopped."
cover: "/blog/tinygrad-jit-hero.png"
card: "/blog/tinygrad-jit-card.png"
coverAlt: "A JIT return points to a captured input before repair, then follows the current input through a parameter slot after repair."
category: "Runtime verification"
---

A JIT can execute the right computation and still hand its caller the wrong tensor. In this tinygrad case, the returned object kept pointing at an earlier input buffer, even as later calls supplied fresh inputs.

We implemented a repair with Claude Code and checked it through OsmoGrep’s production E2B runner. The new test fails without the repair and passes with it. The same three test files report 84 passes and 10 skips with the repair, compared with 83 passes, one failure and 10 skips without it.

The attribution matters: **Claude Code authored the repair. OsmoGrep executed the verification.** OsmoGrep’s model-driven review and repair attempts did not find or fix the bug. This article documents both the working patch and that product gap.

[Read the repair PR](https://github.com/kaushal07wick/tinygrad/pull/1) · [Download the execution record](/data/tinygrad-jit-verification.json)

## The failure was in the returned reference

The bug was already reported in [upstream PR #19205](https://github.com/tinygrad/tinygrad/pull/19205), which also proposes a fix. This is an issue-guided investigation, not a new discovery. Our fork starts from upstream commit `daf2bfb1260ecbbf2b71ca9b48c6442426cfdf96`.

Consider a function that mutates its input and returns both the input and a view:

```python
@TinyJit
def f(a):
  a.assign(a + 1)
  return a, a[1:3]
```

The regression test calls it five times with freshly realized tensors containing different values. It checks the returned tensor, the returned view and, afterward, every earlier input. That last check prevents a tempting but incorrect solution: rebinding a caller-owned tensor to the next call’s input.

Without the fix, the new test reaches this mismatch:

```text
FAIL: test_jit_return_input
Mismatched elements: 4 / 4 (100%)
 ACTUAL: array([11., 11., 11., 11.], dtype=float32)
 DESIRED: array([21, 21, 21, 21])
```

This is a value assertion from executing tinygrad, not a comparison of source text. The test-only [fork PR #3](https://github.com/kaushal07wick/tinygrad/pull/3) contains the new test without the source repair.

## Capture once, bind on every call

The captured execution already binds input buffers for each invocation. The return path was different: it retained capture-time tensor references. Its existing symbolic-return handling updated variable bindings, but did not generally rebind returned inputs and their views.

The patch makes returned input views follow the same slot-based binding as execution:

1. At capture, identify returned tensors whose graphs reference an input buffer.
2. Replace those return objects with JIT-owned tensors and keep their graphs as templates with input `PARAM` slots.
3. On each invocation, bind those slots to the buffers actually used by `run_linear`, including staging buffers for aliased inputs.
4. Rebind symbolic values in the same pass and preserve the return templates through serialization.

![Before repair, a return stays attached to a captured buffer. After repair, a saved parameter template is bound to the current call’s execution buffers.](/blog/tinygrad-jit-binding.svg)

The central execution-and-return binding uses one buffer list. This excerpt is from the patch; it is not the entire implementation:

```python
run_linear(linear, {**self.var_vals, **var_vals},
           input_uops=(bufs:=[staging.get(u, u) for u in input_uops]), jit=True)
for t,u,vals,params in self._rebound_ret:
  t.uop = u.substitute({**{v:v.bind(var_vals.get(v.expr, i)) for v,i in vals.items()},
                       **{p:bufs[p.arg.slot] for p in params}}, walk=True)
```

Using the staged buffers matters when a previous JIT output becomes a later input. Binding returns to a different buffer list could preserve the simple case while breaking alias handling.

The PR changes `tinygrad/engine/jit.py` by 28 added and eight removed lines, and adds the 15-line `test_jit_return_input` test. The [public diff](https://github.com/kaushal07wick/tinygrad/pull/1/files) contains the helper functions and serialization change.

## What the cloud runs actually established

Both suite runs used the same declared command and CPU configuration:

```sh
DEV=CPU:X86 python3 -m unittest test.runtime.test_jit test.runtime.test_symbolic_jit test.runtime.test_pickle
```

| Recorded check | Without repair | With repair |
| --- | --- | --- |
| Tests reported, including skips | 94 | 94 |
| Passed | 83 | 84 |
| Failed | 1: the new return-input test | 0 |
| Skipped | 10 | 10 |
| Corrected additional cases | 0 of 5 passed | 5 of 5 passed |
| mypy on `tinygrad/` | Clean: 219 files | Clean: 219 files |
| ruff on the two PR files | Clean | Clean |

The other 93 tests have identical counts across the two suite heads: 83 pass and 10 are skipped. The skips cover backend-specific or known-pending cases: x86 estimates, CPU default-device exclusions, SDMA, multioutput issue #3607 and a pickle size test.

The additional checks exercise five separate cases:

| Case | What it checks |
| --- | --- |
| Pickled JIT | Return rebinding survives serialization |
| Aliased input | A prior output fed back as input follows staging correctly |
| Symbolic input view | The returned view follows this invocation’s input and binding |
| Input view beside a computed output | Returned views and computed results stay consistent |
| Earlier inputs | Later calls do not rebind tensors supplied by earlier callers |

The additional-check file has the same Git blob, `05d2527f232ec1b5fc0a282dfe5144a1e2352b33`, in the with-fix and without-fix evaluation heads. **These checks were written after the repair.** They strengthen the comparison, but are not an independently frozen pre-repair reproducer.

## Keep the unsuccessful attempts in the record

Two early cloud runs stopped during installation because our evaluation recipe assumed that the image supplied venv or pip. A diagnostic run established the available tools, and the corrected recipe installed NumPy 2.2.6 through a pinned pip 24.3.1 wheel from PyPI. Those blocked comments remain on the PR and are labeled as setup failures.

Our first standalone reproducer was also defective: two cases constructed inputs that tinygrad rejects as virtual, and another performed no work for the JIT to capture. The first additional-check run was marked stale because mypy wrote cache files into the workspace. Correcting the evaluator was necessary before its results could support the patch.

The base branch includes evaluation-only `.osmogrep.json` setup commits. They select dependencies and a bounded test subset; they are not part of the proposed upstream source change.

The downloadable record retains all ten production jobs, including setup failures, the stale run and the unsuccessful repair attempt. It includes exact heads, commands, model usage and links back to the public reports.

## Where OsmoGrep’s repair workflow stopped

OsmoGrep’s source review of the proposed fix produced no findings and did not request execution. We separately submitted the test-only PR to `runtime_fix` to see whether it would repair the exposed bug.

It did not. The investigation marked a hypothesis ready for execution while citing only one revision. The coordinator rejected it because the current regression proof requires evidence from both base and candidate. No VM started for that repair attempt.

That exposes a mismatch worth addressing. A PR introducing a defect and a PR adding a test for an existing defect need different proof paths:

| Investigation | Evidence to establish |
| --- | --- |
| Newly introduced regression | A justified test passes before the change, fails after it and passes after repair |
| Existing bug exposed by a test | Reproduce the reported failure, repair the implementation and rerun the same test with existing checks preserved |

The second row is a design direction, not a capability demonstrated by this run. Weakening the two-revision guard would not solve the task distinction. The evidence suggests we need an explicit existing-bug path that starts by running the supplied failing test.

The review and unsuccessful repair used **eight model calls and 45,183 reported tokens**. All cloud `runtime_check` jobs used zero model calls. These figures exclude Claude Code’s authoring work and are not the cost of an autonomous repair.

## What remains open

This patch changes Python object identity: from capture onward, the returned input is a JIT-owned tensor sharing the input’s buffer, rather than the exact object supplied by the caller. Gradient state is not carried to that wrapper. Those are compatibility considerations, not details to hide behind passing value assertions.

We ran one CPU configuration and three test files. GPU backends, the remaining tinygrad suite and gradient behavior are not covered. The patch is a fork demonstration, has not been merged upstream and needs further compatibility review before being described as upstream-ready.

The saved runtime-check jobs have empty sandbox-evidence lists. A separate E2B account check found no running VMs, but its correspondence to the production account was not verified. We therefore do not claim independently attested production cleanup.

This case establishes a real OSS code change with repeatable failing-without/passing-with checks in OsmoGrep’s production runner. It does not establish autonomous discovery, autonomous repair, a broad accuracy rate or a Greptile comparison.

## Inspect the evidence

- [Repair PR and complete diff](https://github.com/kaushal07wick/tinygrad/pull/1)
- [Upstream report and existing proposed repair](https://github.com/tinygrad/tinygrad/pull/19205)
- [94-test suite with the repair](https://github.com/kaushal07wick/tinygrad/pull/1#issuecomment-7005402563)
- [The same suite without the repair](https://github.com/kaushal07wick/tinygrad/pull/3#issuecomment-7005440502)
- [Corrected additional checks with the repair](https://github.com/kaushal07wick/tinygrad/pull/4#issuecomment-7005645022)
- [Corrected additional checks without the repair](https://github.com/kaushal07wick/tinygrad/pull/5#issuecomment-7005650496)
- [Model repair attempt and recorded blocker](https://github.com/kaushal07wick/tinygrad/pull/3#issuecomment-7005470664)
- [Download the complete job ledger](/data/tinygrad-jit-verification.json)
