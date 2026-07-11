# RealSeek - AI Real Estate Advisor

> **Powered by Cognizant Neuro SAN**

RealSeek is an advanced agentic real estate recommendation platform. It leverages the **Cognizant Neuro SAN** multi-agent backend network to find, analyze, and recommend properties using real-time internet search results and market intelligence.

---

## Key Features

* **Multi-Agent Orchestration**: Master Orchestrator coordinating specialized agents (User Intent, Discovery, Market Intel, Neighborhood, Deal Analyzer, Recommendation).
* **Dynamic Flowchart Visualization**: Real-time tracking of agent activation and execution states with edge-aligned SVG network links.
* **Resilient Rate-Limiting & Caching**: Custom global rate-limiter, SQLite LLM cache, and DuckDuckGo search lock/cache to prevent 429 exceptions and timeouts.
* **Dynamic Insights extraction**: Parses links, prices, neighborhood quality index, and safety scores on-the-fly from agent streams.
* **Mortgage Calculator**: Interactive payment estimator and amortization breakdown.

---

## Project Structure

```text
RealSeek/
├── backend/                  # Tornado & Neuro SAN backend service
│   ├── config/               # LLM configuration (hocon)
│   │   └── llm_config.hocon
│   ├── registries/           
│   │   ├── aaosa.hocon       # AAOSA coordination instructions
│   │   ├── manifest.hocon    # Agent list registry manifest
│   │   └── generated/
│   │       └── real_seek.hocon # RealSeek cognitive network configs
│   └── run_server.py         # Main Tornado backend API server
├── coded_tools/              # Custom python tools invoked by agents
│   ├── __init__.py           # Package setup & global cache registration
│   └── internet_search.py    # Search query scraper & dynamic LLM listing builder
├── frontend/                 # Lightweight served dashboard frontend
│   ├── index.html            
│   ├── style.css             
│   ├── chat.js               
│   ├── graph.js              
│   └── main.js               
├── start.sh                  # Shell script starting backend/frontend concurrently
└── README.md                 
```

---

## Setup & Installation

### Prerequisites
* Python 3.10 or higher
* A Mistral AI API Key (from [Mistral Console](https://console.mistral.ai/))

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/RealSeek.git
cd RealSeek
```

### 2. Configure Environment Variables
Copy the env template and insert your API keys:
```bash
cp .env.example .env
```
Open `.env` and configure:
```env
MISTRAL_API_KEY="your_actual_mistral_api_key"
```

### 3. Create & Activate Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate
```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

---

## Running the Application

To start both the frontend served web server and backend REST server concurrently, run:

* **Linux / macOS**:
  ```bash
  ./start.sh
  ```
* **Windows**:
  Double-click `start.bat` or run:
  ```cmd
  start.bat
  ```

* **Frontend Dashboard**: [http://localhost:5173/](http://localhost:5173/)
* **Backend REST API**: `http://localhost:8080`