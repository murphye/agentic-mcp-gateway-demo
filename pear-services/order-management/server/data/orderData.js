/**
 * Pear Computer Order Management Service - Mock Data Module
 * Sample data aligned with Payments service customer names and transaction IDs
 */

const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

// In-memory storage
const orders = new Map();
const returns = new Map();
const subscriptions = new Map();

// Initialize with sample data aligned to payments service
const initSampleData = () => {
  // Order 1 - Matches txn-001-sample in payments (captured, $1299.99, cust-001 John Smith)
  const order1 = {
    id: 'ORD-2024-001',
    orderNumber: 'PEAR-2024-123456',
    status: 'delivered',
    channel: 'online',
    customer: {
      id: 'cust-001',
      email: 'john.smith@email.com',
      name: 'John Smith'
    },
    items: [
      {
        id: 'item-001',
        productId: 'PEAR-PPH-1601',
        variantId: 'PPH1601-256-BLK',
        sku: 'PPH1601-256-BLK',
        name: 'PearPhone 16 Pro',
        image: 'https://assets.pearcomputer.com/products/pearphone-16-pro-black.jpg',
        options: { color: 'Space Black', storage: '256GB' },
        quantity: 1,
        unitPrice: { amount: 1199.99, currency: 'USD' },
        totalPrice: { amount: 1199.99, currency: 'USD' },
        status: 'delivered',
        serialNumber: 'PEAR-PPH16-2024-001234',
        warranty: { type: 'Limited Warranty', expiresAt: '2025-01-15' }
      },
      {
        id: 'item-002',
        productId: 'PEAR-ACC-CASE-16',
        variantId: 'ACC-CASE-16-CLR',
        sku: 'ACC-CASE-16-CLR',
        name: 'PearPhone 16 Clear Case',
        image: 'https://assets.pearcomputer.com/products/pearphone-16-case-clear.jpg',
        options: { color: 'Clear' },
        quantity: 1,
        unitPrice: { amount: 49.00, currency: 'USD' },
        totalPrice: { amount: 49.00, currency: 'USD' },
        status: 'delivered',
        serialNumber: null,
        warranty: null
      }
    ],
    shippingAddress: {
      firstName: 'John',
      lastName: 'Smith',
      street1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'US',
      phone: '+1-415-555-0123'
    },
    billingAddress: {
      firstName: 'John',
      lastName: 'Smith',
      street1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'US'
    },
    shipping: {
      method: 'Express',
      carrier: 'FedEx',
      estimatedDelivery: { minDate: '2024-01-17', maxDate: '2024-01-18' },
      instructions: 'Leave at front door'
    },
    payment: {
      method: 'credit_card',
      last4: '4242',
      brand: 'Visa',
      status: 'captured',
      transactionId: 'txn-001-sample'
    },
    pricing: {
      subtotal: { amount: 1248.99, currency: 'USD' },
      shipping: { amount: 0, currency: 'USD' },
      tax: { amount: 100.00, currency: 'USD' },
      discount: { amount: 49.00, currency: 'USD' },
      tradeInCredit: { amount: 0, currency: 'USD' },
      total: { amount: 1299.99, currency: 'USD' }
    },
    shipments: [
      {
        id: 'ship-001',
        carrier: 'FedEx',
        trackingNumber: '1234567890123456',
        trackingUrl: 'https://www.fedex.com/track?tracknumber=1234567890123456',
        status: 'delivered',
        items: [{ itemId: 'item-001', quantity: 1 }, { itemId: 'item-002', quantity: 1 }],
        shippedAt: '2024-01-16T10:00:00Z',
        estimatedDelivery: '2024-01-18',
        deliveredAt: '2024-01-17T14:30:00Z',
        events: [
          { status: 'delivered', description: 'Delivered - Left at front door', location: 'San Francisco, CA', timestamp: '2024-01-17T14:30:00Z' },
          { status: 'out_for_delivery', description: 'Out for delivery', location: 'San Francisco, CA', timestamp: '2024-01-17T08:00:00Z' },
          { status: 'in_transit', description: 'In transit', location: 'Oakland, CA', timestamp: '2024-01-17T04:00:00Z' },
          { status: 'in_transit', description: 'Departed FedEx location', location: 'Memphis, TN', timestamp: '2024-01-16T22:00:00Z' },
          { status: 'picked_up', description: 'Picked up', location: 'Cupertino, CA', timestamp: '2024-01-16T10:00:00Z' }
        ]
      }
    ],
    isGift: false,
    giftMessage: null,
    notes: null,
    placedAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-17T14:30:00Z',
    estimatedDelivery: '2024-01-18',
    deliveredAt: '2024-01-17T14:30:00Z'
  };

  // Order 2 - Matches txn-002-sample in payments (authorized, $2499.00, cust-002 Emily Chen)
  const order2 = {
    id: 'ORD-2024-002',
    orderNumber: 'PEAR-2024-123457',
    status: 'processing',
    channel: 'online',
    customer: {
      id: 'cust-002',
      email: 'emily.chen@email.com',
      name: 'Emily Chen'
    },
    items: [
      {
        id: 'item-003',
        productId: 'PEAR-MBP-16-M3',
        variantId: 'MBP16-M3-512-SLV',
        sku: 'MBP16-M3-512-SLV',
        name: 'PearBook Pro 16"',
        image: 'https://assets.pearcomputer.com/products/pearbook-pro-16-silver.jpg',
        options: { color: 'Silver', storage: '512GB', chip: 'M3 Pro' },
        quantity: 1,
        unitPrice: { amount: 2499.00, currency: 'USD' },
        totalPrice: { amount: 2499.00, currency: 'USD' },
        status: 'confirmed',
        serialNumber: null,
        warranty: { type: 'Limited Warranty', expiresAt: '2025-01-16' }
      }
    ],
    shippingAddress: {
      firstName: 'Emily',
      lastName: 'Chen',
      street1: '456 Sunset Blvd',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90028',
      country: 'US',
      phone: '+1-310-555-0456'
    },
    billingAddress: {
      firstName: 'Emily',
      lastName: 'Chen',
      street1: '456 Sunset Blvd',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90028',
      country: 'US'
    },
    shipping: {
      method: 'Standard',
      carrier: 'UPS',
      estimatedDelivery: { minDate: '2024-01-22', maxDate: '2024-01-25' },
      instructions: null
    },
    payment: {
      method: 'pear_card',
      last4: '8888',
      brand: 'Pear Card',
      status: 'authorized',
      transactionId: 'txn-002-sample'
    },
    pricing: {
      subtotal: { amount: 2499.00, currency: 'USD' },
      shipping: { amount: 0, currency: 'USD' },
      tax: { amount: 0, currency: 'USD' },
      discount: { amount: 0, currency: 'USD' },
      tradeInCredit: { amount: 0, currency: 'USD' },
      total: { amount: 2499.00, currency: 'USD' }
    },
    shipments: [],
    isGift: false,
    giftMessage: null,
    notes: null,
    placedAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    estimatedDelivery: '2024-01-25',
    deliveredAt: null
  };

  // Order 3 - Additional order for cust-001 John Smith
  const order3 = {
    id: 'ORD-2024-003',
    orderNumber: 'PEAR-2024-123458',
    status: 'shipped',
    channel: 'retail_store',
    customer: {
      id: 'cust-001',
      email: 'john.smith@email.com',
      name: 'John Smith'
    },
    items: [
      {
        id: 'item-004',
        productId: 'PEAR-PPP-2',
        variantId: 'PPP2-WHT',
        sku: 'PPP2-WHT',
        name: 'PearPods Pro 2',
        image: 'https://assets.pearcomputer.com/products/pearpods-pro-2-white.jpg',
        options: { color: 'White' },
        quantity: 1,
        unitPrice: { amount: 249.00, currency: 'USD' },
        totalPrice: { amount: 249.00, currency: 'USD' },
        status: 'shipped',
        serialNumber: 'PEAR-PPP2-2024-005678',
        warranty: { type: 'Limited Warranty', expiresAt: '2025-01-20' }
      }
    ],
    shippingAddress: {
      firstName: 'John',
      lastName: 'Smith',
      street1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'US',
      phone: '+1-415-555-0123'
    },
    billingAddress: {
      firstName: 'John',
      lastName: 'Smith',
      street1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'US'
    },
    shipping: {
      method: 'Express',
      carrier: 'UPS',
      estimatedDelivery: { minDate: '2024-01-22', maxDate: '2024-01-23' },
      instructions: null
    },
    payment: {
      method: 'pear_card',
      last4: '1234',
      brand: 'Pear Card',
      status: 'captured',
      transactionId: 'txn-003-sample'
    },
    pricing: {
      subtotal: { amount: 249.00, currency: 'USD' },
      shipping: { amount: 0, currency: 'USD' },
      tax: { amount: 19.92, currency: 'USD' },
      discount: { amount: 0, currency: 'USD' },
      tradeInCredit: { amount: 0, currency: 'USD' },
      total: { amount: 268.92, currency: 'USD' }
    },
    shipments: [
      {
        id: 'ship-002',
        carrier: 'UPS',
        trackingNumber: '1Z999AA10123456784',
        trackingUrl: 'https://www.ups.com/track?tracknum=1Z999AA10123456784',
        status: 'in_transit',
        items: [{ itemId: 'item-004', quantity: 1 }],
        shippedAt: '2024-01-21T09:00:00Z',
        estimatedDelivery: '2024-01-23',
        deliveredAt: null,
        events: [
          { status: 'in_transit', description: 'In transit to destination', location: 'Phoenix, AZ', timestamp: '2024-01-21T18:00:00Z' },
          { status: 'in_transit', description: 'Departed UPS facility', location: 'Los Angeles, CA', timestamp: '2024-01-21T12:00:00Z' },
          { status: 'picked_up', description: 'Picked up', location: 'Cupertino, CA', timestamp: '2024-01-21T09:00:00Z' }
        ]
      }
    ],
    isGift: true,
    giftMessage: 'Happy Birthday!',
    notes: null,
    placedAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-01-21T18:00:00Z',
    estimatedDelivery: '2024-01-23',
    deliveredAt: null
  };

  // Order 4 - Matches txn-004-sample in payments (captured, $3499.00, cust-003 Marcus Johnson)
  const order4 = {
    id: 'ORD-2024-004',
    orderNumber: 'PEAR-2024-123459',
    status: 'delivered',
    channel: 'online',
    customer: {
      id: 'cust-003',
      email: 'marcus.johnson@email.com',
      name: 'Marcus Johnson'
    },
    items: [
      {
        id: 'item-005',
        productId: 'PEAR-MBP-14-M3MAX',
        variantId: 'MBP14-M3MAX-1TB-BLK',
        sku: 'MBP14-M3MAX-1TB-BLK',
        name: 'PearBook Pro 14" M3 Max',
        image: 'https://assets.pearcomputer.com/products/pearbook-pro-14-space-black.jpg',
        options: { color: 'Space Black', storage: '1TB', chip: 'M3 Max' },
        quantity: 1,
        unitPrice: { amount: 3499.00, currency: 'USD' },
        totalPrice: { amount: 3499.00, currency: 'USD' },
        status: 'delivered',
        serialNumber: 'PEAR-MBP14-2024-M3MAX-001',
        warranty: { type: 'Limited Warranty', expiresAt: '2025-01-20' }
      }
    ],
    shippingAddress: {
      firstName: 'Marcus',
      lastName: 'Johnson',
      street1: '789 Michigan Ave',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60611',
      country: 'US',
      phone: '+1-312-555-0789'
    },
    billingAddress: {
      firstName: 'Marcus',
      lastName: 'Johnson',
      street1: '789 Michigan Ave',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60611',
      country: 'US'
    },
    shipping: {
      method: 'Express',
      carrier: 'FedEx',
      estimatedDelivery: { minDate: '2024-01-22', maxDate: '2024-01-23' },
      instructions: 'Ring doorbell'
    },
    payment: {
      method: 'credit_card',
      last4: '1001',
      brand: 'Amex',
      status: 'captured',
      transactionId: 'txn-004-sample'
    },
    pricing: {
      subtotal: { amount: 3499.00, currency: 'USD' },
      shipping: { amount: 0, currency: 'USD' },
      tax: { amount: 279.92, currency: 'USD' },
      discount: { amount: 0, currency: 'USD' },
      tradeInCredit: { amount: 0, currency: 'USD' },
      total: { amount: 3778.92, currency: 'USD' }
    },
    shipments: [
      {
        id: 'ship-003',
        carrier: 'FedEx',
        trackingNumber: '789456123456789',
        trackingUrl: 'https://www.fedex.com/track?tracknumber=789456123456789',
        status: 'delivered',
        items: [{ itemId: 'item-005', quantity: 1 }],
        shippedAt: '2024-01-21T08:00:00Z',
        estimatedDelivery: '2024-01-23',
        deliveredAt: '2024-01-22T15:45:00Z',
        events: [
          { status: 'delivered', description: 'Delivered - Signed for by M. JOHNSON', location: 'Chicago, IL', timestamp: '2024-01-22T15:45:00Z' },
          { status: 'out_for_delivery', description: 'Out for delivery', location: 'Chicago, IL', timestamp: '2024-01-22T09:00:00Z' },
          { status: 'in_transit', description: 'In transit', location: 'Indianapolis, IN', timestamp: '2024-01-22T04:00:00Z' },
          { status: 'picked_up', description: 'Picked up', location: 'Cupertino, CA', timestamp: '2024-01-21T08:00:00Z' }
        ]
      }
    ],
    isGift: false,
    giftMessage: null,
    notes: null,
    placedAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-22T15:45:00Z',
    estimatedDelivery: '2024-01-23',
    deliveredAt: '2024-01-22T15:45:00Z'
  };

  // Order 5 - Matches txn-005-sample in payments (captured, $899.00, cust-004 Sarah Williams)
  const order5 = {
    id: 'ORD-2024-005',
    orderNumber: 'PEAR-2024-123460',
    status: 'delivered',
    channel: 'online',
    customer: {
      id: 'cust-004',
      email: 'sarah.williams@email.com',
      name: 'Sarah Williams'
    },
    items: [
      {
        id: 'item-006',
        productId: 'PEAR-PWS-10',
        variantId: 'PWS10-45-GPS-SLV',
        sku: 'PWS10-45-GPS-SLV',
        name: 'PearWatch Series 10 45mm',
        image: 'https://assets.pearcomputer.com/products/pearwatch-10-silver.jpg',
        options: { size: '45mm', connectivity: 'GPS', color: 'Silver' },
        quantity: 1,
        unitPrice: { amount: 399.00, currency: 'USD' },
        totalPrice: { amount: 399.00, currency: 'USD' },
        status: 'delivered',
        serialNumber: 'PEAR-PWS10-2024-002345',
        warranty: { type: 'Limited Warranty', expiresAt: '2025-01-18' }
      },
      {
        id: 'item-007',
        productId: 'PEAR-ACC-BAND-SPORT',
        variantId: 'BAND-SPORT-45-BLK',
        sku: 'BAND-SPORT-45-BLK',
        name: 'Sport Band 45mm',
        image: 'https://assets.pearcomputer.com/products/sport-band-black.jpg',
        options: { size: '45mm', color: 'Black' },
        quantity: 2,
        unitPrice: { amount: 49.00, currency: 'USD' },
        totalPrice: { amount: 98.00, currency: 'USD' },
        status: 'delivered',
        serialNumber: null,
        warranty: null
      }
    ],
    shippingAddress: {
      firstName: 'Sarah',
      lastName: 'Williams',
      street1: '321 Pike St',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'US',
      phone: '+1-206-555-0321'
    },
    billingAddress: {
      firstName: 'Sarah',
      lastName: 'Williams',
      street1: '321 Pike St',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'US'
    },
    shipping: {
      method: 'Standard',
      carrier: 'USPS',
      estimatedDelivery: { minDate: '2024-01-20', maxDate: '2024-01-24' },
      instructions: 'Leave with doorman'
    },
    payment: {
      method: 'debit_card',
      last4: '5555',
      brand: 'Mastercard',
      status: 'captured',
      transactionId: 'txn-005-sample'
    },
    pricing: {
      subtotal: { amount: 497.00, currency: 'USD' },
      shipping: { amount: 0, currency: 'USD' },
      tax: { amount: 50.69, currency: 'USD' },
      discount: { amount: 0, currency: 'USD' },
      tradeInCredit: { amount: 0, currency: 'USD' },
      total: { amount: 547.69, currency: 'USD' }
    },
    shipments: [
      {
        id: 'ship-004',
        carrier: 'USPS',
        trackingNumber: '9400111899223100001234',
        trackingUrl: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=9400111899223100001234',
        status: 'delivered',
        items: [{ itemId: 'item-006', quantity: 1 }, { itemId: 'item-007', quantity: 2 }],
        shippedAt: '2024-01-19T11:00:00Z',
        estimatedDelivery: '2024-01-23',
        deliveredAt: '2024-01-22T13:20:00Z',
        events: [
          { status: 'delivered', description: 'Delivered, Left with Individual', location: 'Seattle, WA', timestamp: '2024-01-22T13:20:00Z' },
          { status: 'out_for_delivery', description: 'Out for Delivery', location: 'Seattle, WA', timestamp: '2024-01-22T08:30:00Z' },
          { status: 'in_transit', description: 'Arrived at Post Office', location: 'Seattle, WA', timestamp: '2024-01-22T05:00:00Z' },
          { status: 'picked_up', description: 'Accepted at USPS Origin Facility', location: 'San Jose, CA', timestamp: '2024-01-19T11:00:00Z' }
        ]
      }
    ],
    isGift: false,
    giftMessage: null,
    notes: null,
    placedAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-22T13:20:00Z',
    estimatedDelivery: '2024-01-23',
    deliveredAt: '2024-01-22T13:20:00Z'
  };

  // Order 6 - Matches txn-006-sample in payments (captured, $199.00, cust-005 David Park)
  const order6 = {
    id: 'ORD-2024-006',
    orderNumber: 'PEAR-2024-123461',
    status: 'delivered',
    channel: 'retail_store',
    customer: {
      id: 'cust-005',
      email: 'david.park@email.com',
      name: 'David Park'
    },
    items: [
      {
        id: 'item-008',
        productId: 'PEAR-PPP-3',
        variantId: 'PPP3-USB-C',
        sku: 'PPP3-USB-C',
        name: 'PearPods Pro 3 (USB-C)',
        image: 'https://assets.pearcomputer.com/products/pearpods-pro-3.jpg',
        options: { connector: 'USB-C' },
        quantity: 1,
        unitPrice: { amount: 199.00, currency: 'USD' },
        totalPrice: { amount: 199.00, currency: 'USD' },
        status: 'delivered',
        serialNumber: 'PEAR-PPP3-2024-003456',
        warranty: { type: 'Limited Warranty', expiresAt: '2025-01-19' }
      }
    ],
    shippingAddress: {
      firstName: 'David',
      lastName: 'Park',
      street1: '567 Congress Ave',
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      country: 'US',
      phone: '+1-512-555-0567'
    },
    billingAddress: {
      firstName: 'David',
      lastName: 'Park',
      street1: '567 Congress Ave',
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      country: 'US'
    },
    shipping: {
      method: 'Store Pickup',
      carrier: null,
      estimatedDelivery: { minDate: '2024-01-19', maxDate: '2024-01-19' },
      instructions: null
    },
    payment: {
      method: 'pear_pay',
      last4: null,
      brand: 'Pear Pay',
      status: 'captured',
      transactionId: 'txn-006-sample'
    },
    pricing: {
      subtotal: { amount: 199.00, currency: 'USD' },
      shipping: { amount: 0, currency: 'USD' },
      tax: { amount: 16.42, currency: 'USD' },
      discount: { amount: 0, currency: 'USD' },
      tradeInCredit: { amount: 0, currency: 'USD' },
      total: { amount: 215.42, currency: 'USD' }
    },
    shipments: [],
    isGift: false,
    giftMessage: null,
    notes: 'In-store pickup at Pear Store Austin',
    placedAt: '2024-01-19T14:30:00Z',
    updatedAt: '2024-01-19T15:00:00Z',
    estimatedDelivery: '2024-01-19',
    deliveredAt: '2024-01-19T15:00:00Z'
  };

  // Order 7 - Matches txn-007-sample in payments (captured, $1599.00, cust-006 Amanda Rodriguez)
  const order7 = {
    id: 'ORD-2024-007',
    orderNumber: 'PEAR-2024-123462',
    status: 'shipped',
    channel: 'online',
    customer: {
      id: 'cust-006',
      email: 'amanda.rodriguez@email.com',
      name: 'Amanda Rodriguez'
    },
    items: [
      {
        id: 'item-009',
        productId: 'PEAR-PP-M4',
        variantId: 'PP-M4-256-WIFI-SLV',
        sku: 'PP-M4-256-WIFI-SLV',
        name: 'PearPad Pro 11" M4',
        image: 'https://assets.pearcomputer.com/products/pearpad-pro-11-silver.jpg',
        options: { size: '11"', storage: '256GB', connectivity: 'WiFi', color: 'Silver' },
        quantity: 1,
        unitPrice: { amount: 999.00, currency: 'USD' },
        totalPrice: { amount: 999.00, currency: 'USD' },
        status: 'shipped',
        serialNumber: 'PEAR-PPM4-2024-004567',
        warranty: { type: 'Limited Warranty', expiresAt: '2025-01-22' }
      },
      {
        id: 'item-010',
        productId: 'PEAR-ACC-PENCIL-3',
        variantId: 'PENCIL-3-PRO',
        sku: 'PENCIL-3-PRO',
        name: 'Pear Pencil Pro',
        image: 'https://assets.pearcomputer.com/products/pear-pencil-pro.jpg',
        options: {},
        quantity: 1,
        unitPrice: { amount: 129.00, currency: 'USD' },
        totalPrice: { amount: 129.00, currency: 'USD' },
        status: 'shipped',
        serialNumber: null,
        warranty: { type: 'Limited Warranty', expiresAt: '2025-01-22' }
      },
      {
        id: 'item-011',
        productId: 'PEAR-ACC-KB-FOLIO',
        variantId: 'KB-FOLIO-11-BLK',
        sku: 'KB-FOLIO-11-BLK',
        name: 'Magic Keyboard Folio 11"',
        image: 'https://assets.pearcomputer.com/products/magic-keyboard-folio.jpg',
        options: { size: '11"', color: 'Black' },
        quantity: 1,
        unitPrice: { amount: 299.00, currency: 'USD' },
        totalPrice: { amount: 299.00, currency: 'USD' },
        status: 'shipped',
        serialNumber: null,
        warranty: null
      }
    ],
    shippingAddress: {
      firstName: 'Amanda',
      lastName: 'Rodriguez',
      street1: '890 Ocean Drive',
      city: 'Miami',
      state: 'FL',
      postalCode: '33139',
      country: 'US',
      phone: '+1-305-555-0890'
    },
    billingAddress: {
      firstName: 'Amanda',
      lastName: 'Rodriguez',
      street1: '890 Ocean Drive',
      city: 'Miami',
      state: 'FL',
      postalCode: '33139',
      country: 'US'
    },
    shipping: {
      method: 'Express',
      carrier: 'UPS',
      estimatedDelivery: { minDate: '2024-01-24', maxDate: '2024-01-25' },
      instructions: 'Call upon arrival'
    },
    payment: {
      method: 'financing',
      last4: '7777',
      brand: 'Pear Card Monthly',
      status: 'captured',
      transactionId: 'txn-007-sample'
    },
    pricing: {
      subtotal: { amount: 1427.00, currency: 'USD' },
      shipping: { amount: 0, currency: 'USD' },
      tax: { amount: 99.89, currency: 'USD' },
      discount: { amount: 0, currency: 'USD' },
      tradeInCredit: { amount: 0, currency: 'USD' },
      total: { amount: 1526.89, currency: 'USD' }
    },
    shipments: [
      {
        id: 'ship-005',
        carrier: 'UPS',
        trackingNumber: '1Z999BB20123456789',
        trackingUrl: 'https://www.ups.com/track?tracknum=1Z999BB20123456789',
        status: 'in_transit',
        items: [{ itemId: 'item-009', quantity: 1 }, { itemId: 'item-010', quantity: 1 }, { itemId: 'item-011', quantity: 1 }],
        shippedAt: '2024-01-23T10:00:00Z',
        estimatedDelivery: '2024-01-25',
        deliveredAt: null,
        events: [
          { status: 'in_transit', description: 'In transit', location: 'Atlanta, GA', timestamp: '2024-01-24T06:00:00Z' },
          { status: 'in_transit', description: 'Departed UPS facility', location: 'Nashville, TN', timestamp: '2024-01-23T22:00:00Z' },
          { status: 'picked_up', description: 'Picked up', location: 'Cupertino, CA', timestamp: '2024-01-23T10:00:00Z' }
        ]
      }
    ],
    isGift: false,
    giftMessage: null,
    notes: 'Financed over 12 months',
    placedAt: '2024-01-22T11:00:00Z',
    updatedAt: '2024-01-24T06:00:00Z',
    estimatedDelivery: '2024-01-25',
    deliveredAt: null
  };

  // Order 8 - Matches txn-008-sample in payments (pending refund, $79.00, cust-007 Michael Thompson)
  const order8 = {
    id: 'ORD-2024-008',
    orderNumber: 'PEAR-2024-123463',
    status: 'delivered',
    channel: 'online',
    customer: {
      id: 'cust-007',
      email: 'michael.thompson@email.com',
      name: 'Michael Thompson'
    },
    items: [
      {
        id: 'item-012',
        productId: 'PEAR-ACC-CHARGER-35W',
        variantId: 'CHARGER-35W-DUAL',
        sku: 'CHARGER-35W-DUAL',
        name: '35W Dual USB-C Charger',
        image: 'https://assets.pearcomputer.com/products/35w-dual-charger.jpg',
        options: {},
        quantity: 1,
        unitPrice: { amount: 59.00, currency: 'USD' },
        totalPrice: { amount: 59.00, currency: 'USD' },
        status: 'delivered',
        serialNumber: null,
        warranty: null
      },
      {
        id: 'item-013',
        productId: 'PEAR-ACC-CABLE-USBC',
        variantId: 'CABLE-USBC-2M',
        sku: 'CABLE-USBC-2M',
        name: 'USB-C Charge Cable (2m)',
        image: 'https://assets.pearcomputer.com/products/usbc-cable-2m.jpg',
        options: { length: '2m' },
        quantity: 1,
        unitPrice: { amount: 29.00, currency: 'USD' },
        totalPrice: { amount: 29.00, currency: 'USD' },
        status: 'return_requested',
        serialNumber: null,
        warranty: null
      }
    ],
    shippingAddress: {
      firstName: 'Michael',
      lastName: 'Thompson',
      street1: '234 16th St Mall',
      city: 'Denver',
      state: 'CO',
      postalCode: '80202',
      country: 'US',
      phone: '+1-303-555-0234'
    },
    billingAddress: {
      firstName: 'Michael',
      lastName: 'Thompson',
      street1: '234 16th St Mall',
      city: 'Denver',
      state: 'CO',
      postalCode: '80202',
      country: 'US'
    },
    shipping: {
      method: 'Standard',
      carrier: 'USPS',
      estimatedDelivery: { minDate: '2024-01-22', maxDate: '2024-01-25' },
      instructions: null
    },
    payment: {
      method: 'credit_card',
      last4: '3333',
      brand: 'Visa',
      status: 'captured',
      transactionId: 'txn-008-sample'
    },
    pricing: {
      subtotal: { amount: 88.00, currency: 'USD' },
      shipping: { amount: 0, currency: 'USD' },
      tax: { amount: 7.70, currency: 'USD' },
      discount: { amount: 0, currency: 'USD' },
      tradeInCredit: { amount: 0, currency: 'USD' },
      total: { amount: 95.70, currency: 'USD' }
    },
    shipments: [
      {
        id: 'ship-006',
        carrier: 'USPS',
        trackingNumber: '9400111899223100005678',
        trackingUrl: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=9400111899223100005678',
        status: 'delivered',
        items: [{ itemId: 'item-012', quantity: 1 }, { itemId: 'item-013', quantity: 1 }],
        shippedAt: '2024-01-21T09:00:00Z',
        estimatedDelivery: '2024-01-24',
        deliveredAt: '2024-01-23T14:00:00Z',
        events: [
          { status: 'delivered', description: 'Delivered, In/At Mailbox', location: 'Denver, CO', timestamp: '2024-01-23T14:00:00Z' },
          { status: 'out_for_delivery', description: 'Out for Delivery', location: 'Denver, CO', timestamp: '2024-01-23T09:00:00Z' },
          { status: 'picked_up', description: 'Accepted at USPS Origin Facility', location: 'San Jose, CA', timestamp: '2024-01-21T09:00:00Z' }
        ]
      }
    ],
    isGift: false,
    giftMessage: null,
    notes: null,
    placedAt: '2024-01-20T15:30:00Z',
    updatedAt: '2024-01-24T10:00:00Z',
    estimatedDelivery: '2024-01-24',
    deliveredAt: '2024-01-23T14:00:00Z'
  };

  // Order 9 - Matches txn-009-sample in payments (captured, $1299.00, cust-008 Jennifer Lee)
  const order9 = {
    id: 'ORD-2024-009',
    orderNumber: 'PEAR-2024-123464',
    status: 'processing',
    channel: 'online',
    customer: {
      id: 'cust-008',
      email: 'jennifer.lee@email.com',
      name: 'Jennifer Lee'
    },
    items: [
      {
        id: 'item-014',
        productId: 'PEAR-PPH-1601',
        variantId: 'PPH1601-512-NAT',
        sku: 'PPH1601-512-NAT',
        name: 'PearPhone 16 Pro',
        image: 'https://assets.pearcomputer.com/products/pearphone-16-pro-natural.jpg',
        options: { color: 'Natural Titanium', storage: '512GB' },
        quantity: 1,
        unitPrice: { amount: 1199.00, currency: 'USD' },
        totalPrice: { amount: 1199.00, currency: 'USD' },
        status: 'confirmed',
        serialNumber: null,
        warranty: { type: 'Limited Warranty', expiresAt: '2025-01-25' }
      }
    ],
    shippingAddress: {
      firstName: 'Jennifer',
      lastName: 'Lee',
      street1: '456 Newbury St',
      city: 'Boston',
      state: 'MA',
      postalCode: '02116',
      country: 'US',
      phone: '+1-617-555-0456'
    },
    billingAddress: {
      firstName: 'Jennifer',
      lastName: 'Lee',
      street1: '456 Newbury St',
      city: 'Boston',
      state: 'MA',
      postalCode: '02116',
      country: 'US'
    },
    shipping: {
      method: 'Express',
      carrier: 'FedEx',
      estimatedDelivery: { minDate: '2024-01-27', maxDate: '2024-01-28' },
      instructions: 'Leave at reception'
    },
    payment: {
      method: 'pear_pay',
      last4: null,
      brand: 'Pear Pay',
      status: 'captured',
      transactionId: 'txn-009-sample'
    },
    pricing: {
      subtotal: { amount: 1199.00, currency: 'USD' },
      shipping: { amount: 0, currency: 'USD' },
      tax: { amount: 75.00, currency: 'USD' },
      discount: { amount: 0, currency: 'USD' },
      tradeInCredit: { amount: 0, currency: 'USD' },
      total: { amount: 1274.00, currency: 'USD' }
    },
    shipments: [],
    isGift: false,
    giftMessage: null,
    notes: null,
    placedAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z',
    estimatedDelivery: '2024-01-28',
    deliveredAt: null
  };

  // Order 10 - Matches txn-010-sample in payments (captured, $449.00, cust-009 Robert Martinez)
  const order10 = {
    id: 'ORD-2024-010',
    orderNumber: 'PEAR-2024-123465',
    status: 'pending',
    channel: 'online',
    customer: {
      id: 'cust-009',
      email: 'robert.martinez@email.com',
      name: 'Robert Martinez'
    },
    items: [
      {
        id: 'item-015',
        productId: 'PEAR-PWU-2',
        variantId: 'PWU2-49-CELL-GRN',
        sku: 'PWU2-49-CELL-GRN',
        name: 'PearWatch Ultra 2 49mm',
        image: 'https://assets.pearcomputer.com/products/pearwatch-ultra-2-green.jpg',
        options: { size: '49mm', connectivity: 'GPS + Cellular', band: 'Alpine Loop Green' },
        quantity: 1,
        unitPrice: { amount: 799.00, currency: 'USD' },
        totalPrice: { amount: 799.00, currency: 'USD' },
        status: 'pending',
        serialNumber: null,
        warranty: { type: 'Limited Warranty', expiresAt: '2025-01-26' }
      }
    ],
    shippingAddress: {
      firstName: 'Robert',
      lastName: 'Martinez',
      street1: '678 Camelback Rd',
      city: 'Phoenix',
      state: 'AZ',
      postalCode: '85016',
      country: 'US',
      phone: '+1-602-555-0678'
    },
    billingAddress: {
      firstName: 'Robert',
      lastName: 'Martinez',
      street1: '678 Camelback Rd',
      city: 'Phoenix',
      state: 'AZ',
      postalCode: '85016',
      country: 'US'
    },
    shipping: {
      method: 'Standard',
      carrier: 'UPS',
      estimatedDelivery: { minDate: '2024-01-30', maxDate: '2024-02-02' },
      instructions: null
    },
    payment: {
      method: 'credit_card',
      last4: '9999',
      brand: 'Discover',
      status: 'authorized',
      transactionId: 'txn-010-sample'
    },
    pricing: {
      subtotal: { amount: 799.00, currency: 'USD' },
      shipping: { amount: 0, currency: 'USD' },
      tax: { amount: 66.72, currency: 'USD' },
      discount: { amount: 0, currency: 'USD' },
      tradeInCredit: { amount: 0, currency: 'USD' },
      total: { amount: 865.72, currency: 'USD' }
    },
    shipments: [],
    isGift: false,
    giftMessage: null,
    notes: null,
    placedAt: '2024-01-26T08:00:00Z',
    updatedAt: '2024-01-26T08:00:00Z',
    estimatedDelivery: '2024-02-02',
    deliveredAt: null
  };

  orders.set(order1.id, order1);
  orders.set(order2.id, order2);
  orders.set(order3.id, order3);
  orders.set(order4.id, order4);
  orders.set(order5.id, order5);
  orders.set(order6.id, order6);
  orders.set(order7.id, order7);
  orders.set(order8.id, order8);
  orders.set(order9.id, order9);
  orders.set(order10.id, order10);

  // Sample returns
  // Return 1 - for the partial refund on order 1 (John Smith)
  const return1 = {
    id: 'RET-2024-001',
    returnNumber: 'RET-2024-789012',
    orderId: 'ORD-2024-001',
    orderNumber: 'PEAR-2024-123456',
    status: 'completed',
    reason: 'defective',
    items: [
      {
        itemId: 'item-002',
        productName: 'PearPhone 16 Clear Case',
        quantity: 1,
        reason: 'defective',
        condition: 'Cracked on arrival'
      }
    ],
    refundMethod: 'original_payment',
    refundAmount: { amount: 49.00, currency: 'USD' },
    returnLabel: {
      carrier: 'FedEx',
      trackingNumber: 'RET123456789',
      labelUrl: 'https://returns.pearcomputer.com/labels/RET-2024-789012.pdf'
    },
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-20T15:00:00Z',
    receivedAt: '2024-01-19T14:00:00Z',
    completedAt: '2024-01-20T15:00:00Z'
  };

  // Return 2 - for Michael Thompson (cust-007) cable return
  const return2 = {
    id: 'RET-2024-002',
    returnNumber: 'RET-2024-789013',
    orderId: 'ORD-2024-008',
    orderNumber: 'PEAR-2024-123463',
    status: 'approved',
    reason: 'wrong_item',
    items: [
      {
        itemId: 'item-013',
        productName: 'USB-C Charge Cable (2m)',
        quantity: 1,
        reason: 'wrong_item',
        condition: 'Unopened'
      }
    ],
    refundMethod: 'original_payment',
    refundAmount: { amount: 29.00, currency: 'USD' },
    returnLabel: {
      carrier: 'USPS',
      trackingNumber: 'RET789456123',
      labelUrl: 'https://returns.pearcomputer.com/labels/RET-2024-789013.pdf'
    },
    createdAt: '2024-01-24T10:00:00Z',
    updatedAt: '2024-01-24T10:00:00Z',
    receivedAt: null,
    completedAt: null
  };

  returns.set(return1.id, return1);
  returns.set(return2.id, return2);

  // Sample subscriptions
  // Sub 1 - John Smith (cust-001) Pear One Premium
  const sub1 = {
    id: 'SUB-2024-001',
    name: 'Pear One Premium',
    product: 'Pear One',
    plan: 'Premium',
    status: 'active',
    billingCycle: 'annual',
    price: { amount: 129.99, currency: 'USD' },
    nextBillingDate: '2025-01-15',
    startedAt: '2024-01-15T00:00:00Z',
    endsAt: null,
    autoRenew: true,
    features: [
      '2TB iCloud+ Storage',
      'Pear Music',
      'Pear TV+',
      'Pear Arcade',
      'Pear News+',
      'Pear Fitness+'
    ],
    usage: {
      storage: {
        used: 524288000000,  // 500GB
        limit: 2199023255552 // 2TB
      }
    },
    customerId: 'cust-001'
  };

  // Sub 2 - Emily Chen (cust-002) Pear Music Individual
  const sub2 = {
    id: 'SUB-2024-002',
    name: 'Pear Music Individual',
    product: 'Pear Music',
    plan: 'Individual',
    status: 'active',
    billingCycle: 'monthly',
    price: { amount: 10.99, currency: 'USD' },
    nextBillingDate: '2024-02-16',
    startedAt: '2024-01-16T00:00:00Z',
    endsAt: null,
    autoRenew: true,
    features: [
      'Access to 100 million songs',
      'Ad-free listening',
      'Download for offline',
      'Spatial Audio'
    ],
    usage: null,
    customerId: 'cust-002'
  };

  // Sub 3 - John Smith (cust-001) PearCare+ for PearPhone
  const sub3 = {
    id: 'SUB-2024-003',
    name: 'PearCare+ for PearPhone',
    product: 'PearCare+',
    plan: 'PearPhone',
    status: 'active',
    billingCycle: 'monthly',
    price: { amount: 9.99, currency: 'USD' },
    nextBillingDate: '2024-02-15',
    startedAt: '2024-01-15T10:30:00Z',
    endsAt: null,
    autoRenew: true,
    features: [
      'Accidental damage protection',
      'Battery service',
      'Express replacement',
      '24/7 priority support'
    ],
    usage: null,
    customerId: 'cust-001'
  };

  // Sub 4 - Marcus Johnson (cust-003) PearCare+ for PearBook
  const sub4 = {
    id: 'SUB-2024-004',
    name: 'PearCare+ for PearBook',
    product: 'PearCare+',
    plan: 'PearBook',
    status: 'active',
    billingCycle: 'monthly',
    price: { amount: 12.99, currency: 'USD' },
    nextBillingDate: '2024-02-20',
    startedAt: '2024-01-20T09:15:00Z',
    endsAt: null,
    autoRenew: true,
    features: [
      'Accidental damage protection',
      'Battery service',
      'Express replacement',
      '24/7 priority support'
    ],
    usage: null,
    customerId: 'cust-003'
  };

  // Sub 5 - Sarah Williams (cust-004) Pear Fitness+
  const sub5 = {
    id: 'SUB-2024-005',
    name: 'Pear Fitness+',
    product: 'Pear Fitness+',
    plan: 'Individual',
    status: 'active',
    billingCycle: 'monthly',
    price: { amount: 9.99, currency: 'USD' },
    nextBillingDate: '2024-02-18',
    startedAt: '2024-01-18T16:45:00Z',
    endsAt: null,
    autoRenew: true,
    features: [
      'Unlimited workouts',
      'Personalized recommendations',
      'Workout metrics on PearWatch',
      'SharePlay with friends'
    ],
    usage: null,
    customerId: 'cust-004'
  };

  // Sub 6 - Amanda Rodriguez (cust-006) Pear One Family
  const sub6 = {
    id: 'SUB-2024-006',
    name: 'Pear One Family',
    product: 'Pear One',
    plan: 'Family',
    status: 'active',
    billingCycle: 'monthly',
    price: { amount: 22.95, currency: 'USD' },
    nextBillingDate: '2024-02-22',
    startedAt: '2024-01-22T11:00:00Z',
    endsAt: null,
    autoRenew: true,
    features: [
      '200GB iCloud+ Storage (shared)',
      'Pear Music (up to 6 people)',
      'Pear TV+',
      'Pear Arcade',
      'Family Sharing'
    ],
    usage: {
      storage: {
        used: 85899345920,   // 80GB
        limit: 214748364800  // 200GB
      },
      familyMembers: 4
    },
    customerId: 'cust-006'
  };

  // Sub 7 - Jennifer Lee (cust-008) Pear TV+
  const sub7 = {
    id: 'SUB-2024-007',
    name: 'Pear TV+',
    product: 'Pear TV+',
    plan: 'Individual',
    status: 'active',
    billingCycle: 'monthly',
    price: { amount: 9.99, currency: 'USD' },
    nextBillingDate: '2024-02-25',
    startedAt: '2024-01-25T10:00:00Z',
    endsAt: null,
    autoRenew: true,
    features: [
      'Pear Originals',
      '4K HDR streaming',
      'Download for offline',
      'Up to 6 family members'
    ],
    usage: null,
    customerId: 'cust-008'
  };

  subscriptions.set(sub1.id, sub1);
  subscriptions.set(sub2.id, sub2);
  subscriptions.set(sub3.id, sub3);
  subscriptions.set(sub4.id, sub4);
  subscriptions.set(sub5.id, sub5);
  subscriptions.set(sub6.id, sub6);
  subscriptions.set(sub7.id, sub7);
};

initSampleData();

// Orders functions
const listOrders = (filters = {}) => {
  let result = Array.from(orders.values());

  if (filters.status) {
    result = result.filter(o => o.status === filters.status);
  }
  if (filters.customerId) {
    result = result.filter(o => o.customer.id === filters.customerId);
  }
  if (filters.channel) {
    result = result.filter(o => o.channel === filters.channel);
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const start = (page - 1) * limit;
  const paginatedResult = result.slice(start, start + limit);

  return {
    orders: paginatedResult,
    pagination: {
      page,
      limit,
      totalItems: result.length,
      totalPages: Math.ceil(result.length / limit)
    }
  };
};

const getOrder = (orderId) => orders.get(orderId) || null;

const lookupOrder = (orderNumber, email) => {
  for (const order of orders.values()) {
    if (order.orderNumber === orderNumber && order.customer.email === email) {
      return order;
    }
  }
  return null;
};

const createOrder = (request) => {
  const id = generateId('ORD');
  const orderNumber = `PEAR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date().toISOString();

  const items = request.items.map((item, index) => ({
    id: `item-${id}-${index}`,
    productId: item.productId || item.sku,
    variantId: item.sku,
    sku: item.sku,
    name: item.name || item.sku,
    image: null,
    options: {},
    quantity: item.quantity,
    unitPrice: { amount: item.unitPrice, currency: 'USD' },
    totalPrice: { amount: item.unitPrice * item.quantity, currency: 'USD' },
    status: 'pending',
    serialNumber: null,
    warranty: null
  }));

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice.amount, 0);

  const order = {
    id,
    orderNumber,
    status: 'pending',
    channel: request.channel || 'online',
    customer: {
      id: request.customerId,
      email: null,
      name: null
    },
    items,
    shippingAddress: request.shippingAddress,
    billingAddress: request.billingAddress,
    shipping: {
      method: request.shippingMethod || 'Standard',
      carrier: 'UPS',
      estimatedDelivery: {
        minDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        maxDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      instructions: null
    },
    payment: request.paymentInfo ? {
      method: request.paymentInfo.method,
      last4: null,
      brand: null,
      status: 'pending',
      transactionId: request.paymentInfo.transactionId
    } : null,
    pricing: {
      subtotal: { amount: subtotal, currency: 'USD' },
      shipping: { amount: 0, currency: 'USD' },
      tax: { amount: subtotal * 0.08, currency: 'USD' },
      discount: { amount: 0, currency: 'USD' },
      tradeInCredit: { amount: 0, currency: 'USD' },
      total: { amount: subtotal * 1.08, currency: 'USD' }
    },
    shipments: [],
    isGift: request.isGift || false,
    giftMessage: request.giftMessage || null,
    notes: null,
    placedAt: now,
    updatedAt: now,
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    deliveredAt: null
  };

  orders.set(id, order);
  return order;
};

const cancelOrder = (orderId, cancelRequest) => {
  const order = orders.get(orderId);
  if (!order) return null;
  if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
    return { error: true, message: 'Order cannot be cancelled' };
  }

  order.status = 'cancelled';
  order.items.forEach(item => item.status = 'cancelled');
  order.updatedAt = new Date().toISOString();

  return {
    orderId,
    status: 'cancelled',
    cancelledItems: order.items.map(i => i.id),
    refundAmount: order.pricing.total,
    refundMethod: order.payment?.method || 'original_payment',
    message: `Order cancelled. Reason: ${cancelRequest?.reason || 'Not specified'}`
  };
};

const cancelOrderItem = (orderId, itemId, cancelItemRequest) => {
  const order = orders.get(orderId);
  if (!order) return null;

  const item = order.items.find(i => i.id === itemId);
  if (!item) return null;
  if (['shipped', 'delivered', 'cancelled'].includes(item.status)) {
    return { error: true, message: 'Item cannot be cancelled' };
  }

  item.status = 'cancelled';
  order.updatedAt = new Date().toISOString();

  // Update order status if all items cancelled
  if (order.items.every(i => i.status === 'cancelled')) {
    order.status = 'cancelled';
  }

  return order;
};

const getOrderTracking = (orderId) => {
  const order = orders.get(orderId);
  if (!order) return null;

  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    shipments: order.shipments
  };
};

const getOrderReceipt = (orderId) => {
  const order = orders.get(orderId);
  if (!order) return null;

  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    receiptNumber: `RCP-${order.orderNumber}`,
    customer: order.customer,
    items: order.items,
    pricing: order.pricing,
    payment: order.payment,
    placedAt: order.placedAt
  };
};

const getGiftReceipt = (orderId) => {
  const order = orders.get(orderId);
  if (!order) return null;

  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    items: order.items.map(i => ({ name: i.name, quantity: i.quantity })),
    giftMessage: order.giftMessage,
    purchasedAt: order.placedAt.split('T')[0]
  };
};

// Fulfillment functions
const updateFulfillmentStatus = (orderId, statusUpdate) => {
  const order = orders.get(orderId);
  if (!order) return null;

  order.status = statusUpdate.status;
  order.updatedAt = new Date().toISOString();

  if (statusUpdate.status === 'delivered') {
    order.deliveredAt = new Date().toISOString();
    order.items.forEach(item => item.status = 'delivered');
  }

  return order;
};

const createShipment = (orderId, shipmentRequest) => {
  const order = orders.get(orderId);
  if (!order) return null;

  const shipment = {
    id: generateId('ship'),
    carrier: shipmentRequest.carrier,
    trackingNumber: shipmentRequest.trackingNumber,
    trackingUrl: `https://track.${shipmentRequest.carrier.toLowerCase()}.com/${shipmentRequest.trackingNumber}`,
    status: 'pending',
    items: shipmentRequest.items,
    shippedAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    deliveredAt: null,
    events: [
      {
        status: 'picked_up',
        description: 'Picked up',
        location: 'Cupertino, CA',
        timestamp: new Date().toISOString()
      }
    ]
  };

  order.shipments.push(shipment);
  order.status = 'shipped';
  order.updatedAt = new Date().toISOString();

  // Update item statuses
  shipmentRequest.items.forEach(shipItem => {
    const item = order.items.find(i => i.id === shipItem.itemId);
    if (item) item.status = 'shipped';
  });

  return shipment;
};

// Returns functions
const listReturns = (filters = {}) => {
  let result = Array.from(returns.values());

  if (filters.status) {
    result = result.filter(r => r.status === filters.status);
  }
  if (filters.customerId) {
    result = result.filter(r => {
      const order = orders.get(r.orderId);
      return order && order.customer.id === filters.customerId;
    });
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const start = (page - 1) * limit;
  const paginatedResult = result.slice(start, start + limit);

  return {
    returns: paginatedResult,
    pagination: {
      page,
      limit,
      totalItems: result.length,
      totalPages: Math.ceil(result.length / limit)
    }
  };
};

const getReturn = (returnId) => returns.get(returnId) || null;

const createReturn = (request) => {
  const order = orders.get(request.orderId);
  if (!order) return null;

  const id = generateId('RET');
  const returnNumber = `RET-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date().toISOString();

  const returnItems = request.items.map(ri => {
    const orderItem = order.items.find(oi => oi.id === ri.itemId);
    return {
      itemId: ri.itemId,
      productName: orderItem?.name || 'Unknown Product',
      quantity: ri.quantity,
      reason: ri.reason,
      condition: null
    };
  });

  const refundAmount = returnItems.reduce((sum, ri) => {
    const orderItem = order.items.find(oi => oi.id === ri.itemId);
    return sum + (orderItem ? orderItem.unitPrice.amount * ri.quantity : 0);
  }, 0);

  const returnRecord = {
    id,
    returnNumber,
    orderId: order.id,
    orderNumber: order.orderNumber,
    status: 'approved',
    reason: request.items[0]?.reason || 'other',
    items: returnItems,
    refundMethod: request.refundMethod || 'original_payment',
    refundAmount: { amount: refundAmount, currency: 'USD' },
    returnLabel: {
      carrier: 'FedEx',
      trackingNumber: `RET${Math.random().toString(36).substring(2, 14).toUpperCase()}`,
      labelUrl: `https://returns.pearcomputer.com/labels/${returnNumber}.pdf`
    },
    createdAt: now,
    updatedAt: now,
    receivedAt: null,
    completedAt: null
  };

  returns.set(id, returnRecord);
  return returnRecord;
};

const checkReturnEligibility = (request) => {
  const order = orders.get(request.orderId);
  if (!order) return null;

  const returnWindowDays = 14;
  const orderDate = new Date(order.placedAt);
  const returnWindowEnds = new Date(orderDate.getTime() + returnWindowDays * 24 * 60 * 60 * 1000);
  const now = new Date();
  const eligible = now <= returnWindowEnds;

  const items = request.items.map(ri => {
    const orderItem = order.items.find(oi => oi.id === ri.itemId);
    const itemEligible = eligible && orderItem && orderItem.status === 'delivered';
    return {
      itemId: ri.itemId,
      productName: orderItem?.name || 'Unknown',
      eligible: itemEligible,
      reason: itemEligible ? null : (eligible ? 'Item not delivered' : 'Return window expired'),
      returnWindowEnds: returnWindowEnds.toISOString().split('T')[0],
      maxQuantity: orderItem?.quantity || 0
    };
  });

  return {
    orderId: request.orderId,
    items,
    returnWindowEnds: returnWindowEnds.toISOString().split('T')[0]
  };
};

const getReturnLabel = (returnId) => {
  const returnRecord = returns.get(returnId);
  if (!returnRecord) return null;
  return returnRecord.returnLabel;
};

// Subscriptions functions
const listSubscriptions = (filters = {}) => {
  let result = Array.from(subscriptions.values());

  if (filters.status) {
    result = result.filter(s => s.status === filters.status);
  }
  if (filters.customerId) {
    result = result.filter(s => s.customerId === filters.customerId);
  }

  return { subscriptions: result };
};

const getSubscription = (subscriptionId) => subscriptions.get(subscriptionId) || null;

const updateSubscription = (subscriptionId, updateRequest) => {
  const subscription = subscriptions.get(subscriptionId);
  if (!subscription) return null;

  if (updateRequest.plan) subscription.plan = updateRequest.plan;
  if (updateRequest.billingCycle) subscription.billingCycle = updateRequest.billingCycle;
  if (updateRequest.autoRenew !== undefined) subscription.autoRenew = updateRequest.autoRenew;

  return subscription;
};

const cancelSubscription = (subscriptionId, cancelRequest) => {
  const subscription = subscriptions.get(subscriptionId);
  if (!subscription) return null;

  if (cancelRequest?.cancelAtPeriodEnd === false) {
    subscription.status = 'cancelled';
    subscription.endsAt = new Date().toISOString();
  } else {
    subscription.autoRenew = false;
    subscription.endsAt = subscription.nextBillingDate + 'T00:00:00Z';
  }

  return subscription;
};

module.exports = {
  // Orders
  listOrders,
  getOrder,
  lookupOrder,
  createOrder,
  cancelOrder,
  cancelOrderItem,
  getOrderTracking,
  getOrderReceipt,
  getGiftReceipt,

  // Fulfillment
  updateFulfillmentStatus,
  createShipment,

  // Returns
  listReturns,
  getReturn,
  createReturn,
  checkReturnEligibility,
  getReturnLabel,

  // Subscriptions
  listSubscriptions,
  getSubscription,
  updateSubscription,
  cancelSubscription
};
