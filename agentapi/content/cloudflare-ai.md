# Cloudflare AI Explained

> Serverless AI inference, agents, and RAG — running on the network that powers 20% of the internet

**Source:** [know.imbila.ai/cloudflare-ai-explainer](https://know.imbila.ai/cloudflare-ai-explainer)
**Validated:** March 2026 | **Author:** [Imbila.AI](https://imbila.ai) | **License:** CC-BY-SA-4.0
**Structured data:** [cloudflare-ai.json](https://raw.githubusercontent.com/imbilawork/know.agent/main/agentapi/data/cloudflare-ai.json)

---

## What Is Cloudflare AI

Cloudflare AI is a suite of products within Cloudflare's Developer Platform that lets you run open-source AI models — LLMs, image generators, embedding models, speech-to-text, and more — on serverless GPUs distributed across Cloudflare's global network. You write a few lines of code, call an API, and Cloudflare handles provisioning, scaling, and routing requests to the nearest available GPU.

The same company that sits between your users and your servers for CDN, DNS, and DDoS protection has strapped NVIDIA H100 GPUs to that network and is selling inference by the request. Your AI workload runs physically close to your users — lower latency, fewer hops, no ML engineering team required, no GPU reservation contracts, no idle hardware bills.

**Key stats:** 89+ models available · 200+ GPU cities · $0.011 per 1K Neurons · 10K free Neurons/day

---

## Products

### Workers AI
The inference engine. Call 89+ open-source models (LLMs, image gen, embeddings, TTS, ASR) via a binding in your Worker or a REST API. Models run on NVIDIA H100 GPUs across Cloudflare's network. Pricing is per-Neuron (GPU compute unit), with 10,000 free per day.

```javascript
const response = await env.AI.run(
  "@cf/meta/llama-4-scout-17b-16e-instruct",
  { messages: [{ role: "user", content: prompt }] }
);
```

### AI Gateway
A proxy layer in front of any AI provider — Workers AI, OpenAI, Anthropic, etc. One line of config gives you request logging, analytics, caching (including semantic caching), rate limiting, model fallback, and cost tracking. Works with the OpenAI SDK. Free on all plans.

### Vectorize
A globally distributed vector database for storing embeddings. Supports metadata filtering (string, number, boolean), integrates natively with Workers AI embedding models. Enables RAG, semantic search, and recommendation workflows.

### AI Search
Formerly AutoRAG. A fully managed RAG pipeline — connect an R2 bucket or website, and Cloudflare handles chunking, embedding, indexing, and querying automatically. Supports continuous re-crawling, multitenancy via folder-based filters, and streaming responses. Currently in open beta.

### Agents SDK
A TypeScript SDK for building persistent, stateful AI agents on Durable Objects. Agents maintain state over long sessions, support WebSocket hibernation (zero cost when idle), MCP client/server support, scheduled tasks, and Code Mode — where the LLM writes code against a typed SDK instead of individual tool calls, reducing token usage by up to 87.5%.

### Infire (Engine)
Cloudflare's custom LLM inference engine, written in Rust. Replaces Python-based stacks like vLLM. Uses granular CUDA graphs, JIT kernel compilation, and paged KV caching. Benchmarks show 7% faster inference than vLLM 0.10.0 on H100s, with 82% lower CPU overhead.

---

## Ecosystem

| Layer | Product | Description |
|-------|---------|-------------|
| Compute | Workers + Durable Objects | Serverless functions (V8 isolates) and persistent stateful objects |
| Storage | R2 + D1 + KV | S3-compatible object storage (zero egress), serverless SQL, global key-value |
| Protocol | MCP Servers | Managed remote MCP servers for Cloudflare API (2,500+ endpoints) and partners |

### When to use what

| Need | Use This | Why |
|------|----------|-----|
| Run an LLM or image model | Workers AI | Serverless, pay-per-request, 89+ open-source models at the edge |
| Monitor & control AI costs | AI Gateway | Caching, fallback, logging across any provider |
| Build semantic search / RAG | Vectorize + AI Search | Vector DB for custom RAG; AI Search for zero-config managed pipelines |
| Build a persistent AI agent | Agents SDK | Stateful execution on Durable Objects with MCP, scheduling, Code Mode |
| Store documents / training data | R2 | Zero egress fees, S3-compatible, feeds into AI Search pipelines |

---

## Use Cases

- **AI-Powered Customer Support** — RAG pipelines grounding LLM responses in knowledge bases. AI Search for ingestion, Workers AI for generation, Durable Objects for session continuity.
- **Semantic Search & Recommendations** — Embeddings via Workers AI, stored in Vectorize, queried by meaning. Product search, content discovery, anomaly detection.
- **Image Generation & Media Processing** — FLUX.2, Stable Diffusion for text-to-image. Deepgram and Whisper for speech-to-text. MeloTTS for voice synthesis.
- **Autonomous AI Agents** — Long-running agents on Agents SDK. MCP integration for tool use. Code Mode for token-efficient orchestration.
- **AI-Enhanced App Security** — DLP false-positive reduction, email threat analysis, automated code review. Internal Bonk agent processed 7B+ tokens daily.
- **AI-Powered DevEx** — MCP servers exposing APIs to agents. Cloudflare MCP server covers 2,500+ endpoints with two tools.

---

## Decision Guide

### ✓ Use Cloudflare AI when
- You want serverless, pay-per-use inference with no GPU reservation — particularly for variable or spiky workloads.
- Latency matters and your users are geographically distributed. Edge inference in 200+ cities.
- You're already on Cloudflare for Workers, Pages, R2, or DNS. Native integration.
- You want to run open-source models (Llama, FLUX, Whisper) without managing GPU infrastructure.

### ✗ Skip Cloudflare AI when
- You need proprietary frontier models (GPT-4o, Claude, Gemini) as your primary. Workers AI only runs open-source models.
- You need fine-tuning or custom model training. Cloudflare supports LoRAs but doesn't offer training infrastructure.
- You need guaranteed GPU capacity for sustained high-throughput workloads. Serverless means shared resources and potential cold starts.
- You need models Cloudflare doesn't carry. Catalogue is curated, not open-ended. Custom hosting requires enterprise.

---

## Pricing

| Product | Free Tier | Paid Pricing |
|---------|-----------|-------------|
| Workers AI | 10K Neurons/day | $0.011 / 1K Neurons above free |
| AI Gateway | 100K logs/month | 1M logs on Workers Paid; Logpush extra |
| Vectorize | Included in Workers plans | Usage-based (request units + storage) |
| AI Search | Open beta (free during beta) | TBD |
| Agents SDK | Durable Objects free tier | Durable Objects usage-based pricing |

---

## Timeline

| Date | Milestone |
|------|-----------|
| Sep 2023 | Workers AI Launch — open-source models, 100+ GPU cities, Hugging Face partnership, Vectorize |
| Apr 2024 | GA — Neuron pricing, LoRA support, Python Workers, AI Playground |
| Sep 2024 | H100 NVL GPUs, Llama 3.1 70B, 180+ cities, Infire revealed |
| Mar 2025 | Agents SDK & MCP server support, partner integrations |
| Sep 2025 | AI Week — Infire deep dive, MCP Portals, AI Search beta, Firewall for AI |
| Dec 2025 | Replicate acquisition |
| Mar 2026 | Kimi K2.5 (256K context), Code Mode, unified MCP server, Nemotron 3, GPT-OSS |

---

## Resources

### Official Documentation
- [Workers AI Docs](https://developers.cloudflare.com/workers-ai/)
- [AI Gateway Docs](https://developers.cloudflare.com/ai-gateway/)
- [Vectorize Docs](https://developers.cloudflare.com/vectorize/)
- [AI Search Docs](https://developers.cloudflare.com/ai-search/)
- [Agents SDK Docs](https://developers.cloudflare.com/agents/)
- [Agents SDK GitHub](https://github.com/cloudflare/agents)
- [Model Catalogue](https://developers.cloudflare.com/workers-ai/models/)
- [Pricing Reference](https://developers.cloudflare.com/workers-ai/platform/pricing/)

### Sources
- [Workers AI Large Models Blog (Mar 2026)](https://blog.cloudflare.com/workers-ai-large-models/)
- [Infire Inference Engine Blog](https://blog.cloudflare.com/cloudflares-most-efficient-ai-inference-engine/)
- [Code Mode: MCP in ~1,000 Tokens](https://blog.cloudflare.com/code-mode-mcp/)

---

*Content validated March 2026. Independent educational explainer by [Imbila.AI](https://imbila.ai).*
