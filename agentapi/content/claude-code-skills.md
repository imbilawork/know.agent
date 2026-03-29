# Claude Code Skills Explained

> Turn your AI coding agent into a specialist. On demand.

**Source:** [know.imbila.ai/claude-code-skills-explainer](https://know.imbila.ai/claude-code-skills-explainer)
**Validated:** March 2026 | **Author:** [Imbila.AI](https://imbila.ai) | **License:** CC-BY-SA-4.0
**Structured data:** [claude-code-skills.json](https://raw.githubusercontent.com/imbilawork/know.agent/main/agentapi/data/claude-code-skills.json)

---

## What Are Claude Code Skills

Claude Code is Anthropic's command-line AI coding agent. Out of the box, it's a strong generalist — it can write code, run tests, refactor files, and navigate repos. But it doesn't know your preferred tech stack, your company's API conventions, or the latest community techniques for a tool released last month. Skills fix that.

A skill is a Markdown file (typically `SKILL.md`) that contains instructions, best practices, and executable workflows for a specific domain. When you invoke a skill, its contents are loaded into Claude's context window — giving it focused expertise for exactly the task at hand, without bloating every interaction with irrelevant instructions.

The pattern works like context cartridges: SKILL.md (instructions file) -> Trigger (user invokes skill) -> Context Load (injected into agent) -> Specialist Output (domain-expert results).

**The Problem:** AI models are trained on data that's months or years old. Community best practices, new tool versions, and emerging patterns aren't in the training data.

**The Solution:** Skills are modular instruction sets stored as files. They're only loaded when relevant — keeping the base agent lean while giving it deep expertise when you need it.

**The Result:** Your AI assistant goes from "I can probably help with that" to "here's exactly how to do this, based on what's working right now."

**Key stats:** 87K+ skills on SkillsMP marketplace · 10K+ GitHub stars on /last30days · 17.3K likes on Remotion skill launch · 9 signal sources in /last30days v2.9

---

## Why It Matters

Claude Code skills went from a niche developer trick to a full ecosystem in a matter of months. Marketplaces have emerged, curated lists are actively maintained, and individual skills like the Remotion video skill have gone viral. This isn't theoretical — the community is building, sharing, and using these at scale.

**Why not just use a long system prompt?** You could jam all your instructions into `CLAUDE.md`, but context windows are finite and attention degrades with length. The community consensus: keep your base CLAUDE.md short (around 1K tokens) and use skills for "context on demand." This way, the agent only loads specialist knowledge when it's relevant — keeping every interaction sharp and focused.

---

## How It Works

Skills follow a consistent pattern with four moving parts:

### Part 1: SKILL.md — The Instruction File
The core of every skill. A Markdown file containing instructions, constraints, workflow steps, and output templates. This is what gets injected into the agent's context when the skill is triggered. The best skills are specific about format, order of operations, and anti-patterns to avoid.

```markdown
# ~/.claude/skills/last30days/SKILL.md

Research ANY topic across Reddit, X,
Bluesky, YouTube, TikTok, HN, Polymarket.

Parse the user's input for:
  TOPIC: What they want to learn about
  TARGET TOOL: Where they'll use prompts
```

### Part 2: Trigger Description
Skills need a description that tells the agent when to activate them. This is essentially a routing instruction — it contains the keywords and intent patterns that should cause the skill to load. Good descriptions are specific; bad ones are vague and cause false triggers or missed activations.

### Part 3: Scripts & Executables
Many skills aren't just instructions — they include actual code. The /last30days skill ships with a full Python pipeline: API clients for Reddit, X, YouTube, and more, plus scoring, deduplication, and rendering modules. The SKILL.md tells the agent how to orchestrate these scripts.

### Part 4: Fixtures & Tests
Production-grade skills include mock data for offline testing and evaluation scripts to measure output quality. This matters when you're building skills for business use — you need to know the skill produces consistent, reliable results before deploying it across a team.

---

## The Ecosystem

While skills originated in Claude Code, the pattern has spread. Codex CLI, Gemini extensions, and other agents now support similar skill-loading mechanisms. The SKILL.md format is becoming a de facto standard for agent extensibility.

### SkillsMP
The largest directory of community skills. Browse, install, and publish skills. Covers everything from document creation to security auditing to video production.

### awesome-claude-skills
Community-maintained GitHub repos that curate the best skills by category. Multiple lists compete for comprehensiveness — a sign of a healthy ecosystem.

### Superpowers & SuperClaude
Meta-frameworks that bundle multiple skills into coherent capability sets. Superpowers alone has 27K+ GitHub stars. These let you bootstrap a fully-loaded agent in one install.

### When to use what

| Need | Use This | Why |
|------|----------|-----|
| Browse available skills | SkillsMP | Largest directory, searchable by category and use case |
| Find vetted, high-quality skills | awesome-claude-skills | Curated by developers — quality over quantity |
| Full agent capability upgrade | Superpowers | Bundled skill sets for common workflows |
| Custom business workflow | Build your own | Maximum control — encode your team's exact process |

---

## Case Study: /last30days

The /last30days skill by Matt Van Horn (co-founder of Lyft) is the most visible skill in the ecosystem — 10K+ GitHub stars and nine integrated signal sources. It demonstrates every principle of good skill design at scale.

**What It Does:** Scans Reddit, X, Bluesky, YouTube, TikTok, Instagram, Hacker News, Polymarket, and the web for the last 30 days of discussion on any topic. Scores results by recency, relevance, and engagement, then synthesises a grounded summary with engagement metrics and — if requested — copy-paste-ready prompts optimised for a target tool.

**Why It Matters:** It combines a rich SKILL.md (with format-matching instructions, anti-patterns, and output templates) with a full Python pipeline for data gathering and scoring. It proves that skills aren't just static instructions — they can orchestrate complex multi-step workflows with real API calls, caching, deduplication, and quality scoring.

**Architecture:** Modular Python pipeline with separate modules for environment loading, date handling, caching, HTTP, model selection, schema, platform-specific API clients (Reddit, X, YouTube, etc.), normalisation, scoring, deduplication, and rendering.

**Quality Controls:** Ships with mock data for offline testing, evaluation scripts for synthesis quality, and a scoring algorithm that weighs recency, relevance, and engagement.

**Cross-Platform:** Installable on Claude Code, Codex CLI, and Gemini via their respective extension mechanisms. Also available through the plugin marketplace.

**What the community actually builds with it:** Prompt research (discovering what techniques work for tools like ChatGPT, Midjourney, or Suno), product intelligence (gauging community sentiment on a new release), developer workflow discovery (finding emerging patterns for tools like Cursor or Remotion), trend detection (viral content, music, culture), and competitive analysis.

---

## Use Cases

- **Video Production (Remotion Skill)** — Generate animated launch videos, explainers, and marketing content from Claude Code. The viral skill post gathered 17.3K likes on X — proof that skills can automate expensive creative workflows.
- **Security Auditing (Trail of Bits Skills)** — Professional security skills for CodeQL and Semgrep that turn Claude Code into a security auditor. Run static analysis, identify vulnerabilities, and generate fix suggestions from the terminal.
- **Document Creation (docx / pptx / xlsx Skills)** — Create polished Word documents, presentations, and spreadsheets with proper formatting, tables of contents, and brand styling.
- **Image Generation (Nano Banana Pro Skills)** — Research current community techniques for AI image generation, then produce optimised prompts in the right format. The skill adapts its output based on what's actually working this month.
- **Developer Workflow (Review Loop — Codex + Claude)** — Wire Claude Code and Codex together via MCP. Claude implements, Codex reviews, Claude fixes. An automated code review loop that catches bugs without human context-switching.
- **Task Automation (Claude Command Suite)** — 148+ commands and 54 agents bundled into a single skill set. Covers everything from Git workflows to test-driven development to systematic debugging patterns.

---

## Decision Guide

### Use skills when
- Your team repeats the same complex workflow (document generation, code review, research) and wants consistent, high-quality output every time.
- You need domain-specific knowledge that changes frequently — current community best practices, up-to-date API patterns, or evolving industry standards.
- You're building AI agents that need to operate autonomously with reliable, repeatable behaviour.
- You want to encode institutional knowledge — coding standards, proposal formats, client communication styles — into shareable, version-controlled files.

### Skip skills when
- The task is genuinely simple and one-off. Writing a skill for something you'll do once is over-engineering.
- Your team doesn't use Claude Code (or a compatible agent). Skills are agent-specific — they don't help with ChatGPT or browser-based assistants.
- You need real-time data but don't have API keys. Research skills like /last30days require API access to function.
- You're looking for a no-code solution. Skills involve Markdown files, terminal commands, and sometimes Python scripts. They're developer-friendly, not beginner-friendly.

---

## Practical Guidance

Skills are where AI moves from "helpful assistant" to "operational teammate." When you write a skill, you're not just prompting — you're encoding a repeatable process that runs the same way every time. That's the difference between using AI and operating with AI.

### Enterprise Use Cases — Custom Workflow Skills
Skills can encode team processes — from proposal generation to compliance checking to competitive intelligence. Each skill is version-controlled, testable, and auditable. The AI agent works the way the business works.

### Architecture — Skill Design Patterns
Structuring the SKILL.md pattern, setting up trigger descriptions, building supporting scripts, and integrating with MCP servers. The goal: a skill library that scales with the team.

### Learning — Building Your First Skill
The best way to learn is to build one from scratch. Start with the SKILL.md pattern, add a trigger description, test with real prompts, and share with your team. The pattern clicks fast once you've done it once.

---

## Timeline

| Date | Milestone |
|------|-----------|
| Mid 2024 | Claude Code launches — Anthropic releases Claude Code as a command-line coding agent. Users start experimenting with CLAUDE.md files to customise behaviour. |
| Late 2024 | The CLAUDE.md problem — Power users hit context window limits. Community starts splitting instructions into separate files — the seed of the skills pattern. |
| Early 2025 | Skills formalise — SKILL.md convention stabilises. Skills get description frontmatter for trigger routing. /last30days launches and gains rapid adoption. |
| Mid 2025 | Ecosystem explosion — SkillsMP launches with 87K+ skills. Remotion skill goes viral. Superpowers bundles skills into meta-packages. Pattern spreads to Codex CLI and Gemini. |
| 2026 | Multi-source, multi-agent — /last30days reaches v2.9+ with nine signal sources. Skills orchestrate multi-agent workflows — Claude implements while Codex reviews. |

---

## Resources

### Official & Community
- [/last30days on GitHub](https://github.com/mvanhorn/last30days-skill) — The research skill that anchors this explainer
- [Claude Code Documentation](https://docs.claude.com) — Official Anthropic docs for Claude Code
- [Matt Van Horn (GitHub)](https://github.com/mvanhorn) — /last30days creator, Lyft co-founder

### Sources
- [/last30days GitHub Repository](https://github.com/mvanhorn/last30days-skill)
- [/last30days SKILL.md](https://github.com/mvanhorn/last30days-skill/blob/main/SKILL.md)
- [/last30days SPEC.md](https://github.com/mvanhorn/last30days-skill/blob/main/SPEC.md)
- [Anthropic Claude Code Docs](https://docs.claude.com)

---

*Content validated March 2026. Claude Code is a product of Anthropic. /last30days is an open-source project by Matt Van Horn. Independent educational explainer by [Imbila.AI](https://imbila.ai).*
