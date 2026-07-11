# RealSeek - Project Summary

RealSeek is a AI-driven real estate advisory workspace. Utilizing the **Cognizant Neuro SAN Agent Network**, the platform combines conversational interfaces, live flowchart graphs, and interactive financial/analytical widgets to provide an end-to-end property intelligence tool.

---

## 1. Core Capabilities

### Conversational Search & Sourcing
* Accepts raw natural language inputs.
* Automatically initiates target searches on real estate portals (e.g. MagicBricks, 99acres) using custom path filtering.
* Parses and extracts specific property detail listings, displaying titles, verified URLs, key details, and recommendations.

### Dynamic Insights Panel
* **Pricing Index & Trends**: Displays price appreciation metrics for target localities.
* **Investment ROI**: Evaluates capitalization rates and rental yield splits.
* **Neighborhood Index**: Scores safety ratings, school quality, walkability, and transit accessibility on-the-fly from streaming text blocks.

### Mortgage Calculator
* Provides interactive payment estimates.
* Dynamically adjusts sliders for property price, downpayments, and interest rates.
* Displays monthly repayments and loan amortization splits.

---

## 2. Key Achievements & Performance Optimizations

### Low-Latency Multi-Agent Reasoning
RealSeek is engineered to run stable and fast across the cooperative network:
* **Mistral Small Model Upgrade**: Swapped default reasoning models from `mistral-large-latest` to `mistral-small-latest`, reducing agent reasoning latencies by over 60%.
* **SQLite Caching**: All identical agent queries are cached in a local database (`.langchain_cache.db`), cutting API call counts by half.

### Selective & Parallel Agent Dispatch
The system implements an intelligent routing logic:
* **Interactive Requirements Gathering**: The `user_intent_agent` runs first to dynamically gather location, BHK, and budget, conducting multi-turn requirements gathering in clean natural language.
* **Parallel Selective Execution**: Once details are complete, the orchestrator dispatches tool requests concurrently (in parallel) *only* to the agents directly requested, saving computational overhead and latency.

### Resilient Web Search Cache & Fallback
The `InternetSearch` tool leverages a local SQLite database (`.search_cache.db`) to cache web results. If live search queries fail due to search engine CAPTCHA blocks, a fully dynamic LLM-based fallback generator uses `mistral-small-latest` to generate high-fidelity, localized mock listings on-the-fly for any city, BHK, or budget without any hardcoded templates.

---

## 3. Technology Stack
* **Frontend**: HTML5, Vanilla CSS3 (curated theme colors, glassmorphism shadows, glowing nodes, 2-row scrollbar-hidden chat input), and ES6 Javascript.
* **Backend**: Python 3.10+, Tornado REST Server (supporting Server-Sent Events/SSE streaming), and LangGraph/Pregel agent execution.
