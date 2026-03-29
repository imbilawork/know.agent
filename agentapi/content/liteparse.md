# LiteParse Explained

> Fast, local document parsing for AI agents

**Source:** [know.imbila.ai/liteparse-explainer](https://know.imbila.ai/liteparse-explainer)
**Validated:** March 2026 | **Author:** [Imbila.AI](https://imbila.ai) | **License:** CC-BY-SA-4.0
**Structured data:** [liteparse.json](https://raw.githubusercontent.com/imbilawork/know.agent/main/agentapi/data/liteparse.json)

---

## What Is LiteParse

LiteParse is an open-source document parsing library by LlamaIndex. It extracts text from PDFs, Office documents, and images while preserving where that text sat on the page — the columns, the spacing, the layout. It runs entirely on your machine. No cloud calls, no API keys, no LLMs involved in the parsing itself.

The problem it solves is specific: AI agents need to read documents, but most parsers either scramble the layout trying to convert everything to Markdown, or they require expensive cloud APIs that add latency and cost. LiteParse skips both traps. It projects text onto a spatial grid, keeps the whitespace intact, and trusts that modern LLMs are smart enough to read a table that looks like a table.

**Key stats:** 0 Python dependencies · 0 API keys required · 2.8k+ GitHub stars (first 2 weeks) · 50+ supported file formats

---

## How It Works

LiteParse is deliberately simple. The design philosophy is that preserving layout is more reliable than detecting structure. Four core concepts:

### Spatial Text Parsing
Instead of converting tables and columns to Markdown (which breaks constantly), LiteParse projects text onto a spatial grid. Whitespace and indentation preserve the original layout. LLMs, trained on ASCII tables and code indentation, read this natively.

### Bounding Boxes
Every line of text comes back with precise coordinate data — where it sat on the page, how wide it was. This is useful for downstream processing, visualization, or building region-specific extraction pipelines.

### Built-in OCR
Scanned PDFs and images are handled automatically via Tesseract.js. OCR parallelises across CPU cores by default (num_workers = cores - 1). You can also plug in an external OCR server (PaddleOCR, EasyOCR) for higher accuracy on difficult documents.

### Multimodal Screenshots
LiteParse can generate page-level screenshots alongside text output. This enables a powerful agent pattern: parse text for fast understanding, fall back to screenshots when the agent needs to visually inspect charts, diagrams, or complex formatting.

```bash
# Screenshot specific pages
lit screenshot document.pdf --target-pages "1,3,5"
```

### Getting Started

```bash
# Install globally
npm i -g @llamaindex/liteparse

# Parse a document
lit parse your-document.pdf

# Or use programmatically
import { LiteParse } from '@llamaindex/liteparse';

const parser = new LiteParse({ ocrEnabled: true });
const result = await parser.parse('document.pdf');
console.log(result.text);
```

Also available via Homebrew (`brew install llamaindex-liteparse`) and pip (`pip install liteparse`) for the Python wrapper.

---

## Ecosystem

LiteParse is one piece of LlamaIndex's document intelligence stack. Understanding where it sits — and what it deliberately doesn't do — helps you pick the right tool.

| Layer | Product | Description |
|-------|---------|-------------|
| Local Parsing | LiteParse | Open-source, local-first. Spatial text + bounding boxes + screenshots. Fast, simple, no cloud. Best for agents and real-time pipelines where speed matters more than perfect structure detection. |
| Cloud Parsing | LlamaParse | Paid cloud service with proprietary models. Agentic OCR, structured outputs (Markdown, JSON schemas), premium accuracy on dense tables, charts, and handwritten text. Built for production document intelligence. |
| Framework | LlamaIndex | The broader Python/TS framework for building LLM applications. LiteParse slots in as the document loading stage — a drop-in component for VectorStoreIndex and IngestionPipeline workflows. |

### When to use what

| Need | Use This | Why |
|------|----------|-----|
| Quick text extraction, agent reads a PDF | LiteParse | Fast, local, zero config. Agent can parse and move on immediately. |
| Dense tables, charts, handwritten text | LlamaParse | Cloud-powered models handle complex layouts that spatial parsing can't resolve. |
| Structured output (JSON schema, Markdown tables) | LlamaParse | LiteParse outputs spatial text only. LlamaParse converts to structured formats. |
| Privacy-sensitive documents, air-gapped environments | LiteParse | Everything stays on your machine. No data leaves the local security perimeter. |
| Scanned PDFs with basic OCR needs | LiteParse | Built-in Tesseract.js handles standard scans. Plug in PaddleOCR for harder cases. |

---

## Use Cases

- **Two-Step Document Reading (Agent Tooling)** — Agents parse text first for fast understanding, then generate page screenshots for visual follow-up on charts or complex layouts. LiteParse ships as an agent skill for this exact pattern.
- **Local Document Ingestion (RAG Pipelines)** — Feed documents into a vector store without cloud round-trips. LiteParse handles the parsing stage of RAG pipelines where latency and privacy matter — internal docs, legal files, financial reports.
- **CLI Document Processing (Dev Tooling)** — Pipe remote PDFs directly through LiteParse from the command line. Batch-parse entire directories. Integrate into CI/CD or automation scripts without standing up a service.
- **Air-Gapped Environments (Enterprise)** — Regulated industries (finance, healthcare, government) where documents cannot leave the network. LiteParse runs fully offline with no external calls — OCR included.
- **Text + Vision Workflows (Multimodal AI)** — Combine spatial text extraction with page screenshots. Feed both into multimodal models for richer document understanding — particularly useful for reports with embedded charts and diagrams.
- **Browser & Edge Parsing (Edge & Embedded)** — TypeScript-native means LiteParse fits into web-based and edge-computing environments without a Python runtime. Parse documents closer to the user, closer to the data.

---

## Decision Guide

### Use LiteParse when
- You're building AI agents that need to read documents quickly and move on. Speed matters more than perfect structural conversion.
- You want local-first execution. Your documents are sensitive, your environment is air-gapped, or you simply don't want to pay for cloud parsing on straightforward documents.
- Your stack is JavaScript/TypeScript. LiteParse is native to this environment — no Python runtime overhead, installs via npm in seconds.
- You need a two-step parse-then-screenshot workflow. LiteParse was built around exactly this agent pattern: fast text first, visual fallback second.

### Skip LiteParse when
- Your documents have dense, complex tables with merged cells, multi-level headers, or columns that don't snap to a clean grid. Spatial parsing alone won't resolve these reliably.
- You need structured output — Markdown tables, JSON schemas, strict key-value extraction. LiteParse outputs spatial text and bounding boxes. That's it.
- You're processing handwritten text or heavily degraded scans. Built-in Tesseract.js is decent for standard scans but isn't state-of-the-art OCR. You'll want LlamaParse or a dedicated OCR model.
- You need chart or diagram parsing — extracting data from visual elements. This requires multimodal LLM reasoning on screenshots, which LiteParse can enable but doesn't do itself.

---

## Pricing

LiteParse is fully open-source under the Apache-2.0 licence. There are no paid tiers, no API keys, and no usage limits.

| Product | Cost |
|---------|------|
| LiteParse | Free, open-source (Apache-2.0) |
| LlamaParse (cloud alternative) | Paid cloud service by LlamaIndex |

---

## Timeline

| Date | Milestone |
|------|-----------|
| 2022 | LlamaIndex launches — originally called GPT Index, establishes itself as the go-to toolkit for connecting LLMs to external data sources |
| 2024 | LlamaParse goes to production — managed cloud parsing service with agentic OCR, structured outputs, premium accuracy |
| Mar 2026 | LiteParse open-sourced — LlamaIndex extracts the lightweight, fast-mode core of LlamaParse's parsing engine and releases it under Apache-2.0 |
| Mar 2026 | 2.8k GitHub stars in two weeks — rapid community adoption, version 1.3.1 with Python wrapper, Homebrew formula, and agent skill packaging |

---

## Resources

### Official
- [GitHub Repository](https://github.com/run-llama/liteparse) — Source code, issues, contributing guide
- [Documentation](https://developers.llamaindex.ai/liteparse/) — Getting started, library usage, CLI reference
- [Launch Blog Post](https://www.llamaindex.ai/blog/liteparse-local-document-parsing-for-ai-agents) — Design philosophy and benchmarks
- [npm Package](https://www.npmjs.com/package/@llamaindex/liteparse) — @llamaindex/liteparse

### Sources
- [LlamaIndex Blog — LiteParse Launch](https://www.llamaindex.ai/blog/liteparse-local-document-parsing-for-ai-agents)
- [MarkTechPost Coverage](https://www.marktechpost.com/2026/03/19/llamaindex-releases-liteparse-a-cli-and-typescript-native-library-for-spatial-pdf-parsing-in-ai-agent-workflows/)

---

*Content validated March 2026. LiteParse and LlamaParse are trademarks of LlamaIndex. Independent educational explainer by [Imbila.AI](https://imbila.ai).*
