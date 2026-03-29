# ARC-AGI-3 Explained

> The first interactive reasoning benchmark — and the hardest reality check for AGI claims

**Source:** [know.imbila.ai/arc-agi-3-explainer](https://know.imbila.ai/arc-agi-3-explainer)
**Validated:** March 2026 | **Author:** [Imbila.AI](https://imbila.ai) | **License:** CC-BY-SA-4.0
**Structured data:** [arc-agi-3.json](https://raw.githubusercontent.com/imbilawork/know.agent/main/agentapi/data/arc-agi-3.json)

---

## What Is ARC-AGI-3

ARC-AGI-3 is the third generation of the Abstraction and Reasoning Corpus, created by Francois Chollet and Mike Knoop's ARC Prize Foundation. It is the first fully interactive AI benchmark — instead of solving static grid puzzles, AI agents are dropped into turn-based game environments with zero instructions, zero stated goals, and no description of the rules. The agent must explore, figure out what winning looks like, build a mental model of the environment, and execute a strategy. All from scratch.

Think of it like handing someone a game controller with no tutorial. A five-year-old figures it out in minutes. The most expensive AI systems on the planet cannot. That gap — between human adaptability and AI rigidity — is exactly what ARC-AGI-3 was built to measure.

**Key stats:** 135 novel environments · 1,000+ levels · Humans: 100% · Best AI: 0.37% (frontier LLM) · $2M prize pool

### The Problem: Old benchmarks are saturated

ARC-AGI-1 is essentially solved (Gemini 3.1 Pro hits 98%). ARC-AGI-2 is approaching saturation at 84.6%. Worse, evidence suggests frontier models may be implicitly trained on ARC data — their reasoning chains reference ARC-specific colour mappings without being told. The signal was dying.

### The Shift: Static puzzles to interactive environments

ARC-AGI-3 replaces image-in/image-out grids with 135 handcrafted turn-based games across 1,000+ levels. Each game has 8-10 levels that progressively introduce new mechanics. Agents observe a 64x64 grid with 16 colours, take actions, and must learn on the fly.

### The Result: A measurable intelligence gap

For the first time, there is a direct, quantitative comparison of human vs. AI learning efficiency on novel tasks. Not memorisation. Not pattern matching. Actual adaptive reasoning measured across time. The gap is enormous — and that is the point.

### Agent Interaction Flow

Perceive (see the grid state) -> Explore (try actions, observe results) -> Model (build world model and goals) -> Execute (plan and act efficiently)

---

## Why It Matters

In the same week that Jensen Huang declared AGI "already achieved" on Lex Fridman's podcast, ARC-AGI-3 dropped — and every frontier model scored below 1%. The benchmark arrives at a moment when the gap between AGI claims and demonstrable capability has never been wider. Labs are racing to declare victory while the simplest test of genuine adaptability exposes how far there is to go.

### But isn't this just moving the goalposts?

Fair question. ARC-AGI-1 was released in 2019 and took five years to approach saturation. ARC-AGI-2 saw scores jump from 3% to 84.6% in under a year. These were not goalpost shifts — they were benchmarks doing their job: tracking real capability gains, then getting replaced when they lost signal. ARC-AGI-3 is the next iteration, designed around the specific gap that remains: interactive, adaptive reasoning in truly novel environments. It measures the thing nobody has cracked yet.

---

## How It Works — Four Pillars of Agentic Intelligence

ARC-AGI-3 tests four capabilities that the technical paper identifies as necessary for general intelligence. These map directly to what humans do naturally when encountering something unfamiliar.

### Pillar 1: Modelling

Turning raw observations into a generalisable world model that can predict future states and outcomes. Inherited from ARC-AGI-1 and 2, but now applied dynamically — the model must update as the environment reveals new mechanics across levels.

### Pillar 2: Goal-Setting

Identifying desirable future states without explicit instructions. There are no win conditions displayed. The agent must independently determine what to target based on environmental cues and its own evolving understanding of the game.

### Pillar 3: Planning and Execution

Mapping an action path from the current state to the identified goal, with the ability to course-correct based on environmental feedback. This requires both initial strategic accuracy and the agility to adapt when things do not go as expected.

### Pillar 4: Efficiency (RHAE Scoring)

Intelligence is measured as action efficiency, not just task completion. The formula: (human actions / AI actions) squared. An AI taking 10x as many steps as a human scores just 1%. This squared penalty makes brute-force approaches mathematically unviable and directly measures learning speed for the first time.

#### Why square the ratio?

The squared penalty is deliberate. If a human solves a game in 10 steps and an AI takes 100, a linear metric would give the AI 10%. The squared formula gives it 1%. At 200 steps: 0.25%. At 500 steps: 0.04%. This design choice forces systems to actually learn the environment's logic rather than systematically trying every possible action. Being faster than the human earns no bonus — the per-level score caps at 1.0. Later levels carry more weight because they require deeper understanding.

---

## The Scorecard — March 2026

The official leaderboard tests models via API with an identical system prompt — no task-specific scaffolding, no custom tooling. This is deliberate. If you need human-engineered workarounds for every new task, that is not general intelligence.

| Model / System | Score |
|----------------|-------|
| Humans (no instructions) | 100% |
| StochasticGoose — CNN + RL (preview winner) | 12.58% |
| Gemini 3.1 Pro Preview | 0.37% |
| GPT-5.4 High | 0.26% |
| Claude Opus 4.6 | 0.25% |
| Grok-4.20 | 0.00% |

Frontier LLM scores are from official API evaluation with identical system prompts. The preview winner used CNN + reinforcement learning, not an LLM.

### The scaffolding problem

Duke University built a custom harness that pushed Opus 4.6 to 97.1% on one known environment (TR87). On an unfamiliar environment (BP35): 0%. The intelligence lived in the human-built scaffolding, not the model. Chollet's argument: if the model needs task-specific human engineering to function, you are measuring the human's intelligence, not the AI's.

### Non-LLM approaches win

The top three preview entries were all non-LLM solutions — CNN-based, rule-based state graph exploration, and frame graph search without any training. A simple CNN agent outperformed GPT-5.4 by more than 12 percentage points. This suggests the path to ARC-AGI-3 runs through novel algorithmic ideas, not bigger language models.

---

## The Debate

ARC-AGI-3 has landed in a highly polarised discourse. Here are the core fault lines.

- **Methodology** — Critics point out the squared efficiency penalty, the human baseline calibration, and the exclusion of extended-thinking models. The counter: if you need 10x more actions than a human who has never seen the task, efficiency is not an unfair metric — it is the entire point.
- **Scaffolding** — The 97.1% to 0% scaffolding result is the strongest evidence against the "models just need better prompts and tools" argument. Task-specific engineering works on known tasks but fails completely on novel ones.
- **Architecture** — NYU professor Saining Xie argues LLMs are inherently limited because they learn entirely from human-generated text rather than from raw experience. The models that crack ARC-AGI-3 may need to be a fundamentally different kind of system.
- **Human Baseline** — Sceptics note the baseline uses the second-best of ten first-time players — near the top of the distribution, not the average person. The ARC team chose a strong baseline deliberately.
- **Data Contamination** — Evidence from Gemini 3's reasoning chain — correctly referencing ARC's integer-to-colour mapping without being told — suggests models have been implicitly trained on ARC data. ARC-AGI-3's interactive format makes contamination structurally harder.
- **Pace of Progress** — Labs pushed ARC-AGI-2 from 3% to 84.6% in under a year. Whether frontier labs can climb ARC-AGI-3 the same way is genuinely open, since it is specifically designed to neutralise scaffolding and scale.

---

## Decision Guide

### Pay attention if

- You are building autonomous agents that need to handle genuinely novel situations without human handholding — warehouse robotics, adaptive game AI, exploration systems.
- You are evaluating AI vendor claims about "AGI" capabilities and need a grounded reference point for what has actually been demonstrated.
- You are doing research in reinforcement learning, world models, or program synthesis — ARC-AGI-3's format maps directly to open problems in your field.
- You care about the architectural question: whether transformers/LRMs can achieve genuine adaptability or whether fundamentally new approaches are needed.

### Safely ignore if

- You are shipping products that use AI for well-defined tasks — coding assistants, summarisation, content generation. LLMs are excellent at these. ARC-AGI-3 does not change that.
- You are using AI as a tool within human-designed workflows. The scaffolding critique does not invalidate productive human-AI collaboration — it clarifies what counts as autonomy vs. automation.
- Your timeline is this quarter, not this decade. ARC-AGI-3 is about long-term capability trajectories. Current AI is already delivering massive value in narrow, well-defined domains.
- You are conflating "useful" with "intelligent." AI does not need to be AGI to transform your business. Most of the value comes from applied intelligence, not general intelligence.

---

## Practical Guidance

ARC-AGI-3 is the most important AI benchmark of 2026 — not because it humbles frontier models, but because it clarifies the conversation. The era of arguing whether AI is smart is over. The question is what kind of smart, and whether current architectures can get to genuine adaptability. For businesses, the practical takeaway is simpler: AI is extraordinarily capable within structured workflows. Do not wait for AGI to capture that value. But also do not confuse product-market fit with scientific progress. They are different races.

- **Enterprise** — Pressure-test vendor claims. When a vendor says "AGI-level," ask what they score on ARC-AGI-3. Not because sub-1% means their product is useless — it almost certainly is not — but because it tells you whether you are buying narrow capability dressed up as general intelligence.
- **Studio** — Design for the scaffolding reality. The 97.1% to 0% scaffolding result is a direct lesson for product teams. Build for graceful degradation when the model hits something genuinely novel.
- **Dojo** — Play the games yourself. The fastest way to understand what AI can and cannot do right now is to play the public ARC-AGI-3 environments and then watch the replay of a frontier model attempting the same thing.

---

## Timeline

| Date | Milestone |
|------|-----------|
| 2019 | ARC-AGI-1 launches — Chollet releases the original Abstraction and Reasoning Corpus alongside "On the Measure of Intelligence." Static grid puzzles, image-in/image-out. Early AI systems score near 0%. First Kaggle competition (2020) draws 913 teams; winner hits ~20% via brute-force program search. |
| 2024 | ARC Prize 2024 and the reasoning breakthrough — ARC Prize Foundation launches with $1M+ in prizes and 1,430 teams. Test-time training reaches 53.5% on ARC-AGI-1. OpenAI's o3 demonstrates genuine fluid intelligence on the benchmark. |
| 2025 | ARC-AGI-2 and rapid saturation — Version 2 launches with harder compositional puzzles. NVIDIA's NVARC team wins first place at 24%. Scaffolding and scale push scores to 84.6% within months. Evidence of data contamination emerges. |
| Mar 2026 | ARC-AGI-3 resets the scoreboard — First fully interactive benchmark. 135 handcrafted environments, 1,000+ levels. In-house game studio. $2M prize pool across two tracks. Launched at Y Combinator with a fireside between Chollet and Sam Altman. Every frontier model scores under 1%. A CNN-based agent leads at 12.58%. |

---

## Resources

### Official

- [ARC-AGI-3 — Play the games yourself](https://arcprize.org/arc-agi/3)
- [Launch announcement — Official blog post](https://arcprize.org/blog/arc-agi-3-launch)
- [Technical paper — Full methodology and results](https://arxiv.org/html/2603.24621v1)
- [RHAE scoring docs — How scores are calculated](https://docs.arcprize.org/methodology)
- [Leaderboard — Live scores and cost analysis](https://arcprize.org/leaderboard)
- [Kaggle competition — $2M prize pool](https://www.kaggle.com/competitions/arc-prize-2026-arc-agi-3)
- [ARC Prize 2025 results — Context for v3](https://arcprize.org/blog/arc-prize-2025-results-analysis)

### Sources

- [ARC Prize Foundation — Launch Blog](https://arcprize.org/blog/arc-agi-3-launch)
- [ARC-AGI-3 Technical Report](https://arxiv.org/html/2603.24621v1)
- [RHAE Scoring Methodology](https://docs.arcprize.org/methodology)
- [ARC Prize 2025 Results](https://arcprize.org/blog/arc-prize-2025-results-analysis)
- [The Decoder — ARC-AGI-3 Analysis](https://the-decoder.com/arc-agi-3-offers-2m-to-any-ai-that-matches-untrained-humans-yet-every-frontier-model-scores-below-1/)
- [Fast Company — ARC-AGI-3 Coverage](https://www.fastcompany.com/91515360/arc-prize-foundation-new-ai-benchmark)
- [Decrypt — Benchmark Analysis](https://decrypt.co/362496/is-agi-here-not-even-close-ai-benchmark)

---

*Content validated March 2026. ARC-AGI is a project of the ARC Prize Foundation, co-founded by Francois Chollet and Mike Knoop. Independent educational explainer by [Imbila.AI](https://imbila.ai).*
