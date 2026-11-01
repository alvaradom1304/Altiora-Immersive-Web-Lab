---
metadata:
  version: 1.0.0
name: smart-model-router
description: Intelligent AI model routing, token cost optimization, and multi-tier task delegation based on complexity (inspired by RouteLLM, FrugalGPT, and LiteLLM). Use when delegating subtasks, optimizing token budgets, or choosing between Flash-Lite, Flash, and Pro models.
---

# Smart Model Router & Token Cost Optimizer

Maximize intelligence-per-dollar and minimize token consumption by dynamically routing every task or subtask to the cheapest model tier capable of executing it with 100% quality, while compressing context payloads.

---

## 1. Complexity-Based Model Routing Matrix (Antigravity Subagents & API)

When the user requests multi-tier optimization or cost-aware execution, classify every task into one of **3 Complexity Tiers** before executing or spawning subagents via `invoke_subagent`:

| Tier | Model Tier (`invoke_subagent`) | Target Use Cases (Low → High Complexity) | Relative Cost |
| :--- | :--- | :--- | :--- |
| **Tier 1: Micro / Mechanical** | `flash_lite` | • Simple file lookups, grep/glob searches, formatting JSON/CSV<br>• Boilerplate generation, copywriting tweaks, translation<br>• Extracting raw text or summarizing single files | **~1x (Ultra-Cheap)** |
| **Tier 2: Standard / Execution** | `flash` | • Standard React/Next.js component implementation<br>• Writing unit tests, CSS/Tailwind styling, API route wiring<br>• Multi-file research and codebase exploration (`research` subagent) | **~3–5x (Balanced)** |
| **Tier 3: Deep Reasoning / Architecture** | `pro` (or `inherit`) | • Complex system architecture, intricate 3D/WebGL shaders, state machines<br>• Hard debugging across multiple layers, security audits<br>• High-stakes creative art direction & orchestrating multi-agent plans | **~15–25x (Premium)** |

---

## 2. Frugal Cascade Protocol (FrugalGPT & RouteLLM Pattern)

1. **Decompose Before Executing**:
   - Break large requests into **10% Architectural Planning (Tier 3 Pro)** and **90% Mechanical Execution / Research (Tier 1 `flash_lite` or Tier 2 `flash`)**.
2. **Delegate Bulk Reading to `flash` / `flash_lite`**:
   - Never pull 10+ large files into the main `pro` context window if a `research` subagent running on `flash` can read them and return a 15-line structured summary.
3. **Auto-Escalation Only on Failure**:
   - Start routine coding/search subtasks at the lowest viable tier (`flash_lite` or `flash`). Escalate to `pro` only if the task involves ambiguous architectural trade-offs or fails validation.

---

## 3. Token Compression & Context Hygiene Rules

Apply these rules at all times to slash input/output token burn by 50%–80%:

- **Targeted Line Viewing**: Use `view_file` with explicit `StartLine` and `EndLine` instead of reading entire large files repeatedly.
- **Diff-Only Edits**: Always use `replace_file_content` on the exact lines being changed—never rewrite full files unless creating a brand-new file.
- **Concise Responses**: Keep explanations direct, structured in tables or bullet points, and avoid repeating code that was just written to disk.
- **Prompt Caching & System Rules**: Store recurring project constraints in `SKILL.md` (progressive disclosure—loaded only when needed) rather than pasting long instructions in every message.

---

## 4. External App / API Routing Reference (OpenRouter / LiteLLM / RouteLLM)

When building AI features *inside* the user's application (e.g., an AI sales assistant, WhatsApp bot, or automated workflow):

- **Classifier / Router Gate**: Use a tiny classifier or rule-based complexity scorer (prompt length, presence of code/math keywords, intent classification) to route incoming user queries:
  - **Simple FAQs / Order status / Greetings (80% of traffic)** → Route to ultra-low-cost models (`gemini-2.5-flash-lite`, `gpt-4o-mini`, `claude-haiku`).
  - **Complex custom quotes / Multi-item negotiation (20% of traffic)** → Route to reasoning models (`gemini-2.5-pro`, `claude-sonnet`).
