# Pear Genius - Intelligent Customer Support Agent

Pear Genius is an AI-powered customer support agent for Pear Computer, built with LangChain, LangGraph, and MCP (Model Context Protocol) tools.

## Overview

Pear Genius provides automated customer support capabilities including:
- **Order Management**: Track orders, check delivery status, process returns
- **Warranty & Repairs**: Check coverage, explain options, schedule appointments
- **Troubleshooting**: Guided diagnostics, knowledge base search
- **Account Management**: Profile updates, device management

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Pear Genius                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Supervisor Agent                         │  │
│  │   (Intent Classification, Routing, Escalation Logic)       │  │
│  └─────────────────────────┬─────────────────────────────────┘  │
│                            │                                    │
│  ┌─────────────────────────▼─────────────────────────────────┐  │
│  │                    Tool Registry                           │  │
│  │  (Order, Warranty, Troubleshooting, Account Tools)         │  │
│  └─────────────────────────┬─────────────────────────────────┘  │
│                            │                                    │
│  ┌─────────────────────────▼─────────────────────────────────┐  │
│  │                     MCP Client                             │  │
│  └─────────────────────────┬─────────────────────────────────┘  │
└────────────────────────────┼────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AgentGateway                               │
│                   (MCP Server @ :3000)                          │
│  ┌───────────┬───────────┬───────────┬───────────┬───────────┐  │
│  │  Product  │  Online   │  Customer │  Order    │  Customer │  │
│  │  Catalog  │  Store    │  Accounts │  Mgmt     │  Support  │  │
│  └───────────┴───────────┴───────────┴───────────┴───────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Prerequisites

- Python 3.11+
- [uv](https://github.com/astral-sh/uv) (recommended) or pip
- AgentGateway running at localhost:3000
- Anthropic API key

## Installation

1. **Clone and navigate to the project:**
   ```bash
   cd pear-genius
   ```

2. **Create and activate virtual environment:**
   ```bash
   # Using uv (recommended)
   uv venv
   source .venv/bin/activate

   # Or using standard Python
   python -m venv .venv
   source .venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   # Using uv
   uv pip install -e .

   # Or using pip
   pip install -e .
   ```

4. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and add your ANTHROPIC_API_KEY
   ```

## Usage

### Interactive CLI

Start an interactive chat session:

```bash
python -m src.main
```

Example interaction:
```
============================================================
  Pear Genius - Customer Support Agent
============================================================

Authenticated as: John Appleseed (Plus member)

Pear Genius: Hello John Appleseed! I'm Pear Genius, your personal support assistant...

You: Where is my recent order?

Pear Genius: I can see you have two recent orders. Let me check the status of your most recent one, PO-2024-78432...
```

### Programmatic Usage

```python
import asyncio
from src.main import PearGeniusChat
from src.state.conversation import CustomerContext, CustomerTier

async def main():
    # Create customer context
    customer = CustomerContext(
        customer_id="CUST-12345",
        email="user@example.com",
        name="Jane Doe",
        tier=CustomerTier.PLUS,
    )

    # Start chat session
    chat = PearGeniusChat(customer=customer)
    await chat.start_session()

    # Send messages
    response = await chat.send_message("What's the status of my order?")
    print(response)

asyncio.run(main())
```

## Project Structure

```
pear-genius/
├── src/
│   ├── agents/
│   │   ├── base.py         # Base agent class with LLM integration
│   │   └── supervisor.py   # Main supervisor agent with LangGraph
│   ├── auth/
│   │   └── keycloak.py     # Keycloak JWT authentication
│   ├── state/
│   │   └── conversation.py # LangGraph state management
│   ├── tools/
│   │   ├── mcp_client.py   # MCP client for AgentGateway
│   │   └── registry.py     # Tool definitions and registry
│   ├── config.py           # Configuration settings
│   └── main.py             # CLI entry point
├── tests/
│   ├── test_state.py       # State management tests
│   └── test_agents.py      # Agent tests
├── pyproject.toml
├── .env.example
└── README.md
```

## Configuration

| Environment Variable | Description | Default |
|---------------------|-------------|---------|
| `ANTHROPIC_API_KEY` | Anthropic API key (required) | - |
| `MODEL_NAME` | Claude model to use | `claude-sonnet-4-20250514` |
| `AGENT_GATEWAY_URL` | AgentGateway URL | `http://localhost:3000` |
| `KEYCLOAK_URL` | Keycloak server URL | `http://localhost:8080` |
| `MAX_REFUND_AMOUNT` | Escalation threshold for refunds | `500.0` |
| `DEBUG` | Enable debug logging | `false` |

## Escalation Rules

The agent automatically escalates to a human when:
- Customer explicitly requests a human agent
- Refund amount exceeds $500
- Billing disputes or fraud concerns
- Safety-related issues
- Repeated tool failures (3+ errors)
- Customer frustration detected

## Development

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src

# Run specific test file
pytest tests/test_state.py -v
```

### Code Quality

```bash
# Format code
ruff format src tests

# Lint code
ruff check src tests

# Type checking
mypy src
```

## Next Steps (Implementation Roadmap)

- [ ] Phase 2: Specialized agents (Order, Warranty, Troubleshooting)
- [ ] Phase 3: Conversation analytics and sentiment tracking
- [ ] Phase 4: Proactive engagement features
- [ ] Phase 5: Web interface integration
- [ ] Phase 6: Production hardening
- [ ] Phase 7: Advanced analytics dashboard

See [AGENTS.md](../AGENTS.md) for the full implementation plan.

## License

Internal use only - Pear Computer Inc.
