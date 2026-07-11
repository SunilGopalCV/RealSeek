# RealSeek Architecture

RealSeek is a real-time conversational real estate advisor designed to simplify property search, market valuation, and neighborhood indexing. It utilizes a web-based ES6 Frontend connected to a Tornado REST API Backend powered by the **Cognizant Neuro SAN Agent Network**.

---

## 1. What We Are Trying to Do
Traditional property search platforms require users to filter results manually, cross-reference pricing averages, look up local school ratings on separate sites, and calculate mortgage rates on external widgets. 

RealSeek aims to unify these processes in a **single conversational workspace**. By taking natural language queries (e.g., *"find me 3 BHK houses in Visakhapatnam under 30 lakhs"*), the system automatically searches the web, analyzes listings, indexes schools and safety, evaluates pricing ROI, and presents the synthesized intelligence to the user instantly.

---

## 2. How the Project Achieves It
RealSeek integrates multiple specialized systems to deliver a comprehensive dashboard:
1. **Interactive Chat**: A conversational panel styled after premium Google Gemini design patterns, supporting real-time Server-Sent Events (SSE) streaming.
2. **Agent Flowchart**: A live, reactive SVG visualization that shows the active execution states of the backend agent network.
3. **Insights Dashboard**: Dynamically populated charts showing pricing appreciation, investment ROI, and neighborhood index ratings parsed on-the-fly from the LLM response streams.
4. **Mortgage Calculator**: An interactive tool to compute monthly payments and downpayments based on discovered listings.

---

## 3. Highlighting the Agentic System

At the core of the backend is the **Neuro SAN Agent Network**, a cooperative multi-agent system configured via HOCON. The agent network comprises:

### The Master Orchestrator
The `master_orchestrator_agent` serves as the supervisor of the network. It receives the user's conversation history and makes decisions on how to route the request:
* **Interactive Requirements Loop**: If the Target Location, BHK/Type, or Budget is missing, it routes exclusively to `user_intent_agent` to gather the bare minimum requirements.
* **Selective Parallel Dispatch**: Once requirements are met, it dispatches tool requests concurrently (in parallel) *only* to the specialized agents needed for the query (e.g. calling `property_discovery_agent` for listings, while skipping market/neighborhood analysis unless explicitly requested). This cuts processing steps and reduces latency.

### Specialized Satellite Agents
* **User Intent Agent**: Dynamically gathers location, BHK/type, and budget parameters in clean, friendly natural language without JSON leakage.
* **Property Discovery Agent**: Formulates clean domain-only `site:` search queries for regional portals (like MagicBricks or 99acres) to retrieve live, verified listing URLs.
* **Market Intelligence Agent**: Gathers transaction data, median prices, and appreciation metrics.
* **Neighborhood Intelligence Agent**: Evaluates safety indexes, local transit, walkability scores, and school ratings.
* **Recommendation Agent**: Collates results from all agents and synthesizes the final markdown report.

### Tool Executions & Caching
* **InternetSearch CodedTool**: Leverages DuckDuckGo search APIs with an automated SQLite search cache. If live searches fail or are CAPTCHA-blocked, a dynamic LLM-based mock listing generator uses `mistral-small-latest` to generate high-fidelity, localized mock listings on-the-fly.
* **Global SQLite Caching**: All identical agent queries are cached in a local database (`.langchain_cache.db`), cutting API call counts by half.
* **Low-Latency LLM Upgrade**: Configured with `mistral-small-latest` as the default model across all nodes, removing the need for artificial pacing delay blocks.
