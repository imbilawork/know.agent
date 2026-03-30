# know.agent

Agent-friendly versions of [know.imbila.ai](https://know.imbila.ai) explainer pages.

## Why this exists

The HTML explainers at know.imbila.ai sit behind Cloudflare, which blocks most automated agent access. This repo provides the same content in formats agents can reliably consume via `raw.githubusercontent.com`.

## Structure

```
know.agent/
├── llms.txt              # Agent discovery file — start here
├── content/              # Markdown explainers (full prose)
│   ├── arc-agi-3.md
│   ├── agent-skills.md
│   ├── agents2026.md
│   ├── claude-code-skills.md
│   ├── cloudflare-ai.md
│   ├── crewai.md
│   ├── dlss5.md
│   ├── elevencreative.md
│   ├── langchain.md
│   ├── liteparse.md
│   ├── llama-cpp.md
│   ├── nemoclaw.md
│   └── teams-agent-channel.md
├── data/                 # Structured JSON (programmatic access)
│   ├── arc-agi-3.json
│   ├── agent-skills.json
│   ├── agents2026.json
│   ├── claude-code-skills.json
│   ├── cloudflare-ai.json
│   ├── crewai.json
│   ├── dlss5.json
│   ├── elevencreative.json
│   ├── langchain.json
│   ├── liteparse.json
│   ├── llama-cpp.json
│   ├── nemoclaw.json
│   └── teams-agent-channel.json
└── schema/               # JSON schema definitions
    └── explainer-v1.json
```

## Usage

### For agents / LLMs
Point your agent at `llms.txt` for discovery, then fetch the markdown or JSON for any explainer:

```
# Discovery
https://raw.githubusercontent.com/imbilawork/know.agent/main/llms.txt

# Full explainer (markdown)
https://raw.githubusercontent.com/imbilawork/know.agent/main/agentapi/content/{id}.md

# Structured data (JSON)
https://raw.githubusercontent.com/imbilawork/know.agent/main/agentapi/data/{id}.json
```

### For MCP servers / tool integrations
The JSON files are designed to be returned directly as tool responses. Each file includes structured `decision_guide`, `products`, `pricing`, and `resources` fields that agents can extract without parsing prose.

## Available explainers

| ID | Title | Topic |
|----|-------|-------|
| `arc-agi-3` | ARC-AGI-3 Explained | Interactive reasoning benchmark for AGI |
| `agents2026` | Top Agent Frameworks — Q2 2026 | Comparison of 10 agent frameworks |
| `agent-skills` | Agent Skills Explained | Open standard for modular AI agent capabilities |
| `claude-code-skills` | Claude Code Skills Explained | Skill system for AI coding agents |
| `crewai` | CrewAI Explained | Multi-agent orchestration framework |
| `cloudflare-ai` | Cloudflare AI Explained | Serverless AI inference and agents |
| `dlss5` | NVIDIA DLSS 5 Explained | Neural rendering technology |
| `elevencreative` | ElevenCreative Explained | AI creative workspace (speech, music, video) |
| `langchain` | LangChain Explained | AI agent framework |
| `liteparse` | LiteParse Explained | Local document parsing for agents |
| `llama-cpp` | llama.cpp Explained | Local LLM inference engine |
| `nemoclaw` | NVIDIA NemoClaw Explained | Sandboxed agent infrastructure |
| `teams-agent-channel` | Microsoft Teams as an AI Agent Channel | Building AI agents in Teams |

## Adding new explainers

Each explainer published at know.imbila.ai gets a corresponding pair of files:
1. `content/{id}.md` — Markdown version of the full explainer
2. `data/{id}.json` — Structured JSON following the `explainer-v1` schema

Update `llms.txt` with the new entry.

## License

[CC-BY-SA-4.0](https://creativecommons.org/licenses/by-sa/4.0/) — Imbila.AI
