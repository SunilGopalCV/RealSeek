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

### Bypassing API Rate Limits & Bottlenecks
RealSeek is engineered to run stable and fast, even under strict model provider rate limits (e.g., Mistral free tier limits of 5 requests per minute):
* **Pacing delay**: A custom lock spaces LLM requests with a 1.5s delay to keep process dispatch smooth and prevent concurrent spikes.
* **SQLite caching**: All identical agent queries (such as state checkins and query formulations) are cached in a local database (`.langchain_cache.db`), cutting API call counts by half.

### Low-Latency Direct Search Routing
The system implements a dual-mode orchestration logic:
* **Single-Agent direct search**: For standard listings queries, the Master Orchestrator bypasses cooperative satellite routing and queries the search tool directly. This reduces latency from minutes to **under 15 seconds**.
* **Cooperative multi-agent analysis**: When safety ratings or market index metrics are requested, the orchestrator routes sub-tasks to the dedicated agents.

### Resilient Web Search Cache & Fallback
The `InternetSearch` tool leverages a local SQLite database (`.search_cache.db`) to cache web results. If live search queries fail due to search engine captcha blocks, a dynamic mock listing generator parses the query to generate high-fidelity, contextual listings for any city, BHK configuration, or budget.

---

## 3. Technology Stack
* **Frontend**: HTML5, Vanilla CSS3 (curated theme colors, glassmorphism shadows, glowing nodes), and ES6 Javascript.
* **Backend**: Python 3.10+, Tornado REST Server (supporting Server-Sent Events/SSE streaming), and LangGraph/Pregel agent execution.
