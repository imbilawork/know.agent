# OpenClaw x Microsoft Teams Explained

> Your AI agent inside Microsoft Teams — DMs, channels, and Adaptive Cards

**Source:** [know.imbila.ai/openclaw-teams-explainer](https://know.imbila.ai/openclaw-teams-explainer)
**Validated:** March 2026 | **Author:** [Imbila.AI](https://imbila.ai) | **License:** CC-BY-SA-4.0
**Structured data:** [openclaw-teams.json](https://raw.githubusercontent.com/imbilawork/know.agent/main/agentapi/data/openclaw-teams.json)

---

## What Is OpenClaw x Teams

The OpenClaw Microsoft Teams integration is a plugin that connects your self-hosted AI agent to Microsoft Teams via the Azure Bot Framework. It handles personal DMs, group chats, and channel conversations — routing messages through a webhook gateway on port 3978 and replying deterministically back to the exact conversation they came from.

As of January 2026, the Teams channel ships as a standalone plugin rather than a core dependency. This was a deliberate breaking change to keep the core install lightweight and let Teams-specific features (Adaptive Cards, SharePoint uploads, RSC permissions) update independently.

Microsoft Teams is the default workspace for most enterprises. OpenClaw's plugin model means you can run any model (Claude, GPT, local Ollama) behind a familiar chat interface — without Microsoft Copilot's per-user pricing or vendor lock-in.

**Key stats:** 23 supported channels · Port 3978 default webhook · Adaptive Card v1.5 schema · $0 OpenClaw license cost

---

## Components

### Microsoft Teams Plugin (Channel Layer)
Handles Bot Framework webhooks, Adaptive Cards, file sharing via SharePoint, and per-channel configuration overrides. Installed separately since the January 2026 breaking change via `openclaw plugins install @openclaw/msteams`.

### Composio MCP Connector (MCP Integration)
Connects via the Composio MCP server to enable granular Teams actions — scheduling meetings, archiving teams, managing memberships — from natural language commands.

### Azure AD + RSC (Auth Layer)
JWT validation on inbound webhooks, App ID + Password for outbound calls. Resource-Specific Consent (RSC) for real-time channel listening without broad admin scopes.

---

## How It Works

### Plugin Installation
Since the January 2026 breaking change, Teams ships as a separate plugin. Install it via the CLI and it connects to the core gateway.

```bash
# Install the Teams plugin
openclaw plugins install @openclaw/msteams
```

### Azure Bot Registration
You need three credentials from Azure: App ID, App Password (client secret), and Tenant ID. Single-tenant bots are recommended — multi-tenant registration was deprecated after July 2025.

```json
// openclaw.json
{
  "channels": {
    "msteams": {
      "enabled": true,
      "appId": "APP_ID",
      "appPassword": "SECRET",
      "tenantId": "TENANT_ID"
    }
  }
}
```

### Access Control Policies
DMs default to a "pairing" model — unknown senders are ignored until explicitly approved. Group chats default to "allowlist" — blocked unless you add users to `groupAllowFrom`. This is security-first by design: no accidental exposure in shared channels.

### Adaptive Cards
The plugin supports sending Adaptive Card v1.5 payloads — rich interactive cards with text blocks, images, action buttons, input fields, and polls. Cards are sent via CLI or agent tool actions and can collect user input through postback events.

### Reply Style Configuration
Teams channels can be set to either "Posts" or "Threads" mode, but the API doesn't tell you which is active. You configure `replyStyle` per channel — "thread" or "top-level" — to match the channel's actual UI mode. Get this wrong and replies appear in the wrong place.

### File Handling via SharePoint
DM file attachments work natively. For channel/group file sharing, you need to configure a `sharePointSiteId` and grant `Sites.ReadWrite.All` Graph permissions. Files are stored in SharePoint's `/OpenClawShared/` folder.

---

## Message Flow

Teams Message → Bot Framework (Azure JWT validation) → OpenClaw Gateway (Port 3978 · /api/messages) → LLM Processing (Claude, GPT, etc.) → Teams Reply (Back to same thread)

---

## Ecosystem

OpenClaw's channel architecture supports 23 messaging platforms. Teams is one entry point — the same agent, prompts, and skills work identically across WhatsApp, Slack, Discord, Telegram, and the rest.

### When to use what

| Need | Use This | Why |
|------|----------|-----|
| Simple channel notifications | Incoming Webhooks | No auth setup, fire-and-forget JSON POST to a channel URL |
| Interactive bot conversations | OpenClaw Teams Plugin | Full bi-directional messaging, DMs, Adaptive Cards, file handling |
| Meeting scheduling & admin | Composio MCP | Graph API operations via natural language — meetings, member management, team creation |
| Message history & catch-up | Microsoft Graph API | RSC only handles live events — you need Graph with admin consent for historical access |

---

## Use Cases

- **Deployment Notifications (DevOps)** — Adaptive Cards with build status, rollback buttons, and log links posted to a #deployments channel. One-click rollback from inside Teams.
- **Helpdesk Triage (IT Support)** — Employees DM the bot with issues. OpenClaw classifies, routes to the right queue, and auto-creates tickets — without a separate helpdesk portal.
- **Onboarding Assistant (HR)** — New hires get a personal DM bot that walks them through policy docs, benefits enrolment, and team introductions — answering questions in natural language.
- **CRM Query Bot (Sales)** — Via MCP connectors, sales reps ask the bot for deal status, contact history, or pipeline numbers directly in their Teams channel — no tab-switching to Salesforce.
- **Daily Standup Polls (Engineering)** — Automated Adaptive Card polls at 9am. Votes collected automatically. Summary posted at end-of-day. No meeting required for status updates.
- **Policy Q&A (Compliance)** — Trained on internal policy documents with RAG. Employees ask compliance questions in Teams and get source-attributed answers — audit-friendly.

---

## Decision Guide

### Use OpenClaw x Teams when
- You need a self-hosted AI assistant that your org controls — model choice, data residency, prompt engineering, the lot.
- Your team already lives in Teams and you want AI embedded in existing workflows, not bolted on.
- You want to avoid Copilot's $30/user/month pricing and need a more flexible, multi-model approach.
- You have (or can get) Azure AD admin consent for the required permissions and someone who can maintain the gateway.

### Skip this when
- Your org blocks third-party bots in Teams or has a strict no-custom-app policy. Check with IT first.
- You don't have access to Azure Portal to create a Bot registration — this is a hard requirement.
- You need full message history search and recall. RSC only covers live events; Graph API with admin consent is needed for historical access.
- You want zero maintenance. This requires a running gateway on a publicly accessible HTTPS endpoint. If that sounds like a burden, Copilot might be simpler.

---

## Why Not Microsoft Copilot?

Copilot costs $30/user/month, uses only Microsoft's models, and doesn't let you control prompts, data residency, or integrate with non-Microsoft tools. OpenClaw is self-hosted, model-agnostic, and free (you pay only for LLM API tokens). The tradeoff: you need to set up Azure Bot registration and maintain the gateway yourself.

---

## Pricing & Costs

OpenClaw itself is open-source and free. The Azure Bot Framework registration has a free tier sufficient for most use cases. Your actual cost is the LLM API tokens — Claude, OpenAI, or whatever model you route through. For a small team, expect $6-$50/month in API usage. Enterprise deployments with heavy traffic may run higher.

---

## Known Limitations

- **Channel/group images** — webhook payload only includes an HTML stub, not actual file bytes. Requires Graph API permissions.
- **Message history** — RSC is for real-time listening only. Historical message access needs `ChannelMessage.Read.All` with admin consent.
- **Private channels** — expanded app support is rolling out across tenants as of early 2026 but not universally available yet.
- **Poll results auto-posting** — votes are stored in a local JSON file but summary cards aren't auto-generated yet.

---

## Required Permissions

**RSC (baseline):** Read channel message text, send channel messages, receive DM file attachments.

**Graph API (optional):** `Sites.ReadWrite.All` for SharePoint file uploads. `Chat.Read.All` for restricted file sharing links. `ChannelMessage.Read.All` for historical message access.

All Graph permissions require admin consent from your M365 admin.

---

## Timeline

| Date | Milestone |
|------|-----------|
| 2024 | Teams bundled in core — early versions included Microsoft Teams as a built-in channel alongside WhatsApp, Telegram, and Discord |
| Mid 2025 | Multi-tenant deprecation — Microsoft deprecated new multi-tenant bot registrations (July 2025). Single-tenant recommended. |
| Jan 2026 | Breaking change: plugin extraction — Teams moved out of core into `@openclaw/msteams`. Separately installable, independently versioned. Release 2026.1.15. |
| Feb 2026 | OpenClaw v2026.2+ & Composio MCP — Full Adaptive Card v1.5 support, SharePoint file integration, Composio MCP toolchain, expanded private channel support rolling out. |

---

## Resources

### Official
- [OpenClaw Teams Docs](https://docs.openclaw.ai/channels/msteams) — Full configuration reference
- [Microsoft Teams Platform Docs](https://learn.microsoft.com/en-us/microsoftteams/platform/) — Bot Framework, Adaptive Cards, Graph API
- [Adaptive Cards Designer](https://adaptivecards.io/designer/) — Visual card builder and schema reference
- [Composio MCP Integration](https://composio.dev/toolkits/microsoft_teams/framework/openclaw) — Teams MCP server for OpenClaw

### Community
- [OpenClaw GitHub](https://github.com/openclaw) — Source code, issues, plugin contributions
- [OpenClaw Discord](https://discord.gg/openclaw) — Community support and discussion
- [Setup & Integration Guide](https://open-claw.me/channels/teams) — Step-by-step walkthrough

### Sources
- [OpenClaw Docs — Microsoft Teams Channel](https://docs.openclaw.ai/channels/msteams)
- [OpenClaw Teams Setup Guide](https://open-claw.me/channels/teams)
- [Composio — OpenClaw Teams MCP](https://composio.dev/toolkits/microsoft_teams/framework/openclaw)
- [OpenClaw AI — Teams Integration](https://openclaw-ai.com/en/channels/teams)

---

*Content validated March 2026. OpenClaw is open-source software. Microsoft Teams is a trademark of Microsoft Corporation. Independent educational explainer by [Imbila.AI](https://imbila.ai).*
