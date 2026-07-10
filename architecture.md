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
The `master_orchestrator_agent` serves as the supervisor of the network. It receives the user's conversation history and makes decisions on how to fulfill the request:
* **Dynamic Direct Search**: If a user is performing a simple property search, the orchestrator immediately calls the `internet_search` tool directly to fetch properties, formatting the response in a single LLM pass. This keeps latency under 15 seconds.
* **Cooperative Routing**: If complex analysis is required (e.g., market comparisons or neighborhood safety reviews), the orchestrator coordinates specialized satellite agents to handle sub-tasks.

### Specialized Satellite Agents
* **Property Discovery Agent**: Generates targeted search queries for regional property portals (like MagicBricks or 99acres) and extracts specific listing details.
* **Market Intelligence Agent**: Gathers transaction data, median prices, and inventory trends to evaluate whether a market is buyer- or seller-oriented.
* **Neighborhood Intelligence Agent**: Curates safety indexes, local transit, walkability scores, and school ratings.
* **Recommendation Agent**: Collates results from all agents and formulates a structured markdown recommendation with verified URLs.

### Tool Executions & Caching
* **InternetSearch CodedTool**: Leverages DuckDuckGo search APIs with an automated SQLite search cache to avoid search blocking. If live searches fail (due to rate limits/captchas), a dynamic listing fallback generator parses the query to supply high-fidelity listings based on city, BHK, and budget.
* **Rate-Limit Spacing Lock**: Ensures LLM requests are spaced with a 1.5s delay to keep execution stable and within free-tier API rate limits.
