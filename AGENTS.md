# Pear Genius - Intelligent Customer Support Agent

An agentic AI application built with LangChain and LangGraph that provides intelligent, autonomous customer support for Pear Computer customers.

## Executive Summary

**Pear Genius** is a conversational AI agent that handles customer support inquiries by orchestrating multiple backend services through MCP (Model Context Protocol) tools. It can resolve complex, multi-step issues autonomously while knowing when to escalate to human agents.

### Value Proposition

- **40-60% reduction** in support ticket volume through intelligent self-service
- **24/7 availability** with consistent, high-quality responses
- **Personalized support** using customer context and history
- **Faster resolution** by automating multi-step workflows (warranty checks, returns, tracking)

---

## Use Cases

### Primary User Scenarios

| Scenario | Description | Services Involved |
|----------|-------------|-------------------|
| **Order Inquiry** | "Where's my order?" / "I need to change my shipping address" | order-management, shipping, customer-accounts |
| **Return & Exchange** | "I want to return my PearPods" / "Exchange for a different color" | order-management, shipping, payments, inventory |
| **Warranty & Repairs** | "Is my PearPhone covered?" / "How do I get it repaired?" | product-support, customer-accounts, physical-stores |
| **Troubleshooting** | "My PearWatch won't sync" / "Battery draining fast" | product-support, customer-support |
| **Account Help** | "Update my payment method" / "Find my device" | customer-accounts, payments |
| **Product Questions** | "What's the difference between models?" / "Is it in stock?" | product-catalog, inventory, physical-stores |

### Example Conversations

**Scenario: Warranty Check + Repair Scheduling**
```
Customer: My PearPhone screen is cracked. Is it covered under warranty?

Agent: I'll check your warranty status. I can see you have a pPhone 16 Pro
       (serial: PEAR-PPH-ABC123) purchased on September 15, 2024.

       Your device is covered under PearCare+ until September 2026, which
       includes accidental damage protection. Screen repair would be a $29
       service fee instead of $279.

       Would you like me to:
       1. Schedule a repair at your nearest Pear Store (Downtown - 0.8 mi)
       2. Set up a mail-in repair (3-5 business days)
       3. Show self-service repair options

Customer: Schedule at the downtown store

Agent: I found availability at Pear Store Downtown:
       - Tomorrow 2:00 PM
       - Tomorrow 4:30 PM
       - Friday 10:00 AM

       Which works best for you?
```

**Scenario: Order Issue + Return**
```
Customer: I ordered a PearBook but received the wrong color

Agent: I'm sorry about that! Let me look up your order.

       I found Order #PO-2024-78432 placed on Jan 20:
       - PearBook Air 15" - Midnight (ordered)
       - Delivered Jan 24 to 123 Main St

       I can see you received Starlight instead of Midnight. I'll initiate
       an exchange right away. You have two options:

       1. **Express Exchange**: We ship the correct Midnight color now,
          you return the Starlight within 14 days (no extra charge)
       2. **Standard Exchange**: Return first, then we ship replacement

       Which would you prefer?

Customer: Express exchange please

Agent: I've initiated the express exchange:
       - Midnight PearBook Air shipping tomorrow via Express (arrives Jan 28)
       - Return label for Starlight sent to your email
       - Return by Feb 10 to avoid charges

       Confirmation #EX-2024-12345 sent to your email. Anything else?
```

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Pear Genius Agent                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐    ┌─────────────────────────────────────────┐     │
│  │   LangGraph │    │           Supervisor Agent              │     │
│  │    Router   │───▶│  (Intent Classification & Orchestration)│     │
│  └─────────────┘    └──────────────┬──────────────────────────┘     │
│                                    │                                │
│         ┌──────────────────────────┼──────────────────────────┐     │
│         ▼                          ▼                          ▼     │
│  ┌─────────────┐          ┌─────────────┐           ┌─────────────┐ │
│  │   Order     │          │  Warranty   │           │Troubleshoot │ │
│  │   Agent     │          │   Agent     │           │   Agent     │ │
│  └──────┬──────┘          └──────┬──────┘           └──────┬──────┘ │
│         │                        │                          │       │
│         └────────────────────────┼──────────────────────────┘       │
│                                  │                                  │
│                                  ▼                                  │
│                         ┌─────────────────┐                         │
│                         │   MCP Client    │                         │
│                         │  (Tool Calls)   │                         │
│                         └────────┬────────┘                         │
│                                  │                                  │
└──────────────────────────────────┼──────────────────────────────────┘
                                   │ MCP Protocol
                                   │ (SSE/WebSocket)
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 AgentGateway - MCP Server (localhost:3000)          │
│                                                                     │
│  Exposes backend services as MCP Tools:                             │
│  ┌────────────────────────────────────────────────────────────-─┐   │
│  │ • order-management/get_order     • shipping/track_shipment   │   │
│  │ • order-management/list_orders   • shipping/create_label     │   │
│  │ • product-support/check_warranty • payments/process_refund   │   │
│  │ • product-support/get_repairs    • customer-accounts/profile │   │
│  │ • physical-stores/book_appt      • customer-support/tickets  │   │
│  │ • inventory/check_stock          • analytics/get_metrics     │   │
│  └─────────────────────────────────────────────────────────────-┘   │
│                                  │                                  │
└──────────────────────────────────┼──────────────────────────────────┘
                                   │ REST API
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Backend Services                            │
├─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬────────-┤
│ order-  │ product │customer │shipping │payments │physical │customer │
│ mgmt    │ support │ accounts│         │         │ stores  │ support │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴───────-─┘
```

**Key Points:**
- **MCP Client** in the agent connects directly to **AgentGateway** (the MCP Server)
- **AgentGateway** exposes all backend service operations as **MCP Tools**
- Agents call tools like `order-management/get_order` via the MCP protocol
- AgentGateway handles the translation from MCP tool calls to REST API calls

### LangGraph State Machine

```
                    ┌─────────────┐
                    │    START    │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────-┐
                    │  Authenticate│ ◀─── Keycloak JWT
                    │   Customer   │
                    └──────┬──────-┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Classify  │
                    │   Intent    │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │   Order     │ │  Warranty   │ │ Troubleshoot│
    │   Subgraph  │ │  Subgraph   │ │  Subgraph   │
    └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
           │               │               │
           └───────────────┼───────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Needs      │
                    │  Escalation?│
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
       ┌─────────────┐          ┌─────────────┐
       │   Human     │          │  Generate   │
       │   Handoff   │          │  Response   │
       └─────────────┘          └──────┬──────┘
                                       │
                                       ▼
                                ┌─────────────┐
                                │    END      │
                                └─────────────┘
```

---

## Agent Specifications

### 1. Supervisor Agent

**Purpose**: Route customer inquiries to the appropriate specialized agent and orchestrate multi-agent workflows.

**Responsibilities**:
- Classify customer intent from natural language
- Load customer context (profile, recent orders, devices)
- Route to specialized sub-agents
- Aggregate responses from multiple agents
- Determine when to escalate to human

**LangGraph Node**: `supervisor`

```python
class SupervisorState(TypedDict):
    messages: Annotated[list, add_messages]
    customer_id: str
    customer_context: CustomerContext
    current_agent: str
    escalation_required: bool
    escalation_reason: str
```

### 2. Order Agent

**Purpose**: Handle all order-related inquiries including status, modifications, cancellations, and returns.

**MCP Tools**:
| Tool | Service | Operation |
|------|---------|-----------|
| `get_customer_orders` | order-management | GET /orders |
| `get_order_details` | order-management | GET /orders/{orderId} |
| `get_order_tracking` | order-management | GET /orders/{orderId}/tracking |
| `cancel_order` | order-management | POST /orders/{orderId}/cancel |
| `initiate_return` | order-management | POST /returns |
| `check_return_eligibility` | order-management | GET /returns/eligibility |
| `get_return_label` | shipping | POST /returns/label |
| `track_shipment` | shipping | GET /tracking/{trackingNumber} |
| `process_refund` | payments | POST /refunds |

**Capabilities**:
- Look up orders by order number or customer ID
- Provide real-time tracking information
- Check return eligibility and initiate returns
- Generate return shipping labels
- Process refunds (with limits)
- Modify shipping address (before shipment)

**Escalation Triggers**:
- Refund amount > $500
- Order older than 90 days
- Disputed charge
- Multiple failed delivery attempts

### 3. Warranty Agent

**Purpose**: Handle warranty inquiries, PearCare+ coverage, and repair scheduling.

**MCP Tools**:
| Tool | Service | Operation |
|------|---------|-----------|
| `check_warranty_coverage` | product-support | GET /warranty/coverage |
| `get_repair_options` | product-support | GET /repairs/options |
| `get_repair_pricing` | product-support | GET /repairs/pricing |
| `get_customer_devices` | customer-accounts | GET /devices |
| `get_store_locations` | physical-stores | GET /locations |
| `check_appointment_availability` | physical-stores | GET /appointments/availability |
| `book_appointment` | physical-stores | POST /appointments |
| `get_pearcare_plans` | product-support | GET /warranty/pearcare |

**Capabilities**:
- Look up warranty status by serial number or device
- Explain coverage details (what's covered/not covered)
- Provide repair pricing with/without warranty
- Find nearest Pear Store locations
- Check appointment availability
- Book Genius Bar appointments
- Recommend PearCare+ upgrades

**Escalation Triggers**:
- Warranty dispute
- Device not in system
- Customer requesting exception
- Safety-related issues

### 4. Troubleshooting Agent

**Purpose**: Guide customers through technical issues and diagnostics.

**MCP Tools**:
| Tool | Service | Operation |
|------|---------|-----------|
| `search_knowledge_base` | customer-support | GET /knowledge-base/articles |
| `get_article` | customer-support | GET /knowledge-base/articles/{id} |
| `run_diagnostics` | product-support | POST /diagnostics/run |
| `get_diagnostics_results` | product-support | GET /diagnostics/{sessionId} |
| `get_software_updates` | product-support | GET /software/updates |
| `check_compatibility` | product-support | GET /software/compatibility |
| `create_support_ticket` | customer-support | POST /tickets |

**Capabilities**:
- Search knowledge base for solutions
- Guide through step-by-step troubleshooting
- Initiate remote diagnostics
- Check for software updates
- Verify software/hardware compatibility
- Create support tickets when unresolved

**Escalation Triggers**:
- Diagnostics indicate hardware failure
- Issue persists after troubleshooting
- Customer requests human agent
- Potential safety issue

### 5. Account Agent

**Purpose**: Handle account management, payment methods, and device services.

**MCP Tools**:
| Tool | Service | Operation |
|------|---------|-----------|
| `get_profile` | customer-accounts | GET /profile |
| `update_profile` | customer-accounts | PUT /profile |
| `get_addresses` | customer-accounts | GET /addresses |
| `add_address` | customer-accounts | POST /addresses |
| `get_devices` | customer-accounts | GET /devices |
| `locate_device` | customer-accounts | POST /devices/{id}/locate |
| `get_payment_methods` | payments | GET /payment-methods |
| `get_preferences` | customer-accounts | GET /preferences |

**Capabilities**:
- View and update profile information
- Manage shipping addresses
- List registered devices
- Trigger Find My device location
- Play sound on lost device
- Enable lost mode
- View payment methods (masked)

**Escalation Triggers**:
- Account security concerns
- Payment method issues
- Family sharing disputes
- Account recovery

---

## MCP Tool Definitions

### Tool Schema Example

```python
from langchain_core.tools import tool
from pydantic import BaseModel, Field

class OrderLookupInput(BaseModel):
    order_id: str = Field(description="Order ID (e.g., PO-2024-78432)")

class OrderLookupOutput(BaseModel):
    order_id: str
    status: str
    items: list[dict]
    shipping_address: dict
    tracking_number: str | None
    estimated_delivery: str | None

@tool("get_order_details", args_schema=OrderLookupInput)
async def get_order_details(order_id: str) -> OrderLookupOutput:
    """
    Retrieve detailed information about a specific order including
    items, status, shipping address, and tracking information.

    Use this when a customer asks about a specific order or needs
    order details for a return/exchange.
    """
    async with mcp_client.connect("order-management") as client:
        response = await client.call_tool(
            "get_order",
            {"orderId": order_id}
        )
        return OrderLookupOutput(**response)
```

### Complete Tool Registry

```python
TOOL_REGISTRY = {
    "order_agent": [
        "get_customer_orders",
        "get_order_details",
        "get_order_tracking",
        "cancel_order",
        "initiate_return",
        "check_return_eligibility",
        "get_return_label",
        "track_shipment",
        "process_refund",
    ],
    "warranty_agent": [
        "check_warranty_coverage",
        "get_repair_options",
        "get_repair_pricing",
        "get_customer_devices",
        "get_store_locations",
        "check_appointment_availability",
        "book_appointment",
        "get_pearcare_plans",
    ],
    "troubleshooting_agent": [
        "search_knowledge_base",
        "get_article",
        "run_diagnostics",
        "get_diagnostics_results",
        "get_software_updates",
        "check_compatibility",
        "create_support_ticket",
    ],
    "account_agent": [
        "get_profile",
        "update_profile",
        "get_addresses",
        "add_address",
        "get_devices",
        "locate_device",
        "play_sound_on_device",
        "enable_lost_mode",
        "get_payment_methods",
        "get_preferences",
    ],
}
```

---

## Keycloak Integration

### Authentication Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Customer│     │  Pear    │     │ Keycloak │     │  Agent   │
│  (Chat)  │     │  Store   │     │   IdP    │     │  Backend │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │
     │  Start Chat    │                │                │
     │───────────────▶│                │                │
     │                │                │                │
     │                │  Redirect to   │                │
     │◀───────────────│  Keycloak      │                │
     │                │                │                │
     │  Login         │                │                │
     │────────────────────────────-───▶│                │
     │                │                │                │
     │  JWT Token     │                │                │
     │◀───────────────────────────-────│                │
     │                │                │                │
     │  Chat Message + JWT             │                │
     │──────────────────────────────────────--─────────▶│
     │                │                │                │
     │                │                │  Validate JWT  │
     │                │                │◀───────────────│
     │                │                │                │
     │                │                │  User Claims   │
     │                │                │───────────────▶│
     │                │                │                │
     │  Agent Response                 │                │
     │◀───────────────────────────────────────────--────│
     │                │                │                │
```

### JWT Claims Used

```python
class CustomerContext(BaseModel):
    customer_id: str          # sub claim
    email: str                # email claim
    name: str                 # name claim
    tier: str                 # custom:tier (standard/plus/premier)
    roles: list[str]          # realm_access.roles

def extract_customer_context(token: str) -> CustomerContext:
    """Extract customer context from Keycloak JWT."""
    claims = decode_jwt(token)
    return CustomerContext(
        customer_id=claims["sub"],
        email=claims["email"],
        name=claims.get("name", claims["preferred_username"]),
        tier=claims.get("customer_tier", "standard"),
        roles=claims.get("realm_access", {}).get("roles", []),
    )
```

### Role-Based Tool Access

| Customer Tier | Additional Capabilities |
|---------------|------------------------|
| **Standard** | Basic support, 14-day returns |
| **Plus** | Priority routing, 30-day returns, chat history |
| **Premier** | Instant escalation, 90-day returns, dedicated agent |

---

## Implementation Plan

### Phase 1: Foundation (Week 1-2)

**Deliverables**:
- [ ] Project scaffolding (Python/LangChain/LangGraph)
- [ ] MCP client setup for AgentGateway connection
- [ ] Keycloak authentication integration
- [ ] Basic supervisor agent with intent classification
- [ ] State management and conversation memory

**Key Files**:
```
pear-genius/
├── pyproject.toml
├── src/
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── supervisor.py
│   │   └── base.py
│   ├── tools/
│   │   ├── __init__.py
│   │   ├── mcp_client.py
│   │   └── registry.py
│   ├── auth/
│   │   ├── __init__.py
│   │   └── keycloak.py
│   ├── state/
│   │   ├── __init__.py
│   │   └── conversation.py
│   └── main.py
├── tests/
└── README.md
```

### Phase 2: Order Agent (Week 3)

**Deliverables**:
- [ ] Order Agent implementation
- [ ] MCP tools: orders, tracking, returns
- [ ] Return eligibility and label generation
- [ ] Refund processing (with limits)
- [ ] Unit tests and integration tests

**Demo Scenario**: "Where's my order?" → Full tracking with delivery estimate

### Phase 3: Warranty Agent (Week 4)

**Deliverables**:
- [ ] Warranty Agent implementation
- [ ] MCP tools: warranty, repairs, appointments
- [ ] Store locator integration
- [ ] Appointment booking flow
- [ ] PearCare+ recommendation logic

**Demo Scenario**: "Is my cracked screen covered?" → Warranty check → Repair booking

### Phase 4: Troubleshooting Agent (Week 5)

**Deliverables**:
- [ ] Troubleshooting Agent implementation
- [ ] MCP tools: knowledge base, diagnostics
- [ ] Step-by-step guided troubleshooting
- [ ] Remote diagnostics integration
- [ ] Ticket creation for unresolved issues

**Demo Scenario**: "PearWatch won't sync" → Diagnostics → Solution or ticket

### Phase 5: Integration & Polish (Week 6)

**Deliverables**:
- [ ] Account Agent implementation
- [ ] Multi-agent conversation flows
- [ ] Human escalation workflow
- [ ] Conversation history and context
- [ ] Error handling and fallbacks
- [ ] Performance optimization

### Phase 6: Demo & Documentation (Week 7)

**Deliverables**:
- [ ] Demo script with 5 key scenarios
- [ ] API documentation
- [ ] Deployment guide
- [ ] Metrics dashboard
- [ ] Video walkthrough

---

## Demo Script

### Demo 1: Order Tracking (2 min)
1. Customer: "Where's my PearBook order?"
2. Agent authenticates, finds recent order
3. Shows order details, tracking, estimated delivery
4. Offers proactive options (delivery instructions, pickup change)

### Demo 2: Return Flow (3 min)
1. Customer: "I want to return my PearPods"
2. Agent checks eligibility, explains options
3. Customer confirms return reason
4. Agent generates label, initiates refund
5. Sends confirmation email

### Demo 3: Warranty + Repair (3 min)
1. Customer: "My PearPhone screen cracked"
2. Agent looks up device, checks warranty
3. Explains coverage (PearCare+ active)
4. Shows repair options with pricing
5. Books Genius Bar appointment

### Demo 4: Troubleshooting (3 min)
1. Customer: "My PearWatch battery drains fast"
2. Agent searches knowledge base
3. Guides through diagnostics
4. Runs remote diagnostic check
5. Recommends software update, schedules follow-up

### Demo 5: Human Escalation (2 min)
1. Customer: "I've been charged twice!"
2. Agent identifies billing dispute
3. Gathers information, creates ticket
4. Warm handoff to human agent with full context

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Containment Rate | 60% | Issues resolved without human |
| Avg Handle Time | < 4 min | Time to resolution |
| Customer Satisfaction | > 4.2/5 | Post-chat survey |
| Escalation Rate | < 40% | Handoffs to human |
| First Contact Resolution | > 70% | Resolved in one session |
| Tool Call Success Rate | > 95% | MCP tool reliability |

---

## Technical Requirements

### Dependencies

```toml
[project]
dependencies = [
    "langchain>=0.3.0",
    "langgraph>=0.2.0",
    "langchain-anthropic>=0.2.0",
    "mcp>=1.0.0",
    "python-keycloak>=4.0.0",
    "httpx>=0.27.0",
    "pydantic>=2.0.0",
    "redis>=5.0.0",  # conversation state
    "structlog>=24.0.0",  # logging
]
```

### Environment Variables

```bash
# LLM
ANTHROPIC_API_KEY=sk-ant-...
MODEL_NAME=claude-sonnet-4-20250514

# MCP / AgentGateway
AGENT_GATEWAY_URL=http://localhost:3000
MCP_TRANSPORT=sse

# Keycloak
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=pear
KEYCLOAK_CLIENT_ID=pear-genius
KEYCLOAK_CLIENT_SECRET=...

# State Store
REDIS_URL=redis://localhost:6379

# Observability
LANGSMITH_API_KEY=...
LANGSMITH_PROJECT=pear-genius
```

---

## Next Steps

1. **Review and approve** this implementation plan
2. **Set up project** scaffolding and dependencies
3. **Implement Phase 1** foundation components
4. **Iterate** through phases with weekly demos
5. **Conduct** user testing with demo scenarios
6. **Deploy** to staging environment
7. **Measure** against success metrics

---

## Appendix: Service API Quick Reference

### Order Management
- `GET /orders` - List customer orders
- `GET /orders/{id}` - Get order details
- `GET /orders/{id}/tracking` - Get tracking info
- `POST /orders/{id}/cancel` - Cancel order
- `POST /returns` - Initiate return
- `GET /returns/eligibility` - Check if returnable

### Product Support
- `GET /warranty/coverage?serial_number=X` - Check warranty
- `GET /repairs/options` - Get repair types
- `GET /repairs/pricing` - Get repair costs
- `POST /diagnostics/run` - Start diagnostics
- `GET /software/updates` - List updates

### Customer Support
- `GET /knowledge-base/articles?q=X` - Search KB
- `POST /tickets` - Create ticket
- `POST /chat/sessions` - Start chat

### Physical Stores
- `GET /locations` - Find stores
- `GET /appointments/availability` - Check slots
- `POST /appointments` - Book appointment

### Shipping
- `GET /tracking/{number}` - Track package
- `POST /returns/label` - Generate return label

### Payments
- `POST /refunds` - Process refund
- `GET /payment-methods` - List saved methods
