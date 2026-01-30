# Pear Computer Enterprise Security & RBAC Documentation

This document defines the Role-Based Access Control (RBAC) framework for Pear Computer's microservices architecture. It covers authentication methods, authorization scopes, and role definitions across all 11 enterprise services.

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication Methods](#authentication-methods)
3. [OAuth2 Scopes](#oauth2-scopes)
4. [Role Definitions](#role-definitions)
   - [Customer Roles](#customer-roles)
   - [Support Roles](#support-roles)
   - [Retail Roles](#retail-roles)
   - [Operations Roles](#operations-roles)
   - [Management Roles](#management-roles)
   - [Service Accounts](#service-accounts-internal)
5. [Service Access Matrix](#service-access-matrix)
6. [Role Hierarchy](#role-hierarchy)
7. [Implementation Guidelines](#implementation-guidelines)

---

## Overview

Pear Computer's microservices architecture implements a multi-layered security model:

- **External APIs**: Customer-facing services using JWT bearer tokens
- **Internal APIs**: Service-to-service communication using OAuth2 client credentials
- **Hybrid APIs**: Support both customer and internal service access

### Services by Classification

| Service | Classification | Primary Users |
|---------|---------------|---------------|
| Product Catalog | External | Customers, Public |
| Online Store | External | Customers |
| Physical Stores | External | Customers |
| Customer Accounts | External | Customers (profile/preferences only) |
| Customer Support | External | Customers, Support Agents |
| Product Support | External | Customers, Support Agents, Genius Grove |
| Order Management | Hybrid | Customers, Internal Services |
| Payments | Hybrid | Customers, Internal Services |
| Shipping | Hybrid | Internal Services, Logistics |
| Inventory | Internal | Warehouse, Internal Services |
| Analytics | Internal | Management, Analysts |

> **Note**: Authentication (login, registration, password reset, MFA) is handled by Keycloak, not the Customer Accounts service. The Customer Accounts service manages profile data, addresses, devices, preferences, and family sharing.

---

## Authentication Methods

### Identity Provider: Keycloak

All authentication is handled by **Keycloak Identity Provider**. Individual services do not implement authentication logic directly.

**Keycloak Responsibilities**:
- User registration and account creation
- Login/logout and session management
- Password management (reset, change)
- Multi-factor authentication (MFA/2FA)
- Token issuance (JWT access tokens, refresh tokens)
- Social identity provider integration
- Single Sign-On (SSO) across services

**Keycloak Endpoints**:
```
Authorization: https://auth.pearcomputer.com/realms/pear/protocol/openid-connect/auth
Token:         https://auth.pearcomputer.com/realms/pear/protocol/openid-connect/token
UserInfo:      https://auth.pearcomputer.com/realms/pear/protocol/openid-connect/userinfo
Logout:        https://auth.pearcomputer.com/realms/pear/protocol/openid-connect/logout
JWKS:          https://auth.pearcomputer.com/realms/pear/protocol/openid-connect/certs
```

### Bearer JWT Token
Used for customer-facing APIs. Tokens are issued by Keycloak and validated against its JWKS endpoint.

```yaml
securitySchemes:
  bearerAuth:
    type: http
    scheme: bearer
    bearerFormat: JWT
    description: JWT token issued by Keycloak
```

**Services**: Customer Accounts, Customer Support, Online Store, Physical Stores, Order Management

### Session Token (Cookie)
Used for web-based shopping sessions.

```yaml
securitySchemes:
  sessionToken:
    type: apiKey
    in: cookie
    name: pear_session
```

**Services**: Online Store

### API Key
Used for public API access with rate limiting.

```yaml
securitySchemes:
  apiKey:
    type: apiKey
    in: header
    name: X-API-Key
```

**Services**: Product Catalog, Shipping

### OAuth2 Client Credentials
Used for service-to-service communication.

```yaml
securitySchemes:
  oauth2:
    type: oauth2
    flows:
      clientCredentials:
        tokenUrl: https://auth.pearcomputer.com/oauth/token
        scopes: [service-specific scopes]
```

**Services**: Inventory, Analytics, Payments, Orders, Shipping

---

## OAuth2 Scopes

### Payments Service
| Scope | Description | Typical Roles |
|-------|-------------|---------------|
| `payments:read` | Read payment data, transactions | Finance, Support |
| `payments:write` | Process payments, create refunds | E-Commerce Service |
| `payments:admin` | Manage webhooks, system config | System Admin |

### Order Management Service
| Scope | Description | Typical Roles |
|-------|-------------|---------------|
| `orders:read` | Read order data | Support, Analytics |
| `orders:write` | Create and modify orders | E-Commerce Service |
| `fulfillment:write` | Update fulfillment status | Warehouse, Logistics |

### Shipping Service
| Scope | Description | Typical Roles |
|-------|-------------|---------------|
| `shipping:read` | Read shipment data, tracking | Warehouse, Support |
| `shipping:write` | Create shipments, labels | Warehouse, Logistics |

### Product Catalog Service
| Scope | Description | Typical Roles |
|-------|-------------|---------------|
| `catalog:read` | Read product information | Public, Services |
| `catalog:write` | Modify product catalog | Product Manager |

### Inventory Service
| Scope | Description | Typical Roles |
|-------|-------------|---------------|
| `inventory:read` | Read stock levels | Warehouse, Analytics |
| `inventory:write` | Modify stock, transfers | Warehouse Manager |
| `inventory:admin` | Full administrative access | System Admin |

### Analytics Service
| Scope | Description | Typical Roles |
|-------|-------------|---------------|
| `analytics:read` | Read reports, dashboards | Managers, Analysts |
| `analytics:write` | Create reports, run queries | Analysts |
| `analytics:admin` | Administrative access | System Admin |

### Product Support Service
| Scope | Description | Typical Roles |
|-------|-------------|---------------|
| `support:read` | Read articles, FAQs, warranty info | Public, Customers |
| `support:write` | Create/update articles, FAQs | Support Managers, Content Team |
| `support:admin` | Full administrative access | System Admin |
| `support:diagnostics` | Run device diagnostics | Genius Grove, Support Agents |

---

## Role Definitions

### Customer Roles

#### `customer:guest`
**Description**: Unauthenticated user browsing the store

**Permissions**:
- Browse product catalog
- View store locations and hours
- Track packages (with tracking number)
- Read knowledge base articles
- View product reviews
- Validate shipping addresses

**Services Access**:
| Service | Access Level |
|---------|-------------|
| Product Catalog | Read (via API Key) |
| Physical Stores | Read public endpoints |
| Shipping | Track, validate address |
| Customer Support | Knowledge base only |
| Online Store | Browse, recommendations |

---

#### `customer:registered`
**Description**: Authenticated customer with Pear ID

**Permissions**:
- All guest permissions, plus:
- Manage account profile and preferences
- Manage saved addresses and payment methods
- Shopping cart and checkout
- Place and manage orders
- Initiate returns and track refunds
- Create and manage wishlists
- Book Genius Grove appointments
- Register for store events
- Create support tickets
- Write product reviews (verified purchase)
- Manage registered devices
- Access Family Sharing features

**Services Access**:
| Service | Access Level |
|---------|-------------|
| Customer Accounts | Full self-service |
| Online Store | Full shopping experience |
| Order Management | Own orders only |
| Payments | Own payment methods |
| Physical Stores | Appointments, events |
| Customer Support | Tickets, chat, diagnostics |
| Shipping | Track own shipments |

---

#### `customer:family_organizer`
**Description**: Customer who manages a Pear Family Sharing group

**Permissions**:
- All registered customer permissions, plus:
- Invite members to family group
- Manage family member permissions
- View family subscription usage
- Manage shared payment methods

**Services Access**:
| Service | Access Level |
|---------|-------------|
| Customer Accounts | Family management endpoints |

---

#### `customer:business`
**Description**: Business/enterprise customer account

**Permissions**:
- All registered customer permissions, plus:
- Access business pricing
- Bulk ordering capabilities
- Purchase orders and invoicing
- Dedicated account management

**Services Access**:
| Service | Access Level |
|---------|-------------|
| Order Management | Business order features |
| Payments | Business payment terms |

---

### Support Roles

#### `support:agent`
**Description**: Tier 1 customer support representative

**Permissions**:
- View and respond to support tickets
- Participate in live chat sessions
- Look up customer profiles (read-only)
- View order details and status
- Track shipments for customers
- Access knowledge base (internal articles)
- Run device diagnostics
- Process simple refund requests

**Services Access**:
| Service | Scopes/Access |
|---------|--------------|
| Customer Support | Full ticket/chat access |
| Customer Accounts | Read customer profiles |
| Order Management | Read orders |
| Shipping | Track shipments |
| Payments | View transactions |

---

#### `support:senior_agent`
**Description**: Tier 2 support with escalation authority

**Permissions**:
- All support agent permissions, plus:
- Handle escalated tickets
- Approve refunds up to threshold
- Access customer account history
- Modify order details
- Override return policy (with approval)

**Services Access**:
| Service | Scopes/Access |
|---------|--------------|
| Order Management | Modify orders |
| Payments | Process refunds |

---

#### `support:manager`
**Description**: Manages support team and operations

**Permissions**:
- All senior agent permissions, plus:
- Assign and reassign tickets
- Access team performance metrics
- Approve high-value refunds
- Manage knowledge base content
- Configure chat routing

**Services Access**:
| Service | Scopes/Access |
|---------|--------------|
| Customer Support | Full administrative |
| Analytics | `analytics:read` (support metrics) |

---

### Retail Roles

#### `retail:associate`
**Description**: Store floor staff assisting customers

**Permissions**:
- Check product availability
- Look up customer appointments
- View store inventory
- Assist with product information
- Check order pickup status

**Services Access**:
| Service | Scopes/Access |
|---------|--------------|
| Physical Stores | Read store data |
| Product Catalog | Read products |
| Inventory | `inventory:read` (store location) |
| Order Management | View pickup orders |

---

#### `retail:genius`
**Description**: Genius Grove technical support specialist

**Permissions**:
- All associate permissions, plus:
- Manage appointments
- Run device diagnostics
- Process repairs and service
- Access repair pricing
- Update appointment status

**Services Access**:
| Service | Scopes/Access |
|---------|--------------|
| Physical Stores | Appointment management |
| Customer Support | Diagnostics access |
| Customer Accounts | Read device info |

---

#### `retail:store_manager`
**Description**: Manages retail store location

**Permissions**:
- All genius permissions, plus:
- Manage store inventory
- Schedule staff appointments
- Manage store events
- Access store performance metrics
- Approve in-store returns
- Override pricing (within limits)

**Services Access**:
| Service | Scopes/Access |
|---------|--------------|
| Physical Stores | Full store management |
| Inventory | `inventory:read`, `inventory:write` (store) |
| Order Management | Store fulfillment |
| Analytics | `analytics:read` (store metrics) |

---

#### `retail:regional_manager`
**Description**: Manages multiple retail locations

**Permissions**:
- All store manager permissions, plus:
- Access multi-store reports
- Transfer inventory between stores
- Regional performance analytics

**Services Access**:
| Service | Scopes/Access |
|---------|--------------|
| Inventory | `inventory:write` (region) |
| Analytics | `analytics:read` (regional) |

---

### Operations Roles

#### `operations:warehouse_worker`
**Description**: Warehouse staff handling inventory

**Permissions**:
- View stock levels
- Perform stock counts
- Pick and pack orders
- Process incoming shipments

**Services Access**:
| Service | Scopes/Access |
|---------|--------------|
| Inventory | `inventory:read` |
| Shipping | `shipping:read` |
| Order Management | View fulfillment queue |

---

#### `operations:warehouse_manager`
**Description**: Manages warehouse operations

**Permissions**:
- All warehouse worker permissions, plus:
- Adjust stock levels
- Create inventory transfers
- Manage stock alerts
- Schedule carrier pickups
- Generate shipping labels
- Process returns receiving

**Services Access**:
| Service | Scopes/Access |
|---------|--------------|
| Inventory | `inventory:read`, `inventory:write` |
| Shipping | `shipping:read`, `shipping:write` |
| Order Management | `fulfillment:write` |

---

#### `operations:logistics_manager`
**Description**: Manages shipping and logistics

**Permissions**:
- All warehouse manager permissions, plus:
- Configure carrier settings
- Negotiate shipping rates
- Manage return logistics
- Access logistics analytics

**Services Access**:
| Service | Scopes/Access |
|---------|--------------|
| Shipping | Full access |
| Analytics | `analytics:read` (fulfillment) |

---

#### `operations:inventory_manager`
**Description**: Manages inventory across all locations

**Permissions**:
- Full inventory system access
- Create and approve transfers
- Set reorder points
- Manage stock alerts
- Access inventory analytics

**Services Access**:
| Service | Scopes/Access |
|---------|--------------|
| Inventory | `inventory:admin` |
| Analytics | `analytics:read` (inventory) |

---

### Management Roles

#### `management:sales_manager`
**Description**: Manages sales performance

**Permissions**:
- View sales metrics and trends
- Access sales forecasts
- Regional sales analysis
- Channel performance data

**Services Access**:
| Service | Scopes/Access |
|---------|--------------|
| Analytics | `analytics:read` (sales) |
| Order Management | `orders:read` |

---

#### `management:product_manager`
**Description**: Manages product catalog and strategy

**Permissions**:
- Full product catalog access
- Product performance analytics
- Category management
- Pricing visibility

**Services Access**:
| Service | Scopes/Access |
|---------|--------------|
| Product Catalog | `catalog:read`, `catalog:write` |
| Analytics | `analytics:read` (product) |

---

#### `management:marketing_manager`
**Description**: Manages marketing and customer engagement

**Permissions**:
- Customer segmentation data
- Campaign analytics
- Customer lifetime value
- Promotion management

**Services Access**:
| Service | Scopes/Access |
|---------|--------------|
| Analytics | `analytics:read` (customer) |
| Online Store | Promotion configuration |

---

#### `management:finance`
**Description**: Finance and accounting oversight

**Permissions**:
- Transaction and payment data
- Revenue and cost analytics
- Refund approval (high value)
- Financial reporting

**Services Access**:
| Service | Scopes/Access |
|---------|--------------|
| Payments | `payments:read` |
| Analytics | `analytics:read` (all) |
| Order Management | `orders:read` |

---

#### `management:analyst`
**Description**: Business/data analyst

**Permissions**:
- Create custom reports
- Execute analytics queries
- Build dashboards
- Access all analytics data

**Services Access**:
| Service | Scopes/Access |
|---------|--------------|
| Analytics | `analytics:read`, `analytics:write` |

---

#### `management:auditor`
**Description**: Compliance and audit oversight

**Permissions**:
- Access audit logs
- View transaction history
- Stock movement reports
- Read-only across systems

**Services Access**:
| Service | Scopes/Access |
|---------|--------------|
| Analytics | `analytics:read` |
| Inventory | `inventory:read` |
| Order Management | `orders:read` |
| Payments | `payments:read` |

---

#### `management:executive`
**Description**: C-level executive access (COO, CFO)

**Permissions**:
- Full analytics dashboard access
- All operational metrics
- Strategic reporting

**Services Access**:
| Service | Scopes/Access |
|---------|--------------|
| Analytics | `analytics:read` (all) |

---

### Service Accounts (Internal)

#### `service:ecommerce`
**Description**: Online store backend service

**Permissions**:
- Create orders
- Process payments
- Reserve inventory
- Calculate shipping rates

**Services Access**:
| Service | Scopes |
|---------|--------|
| Order Management | `orders:write` |
| Payments | `payments:write` |
| Inventory | `inventory:write` |
| Shipping | `shipping:read`, `shipping:write` |

---

#### `service:order_processing`
**Description**: Order fulfillment orchestration

**Permissions**:
- Update fulfillment status
- Create shipments
- Process refunds
- Manage inventory reservations

**Services Access**:
| Service | Scopes |
|---------|--------|
| Order Management | `fulfillment:write` |
| Payments | `payments:write` |
| Inventory | `inventory:write` |
| Shipping | `shipping:write` |

---

#### `service:analytics_pipeline`
**Description**: Analytics data aggregation

**Permissions**:
- Read all operational data
- Execute analytics queries
- Generate reports

**Services Access**:
| Service | Scopes |
|---------|--------|
| Analytics | `analytics:admin` |
| All services | Read access for aggregation |

---

#### `service:notification`
**Description**: Notification and messaging service

**Permissions**:
- Subscribe to webhooks
- Read order/shipping status
- Customer contact info

**Services Access**:
| Service | Scopes |
|---------|--------|
| Payments | Webhook subscription |
| Shipping | Tracking webhooks |
| Order Management | Status webhooks |

---

## Service Access Matrix

### Customer Accounts Service
> **Note**: Authentication handled by Keycloak. This service manages account data only.

| Role | Profile | Addresses | Devices | Preferences | Family |
|------|---------|-----------|---------|-------------|--------|
| Guest | - | - | - | - | - |
| Customer | Full | Full | Full | Full | Read |
| Family Organizer | Full | Full | Full | Full | Full |
| Support Agent | Read | Read | Read | - | - |
| Internal Service | Read | Read | - | - | - |

### Online Store Service
| Role | Cart | Checkout | Wishlist | Reviews | Recommendations |
|------|------|----------|----------|---------|-----------------|
| Guest | Session | - | - | Read | Read |
| Customer | Full | Full | Full | Full | Full |
| Support Agent | Read | Read | - | - | - |

### Order Management Service
| Role | List Orders | Create | Cancel | Fulfillment | Returns |
|------|-------------|--------|--------|-------------|---------|
| Customer | Own | - | Own | - | Own |
| Support Agent | Customer's | - | With approval | - | Initiate |
| Warehouse Manager | All | - | - | Full | Receive |
| E-Commerce Service | - | Full | - | - | - |

### Payments Service
| Role | Transactions | Payment Methods | Refunds | Pear Card | Webhooks |
|------|--------------|-----------------|---------|-----------|----------|
| Customer | Own | Own | - | Own | - |
| Support Agent | Read | - | Request | - | - |
| Finance | Read | - | Approve | - | - |
| E-Commerce Service | Create | - | Create | - | - |
| System Admin | - | - | - | - | Full |

### Inventory Service
| Role | Read Stock | Adjust Stock | Transfers | Alerts | Reports |
|------|------------|--------------|-----------|--------|---------|
| Warehouse Worker | Location | - | - | View | - |
| Warehouse Manager | All | Full | Create | Full | View |
| Inventory Manager | All | Full | Approve | Full | Full |
| Store Manager | Store | Store | Request | Store | Store |
| E-Commerce Service | All | Reserve | - | - | - |

### Shipping Service
| Role | Rates | Create Shipment | Track | Labels | Returns |
|------|-------|-----------------|-------|--------|---------|
| Guest | - | - | Public | - | - |
| Customer | Calculate | - | Own | - | Own |
| Warehouse Manager | Full | Full | Full | Full | Full |
| E-Commerce Service | Full | Full | Full | Full | Create |

### Product Support Service
| Role | Articles | FAQs | Warranty Lookup | Repairs | Diagnostics | Content Mgmt |
|------|----------|------|-----------------|---------|-------------|--------------|
| Guest | Read | Read | - | Read pricing | - | - |
| Customer | Read | Read | Own devices | Read/Request | - | - |
| Support Agent | Read | Read | Customer's | Full | Initiate | - |
| Genius Grove | Read | Read | Full | Full | Full | - |
| Support Manager | Read | Read | Full | Full | Full | Full |
| Content Team | Read | Read | - | - | - | Full |

### Analytics Service
| Role | Sales | Products | Customers | Inventory | Operations | Reports |
|------|-------|----------|-----------|-----------|------------|---------|
| Sales Manager | Full | - | - | - | - | Read |
| Product Manager | - | Full | - | - | - | Read |
| Marketing Manager | - | - | Full | - | - | Read |
| Inventory Manager | - | - | - | Full | - | Read |
| Operations Manager | - | - | - | - | Full | Read |
| Analyst | Full | Full | Full | Full | Full | Full |
| Executive | Full | Full | Full | Full | Full | Read |

---

## Role Hierarchy

```
system:admin
├── management:executive
│   ├── management:finance
│   ├── management:auditor
│   └── management:analyst
├── operations
│   ├── operations:inventory_manager
│   │   └── operations:warehouse_manager
│   │       └── operations:warehouse_worker
│   └── operations:logistics_manager
├── retail
│   ├── retail:regional_manager
│   │   └── retail:store_manager
│   │       ├── retail:genius
│   │       └── retail:associate
├── support
│   ├── support:manager
│   │   └── support:senior_agent
│   │       └── support:agent
├── management
│   ├── management:sales_manager
│   ├── management:product_manager
│   └── management:marketing_manager
├── service_accounts
│   ├── service:ecommerce
│   ├── service:order_processing
│   ├── service:analytics_pipeline
│   └── service:notification
└── customer
    ├── customer:business
    ├── customer:family_organizer
    ├── customer:registered
    └── customer:guest
```

---

## Implementation Guidelines

### 1. Keycloak Token Structure (JWT Claims)

Tokens issued by Keycloak contain standard OIDC claims plus custom Pear-specific claims:

```json
{
  "iss": "https://auth.pearcomputer.com/realms/pear",
  "sub": "f8a7b2c1-d3e4-5f6a-7b8c-9d0e1f2a3b4c",
  "aud": "pear-api",
  "exp": 1234571490,
  "iat": 1234567890,
  "auth_time": 1234567890,
  "azp": "pear-web-app",
  "session_state": "abc123-session-id",
  "acr": "1",
  "realm_access": {
    "roles": ["customer"]
  },
  "resource_access": {
    "pear-api": {
      "roles": ["customer:registered", "family:organizer"]
    }
  },
  "scope": "openid profile email",
  "email_verified": true,
  "pear_id": "user@email.com",
  "name": "John Doe",
  "preferred_username": "johndoe",
  "given_name": "John",
  "family_name": "Doe",
  "email": "user@email.com",
  "department": "retail",
  "location_id": "store-001"
}
```

**Custom Claims** (configured in Keycloak mappers):
- `pear_id`: User's Pear ID (email)
- `department`: Employee department (for staff)
- `location_id`: Store/warehouse location (for staff)
- `resource_access.pear-api.roles`: Application-specific roles

### 2. Keycloak Realm Configuration

**Clients**:
| Client ID | Type | Description |
|-----------|------|-------------|
| `pear-web-app` | Public | Customer web application |
| `pear-mobile-app` | Public | Mobile applications |
| `pear-admin-portal` | Confidential | Employee admin portal |
| `service-ecommerce` | Confidential (service account) | E-commerce backend |
| `service-orders` | Confidential (service account) | Order processing |
| `service-analytics` | Confidential (service account) | Analytics pipeline |

**Identity Providers** (optional social login):
- Sign in with Google
- Sign in with Apple (for Pear ecosystem alignment)

**Authentication Flows**:
- Browser flow with optional MFA
- Direct grant for mobile apps
- Client credentials for service accounts

### 3. API Gateway Enforcement

All requests should pass through the API Gateway which:
- Validates JWT signatures
- Checks token expiration
- Verifies required scopes
- Enforces rate limits per role
- Logs access for audit

### 4. Service-Level Authorization

Each service should:
- Validate scopes match operation requirements
- Check resource ownership for customer data
- Implement row-level security where applicable
- Log all authorization decisions

### 5. Scope Inheritance

Roles inherit scopes hierarchically:
- `inventory:admin` includes `inventory:write` and `inventory:read`
- `analytics:write` includes `analytics:read`
- Manager roles include subordinate role permissions

### 6. Multi-Tenancy Considerations

For enterprise/business customers:
- Organization-level roles
- Cross-account access controls
- Delegated administration

### 7. Audit Requirements

All access to sensitive data must be logged:
- Payment information access
- Customer PII access
- Inventory adjustments
- Order modifications
- Security setting changes

---

## Security Contact

For security concerns or to report vulnerabilities:
- Email: security@pearcomputer.com
- Bug Bounty: https://pearcomputer.com/security/bounty

---

*Document Version: 1.0*
*Last Updated: 2024*
*Classification: Internal Use*
