# Agent Skills Explained

> The open standard for teaching AI agents reusable, modular capabilities via SKILL.md files

**Source:** [know.imbila.ai/agent-skills-explainer](https://know.imbila.ai/agent-skills-explainer)
**Validated:** March 2026 | **Author:** [Imbila.AI](https://imbila.ai) | **License:** CC-BY-SA-4.0
**Structured data:** [agent-skills.json](https://raw.githubusercontent.com/imbilawork/know.agent/main/agentapi/data/agent-skills.json)

---

## What Are Agent Skills

Agent Skills are a simple, open format for giving AI agents new capabilities and domain-specific expertise. Each skill is a directory containing at minimum a SKILL.md file — YAML frontmatter describing the skill plus Markdown instructions the agent follows. Optional subdirectories hold scripts, reference docs, and templates. The agent discovers installed skills at startup, sees only lightweight metadata, and loads full instructions only when it decides a skill is relevant to the current task.

Think of it as an onboarding guide for an AI colleague. Instead of cramming every possible instruction into one bloated system prompt, you package domain knowledge into discrete, reusable modules. The agent stays lean until it actually needs the expertise — then loads just what's required. Anthropic published the specification as an open standard on 18 December 2025 at agentskills.io, and within weeks it was adopted by OpenAI Codex, Gemini CLI, GitHub Copilot, Cursor, and dozens of other tools.

**Key stats:** 26+ platforms adopted · 500K+ skills indexed · ~90% token reduction via targeted scripts · 50–100 tokens per skill at discovery

### The Problem: Context Window Bloat
Agents are capable generalists, but they don't know your workflows, security checks, or domain edge cases. Loading everything upfront wastes tokens and degrades performance as context fills with irrelevant instructions.

### The Solution: Modular, On-Demand Expertise
Skills package instructions, scripts, and reference material into self-contained directories. The agent sees skill names and descriptions at startup (~50–100 tokens each) and loads full instructions only when triggered.

### The Result: Write Once, Use Everywhere
A skill written for Claude Code works identically in OpenAI Codex, Gemini CLI, GitHub Copilot, and every other platform implementing the spec. Portable, version-controlled, and sharable across teams.

**Flow:** Skill Directory (SKILL.md + assets) → Discovery (Name + description only) → Activation (Full instructions load) → Execution (Scripts + references run)

---

## Why It Matters

Agent Skills solved a problem every AI tool vendor had independently: how to give agents specialised knowledge without wrecking context window efficiency. The speed of adoption — from a single vendor's internal pattern to an industry-wide open standard in under six months — signals that this format hit a genuine architectural nerve.

### Why not just use MCP for everything?
MCP (Model Context Protocol) is excellent for connecting agents to external APIs, databases, and live services — it handles tool-calling and structured data retrieval. Agent Skills solve a different problem: packaging procedural knowledge, workflows, and instructions that the agent should follow. MCP gives agents tools to call. Skills give agents expertise to apply. In practice, the two are complementary — a skill can reference MCP servers, and many production workflows use both.

---

## How It Works

Agent Skills are built on two core engineering principles: progressive disclosure (load information in tiers, not all at once) and token intentionality (strictly control what enters, exits, and never touches the context window).

### Three-Tier Progressive Disclosure
At startup, the agent reads only YAML frontmatter — name and description — from every installed skill. This is the Discovery tier. When the agent decides a skill is relevant, it loads the full SKILL.md body (Activation, recommended under 5,000 tokens). Supporting scripts and reference files load only during Execution. This means you can install dozens of skills with negligible context cost.

### SKILL.md Structure
Every skill starts with a SKILL.md file. YAML frontmatter declares name, description, optional license and metadata. The Markdown body contains the instructions the agent follows when the skill activates. The spec recommends keeping the body under 500 lines.

```yaml
---
name: api-security-reviewer
description: Reviews API code for security
  vulnerabilities. Use when reviewing
  backend code or APIs.
license: Apache-2.0
---

# API Security Review
Analyze code for auth issues,
injection attacks, data exposure...
```

### Code Scripts Beat Vague Markdown
A common mistake: writing goals in SKILL.md but relying on the LLM to figure out execution via generic tools. If an agent uses a default web fetcher, it can burn 8,000+ tokens on a single HTML page. A targeted Python or Bash script in scripts/ can filter noise, parse structured data, and return clean JSON — cutting token consumption by up to 90%. Pre-making logical decisions in code means the LLM doesn't waste compute figuring it out on the fly.

### Deterministic Tooling in Scripts
Skills can bundle executable scripts (Python, Bash, Node, etc.) that the agent runs in a sandbox. These scripts handle operations that benefit from deterministic execution — sorting, parsing, data transformation, API calls — rather than burning tokens on tasks code handles better. Anthropic's own PDF skill includes a Python script that extracts form fields without loading either the script or the PDF into context.

---

## Ecosystem

The Agent Skills standard has been adopted across the AI coding and agent ecosystem at a pace reminiscent of MCP's earlier spread. The specification lives at agentskills.io, maintained by Anthropic and open to community contributions.

### Agent Platforms
Claude Code, Codex CLI, Gemini CLI — The three major model vendors all support SKILL.md natively. Claude Code pioneered the format, OpenAI adopted it for Codex, and Google's Gemini CLI implements full progressive disclosure with consent-based activation.

### IDE Integration
GitHub Copilot, Cursor, VS Code — Microsoft adopted Agent Skills as a first-class feature in GitHub Copilot and VS Code. Cursor, one of the most popular AI-native IDEs, supports the standard alongside its existing rules system. Skills created in any tool are portable.

### Marketplaces & Directories
skills.sh, SkillsMP, SkillHub, LobeHub — A growing ecosystem of directories indexes community and official skills from GitHub repositories. SkillsMP claims 500,000+ indexed skills. Security-focused directories like SkillsDirectory.com scan for prompt injection and credential theft.

### When to use what

| Need | Use This | Why |
|------|----------|-----|
| Repeatable workflow with domain logic | Agent Skill | Packages instructions + scripts the agent loads on demand. Portable across platforms. |
| Connect to external API or service | MCP Server | Structured tool-calling protocol for live data sources. Handles auth, schemas, streaming. |
| Project-wide coding conventions | CLAUDE.md / GEMINI.md | Always-loaded context for persistent project rules. Skills complement these for specialised tasks. |
| One-off explicit command | Slash Command | User-invoked, deterministic triggers. Skills are model-invoked based on context matching. |

---

## Use Cases

- **Code Review & Security Audit** — Skills that run structured review passes checking for auth issues, injection vectors, and code quality — then fix problems before presenting code to the developer. Anthropic's official simplify skill does this natively.
- **Brand-Consistent Outputs** — Skills package brand guidelines, templates, and design tokens so every generated document, presentation, or report follows organisational standards without re-explaining them each session.
- **Targeted Web Scraping** — Instead of the agent fetching entire HTML pages (8,000+ tokens), a bundled script filters out scripts, styles, and nav — returning only structured data. Pre-defining CSS selectors in the script eliminates per-run discovery costs.
- **Release & Deployment Workflows** — Git release skills generate changelogs, tag versions, and create PRs following team conventions. Firebase skills scaffold apps with auth and database configuration pre-wired to best practices.
- **Regulatory Document Review** — Skills for MDR compliance, SOC2 preparation, and accessibility auditing (WCAG 2.2) encode regulatory checklists and verification workflows that the agent applies consistently across code and documentation.
- **Experiment Analysis Pipelines** — Skills that query databases, run analysis scripts, and produce comparative reports — with bundled schema references so the agent doesn't need to rediscover data structures on every invocation.

---

## Decision Guide

### Use Agent Skills when
- You repeat the same prompt patterns across conversations — code review checklists, release workflows, data analysis pipelines. Skills eliminate prompt repetition.
- You need consistent, deterministic outputs — brand compliance, regulatory checks, security audits — where bundled scripts handle the repeatable logic.
- Your team shares domain knowledge that new hires (or new agent sessions) need. Skills act as version-controlled onboarding docs for AI colleagues.
- You work across multiple AI tools and want portable capabilities. A skill written for Claude Code also works in Codex, Gemini CLI, and Copilot.

### Skip Agent Skills when
- Your task is genuinely one-off. Writing a skill for something you'll do once is overhead — just use the prompt directly.
- You need real-time data from external services. Skills aren't API connectors — use MCP servers for live data integrations. Skills can reference MCP, but they don't replace it.
- Your instructions are short enough for CLAUDE.md or GEMINI.md. If the guidance fits in persistent project context without bloating it, a skill adds unnecessary indirection.
- You're working in a constrained environment without filesystem access. Skills require directory structures — they don't work in environments that can't read local files.

---

## Timeline

| Date | Milestone |
|------|-----------|
| Early 2025 | Claude Code Internal Skills — Anthropic develops skills as an internal mechanism for Claude Code, structured folders of instructions that Claude loads dynamically. |
| Sep 2025 | Context Engineering Guide Published — Anthropic publishes its engineering guide on context engineering for agents, establishing the theoretical foundation for progressive disclosure. Released alongside Claude Sonnet 4.5. |
| Nov 2025 | Building More Efficient Agents — Anthropic's engineering blog describes presenting tools as a filesystem the model can explore incrementally — the architectural pattern that skills formalise. |
| Dec 2025 | Open Standard Published — On 18 December 2025, Anthropic publishes Agent Skills as an open standard at agentskills.io with an Apache 2.0 code license and CC-BY-4.0 documentation license. |
| Jan 2026 | Rapid Cross-Platform Adoption — OpenAI adopts SKILL.md for Codex CLI. Google's Gemini CLI implements full progressive disclosure. GitHub Copilot, Cursor, VS Code, OpenCode, and Amp all add native support. |
| Mar 2026 | Ecosystem Maturation — 500,000+ skills indexed across public marketplaces. Google publishes official Gemini API skills with 87–96% accuracy improvement. Security scanning becomes standard. |

---

## Resources

### Official
- [Agent Skills Specification](https://agentskills.io/specification) — The canonical format spec
- [agentskills/agentskills](https://github.com/agentskills/agentskills) — Spec repo, SDK, and documentation
- [anthropics/skills](https://github.com/anthropics/skills) — Anthropic's official example skills
- [Equipping Agents for the Real World](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) — Anthropic engineering blog
- [Agent Skills API Documentation](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) — Claude API integration guide
- [Claude Code Skills Docs](https://code.claude.com/docs/en/skills) — Building skills for Claude Code
- [OpenAI Codex Skills](https://developers.openai.com/codex/skills) — Using skills with Codex CLI
- [Gemini CLI Skills](https://geminicli.com/docs/cli/skills/) — Google's implementation
- [VS Code Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills) — GitHub Copilot integration

### Community
- [skills.sh](https://skills.sh/) — The Agent Skills Directory
- [SkillsMP](https://skillsmp.com/) — 500K+ indexed skills with filtering
- [Skills Directory](https://www.skillsdirectory.com/) — Security-scanned skills registry
- [claude-skills (5.2K stars)](https://github.com/alirezarezvani/claude-skills) — 192+ skills for 11 platforms
- [google-gemini/gemini-skills](https://github.com/google-gemini/gemini-skills) — Official Gemini API skills
- [Anthropic Skills Course](https://anthropic.skilljar.com/introduction-to-agent-skills) — Official training on building skills

### Sources
- [Agent Skills Specification — agentskills.io](https://agentskills.io/specification)
- [Anthropic Engineering Blog (Jan 2026)](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Google Developers Blog — Closing the Knowledge Gap (Mar 2026)](https://developers.googleblog.com/closing-the-knowledge-gap-with-agent-skills/)
- [Simon Willison — Agent Skills (Dec 2025)](https://simonwillison.net/2025/Dec/19/agent-skills/)
- [State of Context Engineering in 2026 — SwirlAI](https://www.newsletter.swirlai.com/p/state-of-context-engineering-in-2026)

---

*Content validated March 2026. Agent Skills is an open standard maintained by Anthropic under Apache 2.0 (code) and CC-BY-4.0 (documentation). Independent educational explainer by [Imbila.AI](https://imbila.ai).*
