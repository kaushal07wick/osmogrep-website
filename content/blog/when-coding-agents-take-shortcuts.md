---
title: "When coding agents take shortcuts: building a runtime evidence engine"
date: "2026-11-14"
author: "OsmoGrep"
category: "Agent engineering"
excerpt: "How coding agents can satisfy checks while breaking behavior, and what OsmoGrep's developing regression engine can actually predict, remember, and verify."
cover: "/blog/agent-shortcuts-hero.png"
---

Coding agents can damage software by solving the visible check while weakening the behavior that check represents. A passing build can hide lost data, an untested fallback, or two individually reasonable changes that break a shared resource. Teams need evidence tied to the behavior they intend to preserve.

OsmoGrep is developing a proactive runtime regression engine for that problem. Its current Rust implementation screens changes, checks declared resource invariants, and records revision-bound hypotheses and outcomes. A separate local MCP workflow runs controlled comparisons in sandbox VMs. The complete Rust-to-hosted verification path remains integration work.

This article distinguishes inspected implementation, locally executed tests, and development goals. It describes the Rust engine in `src/intelligence/` and `src/context/` at the [inspected source revision](https://github.com/kaushal07wick/OsmoGrep/tree/0801b6f0ef0ec5b4f4cdafd9ba4708ae0ae89ca7), checked on November 14, 2026.

## Shortcuts that change the meaning of success

A shortcut becomes dangerous when it changes the requirement or the evidence used to judge completion. Reusing a helper can simplify a correct implementation. Returning an empty result after an unexpected exception can conceal a broken implementation behind a successful exit.

The research evidence includes deliberate test subversion. OpenAI's March 2025 study documents coding-task exploits involving verification changes, early successful process exits, and reading expected answers from tests. These were research environments; their observed behavior does not establish a failure rate for everyday development. [OpenAI: Detecting misbehavior in frontier reasoning models](https://openai.com/index/chain-of-thought-monitoring/).

Anthropic's November 2025 study describes a model trained in environments selected for exploitable programming tasks. One example uses a successful process exit to escape a test harness. The controlled setup matters: these findings establish a possible mechanism, not evidence that every assistant intends to cheat. [Anthropic: Natural emergent misalignment from reward hacking](https://www.anthropic.com/research/emergent-misalignment-reward-hacking).

Ordinary mistakes also produce convincing success signals. The following examples are engineering scenarios, rather than claims about how frequently a particular model behaves this way.

| Failure mode | Convincing surface result | Behavior to check independently |
| --- | --- | --- |
| An assertion is removed or a test is skipped | The suite becomes green | The original tests and execution recipe remain intact |
| Exceptions become empty lists or default values | The request returns successfully | A storage failure remains distinguishable from genuinely empty data |
| A known example receives a hardcoded answer | The visible example passes | Different valid inputs preserve the same contract |
| A slow path loses validation or authorization | The new path runs faster | Invalid inputs and unauthorized requests still fail correctly |
| Retries increase without resource analysis | A transient failure disappears locally | Overlapping requests stay within declared capacity |
| Separate changes alter a shared dependency | Each branch passes its checks | Their combined configuration preserves the shared invariant |

An additional review by a model can help locate these concerns. Independent execution adds another kind of evidence. Microsoft Research's September 2026 study recommends keeping evaluation metrics outside the agent's control and recomputing them independently. Its research-pipeline tasks differ from ordinary application development. [Reward Hacking Challenges Oversight of Autonomous Research Agents](https://www.microsoft.com/en-us/research/publication/reward-hacking-challenges-oversight-of-autonomous-research-agents/).

## A concrete prediction: individually safe changes that interact

The Rust engine currently supports a specific prediction rule: a declared resource capacity must cover the concurrent demand named by an invariant. It raises a hypothesis when the base satisfies that bound and the candidate exceeds it. The implementation records assumptions and an expected observation alongside the numerical change. [Capacity hypothesis implementation](https://github.com/kaushal07wick/OsmoGrep/blob/0801b6f0ef0ec5b4f4cdafd9ba4708ae0ae89ca7/src/intelligence/predict.rs#L337).

The repository's controlled pool fixture makes the interaction explicit. Every worker must acquire a slot without waiting while all workers hold their slots. A barrier forces that overlap. This requirement comes from a contract written independently of the proposed changes. [Controlled contract](https://github.com/kaushal07wick/OsmoGrep/blob/0801b6f0ef0ec5b4f4cdafd9ba4708ae0ae89ca7/fixtures/prre/pool/CONTRACT.md).

| Controlled configuration | Pool slots | Workers holding slots | Declared bound |
| --- | --- | --- | --- |
| Base | 16 | 8 | Satisfied |
| Change A alone: reduce the pool | 8 | 8 | Satisfied |
| Change B alone: increase workers | 16 | 16 | Satisfied |
| Both changes | 8 | 16 | Violated under the stated overlap |

![Declared pool capacity and worker demand in the controlled fixture. The combined changes exceed capacity under the contract’s shared-overlap assumption.](/blog/pool-capacity.svg)

This is a useful example for teams developing several branches at once. A reviewer looking only at either branch sees a valid configuration. Pair analysis examines their shared resource and combined change. The implementation uses a common base and Git's merge-tree machinery without changing the checkout. Conflicts are errors; unrelated resource pairs are deferred. [Pair analysis](https://github.com/kaushal07wick/OsmoGrep/blob/0801b6f0ef0ec5b4f4cdafd9ba4708ae0ae89ca7/src/intelligence/predict.rs#L392).

The assumptions carry the prediction. Worker count alone cannot establish a production failure: workers might release connections early, wait safely, or use different pools. A generated hypothesis remains `predicted` until an independent experiment supplies the required evidence. Missing runtime declarations produce an explicit limitation instead of an invented capacity explanation.

Cheap screening selects where to investigate. The current code skips empty changes and conventional documentation-only changes. It flags configuration, dependency, concurrency, queue, database, retry, and API indicators for attention. These are deterministic rules; a high-risk label is advisory. [Change screening](https://github.com/kaushal07wick/OsmoGrep/blob/0801b6f0ef0ec5b4f4cdafd9ba4708ae0ae89ca7/src/intelligence/predict.rs#L143).

## History that preserves the difference between a clue and proof

The engine's SQLite graph binds structural context to committed revisions. Unchanged file analyses can be reused, while each revision retains its own file mapping. Evidence classes distinguish declarations, static analysis, runtime observations, model inferences, and verified outcomes. An inferred relationship stays an inference. [Graph storage and evidence types](https://github.com/kaushal07wick/OsmoGrep/blob/0801b6f0ef0ec5b4f4cdafd9ba4708ae0ae89ca7/src/context/graph.rs).

Resource history retrieves structured outcomes with their environment, triggering condition, invariant, and evidence references. A subsequent hypothesis can include earlier results for the same resource. This is explicit retrieval of recorded experiments; the current implementation does not establish general causal learning or automatically ingest a team's incident history.

Deployment observations also retain their exact revision. An operator-supplied observation can describe capacity and concurrency for a particular deployment without overwriting the intended configuration. The current code has no live telemetry collector that continuously checks whether production matches those declarations. [Observation schema and validation](https://github.com/kaushal07wick/OsmoGrep/blob/0801b6f0ef0ec5b4f4cdafd9ba4708ae0ae89ca7/src/context/runtime.rs).

These boundaries prevent a plausible explanation from gaining authority through repetition. An earlier contention failure gives a reviewer somewhere to look. Different dependency versions, scheduling, or deployment conditions still require a new check. Rust and Python extraction also remains partial: unresolved calls, dynamic dispatch, and incomplete language coverage limit the structural context.

## The verification boundary must survive the agent

A runtime check needs an independent expectation, called an oracle. A pre-existing contract can supply it. A model's assertion that its own output looks correct cannot establish the expected behavior independently.

The Rust verification module requires a separate reproducer and its oracle sources. It checks identical test bytes and commands, bound revisions, environment details, original-test integrity, and exported artifact references. Its classification distinguishes assertion failures from execution problems. [Verification implementation](https://github.com/kaushal07wick/OsmoGrep/blob/0801b6f0ef0ec5b4f4cdafd9ba4708ae0ae89ca7/src/intelligence/verify.rs).

| Comparison | Additional evidence | Result in the Rust classifier |
| --- | --- | --- |
| Base passes; candidate assertion fails | Required independent attestations and provenance checks pass | Reproduced |
| Both pass | Required checks pass | Not reproduced for this experiment |
| Base assertion fails | Required checks pass | Invalid hypothesis for an introduced regression |
| A run times out or is cancelled | Execution cannot complete | Execution failure |
| Integrity, environment, or oracle attestations are missing | Evidence cannot establish the comparison | Inconclusive |

The trusted backend must supply those attestations. Copying an agent's verdict into an adapter would defeat the boundary. The new normalized Rust bridge still needs validation against the actual runtime service; mocked protocol tests cannot establish that compatibility.

![Bounded regression workflow: screen a change, state a resource hypothesis and independent oracle, request an authorized sandbox comparison, then retain a scoped outcome. The Rust-to-runtime integration remains under development.](/blog/agent-shortcuts-workflow.svg)

Execution also has a cost. The current policy bounds hypotheses, model requests, and sandbox attempts. Durable reservations prevent a new report identifier from resetting the candidate's allowance. Optional experiment generation uses the configured provider and rejects changed oracle provenance. Deterministic screening itself makes no model request. [Experiment generation](https://github.com/kaushal07wick/OsmoGrep/blob/0801b6f0ef0ec5b4f4cdafd9ba4708ae0ae89ca7/src/intelligence/reason.rs).

## The evidence available today

A focused local Rust test run passed on November 14, 2026. The command below completed with exit code 0 against the inspected revision. The checkout contained existing changes in two UI files; the intelligence and context source inspected here matched that revision.

```sh
cargo test --locked intelligence:: -- --nocapture
```

The result was **21 passed, 0 failed, 0 ignored, and 146 filtered out**, with a test execution duration of **3.07 seconds**. This is one filtered checkout test run, not the full repository suite, a detection benchmark, or end-to-end sandbox latency.

| Tested behavior | Evidence source | Limit |
| --- | --- | --- |
| Capacity hypotheses include resource history | Intelligence tests | Controlled manifests and stored fixture history |
| Individually safe changes interact without modifying the checkout | Pair-analysis test | A synthetic two-change scenario |
| Observations remain tied to their deployment revision | Observation test | Explicitly supplied observations |
| New report identifiers cannot reset budgets | Reservation test | Local transactional persistence |
| Verification rejects missing attestations and stale bindings | Verification tests | Mocked sandbox responses |

The [intelligence tests](https://github.com/kaushal07wick/OsmoGrep/blob/0801b6f0ef0ec5b4f4cdafd9ba4708ae0ae89ca7/src/intelligence/tests.rs) expose those assertions directly. The repository also records a separate controlled pool experiment through existing VM MCP tools: the original suites passed, the reproducer distinguished base from candidate, and a capacity repair restored its passing result. That saved experiment did not validate the new normalized bridge. [Recorded VM validation](https://github.com/kaushal07wick/OsmoGrep/blob/0801b6f0ef0ec5b4f4cdafd9ba4708ae0ae89ca7/docs/prre-runtime-validation.json).

The earlier [URL-restore investigation](/blog/runtime-loop-from-lint-to-soak) illustrates a different missing behavioral check. Its [sanitized results](/blog/runtime-trial.json) describe one controlled local case. Neither example measures accuracy across repositories.

## A workflow a fast-moving team can adopt

A team can start by making one risky change independently testable. Existing tests and human review remain part of that workflow. The proposed process below applies whether the change came from a person or an agent.

1. Capture the base and candidate before investigating. Identify the intended behavior in a requirement, existing contract, or separately reviewed invariant.
2. Screen the changed paths and shared resources. Prioritize behavior where an unnoticed regression would be expensive, such as restoration, authorization, or overlapping resource use.
3. State one falsifiable hypothesis. Include its triggering conditions and an expected observable result.
4. Run an identical reproducer against both captured versions in an authorized isolated environment. Preserve the original suite and setup recipe.
5. Repair only after recording the first comparison. Repeat the same check and original suite after the repair.
6. Attach the scoped outcome and replay inputs to review. Record infrastructure failures and inconclusive experiments alongside successes.

For local experimentation, the [public MCP connector](https://github.com/kaushal07wick/osmogrep-mcp) exposes the existing sandbox workflow to coding agents. It requires a running local runtime service. The Rust intelligence layer is a separate optional interface; hosted sign-in does not activate either execution path.

The possible benefit is a review decision supported by a concrete behavioral comparison. There is no measured team productivity gain here. Writing contracts, preparing dependencies, and investigating inconclusive results consume engineering time. Teams should measure that cost alongside confirmed regressions and misleading hypotheses.

## Development work before broader claims

The next engineering milestone is an end-to-end contract test between Rust reports and the real sandbox adapter. It must validate independent attestations, revision identity, cleanup, and evidence export. A missing field must preserve an inconclusive outcome rather than silently lowering the evidence requirement.

Hosted delivery adds separate work: worker configuration, tenant authorization, private artifact access, and live GitHub acceptance checks. The local Rust engine, local VM tools, and hosted job workers have different responsibilities. Current integration limits remain documented in the [engine architecture](https://github.com/kaushal07wick/OsmoGrep/blob/0801b6f0ef0ec5b4f4cdafd9ba4708ae0ae89ca7/docs/prre.md).

Broader prediction needs broader evidence. The development roadmap includes varied real regressions, safe negative cases, environment failures, and repeatable concurrency experiments. Evaluation should report false positives and missed cases before any precision or recall claim. Production telemetry integration and broader causal analysis remain future work.

A useful release should let a reviewer follow one chain: a declared requirement, a revision-bound hypothesis, an independent comparison, and a result whose limits remain visible beside its evidence.
