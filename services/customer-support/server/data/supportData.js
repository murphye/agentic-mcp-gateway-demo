/**
 * Customer Support Sample Data
 * Aligned with customer-accounts, payments, and order-management services
 */

// Current user simulation (would come from auth token in production)
let currentUserId = 'cust-001';

const getCurrentUser = () => currentUserId;
const setCurrentUser = (userId) => { currentUserId = userId; };

// Support Agents
const agents = [
  { id: 'agent-001', name: 'Alex Rivera', avatar: 'https://cdn.pearcomputer.com/avatars/agent-001.jpg' },
  { id: 'agent-002', name: 'Sam Chen', avatar: 'https://cdn.pearcomputer.com/avatars/agent-002.jpg' },
  { id: 'agent-003', name: 'Jordan Taylor', avatar: 'https://cdn.pearcomputer.com/avatars/agent-003.jpg' },
  { id: 'agent-004', name: 'Morgan Williams', avatar: 'https://cdn.pearcomputer.com/avatars/agent-004.jpg' },
];

// Support Tickets
const tickets = [
  {
    id: 'ticket-001',
    ticketNumber: 'SUP-2024-100001',
    subject: 'PearPhone 15 Pro battery draining quickly',
    description: 'My PearPhone 15 Pro battery has been draining much faster than usual over the past week. It used to last all day but now barely makes it to 3pm. I have not installed any new apps recently.',
    status: 'in_progress',
    priority: 'high',
    topic: 'technical_support',
    customer: { id: 'cust-001', name: 'John Smith', email: 'john.smith@email.com' },
    device: { id: 'dev-001', type: 'pearphone', model: 'PearPhone 15 Pro', serialNumber: 'PP15P-2024-001234' },
    assignedTo: { id: 'agent-001', name: 'Alex Rivera' },
    relatedOrderId: null,
    tags: ['battery', 'pearphone', 'hardware'],
    messageCount: 4,
    attachments: [],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    resolvedAt: null,
    firstResponseAt: '2024-01-15T11:45:00Z'
  },
  {
    id: 'ticket-002',
    ticketNumber: 'SUP-2024-100002',
    subject: 'Order not delivered - tracking shows delivered',
    description: 'My order ORD-2024-003 shows as delivered but I never received it. The package was supposedly left at my door but nothing was there when I got home.',
    status: 'waiting_on_support',
    priority: 'urgent',
    topic: 'orders',
    customer: { id: 'cust-003', name: 'Marcus Johnson', email: 'marcus.johnson@email.com' },
    device: null,
    assignedTo: { id: 'agent-002', name: 'Sam Chen' },
    relatedOrderId: 'ORD-2024-003',
    tags: ['shipping', 'missing-package', 'urgent'],
    messageCount: 3,
    attachments: [],
    createdAt: '2024-01-14T16:00:00Z',
    updatedAt: '2024-01-15T09:30:00Z',
    resolvedAt: null,
    firstResponseAt: '2024-01-14T17:15:00Z'
  },
  {
    id: 'ticket-003',
    ticketNumber: 'SUP-2024-100003',
    subject: 'Question about Pear Care+ coverage',
    description: 'I want to understand what is covered under my Pear Care+ plan for my PearWatch Ultra. Specifically, is accidental damage from water exposure covered?',
    status: 'resolved',
    priority: 'normal',
    topic: 'billing',
    customer: { id: 'cust-004', name: 'Sarah Williams', email: 'sarah.williams@email.com' },
    device: { id: 'dev-005', type: 'pearwatch', model: 'PearWatch Ultra', serialNumber: 'PWU-2024-005678' },
    assignedTo: { id: 'agent-003', name: 'Jordan Taylor' },
    relatedOrderId: null,
    tags: ['pearcare', 'warranty', 'pearwatch'],
    messageCount: 5,
    attachments: [],
    createdAt: '2024-01-10T08:15:00Z',
    updatedAt: '2024-01-12T11:00:00Z',
    resolvedAt: '2024-01-12T11:00:00Z',
    firstResponseAt: '2024-01-10T09:30:00Z'
  },
  {
    id: 'ticket-004',
    ticketNumber: 'SUP-2024-100004',
    subject: 'PearBook Air screen flickering',
    description: 'The screen on my PearBook Air has started flickering randomly. It happens mostly when running multiple applications. The laptop is about 8 months old.',
    status: 'open',
    priority: 'high',
    topic: 'technical_support',
    customer: { id: 'cust-003', name: 'Marcus Johnson', email: 'marcus.johnson@email.com' },
    device: { id: 'dev-004', type: 'pearbook', model: 'PearBook Air', serialNumber: 'PBA-2024-003456' },
    assignedTo: null,
    relatedOrderId: null,
    tags: ['display', 'pearbook', 'hardware'],
    messageCount: 1,
    attachments: [],
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-16T09:00:00Z',
    resolvedAt: null,
    firstResponseAt: null
  },
  {
    id: 'ticket-005',
    ticketNumber: 'SUP-2024-100005',
    subject: 'Return request for PearPods Pro',
    description: 'I would like to return my recently purchased PearPods Pro. They do not fit my ears comfortably even with all the tip sizes included.',
    status: 'closed',
    priority: 'normal',
    topic: 'returns',
    customer: { id: 'cust-006', name: 'Amanda Rodriguez', email: 'amanda.rodriguez@email.com' },
    device: { id: 'dev-006', type: 'pearpods', model: 'PearPods Pro', serialNumber: 'PPP-2024-006789' },
    assignedTo: { id: 'agent-004', name: 'Morgan Williams' },
    relatedOrderId: 'ORD-2024-006',
    tags: ['return', 'pearpods', 'fit-issue'],
    messageCount: 6,
    attachments: [],
    createdAt: '2024-01-05T14:30:00Z',
    updatedAt: '2024-01-08T16:00:00Z',
    resolvedAt: '2024-01-08T16:00:00Z',
    firstResponseAt: '2024-01-05T15:00:00Z'
  },
  {
    id: 'ticket-006',
    ticketNumber: 'SUP-2024-100006',
    subject: 'Unable to sync PearWatch with PearPhone',
    description: 'My PearWatch Ultra will not sync with my PearPhone 15 Pro Max. I have tried restarting both devices and re-pairing but the connection keeps dropping.',
    status: 'waiting_on_customer',
    priority: 'normal',
    topic: 'technical_support',
    customer: { id: 'cust-007', name: 'Michael Thompson', email: 'michael.thompson@email.com' },
    device: { id: 'dev-007', type: 'pearphone', model: 'PearPhone 15 Pro Max', serialNumber: 'PP15PM-2024-007890' },
    assignedTo: { id: 'agent-001', name: 'Alex Rivera' },
    relatedOrderId: null,
    tags: ['sync', 'bluetooth', 'pearwatch', 'pearphone'],
    messageCount: 4,
    attachments: [],
    createdAt: '2024-01-13T11:45:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    resolvedAt: null,
    firstResponseAt: '2024-01-13T12:30:00Z'
  },
  {
    id: 'ticket-007',
    ticketNumber: 'SUP-2024-100007',
    subject: 'Billing discrepancy on Pear Music subscription',
    description: 'I was charged $14.99 this month for Pear Music but my plan is the individual plan at $10.99. Can you please review my billing?',
    status: 'in_progress',
    priority: 'normal',
    topic: 'billing',
    customer: { id: 'cust-002', name: 'Emily Chen', email: 'emily.chen@email.com' },
    device: null,
    assignedTo: { id: 'agent-003', name: 'Jordan Taylor' },
    relatedOrderId: null,
    tags: ['billing', 'subscription', 'pear-music'],
    messageCount: 2,
    attachments: [],
    createdAt: '2024-01-16T08:00:00Z',
    updatedAt: '2024-01-16T10:15:00Z',
    resolvedAt: null,
    firstResponseAt: '2024-01-16T09:00:00Z'
  },
  {
    id: 'ticket-008',
    ticketNumber: 'SUP-2024-100008',
    subject: 'PearPad Pro touchscreen unresponsive in corners',
    description: 'The touchscreen on my PearPad Pro 12.9" is not responding to touch in the upper right and lower left corners. This started after the latest software update.',
    status: 'open',
    priority: 'high',
    topic: 'technical_support',
    customer: { id: 'cust-009', name: 'Robert Martinez', email: 'robert.martinez@email.com' },
    device: { id: 'dev-008', type: 'pearpad', model: 'PearPad Pro 12.9"', serialNumber: 'PPDP-2024-009012' },
    assignedTo: null,
    relatedOrderId: null,
    tags: ['touchscreen', 'pearpad', 'software-issue'],
    messageCount: 1,
    attachments: [],
    createdAt: '2024-01-16T12:00:00Z',
    updatedAt: '2024-01-16T12:00:00Z',
    resolvedAt: null,
    firstResponseAt: null
  }
];

// Ticket Messages
const ticketMessages = [
  // Ticket 1 messages
  {
    id: 'msg-001',
    ticketId: 'ticket-001',
    sender: { id: 'cust-001', name: 'John Smith', type: 'customer' },
    message: 'My PearPhone 15 Pro battery has been draining much faster than usual over the past week. It used to last all day but now barely makes it to 3pm. I have not installed any new apps recently.',
    attachments: [],
    isInternal: false,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'msg-002',
    ticketId: 'ticket-001',
    sender: { id: 'agent-001', name: 'Alex Rivera', type: 'agent', avatar: 'https://cdn.pearcomputer.com/avatars/agent-001.jpg' },
    message: 'Hi John, thank you for reaching out. I understand how frustrating unexpected battery drain can be. Let me help you troubleshoot this issue. Could you please go to Settings > Battery and check the Battery Health percentage? Also, can you tell me which apps are showing the highest battery usage in the last 24 hours?',
    attachments: [],
    isInternal: false,
    createdAt: '2024-01-15T11:45:00Z'
  },
  {
    id: 'msg-003',
    ticketId: 'ticket-001',
    sender: { id: 'cust-001', name: 'John Smith', type: 'customer' },
    message: 'Battery Health shows 94% which seems fine. The top battery users are: Messages (18%), Safari (15%), and Mail (12%). Background App Refresh is on for most apps.',
    attachments: [],
    isInternal: false,
    createdAt: '2024-01-15T14:20:00Z'
  },
  {
    id: 'msg-004',
    ticketId: 'ticket-001',
    sender: { id: 'agent-001', name: 'Alex Rivera', type: 'agent', avatar: 'https://cdn.pearcomputer.com/avatars/agent-001.jpg' },
    message: 'Thank you for that information. Those percentages look normal, but Background App Refresh can significantly impact battery life. Let me suggest a few things:\n\n1. Go to Settings > General > Background App Refresh and turn it off for apps you do not need updating in the background\n2. Check Settings > Privacy > Location Services and set apps to "While Using" instead of "Always"\n3. Try restarting your phone (hold side button + volume button)\n\nPlease try these steps and let me know if you see improvement over the next day or two.',
    attachments: [],
    isInternal: false,
    createdAt: '2024-01-16T14:20:00Z'
  },
  // Ticket 2 messages
  {
    id: 'msg-005',
    ticketId: 'ticket-002',
    sender: { id: 'cust-003', name: 'Marcus Johnson', type: 'customer' },
    message: 'My order ORD-2024-003 shows as delivered but I never received it. The package was supposedly left at my door but nothing was there when I got home.',
    attachments: [],
    isInternal: false,
    createdAt: '2024-01-14T16:00:00Z'
  },
  {
    id: 'msg-006',
    ticketId: 'ticket-002',
    sender: { id: 'agent-002', name: 'Sam Chen', type: 'agent', avatar: 'https://cdn.pearcomputer.com/avatars/agent-002.jpg' },
    message: 'Hi Marcus, I am so sorry to hear your package is missing. This is definitely concerning and I want to help resolve this right away. I am opening an investigation with our shipping partner. In the meantime, could you please check with neighbors or your building management in case it was left there by mistake?',
    attachments: [],
    isInternal: false,
    createdAt: '2024-01-14T17:15:00Z'
  },
  {
    id: 'msg-007',
    ticketId: 'ticket-002',
    sender: { id: 'cust-003', name: 'Marcus Johnson', type: 'customer' },
    message: 'I checked with my neighbors and the building manager. No one has seen the package. The delivery photo from tracking shows a door that is not mine.',
    attachments: [],
    isInternal: false,
    createdAt: '2024-01-15T09:30:00Z'
  },
  // Ticket 3 messages
  {
    id: 'msg-008',
    ticketId: 'ticket-003',
    sender: { id: 'cust-004', name: 'Sarah Williams', type: 'customer' },
    message: 'I want to understand what is covered under my Pear Care+ plan for my PearWatch Ultra. Specifically, is accidental damage from water exposure covered?',
    attachments: [],
    isInternal: false,
    createdAt: '2024-01-10T08:15:00Z'
  },
  {
    id: 'msg-009',
    ticketId: 'ticket-003',
    sender: { id: 'agent-003', name: 'Jordan Taylor', type: 'agent', avatar: 'https://cdn.pearcomputer.com/avatars/agent-003.jpg' },
    message: 'Hi Sarah! Great question. Your Pear Care+ plan for PearWatch Ultra covers accidental damage, including water damage that exceeds the device rated water resistance. There is a service fee of $69 for accidental damage repairs. Your PearWatch Ultra is water resistant up to 100m, so normal swimming and water activities are fine without needing a claim.',
    attachments: [],
    isInternal: false,
    createdAt: '2024-01-10T09:30:00Z'
  }
];

// Chat Sessions
const chatSessions = [
  {
    id: 'chat-001',
    status: 'active',
    topic: 'technical_support',
    customerId: 'cust-005',
    queuePosition: null,
    estimatedWaitTime: null,
    agent: { id: 'agent-002', name: 'Sam Chen', avatar: 'https://cdn.pearcomputer.com/avatars/agent-002.jpg' },
    websocketUrl: 'wss://support.pearcomputer.com/chat/chat-001',
    createdAt: '2024-01-16T14:00:00Z',
    startedAt: '2024-01-16T14:02:00Z',
    endedAt: null
  },
  {
    id: 'chat-002',
    status: 'queued',
    topic: 'billing',
    customerId: 'cust-008',
    queuePosition: 2,
    estimatedWaitTime: 5,
    agent: null,
    websocketUrl: 'wss://support.pearcomputer.com/chat/chat-002',
    createdAt: '2024-01-16T14:10:00Z',
    startedAt: null,
    endedAt: null
  },
  {
    id: 'chat-003',
    status: 'ended',
    topic: 'orders',
    customerId: 'cust-002',
    queuePosition: null,
    estimatedWaitTime: null,
    agent: { id: 'agent-004', name: 'Morgan Williams', avatar: 'https://cdn.pearcomputer.com/avatars/agent-004.jpg' },
    websocketUrl: null,
    createdAt: '2024-01-16T10:00:00Z',
    startedAt: '2024-01-16T10:03:00Z',
    endedAt: '2024-01-16T10:25:00Z'
  }
];

// Chat Messages
const chatMessages = [
  {
    id: 'cmsg-001',
    sessionId: 'chat-001',
    sender: { id: 'cust-005', name: 'David Park', type: 'customer' },
    message: 'Hi, I need help setting up my new PearBook',
    messageType: 'text',
    metadata: {},
    createdAt: '2024-01-16T14:00:00Z'
  },
  {
    id: 'cmsg-002',
    sessionId: 'chat-001',
    sender: { id: 'bot', name: 'Pear Support Bot', type: 'bot' },
    message: 'Welcome to Pear Support! An agent will be with you shortly. In the meantime, you might find these resources helpful.',
    messageType: 'text',
    metadata: {},
    createdAt: '2024-01-16T14:00:30Z'
  },
  {
    id: 'cmsg-003',
    sessionId: 'chat-001',
    sender: { id: 'agent-002', name: 'Sam Chen', type: 'agent' },
    message: 'Hi David! I am Sam and I would be happy to help you set up your new PearBook. What model do you have and what step are you on?',
    messageType: 'text',
    metadata: {},
    createdAt: '2024-01-16T14:02:00Z'
  },
  {
    id: 'cmsg-004',
    sessionId: 'chat-003',
    sender: { id: 'cust-002', name: 'Emily Chen', type: 'customer' },
    message: 'I have a question about changing my delivery address for an upcoming order',
    messageType: 'text',
    metadata: {},
    createdAt: '2024-01-16T10:00:00Z'
  },
  {
    id: 'cmsg-005',
    sessionId: 'chat-003',
    sender: { id: 'agent-004', name: 'Morgan Williams', type: 'agent' },
    message: 'Hi Emily! I can help you with that. Can you provide me with your order number?',
    messageType: 'text',
    metadata: {},
    createdAt: '2024-01-16T10:03:00Z'
  }
];

// Knowledge Base Categories
const categories = [
  {
    id: 'cat-001',
    name: 'PearPhone',
    slug: 'pearphone',
    description: 'Support articles for PearPhone devices',
    icon: 'phone',
    articleCount: 45,
    subcategories: [
      { id: 'cat-001-01', name: 'Setup & Getting Started', slug: 'pearphone-setup', articleCount: 12 },
      { id: 'cat-001-02', name: 'Battery & Power', slug: 'pearphone-battery', articleCount: 8 },
      { id: 'cat-001-03', name: 'Camera & Photos', slug: 'pearphone-camera', articleCount: 10 }
    ]
  },
  {
    id: 'cat-002',
    name: 'PearBook',
    slug: 'pearbook',
    description: 'Support articles for PearBook laptops',
    icon: 'laptop',
    articleCount: 52,
    subcategories: [
      { id: 'cat-002-01', name: 'Setup & Migration', slug: 'pearbook-setup', articleCount: 15 },
      { id: 'cat-002-02', name: 'Performance', slug: 'pearbook-performance', articleCount: 12 },
      { id: 'cat-002-03', name: 'Display & Graphics', slug: 'pearbook-display', articleCount: 9 }
    ]
  },
  {
    id: 'cat-003',
    name: 'PearWatch',
    slug: 'pearwatch',
    description: 'Support articles for PearWatch devices',
    icon: 'watch',
    articleCount: 38,
    subcategories: [
      { id: 'cat-003-01', name: 'Health & Fitness', slug: 'pearwatch-health', articleCount: 14 },
      { id: 'cat-003-02', name: 'Pairing & Connectivity', slug: 'pearwatch-pairing', articleCount: 10 }
    ]
  },
  {
    id: 'cat-004',
    name: 'Billing & Subscriptions',
    slug: 'billing',
    description: 'Help with payments, subscriptions, and account billing',
    icon: 'credit-card',
    articleCount: 28,
    subcategories: []
  },
  {
    id: 'cat-005',
    name: 'Orders & Shipping',
    slug: 'orders',
    description: 'Help with orders, shipping, and delivery',
    icon: 'package',
    articleCount: 22,
    subcategories: []
  }
];

// Knowledge Base Articles
const articles = [
  {
    id: 'article-001',
    title: 'How to check and improve PearPhone battery life',
    slug: 'pearphone-battery-life-tips',
    summary: 'Learn how to monitor your battery health and optimize settings for longer battery life.',
    content: '<h2>Checking Battery Health</h2><p>Go to Settings > Battery > Battery Health to see your maximum capacity and peak performance capability.</p><h2>Tips for Longer Battery Life</h2><ul><li>Enable Low Power Mode when needed</li><li>Reduce screen brightness or use Auto-Brightness</li><li>Turn off Background App Refresh for apps that do not need it</li><li>Use Wi-Fi instead of cellular when possible</li></ul>',
    category: { id: 'cat-001-02', name: 'Battery & Power', slug: 'pearphone-battery' },
    products: ['pearphone-15', 'pearphone-15-pro', 'pearphone-15-pro-max'],
    tags: ['battery', 'power', 'optimization', 'settings'],
    relatedArticles: [
      { id: 'article-002', title: 'Understanding Battery Health', slug: 'battery-health-explained', summary: 'What battery health means and when to consider replacement' }
    ],
    helpfulCount: 1523,
    notHelpfulCount: 89,
    viewCount: 45200,
    language: 'en',
    publishedAt: '2023-09-15T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'article-002',
    title: 'Understanding Battery Health',
    slug: 'battery-health-explained',
    summary: 'What battery health means and when to consider replacement',
    content: '<h2>What is Battery Health?</h2><p>Battery health indicates your battery maximum capacity compared to when it was new. All rechargeable batteries are consumable components that become less effective as they age.</p><h2>When to Replace</h2><p>If your battery health drops below 80% and you notice significant performance issues, it may be time to consider a battery replacement.</p>',
    category: { id: 'cat-001-02', name: 'Battery & Power', slug: 'pearphone-battery' },
    products: ['pearphone-15', 'pearphone-15-pro', 'pearphone-15-pro-max', 'pearbook-air', 'pearbook-pro'],
    tags: ['battery', 'health', 'replacement'],
    relatedArticles: [],
    helpfulCount: 892,
    notHelpfulCount: 45,
    viewCount: 28300,
    language: 'en',
    publishedAt: '2023-08-20T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    id: 'article-003',
    title: 'Setting up your new PearBook',
    slug: 'pearbook-initial-setup',
    summary: 'Step-by-step guide to set up your new PearBook and migrate your data',
    content: '<h2>Initial Setup</h2><p>When you first turn on your PearBook, Setup Assistant will guide you through the process.</p><h2>Migration Options</h2><ul><li>Transfer from another PearBook</li><li>Transfer from Windows PC</li><li>Restore from Time Machine backup</li><li>Start fresh</li></ul>',
    category: { id: 'cat-002-01', name: 'Setup & Migration', slug: 'pearbook-setup' },
    products: ['pearbook-air', 'pearbook-pro-14', 'pearbook-pro-16'],
    tags: ['setup', 'migration', 'new-device', 'getting-started'],
    relatedArticles: [],
    helpfulCount: 2105,
    notHelpfulCount: 67,
    viewCount: 62100,
    language: 'en',
    publishedAt: '2023-10-01T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z'
  },
  {
    id: 'article-004',
    title: 'Pairing PearWatch with your PearPhone',
    slug: 'pearwatch-pairing-guide',
    summary: 'How to pair, unpair, and troubleshoot PearWatch connectivity',
    content: '<h2>Pairing Your PearWatch</h2><p>Make sure Bluetooth is enabled on your PearPhone, then bring your PearWatch close to your phone. The pairing dialog should appear automatically.</p><h2>Troubleshooting Connection Issues</h2><ul><li>Restart both devices</li><li>Check that both devices are updated</li><li>Unpair and re-pair if issues persist</li></ul>',
    category: { id: 'cat-003-02', name: 'Pairing & Connectivity', slug: 'pearwatch-pairing' },
    products: ['pearwatch-ultra', 'pearwatch-series-9'],
    tags: ['pairing', 'bluetooth', 'connectivity', 'setup'],
    relatedArticles: [],
    helpfulCount: 756,
    notHelpfulCount: 34,
    viewCount: 19800,
    language: 'en',
    publishedAt: '2023-09-25T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z'
  },
  {
    id: 'article-005',
    title: 'Understanding your Pear Care+ coverage',
    slug: 'pearcare-plus-coverage',
    summary: 'What is covered under Pear Care+ and how to make a claim',
    content: '<h2>What is Covered</h2><ul><li>Accidental damage (with service fee)</li><li>Battery service</li><li>Hardware coverage</li><li>24/7 priority support</li></ul><h2>Service Fees</h2><p>Accidental damage claims have a service fee that varies by device type.</p>',
    category: { id: 'cat-004', name: 'Billing & Subscriptions', slug: 'billing' },
    products: ['all'],
    tags: ['pearcare', 'warranty', 'coverage', 'insurance'],
    relatedArticles: [],
    helpfulCount: 1890,
    notHelpfulCount: 112,
    viewCount: 54600,
    language: 'en',
    publishedAt: '2023-07-15T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'article-006',
    title: 'How to track your Pear order',
    slug: 'track-pear-order',
    summary: 'Track your order status and get delivery updates',
    content: '<h2>Tracking Your Order</h2><p>You can track your order by:</p><ul><li>Visiting orders.pearcomputer.com and signing in</li><li>Clicking the tracking link in your shipping confirmation email</li><li>Using the Pear Store app</li></ul>',
    category: { id: 'cat-005', name: 'Orders & Shipping', slug: 'orders' },
    products: ['all'],
    tags: ['orders', 'shipping', 'tracking', 'delivery'],
    relatedArticles: [],
    helpfulCount: 3201,
    notHelpfulCount: 156,
    viewCount: 89400,
    language: 'en',
    publishedAt: '2023-06-01T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z'
  }
];

// Diagnostics Sessions
const diagnosticsSessions = [
  {
    id: 'diag-001',
    deviceId: 'dev-001',
    deviceModel: 'PearPhone 15 Pro',
    customerId: 'cust-001',
    status: 'completed',
    progress: 100,
    tests: [
      { name: 'battery', status: 'warning', result: { score: 72, details: 'Battery health at 94%, slightly elevated drain detected', metrics: { health: '94%', cycles: '156' } } },
      { name: 'storage', status: 'passed', result: { score: 95, details: 'Storage functioning normally', metrics: { used: '78GB', total: '256GB' } } },
      { name: 'display', status: 'passed', result: { score: 100, details: 'Display functioning normally', metrics: { brightness: 'OK', pixels: 'OK' } } },
      { name: 'camera', status: 'passed', result: { score: 98, details: 'All cameras functioning normally', metrics: { main: 'OK', ultrawide: 'OK', telephoto: 'OK' } } },
      { name: 'connectivity', status: 'passed', result: { score: 100, details: 'All connectivity features working', metrics: { wifi: 'OK', bluetooth: 'OK', cellular: 'OK' } } }
    ],
    overallHealth: 'good',
    recommendations: [
      { type: 'optimization', title: 'Optimize Battery Usage', description: 'Consider reducing background app refresh to improve battery life', actionUrl: 'https://support.pearcomputer.com/article/pearphone-battery-life-tips' }
    ],
    createdAt: '2024-01-15T12:00:00Z',
    completedAt: '2024-01-15T12:05:00Z'
  },
  {
    id: 'diag-002',
    deviceId: 'dev-004',
    deviceModel: 'PearBook Air',
    customerId: 'cust-003',
    status: 'completed',
    progress: 100,
    tests: [
      { name: 'battery', status: 'passed', result: { score: 98, details: 'Battery in excellent condition', metrics: { health: '99%', cycles: '42' } } },
      { name: 'storage', status: 'passed', result: { score: 90, details: 'Storage functioning normally', metrics: { used: '234GB', total: '512GB' } } },
      { name: 'display', status: 'warning', result: { score: 65, details: 'Display showing intermittent issues', metrics: { brightness: 'OK', pixels: 'Issue detected' } } },
      { name: 'performance', status: 'passed', result: { score: 95, details: 'System performance is excellent', metrics: { cpu: 'OK', memory: 'OK' } } }
    ],
    overallHealth: 'fair',
    recommendations: [
      { type: 'service', title: 'Display Service Recommended', description: 'Display diagnostics detected an issue. Schedule a service appointment for further evaluation.', actionUrl: 'https://support.pearcomputer.com/service' }
    ],
    createdAt: '2024-01-16T10:00:00Z',
    completedAt: '2024-01-16T10:08:00Z'
  },
  {
    id: 'diag-003',
    deviceId: 'dev-007',
    deviceModel: 'PearPhone 15 Pro Max',
    customerId: 'cust-007',
    status: 'running',
    progress: 60,
    tests: [
      { name: 'battery', status: 'passed', result: { score: 100, details: 'Battery in excellent condition', metrics: { health: '100%', cycles: '28' } } },
      { name: 'storage', status: 'passed', result: { score: 92, details: 'Storage functioning normally', metrics: { used: '128GB', total: '512GB' } } },
      { name: 'display', status: 'running', result: null },
      { name: 'connectivity', status: 'pending', result: null }
    ],
    overallHealth: null,
    recommendations: [],
    createdAt: '2024-01-16T14:30:00Z',
    completedAt: null
  }
];

// Feedback
const feedback = [
  {
    id: 'fb-001',
    customerId: 'cust-002',
    type: 'feature_request',
    subject: 'Add dark mode scheduling',
    message: 'It would be great if PearOS could automatically switch between light and dark mode based on time of day, similar to night shift.',
    productId: 'pearos',
    deviceId: null,
    contactConsent: true,
    createdAt: '2024-01-10T15:30:00Z'
  },
  {
    id: 'fb-002',
    customerId: 'cust-005',
    type: 'praise',
    subject: 'Amazing customer support',
    message: 'Just wanted to say thank you for the excellent support I received when setting up my new PearBook. Sam was incredibly helpful and patient.',
    productId: null,
    deviceId: null,
    contactConsent: false,
    createdAt: '2024-01-14T09:00:00Z'
  },
  {
    id: 'fb-003',
    customerId: 'cust-006',
    type: 'bug_report',
    subject: 'PearPods case battery indicator incorrect',
    message: 'The battery indicator for my PearPods Pro case often shows 100% even when the case is nearly empty. This has caused my PearPods to die unexpectedly several times.',
    productId: 'pearpods-pro',
    deviceId: 'dev-006',
    contactConsent: true,
    createdAt: '2024-01-12T11:45:00Z'
  }
];

// Surveys
const surveys = [
  {
    id: 'survey-001',
    title: 'Support Experience Survey',
    description: 'Help us improve by sharing your feedback on your recent support experience.',
    questions: [
      {
        id: 'q1',
        type: 'nps',
        question: 'How likely are you to recommend Pear Support to a friend or colleague?',
        required: true,
        options: null
      },
      {
        id: 'q2',
        type: 'single_choice',
        question: 'Was your issue resolved?',
        required: true,
        options: [
          { value: 'yes', label: 'Yes, completely' },
          { value: 'partial', label: 'Partially' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'q3',
        type: 'rating',
        question: 'How would you rate the knowledge of our support agent?',
        required: true,
        options: null
      },
      {
        id: 'q4',
        type: 'text',
        question: 'Any additional comments or suggestions?',
        required: false,
        options: null
      }
    ],
    expiresAt: '2024-02-15T00:00:00Z'
  },
  {
    id: 'survey-002',
    title: 'Post-Purchase Feedback',
    description: 'Tell us about your experience with your new Pear product.',
    questions: [
      {
        id: 'q1',
        type: 'rating',
        question: 'How satisfied are you with your purchase?',
        required: true,
        options: null
      },
      {
        id: 'q2',
        type: 'single_choice',
        question: 'How easy was the setup process?',
        required: true,
        options: [
          { value: 'very_easy', label: 'Very easy' },
          { value: 'easy', label: 'Easy' },
          { value: 'neutral', label: 'Neutral' },
          { value: 'difficult', label: 'Difficult' },
          { value: 'very_difficult', label: 'Very difficult' }
        ]
      },
      {
        id: 'q3',
        type: 'multi_choice',
        question: 'What features do you use most?',
        required: false,
        options: [
          { value: 'camera', label: 'Camera' },
          { value: 'battery', label: 'Battery life' },
          { value: 'display', label: 'Display' },
          { value: 'performance', label: 'Performance' },
          { value: 'ecosystem', label: 'Pear ecosystem integration' }
        ]
      }
    ],
    expiresAt: '2024-03-01T00:00:00Z'
  }
];

// Chat availability settings
const chatAvailability = {
  technical_support: { available: true, estimatedWaitTime: 3, queueLength: 5 },
  billing: { available: true, estimatedWaitTime: 5, queueLength: 8 },
  orders: { available: true, estimatedWaitTime: 2, queueLength: 3 },
  returns: { available: true, estimatedWaitTime: 4, queueLength: 6 },
  account: { available: true, estimatedWaitTime: 3, queueLength: 4 },
  feedback: { available: false, estimatedWaitTime: null, queueLength: 0 },
  other: { available: true, estimatedWaitTime: 6, queueLength: 10 }
};

// Helper Functions

// Tickets
const listTickets = (customerId, { status, priority, page = 1, limit = 20 }) => {
  let filtered = tickets.filter(t => t.customer.id === customerId);
  if (status) filtered = filtered.filter(t => t.status === status);
  if (priority) filtered = filtered.filter(t => t.priority === priority);

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit);
  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + limit);

  return {
    tickets: paged,
    pagination: { page, limit, totalItems, totalPages }
  };
};

const getTicket = (ticketId) => tickets.find(t => t.id === ticketId);

const createTicket = (customerId, ticketData) => {
  const customer = { id: customerId, name: 'Customer', email: 'customer@email.com' };
  // In a real system, we'd look up customer details
  const customerNames = {
    'cust-001': { name: 'John Smith', email: 'john.smith@email.com' },
    'cust-002': { name: 'Emily Chen', email: 'emily.chen@email.com' },
    'cust-003': { name: 'Marcus Johnson', email: 'marcus.johnson@email.com' },
    'cust-004': { name: 'Sarah Williams', email: 'sarah.williams@email.com' },
    'cust-005': { name: 'David Park', email: 'david.park@email.com' },
    'cust-006': { name: 'Amanda Rodriguez', email: 'amanda.rodriguez@email.com' },
    'cust-007': { name: 'Michael Thompson', email: 'michael.thompson@email.com' },
    'cust-008': { name: 'Jennifer Lee', email: 'jennifer.lee@email.com' },
    'cust-009': { name: 'Robert Martinez', email: 'robert.martinez@email.com' }
  };

  if (customerNames[customerId]) {
    customer.name = customerNames[customerId].name;
    customer.email = customerNames[customerId].email;
  }

  const newTicket = {
    id: `ticket-${String(tickets.length + 1).padStart(3, '0')}`,
    ticketNumber: `SUP-2024-${String(100009 + tickets.length).padStart(6, '0')}`,
    subject: ticketData.subject,
    description: ticketData.description,
    status: 'open',
    priority: ticketData.priority || 'normal',
    topic: ticketData.topic,
    customer,
    device: ticketData.deviceId ? { id: ticketData.deviceId } : null,
    assignedTo: null,
    relatedOrderId: ticketData.orderId || null,
    tags: [],
    messageCount: 1,
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    resolvedAt: null,
    firstResponseAt: null
  };

  tickets.push(newTicket);

  // Add initial message
  ticketMessages.push({
    id: `msg-${String(ticketMessages.length + 1).padStart(3, '0')}`,
    ticketId: newTicket.id,
    sender: { id: customerId, name: customer.name, type: 'customer' },
    message: ticketData.description,
    attachments: [],
    isInternal: false,
    createdAt: new Date().toISOString()
  });

  return newTicket;
};

const updateTicket = (ticketId, updates) => {
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return null;

  if (updates.status) ticket.status = updates.status;
  if (updates.priority) ticket.priority = updates.priority;
  ticket.updatedAt = new Date().toISOString();

  if (updates.status === 'resolved') {
    ticket.resolvedAt = new Date().toISOString();
  }

  return ticket;
};

const getTicketMessages = (ticketId, { page = 1, limit = 20 }) => {
  const messages = ticketMessages.filter(m => m.ticketId === ticketId);
  const totalItems = messages.length;
  const totalPages = Math.ceil(totalItems / limit);
  const start = (page - 1) * limit;
  const paged = messages.slice(start, start + limit);

  return {
    messages: paged,
    pagination: { page, limit, totalItems, totalPages }
  };
};

const addTicketMessage = (ticketId, customerId, messageText) => {
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return null;

  const newMessage = {
    id: `msg-${String(ticketMessages.length + 1).padStart(3, '0')}`,
    ticketId,
    sender: { id: customerId, name: ticket.customer.name, type: 'customer' },
    message: messageText,
    attachments: [],
    isInternal: false,
    createdAt: new Date().toISOString()
  };

  ticketMessages.push(newMessage);
  ticket.messageCount++;
  ticket.updatedAt = new Date().toISOString();

  // Update status if customer replies
  if (ticket.status === 'waiting_on_customer') {
    ticket.status = 'waiting_on_support';
  }

  return newMessage;
};

const closeTicket = (ticketId, resolution, feedback) => {
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return null;

  ticket.status = 'closed';
  ticket.updatedAt = new Date().toISOString();
  if (!ticket.resolvedAt) ticket.resolvedAt = new Date().toISOString();

  return ticket;
};

const reopenTicket = (ticketId, reason) => {
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return null;

  ticket.status = 'open';
  ticket.resolvedAt = null;
  ticket.updatedAt = new Date().toISOString();

  if (reason) {
    addTicketMessage(ticketId, ticket.customer.id, `Ticket reopened: ${reason}`);
  }

  return ticket;
};

// Chat
const startChatSession = (customerId, { topic, deviceId, initialMessage }) => {
  const availability = chatAvailability[topic || 'other'];

  const newSession = {
    id: `chat-${String(chatSessions.length + 1).padStart(3, '0')}`,
    status: availability.available ? 'queued' : 'queued',
    topic: topic || 'other',
    customerId,
    queuePosition: availability.queueLength + 1,
    estimatedWaitTime: availability.estimatedWaitTime,
    agent: null,
    websocketUrl: `wss://support.pearcomputer.com/chat/chat-${String(chatSessions.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    startedAt: null,
    endedAt: null
  };

  chatSessions.push(newSession);

  if (initialMessage) {
    chatMessages.push({
      id: `cmsg-${String(chatMessages.length + 1).padStart(3, '0')}`,
      sessionId: newSession.id,
      sender: { id: customerId, name: 'Customer', type: 'customer' },
      message: initialMessage,
      messageType: 'text',
      metadata: {},
      createdAt: new Date().toISOString()
    });
  }

  return newSession;
};

const getChatSession = (sessionId) => chatSessions.find(s => s.id === sessionId);

const getChatMessages = (sessionId, after) => {
  let messages = chatMessages.filter(m => m.sessionId === sessionId);
  if (after) {
    const afterIndex = messages.findIndex(m => m.id === after);
    if (afterIndex >= 0) {
      messages = messages.slice(afterIndex + 1);
    }
  }
  return { messages };
};

const sendChatMessage = (sessionId, customerId, message) => {
  const session = chatSessions.find(s => s.id === sessionId);
  if (!session) return null;

  const newMessage = {
    id: `cmsg-${String(chatMessages.length + 1).padStart(3, '0')}`,
    sessionId,
    sender: { id: customerId, name: 'Customer', type: 'customer' },
    message,
    messageType: 'text',
    metadata: {},
    createdAt: new Date().toISOString()
  };

  chatMessages.push(newMessage);
  return newMessage;
};

const endChatSession = (sessionId, feedback) => {
  const session = chatSessions.find(s => s.id === sessionId);
  if (!session) return null;

  session.status = 'ended';
  session.endedAt = new Date().toISOString();
  return session;
};

const getChatAvailability = (topic) => {
  const availability = chatAvailability[topic || 'technical_support'];
  return {
    available: availability.available,
    estimatedWaitTime: availability.estimatedWaitTime,
    queuePosition: availability.queueLength,
    alternativeOptions: availability.available ? [] : ['Create a support ticket', 'Browse knowledge base', 'Email support@pearcomputer.com']
  };
};

// Knowledge Base
const searchArticles = ({ query, category, product, language = 'en', page = 1, limit = 20 }) => {
  let filtered = articles.filter(a => a.language === language);

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.tags.some(t => t.includes(q))
    );
  }

  if (category) {
    filtered = filtered.filter(a => a.category.slug === category || a.category.id === category);
  }

  if (product) {
    filtered = filtered.filter(a => a.products.includes(product) || a.products.includes('all'));
  }

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit);
  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + limit);

  return {
    articles: paged.map(a => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      summary: a.summary,
      category: a.category.name
    })),
    pagination: { page, limit, totalItems, totalPages }
  };
};

const getArticle = (articleId) => articles.find(a => a.id === articleId);

const markArticleHelpful = (articleId, helpful, comments) => {
  const article = articles.find(a => a.id === articleId);
  if (!article) return null;

  if (helpful) {
    article.helpfulCount++;
  } else {
    article.notHelpfulCount++;
  }

  return { success: true };
};

const listCategories = () => ({ categories });

const getFeaturedArticles = (product) => {
  let featured = articles.slice(0, 3);
  let trending = articles.slice(0, 4);

  if (product) {
    featured = articles.filter(a => a.products.includes(product) || a.products.includes('all')).slice(0, 3);
    trending = articles.filter(a => a.products.includes(product) || a.products.includes('all')).slice(0, 4);
  }

  return {
    featured: featured.map(a => ({ id: a.id, title: a.title, slug: a.slug, summary: a.summary, category: a.category.name })),
    trending: trending.map(a => ({ id: a.id, title: a.title, slug: a.slug, summary: a.summary, category: a.category.name }))
  };
};

// Diagnostics
const runDiagnostics = (customerId, { deviceId, tests }) => {
  const deviceModels = {
    'dev-001': 'PearPhone 15 Pro',
    'dev-002': 'PearBook Pro 14"',
    'dev-003': 'PearPhone 15',
    'dev-004': 'PearBook Air',
    'dev-005': 'PearWatch Ultra',
    'dev-006': 'PearPods Pro',
    'dev-007': 'PearPhone 15 Pro Max',
    'dev-008': 'PearPad Pro 12.9"'
  };

  const allTests = tests || ['battery', 'storage', 'display', 'connectivity', 'performance'];

  const newSession = {
    id: `diag-${String(diagnosticsSessions.length + 1).padStart(3, '0')}`,
    deviceId,
    deviceModel: deviceModels[deviceId] || 'Unknown Device',
    customerId,
    status: 'running',
    progress: 0,
    tests: allTests.map(t => ({
      name: t,
      status: 'pending',
      result: null
    })),
    overallHealth: null,
    recommendations: [],
    createdAt: new Date().toISOString(),
    completedAt: null
  };

  diagnosticsSessions.push(newSession);
  return newSession;
};

const getDiagnosticsResults = (sessionId) => diagnosticsSessions.find(s => s.id === sessionId);

const getDiagnosticsHistory = (customerId, deviceId) => {
  let filtered = diagnosticsSessions.filter(s => s.customerId === customerId);
  if (deviceId) {
    filtered = filtered.filter(s => s.deviceId === deviceId);
  }
  return { sessions: filtered };
};

// Feedback
const submitFeedback = (customerId, feedbackData) => {
  const newFeedback = {
    id: `fb-${String(feedback.length + 1).padStart(3, '0')}`,
    customerId,
    ...feedbackData,
    createdAt: new Date().toISOString()
  };

  feedback.push(newFeedback);

  return {
    feedbackId: newFeedback.id,
    message: 'Thank you for your feedback! We appreciate you taking the time to help us improve.'
  };
};

const getSurvey = (surveyId) => surveys.find(s => s.id === surveyId);

const submitSurveyResponse = (surveyId, responses) => {
  const survey = surveys.find(s => s.id === surveyId);
  if (!survey) return null;

  // In a real system, we'd store the responses
  return { success: true, message: 'Thank you for completing the survey!' };
};

module.exports = {
  getCurrentUser,
  setCurrentUser,
  // Tickets
  listTickets,
  getTicket,
  createTicket,
  updateTicket,
  getTicketMessages,
  addTicketMessage,
  closeTicket,
  reopenTicket,
  // Chat
  startChatSession,
  getChatSession,
  getChatMessages,
  sendChatMessage,
  endChatSession,
  getChatAvailability,
  // Knowledge Base
  searchArticles,
  getArticle,
  markArticleHelpful,
  listCategories,
  getFeaturedArticles,
  // Diagnostics
  runDiagnostics,
  getDiagnosticsResults,
  getDiagnosticsHistory,
  // Feedback
  submitFeedback,
  getSurvey,
  submitSurveyResponse
};
