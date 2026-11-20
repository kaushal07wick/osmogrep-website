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

**The computation used the current input. The returned tensor did not.** A captured tinygrad function retained an earlier input reference, producing stale values on subsequent calls.

We repaired the return-binding path and checked it in OsmoGrep’s production E2B runner. **Claude Code authored the repair. OsmoGrep executed the verification.** Its review and repair models did not produce this fix.

<!-- tinygrad-figure:summary -->

[Read the repair PR](https://github.com/kaushal07wick/tinygrad/pull/1) · [Download the execution record](/data/tinygrad-jit-verification.json)

## The bug: stale references during JIT replay

**JIT capture** records work for reuse. **Replay** executes that captured work with another invocation’s inputs. tinygrad already rebound execution inputs; returned tensors backed by those inputs needed the same treatment.

Three objects matter:

- **Tensor:** the Python object returned to the caller.
- **UOp graph:** tinygrad’s intermediate representation of the value, including views and buffer references.
- **Buffer:** the realized storage containing the tensor’s data.

The old return path handled **symbolic variable rebinding**, but an input-backed return could retain its **capture-time buffer**. Reusing the computation did not make that return reference current.

The [added regression test](https://github.com/kaushal07wick/tinygrad/blob/217d01643c210c4d4f8f21993c58f60f3ee062cb/test/runtime/test_jit.py#L26-L39) exposes the distinction:

```python
@TinyJit
def f(a):
  a.assign(a + 1)
  return a, a[1:3]
```

It supplies **five fresh inputs**, checks the returned tensor and slice, then checks that earlier caller-owned inputs remain unchanged. Without the repair, it returns `[11, 11, 11, 11]` where the assertion expects `[21, 21, 21, 21]`: **4/4 elements mismatch**.

This was already reported in [upstream PR #19205](https://github.com/tinygrad/tinygrad/pull/19205), which proposes its own fix. Our evaluation uses upstream `daf2bfb1260ecbbf2b71ca9b48c6442426cfdf96`. It is an **issue-guided repair**, not a new discovery.

## The repair: parameterize the return graph

The fix preserves a **return template**, replacing concrete input-buffer references with **PARAM slots**. Each replay binds those slots to that invocation’s buffers.

<!-- tinygrad-figure:binding -->

**At capture:** [`_own_input_views()`](https://github.com/kaushal07wick/tinygrad/blob/217d01643c210c4d4f8f21993c58f60f3ee062cb/tinygrad/engine/jit.py#L48-L58) finds returns that depend on input storage. It creates JIT-owned Tensor wrappers and stores their parameterized UOp templates. Caller-owned Tensor objects are not repurposed.

**At replay:** [`_rebound_ret`](https://github.com/kaushal07wick/tinygrad/blob/217d01643c210c4d4f8f21993c58f60f3ee062cb/tinygrad/engine/jit.py#L76-L81) combines those input-return templates with symbolic bindings. The execution and return paths use the **same `bufs` list**:

```python
run_linear(linear, {**self.var_vals, **var_vals},
           input_uops=(bufs:=[staging.get(u, u) for u in input_uops]), jit=True)
for t,u,vals,params in self._rebound_ret:
  t.uop = u.substitute({**{v:v.bind(var_vals.get(v.expr, i)) for v,i in vals.items()},
                       **{p:bufs[p.arg.slot] for p in params}}, walk=True)
```

This is an excerpt from the [actual patch](https://github.com/kaushal07wick/tinygrad/pull/1/files), not a standalone implementation.

**Why alias staging matters:** a previous JIT output can become a later input. Execution may stage that aliased buffer through a copy. Binding the return to the raw input instead of the buffer actually passed to [`run_linear`](https://github.com/kaushal07wick/tinygrad/blob/217d01643c210c4d4f8f21993c58f60f3ee062cb/tinygrad/engine/jit.py#L83-L96) would split the two paths again.

**Why serialization matters:** [`CapturedJit.__reduce__`](https://github.com/kaushal07wick/tinygrad/blob/217d01643c210c4d4f8f21993c58f60f3ee062cb/tinygrad/engine/jit.py#L71) retains the return templates, so a pickled JIT can rebuild the binding. Source delta: **+28 / −8 lines** in `tinygrad/engine/jit.py`, plus **15 lines** for `test_jit_return_input`.

## The result: one failing test becomes green

The comparison uses **identical test-file blobs**, the same declared command and **`DEV=CPU:X86`**. Select a revision to inspect its recorded unittest summary.

<!-- tinygrad-figure:results -->

The **other 93 tests** have the same outcome on both heads: **83 pass, 10 skip**. The skips are backend-specific or known-pending cases; they are not counted as passes.

| Test file | Coverage exercised |
| --- | --- |
| `test/runtime/test_jit.py` | JIT execution and the new input-return case |
| `test/runtime/test_symbolic_jit.py` | Symbolic JIT behavior |
| `test/runtime/test_pickle.py` | Serialization behavior |

## Beyond the happy path: five edge cases

**All five corrected additional cases fail without the repair and pass with it.** Static checks alone remain green on both versions, making them insufficient to detect this behavior.

| Additional case | Invariant checked |
| --- | --- |
| **Pickled JIT** | Input-return binding survives serialization |
| **Aliased input** | A prior output fed back as input follows staging |
| **Symbolic view** | Returned view follows the current input and binding |
| **View + computed output** | Both results stay consistent with this invocation |
| **Earlier inputs** | Later calls never rebind earlier caller-owned tensors |

**mypy:** clean across **219 source files**. **ruff:** clean on the two PR files. The additional-check file is byte-identical between the compared heads, with Git blob `05d2527f232ec1b5fc0a282dfe5144a1e2352b33`.

**Provenance:** these five checks were written **after the repair**. The first frozen reproducer had three invalid cases; the corrected checks are not a pre-repair holdout.

## What the repair model missed

OsmoGrep’s review of the proposed fix found no issue and requested no execution. Its `runtime_fix` attempt on the **test-only PR** stopped before a VM started: the hypothesis cited only one revision, so it failed the existing two-revision evidence check.

The engineering gap is a distinction between two tasks:

| Task | Proof needed |
| --- | --- |
| **Introduced regression** | Base passes → changed code fails → repair passes |
| **Existing bug** | Reproduce the reported failure → repair → same test passes |

An explicit existing-bug path is a **next design step**, not a capability demonstrated here. The two-revision guard should remain intact for introduced-regression claims.

**Model accounting:** eight calls, **45,183 reported tokens**, for the review and unsuccessful repair attempt. Every cloud test job used **zero model calls**. These counts exclude Claude Code’s authoring work and do not price an autonomous repair.

## What remains open

**Object identity changes.** After capture, the returned input is a JIT-owned wrapper sharing input storage, rather than the original Python object. **Gradient state is not carried** to that wrapper; gradient compatibility remains untested.

**Coverage is bounded:** one CPU configuration, three test files and the additional checks. No GPU, full-suite or cross-backend guarantee is established. The fork patch has not been merged upstream.

**Failed attempts remain visible.** Two early recipes assumed unavailable venv/pip support. A later run was marked stale because mypy wrote cache files into the workspace. The corrected setup uses NumPy 2.2.6 and a pinned pip 24.3.1 wheel. Evaluation-only setup commits are not intended for upstream.

**Cleanup evidence is incomplete.** Saved jobs have empty sandbox-evidence lists; the separately checked E2B account was not confirmed as production’s account. The [ten-job ledger](/data/tinygrad-jit-verification.json) retains the unsuccessful attempts and these limits.

This is a **real OSS repair with cloud validation**. It establishes neither autonomous discovery/repair nor a Greptile comparison.

## Reproduce and inspect

```sh
DEV=CPU:X86 python3 -m unittest test.runtime.test_jit test.runtime.test_symbolic_jit test.runtime.test_pickle
```

<!-- tinygrad-figure:sources -->
