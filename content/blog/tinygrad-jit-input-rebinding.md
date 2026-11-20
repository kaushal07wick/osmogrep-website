---
title: "Fixing stale input references in tinygrad’s JIT"
date: "2026-11-19"
updated: "2026-11-20"
author: "OsmoGrep Team"
excerpt: "The kernel ran on a new input. The returned Tensor still pointed at the old buffer. Inside the repair: UOp templates, PARAM slots, alias staging and 94 reported tests."
cover: "/blog/tinygrad-jit-hero-v2.png"
card: "/blog/tinygrad-jit-card-v2.png"
coverAlt: "Official tinygrad logo beside two illustrated buffer stacks. The old return points to captured storage; the repaired return binds to the current input."
category: "Runtime verification"
---

**A JIT can run the right computation and still return the wrong tensor.** That was the problem we worked through in [tinygrad](https://github.com/tinygrad/tinygrad): repeated calls used fresh inputs, but an input-backed return could stay attached to capture-time storage.

The bug was already reported in [upstream PR #19205](https://github.com/tinygrad/tinygrad/pull/19205), which also proposes a fix. We implemented a repair in [our fork](https://github.com/kaushal07wick/tinygrad/pull/1) and checked it through OsmoGrep’s production E2B runner. **Claude Code authored the repair. OsmoGrep executed the verification.** Its review and repair models did not produce this fix.

<!-- tinygrad-figure:summary -->

## The input moved. The return did not.

The function that exposes the problem is small:

```python
@TinyJit
def f(a):
  a.assign(a + 1)
  return a, a[1:3]
```

Each invocation receives a freshly realized tensor containing different values. The function increments it, then returns the tensor and a slice. A caller reasonably expects both returns to reflect **this invocation’s input**.

The [added regression test](https://github.com/kaushal07wick/tinygrad/blob/217d01643c210c4d4f8f21993c58f60f3ee062cb/test/runtime/test_jit.py#L26-L39) repeats that five times. Without the repair, one call returns `[11, 11, 11, 11]` where the assertion expects `[21, 21, 21, 21]`: **4/4 elements mismatch**. The [cloud run without the fix](https://github.com/kaushal07wick/tinygrad/pull/3#issuecomment-7005440502) records the actual assertion failure.

The test also retains earlier inputs and checks them afterward. Correcting the current return must not silently rebind a Tensor that an earlier caller still owns.

## A Tensor is not its storage

Understanding the failure means separating three layers. A **Tensor** is a Python wrapper. Its **UOp graph** is tinygrad’s intermediate representation of the value, including views and buffer references. A **Buffer** is the realized storage holding its data.

**Capture** records work for reuse; **replay** executes that work with another invocation’s inputs. The captured execution already rebound its input buffers. The return path handled symbolic variables, but an input-backed Tensor could retain a reference to the **capture-time buffer**.

That is why checking only the computation misses the problem. Input rebinding and return rebinding have to agree.

<!-- tinygrad-figure:binding -->

## Bind the return to the same inputs as execution

The repair keeps a **return template** instead of treating a capture-time input reference as permanent.

At capture, [`_own_input_views()`](https://github.com/kaushal07wick/tinygrad/blob/217d01643c210c4d4f8f21993c58f60f3ee062cb/tinygrad/engine/jit.py#L48-L58) finds returned tensors whose graphs depend on input storage. It creates **JIT-owned wrappers** and replaces concrete input-buffer references in their templates with **PARAM slots**. Earlier caller-owned Tensor objects remain untouched.

On replay, [`_rebound_ret`](https://github.com/kaushal07wick/tinygrad/blob/217d01643c210c4d4f8f21993c58f60f3ee062cb/tinygrad/engine/jit.py#L76-L81) combines those templates with symbolic bindings. Execution and the return path then share the same `bufs` list:

```python
run_linear(linear, {**self.var_vals, **var_vals},
           input_uops=(bufs:=[staging.get(u, u) for u in input_uops]), jit=True)
for t,u,vals,params in self._rebound_ret:
  t.uop = u.substitute({**{v:v.bind(var_vals.get(v.expr, i)) for v,i in vals.items()},
                       **{p:bufs[p.arg.slot] for p in params}}, walk=True)
```

This is an excerpt from the [source patch](https://github.com/kaushal07wick/tinygrad/pull/1/files), which changes `tinygrad/engine/jit.py` by **+28 / −8 lines** and adds a **15-line test**.

The shared buffer list matters for **aliasing**. A previous JIT output can become a later input, and execution may stage that aliased input through a copy. Returning a reference bound to the raw input rather than the buffer actually used by [`run_linear`](https://github.com/kaushal07wick/tinygrad/blob/217d01643c210c4d4f8f21993c58f60f3ee062cb/tinygrad/engine/jit.py#L83-L96) would split the paths again.

Serialization needs the same care. The updated [`CapturedJit.__reduce__`](https://github.com/kaushal07wick/tinygrad/blob/217d01643c210c4d4f8f21993c58f60f3ee062cb/tinygrad/engine/jit.py#L71) retains the templates so a pickled JIT can rebuild its return bindings.

## Check the paths a simple example misses

We extended the comparison beyond the basic return value: **pickled JITs**, **aliased inputs**, **symbolic views**, **a returned view beside a computed output**, and **earlier inputs left untouched**.

All five corrected cases [pass with the repair](https://github.com/kaushal07wick/tinygrad/pull/4#issuecomment-7005645022) and [fail without it](https://github.com/kaushal07wick/tinygrad/pull/5#issuecomment-7005650496). The [additional test program](https://github.com/kaushal07wick/tinygrad/blob/7e96fc90ea787d21b1f812fdc9f151bb14b330b2/osmogrep_extra_check.py) has the same Git blob on both compared heads.

**These checks were written after the repair.** Our first frozen reproducer had three invalid cases: two constructed virtual inputs that tinygrad rejects, and one performed no work for the JIT to capture. The corrected cases strengthen the behavioral comparison; they are not a pre-repair holdout.

## What changed in the cloud runs

The main comparison used **`DEV=CPU:X86`**, the same declared command and identical test-file blobs for [JIT](https://github.com/kaushal07wick/tinygrad/blob/217d01643c210c4d4f8f21993c58f60f3ee062cb/test/runtime/test_jit.py), [symbolic JIT](https://github.com/kaushal07wick/tinygrad/blob/217d01643c210c4d4f8f21993c58f60f3ee062cb/test/runtime/test_symbolic_jit.py) and [pickle](https://github.com/kaushal07wick/tinygrad/blob/217d01643c210c4d4f8f21993c58f60f3ee062cb/test/runtime/test_pickle.py) tests. Select a revision below to inspect the recorded summary.

<!-- tinygrad-figure:results -->

The passing suite job took **51.2 seconds** from its recorded start to finish. Its test command took **30.6 seconds**; Python’s unittest runner reported **28.531 seconds** inside that command. These are three different timing boundaries, not interchangeable measurements.

Across the **four comparison jobs**, OsmoGrep ran the suite on both revisions, executed the five additional cases on both revisions, and checked types and lint in the additional-check commands:

| Cloud run | Observed result | Job elapsed | Command elapsed |
|---|---|---|---|
| [Suite without repair](https://github.com/kaushal07wick/tinygrad/pull/3#issuecomment-7005440502) | 83 pass · 1 fail · 10 skip | 42.8s | 23.2s |
| [Suite with repair](https://github.com/kaushal07wick/tinygrad/pull/1#issuecomment-7005402563) | 84 pass · 10 skip | 51.2s | 30.6s |
| [Additional checks without repair](https://github.com/kaushal07wick/tinygrad/pull/5#issuecomment-7005650496) | 5 fail · types and lint clean | 41.0s | 19.4s |
| [Additional checks with repair](https://github.com/kaushal07wick/tinygrad/pull/4#issuecomment-7005645022) | 5 pass · types and lint clean | 54.7s | 25.3s |

Together, those four jobs account for **3 minutes 9.8 seconds of cumulative job time**, including **98.4 seconds of command execution**. The totals use unrounded records. They exclude earlier blocked or stale jobs, source review, the unsuccessful automated repair and time spent authoring the patch. **End-to-end repair time was not measured.** These single runs verify behavior; they do not establish a performance improvement.

The **other 93 tests** have identical outcomes: **83 pass and 10 skip**. Those skips cover backend-specific or known-pending cases; they are not counted as passes. The new return-input test supplies the difference between the two heads.

**mypy stays clean across 219 source files**, and **ruff stays clean on the two PR files**, with and without the fix. Static checks are useful here, but neither establishes that the returned data belongs to the current invocation.

To repeat the bounded suite, use the [pinned evaluation recipe](https://github.com/kaushal07wick/tinygrad/blob/7d9d56d7715795e789b1febebf5e22a00fb86c0a/.osmogrep.json) and the tested revisions in the [execution record](/data/tinygrad-jit-verification.json). The base is upstream `daf2bfb` plus evaluation-only setup commits; those commits are not intended for upstream.

## Where automated repair stopped

The patch worked in the measured checks, but OsmoGrep’s own repair workflow did not produce it. Its source review found no issue and requested no execution. A later [repair attempt stopped before execution](https://github.com/kaushal07wick/tinygrad/pull/3#issuecomment-7005470664): the model marked a hypothesis ready while citing only one revision, so the coordinator rejected it under the two-revision evidence rule.

That suggests a task-framing gap. An **introduced regression** needs a justified base-pass → changed-code-fail comparison. An **existing bug exposed by a test** needs the reported failure reproduced first, followed by repair and rerunning the same test. Both need existing checks preserved. An explicit existing-bug path is a next design step; weakening the regression guard would not provide it.

## What remains open

The patch changes **Python object identity** after capture: the return is a JIT-owned wrapper sharing input storage, rather than the original Python object. **Gradient state is not carried** to that wrapper. Gradient compatibility, GPU backends and the rest of tinygrad’s suite remain untested.

The [ten-job ledger](/data/tinygrad-jit-verification.json) also retains the recipe failures, stale run and incomplete cleanup evidence. Two early recipes assumed unavailable venv/pip support; a later run became stale because mypy wrote cache files into the workspace. Saved jobs have empty sandbox-evidence lists, and the separately checked E2B account was not confirmed as production’s account.

The result is a **real OSS repair with cloud validation**, bounded to the tested CPU configuration. It is not an autonomous-discovery result or a Greptile comparison. The [public PR](https://github.com/kaushal07wick/tinygrad/pull/1) contains the source change and test; the linked run reports show what happened when each version executed.
