/**
 * Pear Computer Payments Service - Mock Data Module
 */

// Helper to generate IDs
const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// In-memory storage
const transactions = new Map();
const paymentMethods = new Map();
const refunds = new Map();
const pearCards = new Map();
const webhooks = new Map();

// Initialize with sample data
const initSampleData = () => {
  // Sample transactions
  const sampleTransactions = [
    // cust-001: John Smith - San Francisco
    {
      id: 'txn-001-sample',
      type: 'sale',
      status: 'captured',
      amount: { amount: 1299.99, currency: 'USD' },
      authorizedAmount: { amount: 1299.99, currency: 'USD' },
      capturedAmount: { amount: 1299.99, currency: 'USD' },
      refundedAmount: { amount: 0, currency: 'USD' },
      paymentMethod: { type: 'credit_card', brand: 'Visa', last4: '4242', expiryMonth: 12, expiryYear: 2026, holderName: 'John Smith' },
      orderId: 'ORD-2024-001',
      customerId: 'cust-001',
      billingAddress: { firstName: 'John', lastName: 'Smith', street1: '123 Main St', city: 'San Francisco', state: 'CA', postalCode: '94102', country: 'US' },
      riskScore: 15, avsResult: 'Y', cvvResult: 'M', authorizationCode: 'AUTH123456', networkTransactionId: 'NET789012',
      processorResponse: { code: '00', message: 'Approved' },
      createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:05Z', capturedAt: '2024-01-15T10:30:05Z'
    },
    // cust-002: Emily Chen - Los Angeles
    {
      id: 'txn-002-sample',
      type: 'authorization',
      status: 'authorized',
      amount: { amount: 2499.00, currency: 'USD' },
      authorizedAmount: { amount: 2499.00, currency: 'USD' },
      capturedAmount: { amount: 0, currency: 'USD' },
      refundedAmount: { amount: 0, currency: 'USD' },
      paymentMethod: { type: 'pear_card', brand: 'Pear Card', last4: '8888', expiryMonth: 6, expiryYear: 2027, holderName: 'Emily Chen' },
      orderId: 'ORD-2024-002',
      customerId: 'cust-002',
      billingAddress: { firstName: 'Emily', lastName: 'Chen', street1: '456 Oak Ave', city: 'Los Angeles', state: 'CA', postalCode: '90001', country: 'US' },
      riskScore: 8, avsResult: 'Y', cvvResult: 'M', authorizationCode: 'AUTH789012', networkTransactionId: 'NET345678',
      processorResponse: { code: '00', message: 'Approved' },
      createdAt: '2024-01-16T14:20:00Z', updatedAt: '2024-01-16T14:20:00Z'
    },
    // cust-001: John Smith - second purchase
    {
      id: 'txn-003-sample',
      type: 'sale',
      status: 'captured',
      amount: { amount: 268.92, currency: 'USD' },
      authorizedAmount: { amount: 268.92, currency: 'USD' },
      capturedAmount: { amount: 268.92, currency: 'USD' },
      refundedAmount: { amount: 0, currency: 'USD' },
      paymentMethod: { type: 'pear_card', brand: 'Pear Card', last4: '1234', expiryMonth: 3, expiryYear: 2028, holderName: 'John Smith' },
      orderId: 'ORD-2024-003',
      customerId: 'cust-001',
      billingAddress: { firstName: 'John', lastName: 'Smith', street1: '123 Main St', city: 'San Francisco', state: 'CA', postalCode: '94102', country: 'US' },
      riskScore: 5, avsResult: 'Y', cvvResult: 'M', authorizationCode: 'AUTH345678', networkTransactionId: 'NET901234',
      processorResponse: { code: '00', message: 'Approved' },
      createdAt: '2024-01-20T11:00:00Z', updatedAt: '2024-01-20T11:00:05Z', capturedAt: '2024-01-20T11:00:05Z'
    },
    // cust-003: Marcus Johnson - Chicago
    {
      id: 'txn-004-sample',
      type: 'sale',
      status: 'captured',
      amount: { amount: 3499.00, currency: 'USD' },
      authorizedAmount: { amount: 3499.00, currency: 'USD' },
      capturedAmount: { amount: 3499.00, currency: 'USD' },
      refundedAmount: { amount: 0, currency: 'USD' },
      paymentMethod: { type: 'credit_card', brand: 'Amex', last4: '1001', expiryMonth: 8, expiryYear: 2027, holderName: 'Marcus Johnson' },
      orderId: 'ORD-2024-004',
      customerId: 'cust-003',
      billingAddress: { firstName: 'Marcus', lastName: 'Johnson', street1: '789 Michigan Ave', street2: 'Suite 1200', city: 'Chicago', state: 'IL', postalCode: '60611', country: 'US' },
      riskScore: 12, avsResult: 'Y', cvvResult: 'M', authorizationCode: 'AUTH567890', networkTransactionId: 'NET234567',
      processorResponse: { code: '00', message: 'Approved' },
      createdAt: '2024-01-18T09:15:00Z', updatedAt: '2024-01-18T09:15:05Z', capturedAt: '2024-01-18T09:15:05Z'
    },
    // cust-004: Sarah Williams - Seattle
    {
      id: 'txn-005-sample',
      type: 'sale',
      status: 'captured',
      amount: { amount: 1599.00, currency: 'USD' },
      authorizedAmount: { amount: 1599.00, currency: 'USD' },
      capturedAmount: { amount: 1599.00, currency: 'USD' },
      refundedAmount: { amount: 0, currency: 'USD' },
      paymentMethod: { type: 'pear_pay', brand: 'Pear Pay', last4: '7777', expiryMonth: null, expiryYear: null, holderName: 'Sarah Williams' },
      orderId: 'ORD-2024-005',
      customerId: 'cust-004',
      billingAddress: { firstName: 'Sarah', lastName: 'Williams', street1: '321 Pike St', city: 'Seattle', state: 'WA', postalCode: '98101', country: 'US' },
      riskScore: 3, avsResult: 'Y', cvvResult: 'M', authorizationCode: 'AUTH678901', networkTransactionId: 'NET345678',
      processorResponse: { code: '00', message: 'Approved' },
      createdAt: '2024-01-19T16:45:00Z', updatedAt: '2024-01-19T16:45:05Z', capturedAt: '2024-01-19T16:45:05Z'
    },
    // cust-005: David Park - Austin
    {
      id: 'txn-006-sample',
      type: 'sale',
      status: 'captured',
      amount: { amount: 4299.00, currency: 'USD' },
      authorizedAmount: { amount: 4299.00, currency: 'USD' },
      capturedAmount: { amount: 4299.00, currency: 'USD' },
      refundedAmount: { amount: 0, currency: 'USD' },
      paymentMethod: { type: 'financing', brand: 'Pear Financial', last4: null, expiryMonth: null, expiryYear: null, holderName: 'David Park' },
      orderId: 'ORD-2024-006',
      customerId: 'cust-005',
      billingAddress: { firstName: 'David', lastName: 'Park', street1: '555 Congress Ave', city: 'Austin', state: 'TX', postalCode: '78701', country: 'US' },
      riskScore: 18, avsResult: 'Y', cvvResult: 'N', authorizationCode: 'AUTH789012', networkTransactionId: 'NET456789',
      processorResponse: { code: '00', message: 'Approved' },
      createdAt: '2024-01-21T13:30:00Z', updatedAt: '2024-01-21T13:30:05Z', capturedAt: '2024-01-21T13:30:05Z'
    },
    // cust-006: Amanda Rodriguez - Miami
    {
      id: 'txn-007-sample',
      type: 'sale',
      status: 'refunded',
      amount: { amount: 999.00, currency: 'USD' },
      authorizedAmount: { amount: 999.00, currency: 'USD' },
      capturedAmount: { amount: 999.00, currency: 'USD' },
      refundedAmount: { amount: 999.00, currency: 'USD' },
      paymentMethod: { type: 'credit_card', brand: 'Visa', last4: '9876', expiryMonth: 11, expiryYear: 2025, holderName: 'Amanda Rodriguez' },
      orderId: 'ORD-2024-007',
      customerId: 'cust-006',
      billingAddress: { firstName: 'Amanda', lastName: 'Rodriguez', street1: '888 Brickell Ave', street2: 'Apt 42B', city: 'Miami', state: 'FL', postalCode: '33131', country: 'US' },
      riskScore: 10, avsResult: 'Y', cvvResult: 'M', authorizationCode: 'AUTH890123', networkTransactionId: 'NET567890',
      processorResponse: { code: '00', message: 'Approved' },
      createdAt: '2024-01-10T11:00:00Z', updatedAt: '2024-01-17T14:30:00Z', capturedAt: '2024-01-10T11:00:05Z'
    },
    // cust-007: Michael Thompson - Denver
    {
      id: 'txn-008-sample',
      type: 'sale',
      status: 'captured',
      amount: { amount: 799.00, currency: 'USD' },
      authorizedAmount: { amount: 799.00, currency: 'USD' },
      capturedAmount: { amount: 799.00, currency: 'USD' },
      refundedAmount: { amount: 0, currency: 'USD' },
      paymentMethod: { type: 'pear_card', brand: 'Pear Card', last4: '3456', expiryMonth: 5, expiryYear: 2028, holderName: 'Michael Thompson' },
      orderId: 'ORD-2024-008',
      customerId: 'cust-007',
      billingAddress: { firstName: 'Michael', lastName: 'Thompson', street1: '1600 Market St', city: 'Denver', state: 'CO', postalCode: '80202', country: 'US' },
      riskScore: 7, avsResult: 'Y', cvvResult: 'M', authorizationCode: 'AUTH901234', networkTransactionId: 'NET678901',
      processorResponse: { code: '00', message: 'Approved' },
      createdAt: '2024-01-22T10:00:00Z', updatedAt: '2024-01-22T10:00:05Z', capturedAt: '2024-01-22T10:00:05Z'
    },
    // cust-008: Jennifer Lee - Boston
    {
      id: 'txn-009-sample',
      type: 'authorization',
      status: 'authorized',
      amount: { amount: 5999.00, currency: 'USD' },
      authorizedAmount: { amount: 5999.00, currency: 'USD' },
      capturedAmount: { amount: 0, currency: 'USD' },
      refundedAmount: { amount: 0, currency: 'USD' },
      paymentMethod: { type: 'credit_card', brand: 'Mastercard', last4: '2468', expiryMonth: 4, expiryYear: 2026, holderName: 'Jennifer Lee' },
      orderId: 'ORD-2024-009',
      customerId: 'cust-008',
      billingAddress: { firstName: 'Jennifer', lastName: 'Lee', street1: '200 Boylston St', city: 'Boston', state: 'MA', postalCode: '02116', country: 'US' },
      riskScore: 22, avsResult: 'Y', cvvResult: 'M', authorizationCode: 'AUTH012345', networkTransactionId: 'NET789012',
      processorResponse: { code: '00', message: 'Approved' },
      createdAt: '2024-01-23T15:20:00Z', updatedAt: '2024-01-23T15:20:00Z'
    },
    // cust-009: Robert Martinez - Phoenix
    {
      id: 'txn-010-sample',
      type: 'sale',
      status: 'captured',
      amount: { amount: 349.00, currency: 'USD' },
      authorizedAmount: { amount: 349.00, currency: 'USD' },
      capturedAmount: { amount: 349.00, currency: 'USD' },
      refundedAmount: { amount: 0, currency: 'USD' },
      paymentMethod: { type: 'credit_card', brand: 'Discover', last4: '6011', expiryMonth: 7, expiryYear: 2027, holderName: 'Robert Martinez' },
      orderId: 'ORD-2024-010',
      customerId: 'cust-009',
      billingAddress: { firstName: 'Robert', lastName: 'Martinez', street1: '4420 N Central Ave', city: 'Phoenix', state: 'AZ', postalCode: '85012', country: 'US' },
      riskScore: 9, avsResult: 'Y', cvvResult: 'M', authorizationCode: 'AUTH123789', networkTransactionId: 'NET890123',
      processorResponse: { code: '00', message: 'Approved' },
      createdAt: '2024-01-24T08:45:00Z', updatedAt: '2024-01-24T08:45:05Z', capturedAt: '2024-01-24T08:45:05Z'
    }
  ];
  sampleTransactions.forEach(t => transactions.set(t.id, t));

  // Sample payment methods
  const samplePaymentMethods = [
    // cust-001: John Smith
    { id: 'pm-001-sample', customerId: 'cust-001', type: 'credit_card', brand: 'Visa', last4: '4242', expiryMonth: 12, expiryYear: 2026, holderName: 'John Smith',
      billingAddress: { firstName: 'John', lastName: 'Smith', street1: '123 Main St', city: 'San Francisco', state: 'CA', postalCode: '94102', country: 'US' },
      isDefault: true, nickname: 'Personal Visa', createdAt: '2024-01-01T00:00:00Z' },
    { id: 'pm-002-sample', customerId: 'cust-001', type: 'pear_card', brand: 'Pear Card', last4: '1234', expiryMonth: 3, expiryYear: 2028, holderName: 'John Smith',
      billingAddress: { firstName: 'John', lastName: 'Smith', street1: '123 Main St', city: 'San Francisco', state: 'CA', postalCode: '94102', country: 'US' },
      isDefault: false, nickname: 'Pear Card Titanium', createdAt: '2024-01-05T00:00:00Z' },
    // cust-002: Emily Chen
    { id: 'pm-003-sample', customerId: 'cust-002', type: 'pear_card', brand: 'Pear Card', last4: '8888', expiryMonth: 6, expiryYear: 2027, holderName: 'Emily Chen',
      billingAddress: { firstName: 'Emily', lastName: 'Chen', street1: '456 Oak Ave', city: 'Los Angeles', state: 'CA', postalCode: '90001', country: 'US' },
      isDefault: true, nickname: 'Pear Card White', createdAt: '2024-01-10T00:00:00Z' },
    { id: 'pm-004-sample', customerId: 'cust-002', type: 'credit_card', brand: 'Mastercard', last4: '5555', expiryMonth: 9, expiryYear: 2025, holderName: 'Emily Chen',
      billingAddress: { firstName: 'Emily', lastName: 'Chen', street1: '456 Oak Ave', city: 'Los Angeles', state: 'CA', postalCode: '90001', country: 'US' },
      isDefault: false, nickname: 'Work Card', createdAt: '2024-01-12T00:00:00Z' },
    // cust-003: Marcus Johnson
    { id: 'pm-005-sample', customerId: 'cust-003', type: 'credit_card', brand: 'Amex', last4: '1001', expiryMonth: 8, expiryYear: 2027, holderName: 'Marcus Johnson',
      billingAddress: { firstName: 'Marcus', lastName: 'Johnson', street1: '789 Michigan Ave', street2: 'Suite 1200', city: 'Chicago', state: 'IL', postalCode: '60611', country: 'US' },
      isDefault: true, nickname: 'Amex Platinum', createdAt: '2024-01-08T00:00:00Z' },
    // cust-004: Sarah Williams
    { id: 'pm-006-sample', customerId: 'cust-004', type: 'pear_pay', brand: 'Pear Pay', last4: '7777', expiryMonth: null, expiryYear: null, holderName: 'Sarah Williams',
      billingAddress: { firstName: 'Sarah', lastName: 'Williams', street1: '321 Pike St', city: 'Seattle', state: 'WA', postalCode: '98101', country: 'US' },
      isDefault: true, nickname: 'Pear Pay', createdAt: '2024-01-15T00:00:00Z' },
    // cust-005: David Park
    { id: 'pm-007-sample', customerId: 'cust-005', type: 'credit_card', brand: 'Visa', last4: '4567', expiryMonth: 10, expiryYear: 2026, holderName: 'David Park',
      billingAddress: { firstName: 'David', lastName: 'Park', street1: '555 Congress Ave', city: 'Austin', state: 'TX', postalCode: '78701', country: 'US' },
      isDefault: true, nickname: 'Chase Sapphire', createdAt: '2024-01-11T00:00:00Z' },
    // cust-006: Amanda Rodriguez
    { id: 'pm-008-sample', customerId: 'cust-006', type: 'credit_card', brand: 'Visa', last4: '9876', expiryMonth: 11, expiryYear: 2025, holderName: 'Amanda Rodriguez',
      billingAddress: { firstName: 'Amanda', lastName: 'Rodriguez', street1: '888 Brickell Ave', street2: 'Apt 42B', city: 'Miami', state: 'FL', postalCode: '33131', country: 'US' },
      isDefault: true, nickname: 'Personal Card', createdAt: '2024-01-09T00:00:00Z' },
    // cust-007: Michael Thompson
    { id: 'pm-009-sample', customerId: 'cust-007', type: 'pear_card', brand: 'Pear Card', last4: '3456', expiryMonth: 5, expiryYear: 2028, holderName: 'Michael Thompson',
      billingAddress: { firstName: 'Michael', lastName: 'Thompson', street1: '1600 Market St', city: 'Denver', state: 'CO', postalCode: '80202', country: 'US' },
      isDefault: true, nickname: 'Pear Card Titanium', createdAt: '2024-01-14T00:00:00Z' },
    // cust-008: Jennifer Lee
    { id: 'pm-010-sample', customerId: 'cust-008', type: 'credit_card', brand: 'Mastercard', last4: '2468', expiryMonth: 4, expiryYear: 2026, holderName: 'Jennifer Lee',
      billingAddress: { firstName: 'Jennifer', lastName: 'Lee', street1: '200 Boylston St', city: 'Boston', state: 'MA', postalCode: '02116', country: 'US' },
      isDefault: true, nickname: 'Citi Double Cash', createdAt: '2024-01-13T00:00:00Z' },
    // cust-009: Robert Martinez
    { id: 'pm-011-sample', customerId: 'cust-009', type: 'credit_card', brand: 'Discover', last4: '6011', expiryMonth: 7, expiryYear: 2027, holderName: 'Robert Martinez',
      billingAddress: { firstName: 'Robert', lastName: 'Martinez', street1: '4420 N Central Ave', city: 'Phoenix', state: 'AZ', postalCode: '85012', country: 'US' },
      isDefault: true, nickname: 'Discover It', createdAt: '2024-01-16T00:00:00Z' }
  ];
  samplePaymentMethods.forEach(pm => paymentMethods.set(pm.id, pm));

  // Sample refunds
  const sampleRefunds = [
    { id: 'ref-001-sample', transactionId: 'txn-001-sample', amount: { amount: 49.00, currency: 'USD' }, status: 'completed',
      reason: 'Customer return - case arrived cracked', createdAt: '2024-01-20T09:00:00Z', completedAt: '2024-01-20T09:05:00Z' },
    { id: 'ref-002-sample', transactionId: 'txn-007-sample', amount: { amount: 999.00, currency: 'USD' }, status: 'completed',
      reason: 'Customer changed mind - full refund', createdAt: '2024-01-17T14:00:00Z', completedAt: '2024-01-17T14:30:00Z' }
  ];
  sampleRefunds.forEach(r => refunds.set(r.id, r));

  // Sample Pear Cards
  const samplePearCards = [
    { id: 'pc-001-sample', customerId: 'cust-001', last4: '1234', type: 'titanium', status: 'active',
      creditLimit: { amount: 15000.00, currency: 'USD' }, availableCredit: { amount: 12500.00, currency: 'USD' },
      currentBalance: { amount: 2500.00, currency: 'USD' }, dailyCashBalance: { amount: 125.50, currency: 'USD' }, linkedAt: '2024-01-05T00:00:00Z' },
    { id: 'pc-002-sample', customerId: 'cust-002', last4: '8888', type: 'white', status: 'active',
      creditLimit: { amount: 5000.00, currency: 'USD' }, availableCredit: { amount: 3200.00, currency: 'USD' },
      currentBalance: { amount: 1800.00, currency: 'USD' }, dailyCashBalance: { amount: 45.00, currency: 'USD' }, linkedAt: '2024-02-01T00:00:00Z' },
    { id: 'pc-003-sample', customerId: 'cust-007', last4: '3456', type: 'titanium', status: 'active',
      creditLimit: { amount: 20000.00, currency: 'USD' }, availableCredit: { amount: 19201.00, currency: 'USD' },
      currentBalance: { amount: 799.00, currency: 'USD' }, dailyCashBalance: { amount: 215.75, currency: 'USD' }, linkedAt: '2024-01-14T00:00:00Z' }
  ];
  samplePearCards.forEach(pc => pearCards.set(pc.id, pc));

  // Sample webhooks
  const sampleWebhooks = [
    { id: 'wh-001-sample', url: 'https://api.pearcomputer.com/webhooks/payments', events: ['transaction.captured', 'transaction.refunded'], secret: 'whsec_sample_secret_001', active: true, createdAt: '2024-01-01T00:00:00Z' }
  ];
  sampleWebhooks.forEach(wh => webhooks.set(wh.id, wh));
};

initSampleData();

// Transaction functions
const createTransaction = (request) => {
  const id = generateId('txn');
  const now = new Date().toISOString();

  const transaction = {
    id,
    type: request.capture === false ? 'authorization' : 'sale',
    status: request.capture === false ? 'authorized' : 'captured',
    amount: request.amount,
    authorizedAmount: request.amount,
    capturedAmount: request.capture === false ? { amount: 0, currency: request.amount.currency } : request.amount,
    refundedAmount: { amount: 0, currency: request.amount.currency || 'USD' },
    paymentMethod: {
      type: request.paymentMethod.type,
      brand: getBrandFromType(request.paymentMethod),
      last4: request.paymentMethod.card?.number?.slice(-4) || '0000',
      expiryMonth: request.paymentMethod.card?.expiryMonth,
      expiryYear: request.paymentMethod.card?.expiryYear,
      holderName: request.paymentMethod.card?.holderName
    },
    orderId: request.orderId,
    customerId: request.customerId,
    billingAddress: request.billingAddress,
    riskScore: Math.floor(Math.random() * 30),
    avsResult: 'Y',
    cvvResult: 'M',
    authorizationCode: `AUTH${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    networkTransactionId: `NET${Math.random().toString(36).substr(2, 10).toUpperCase()}`,
    processorResponse: { code: '00', message: 'Approved' },
    createdAt: now,
    updatedAt: now,
    capturedAt: request.capture === false ? null : now
  };

  transactions.set(id, transaction);
  return transaction;
};

const getTransaction = (transactionId) => {
  return transactions.get(transactionId) || null;
};

const captureTransaction = (transactionId, captureRequest) => {
  const transaction = transactions.get(transactionId);
  if (!transaction) return null;

  const now = new Date().toISOString();
  const captureAmount = captureRequest?.amount || transaction.authorizedAmount;

  transaction.status = 'captured';
  transaction.capturedAmount = captureAmount;
  transaction.updatedAt = now;
  transaction.capturedAt = now;

  transactions.set(transactionId, transaction);
  return transaction;
};

const voidTransaction = (transactionId, voidRequest) => {
  const transaction = transactions.get(transactionId);
  if (!transaction) return null;

  transaction.status = 'voided';
  transaction.updatedAt = new Date().toISOString();
  transaction.voidReason = voidRequest?.reason;

  transactions.set(transactionId, transaction);
  return transaction;
};

const verifyPaymentMethod = (verifyRequest) => {
  return {
    verified: true,
    avsResult: 'Y',
    cvvResult: 'M',
    riskScore: Math.floor(Math.random() * 20),
    message: 'Payment method verified successfully'
  };
};

// Payment Method functions
const listPaymentMethods = (customerId) => {
  const methods = [];
  paymentMethods.forEach(pm => {
    if (pm.customerId === customerId) {
      methods.push(pm);
    }
  });
  return { paymentMethods: methods };
};

const createPaymentMethod = (request) => {
  const id = generateId('pm');
  const now = new Date().toISOString();

  const method = {
    id,
    customerId: request.customerId,
    type: request.type,
    brand: getBrandFromType({ type: request.type }),
    last4: Math.floor(1000 + Math.random() * 9000).toString(),
    expiryMonth: Math.floor(1 + Math.random() * 12),
    expiryYear: 2026 + Math.floor(Math.random() * 4),
    holderName: request.billingAddress?.firstName + ' ' + request.billingAddress?.lastName,
    billingAddress: request.billingAddress,
    isDefault: request.isDefault || false,
    nickname: request.nickname || null,
    createdAt: now
  };

  paymentMethods.set(id, method);
  return method;
};

const getPaymentMethod = (paymentMethodId) => {
  return paymentMethods.get(paymentMethodId) || null;
};

const updatePaymentMethod = (paymentMethodId, updateRequest) => {
  const method = paymentMethods.get(paymentMethodId);
  if (!method) return null;

  if (updateRequest.billingAddress) method.billingAddress = updateRequest.billingAddress;
  if (updateRequest.isDefault !== undefined) method.isDefault = updateRequest.isDefault;
  if (updateRequest.nickname !== undefined) method.nickname = updateRequest.nickname;

  paymentMethods.set(paymentMethodId, method);
  return method;
};

const deletePaymentMethod = (paymentMethodId) => {
  if (!paymentMethods.has(paymentMethodId)) return false;
  paymentMethods.delete(paymentMethodId);
  return true;
};

// Refund functions
const createRefund = (request) => {
  const id = generateId('ref');
  const now = new Date().toISOString();

  const transaction = transactions.get(request.transactionId);
  const refundAmount = request.amount || transaction?.capturedAmount;

  const refund = {
    id,
    transactionId: request.transactionId,
    amount: refundAmount,
    status: 'completed',
    reason: request.reason || 'Customer requested refund',
    createdAt: now,
    completedAt: now
  };

  refunds.set(id, refund);

  // Update transaction status
  if (transaction) {
    transaction.refundedAmount = refundAmount;
    transaction.status = refundAmount.amount >= transaction.capturedAmount.amount ? 'refunded' : 'partially_refunded';
    transaction.updatedAt = now;
    transactions.set(request.transactionId, transaction);
  }

  return refund;
};

const getRefund = (refundId) => {
  return refunds.get(refundId) || null;
};

// Pear Card functions
const linkPearCard = (linkRequest) => {
  const id = generateId('pc');
  const now = new Date().toISOString();

  const card = {
    id,
    last4: linkRequest.cardNumber.slice(-4),
    type: Math.random() > 0.5 ? 'titanium' : 'white',
    status: 'active',
    creditLimit: { amount: 10000.00, currency: 'USD' },
    availableCredit: { amount: 8500.00, currency: 'USD' },
    currentBalance: { amount: 1500.00, currency: 'USD' },
    dailyCashBalance: { amount: 75.00, currency: 'USD' },
    linkedAt: now
  };

  pearCards.set(id, card);
  return card;
};

const getPearCard = (cardId) => {
  return pearCards.get(cardId) || null;
};

const getPearCardRewards = (cardId, startDate, endDate) => {
  const card = pearCards.get(cardId);
  if (!card) return null;

  return {
    cardId,
    currentBalance: { amount: 325.50, currency: 'USD' },
    lifetimeEarned: { amount: 1250.75, currency: 'USD' },
    history: [
      {
        date: '2024-01-15',
        description: 'Purchase at Pear Store - PearPhone 16',
        amount: { amount: 45.50, currency: 'USD' },
        category: 'Pear Products'
      },
      {
        date: '2024-01-10',
        description: 'Purchase at Whole Foods',
        amount: { amount: 8.25, currency: 'USD' },
        category: 'Groceries'
      },
      {
        date: '2024-01-05',
        description: 'Daily Cash from streaming services',
        amount: { amount: 2.00, currency: 'USD' },
        category: 'Entertainment'
      },
      {
        date: '2024-01-02',
        description: 'Purchase at Pear Store - PearPods Pro',
        amount: { amount: 12.50, currency: 'USD' },
        category: 'Pear Products'
      }
    ]
  };
};

const getPearCardInstallments = (cardId) => {
  const card = pearCards.get(cardId);
  if (!card) return null;

  return {
    plans: [
      {
        id: 'inst-001',
        orderId: 'ORD-2024-001',
        orderDescription: 'PearBook Pro 16"',
        totalAmount: { amount: 2499.00, currency: 'USD' },
        remainingAmount: { amount: 1874.25, currency: 'USD' },
        monthlyPayment: { amount: 208.25, currency: 'USD' },
        term: 12,
        remainingPayments: 9,
        apr: 0,
        startDate: '2024-01-15',
        nextPaymentDate: '2024-02-15',
        status: 'active'
      },
      {
        id: 'inst-002',
        orderId: 'ORD-2024-002',
        orderDescription: 'PearPhone 16 Pro Max',
        totalAmount: { amount: 1199.00, currency: 'USD' },
        remainingAmount: { amount: 599.50, currency: 'USD' },
        monthlyPayment: { amount: 199.83, currency: 'USD' },
        term: 6,
        remainingPayments: 3,
        apr: 0,
        startDate: '2023-12-01',
        nextPaymentDate: '2024-02-01',
        status: 'active'
      }
    ]
  };
};

// Financing functions
const checkFinancingEligibility = (request) => {
  const eligible = request.amount.amount <= 25000;
  return {
    eligible,
    maxAmount: { amount: 25000.00, currency: 'USD' },
    reason: eligible ? 'Customer meets eligibility requirements' : 'Amount exceeds maximum financing limit',
    prequalified: eligible && request.amount.amount <= 10000
  };
};

const getFinancingOptions = (request) => {
  const amount = request.amount.amount;

  return {
    options: [
      {
        id: 'fin-6mo',
        provider: 'Pear Financial',
        term: 6,
        apr: 0,
        monthlyPayment: { amount: Math.round(amount / 6 * 100) / 100, currency: 'USD' },
        totalCost: { amount: amount, currency: 'USD' },
        interestCharge: { amount: 0, currency: 'USD' },
        promotionalRate: true
      },
      {
        id: 'fin-12mo',
        provider: 'Pear Financial',
        term: 12,
        apr: 0,
        monthlyPayment: { amount: Math.round(amount / 12 * 100) / 100, currency: 'USD' },
        totalCost: { amount: amount, currency: 'USD' },
        interestCharge: { amount: 0, currency: 'USD' },
        promotionalRate: true
      },
      {
        id: 'fin-24mo',
        provider: 'Pear Financial',
        term: 24,
        apr: 9.99,
        monthlyPayment: { amount: Math.round((amount * 1.0999) / 24 * 100) / 100, currency: 'USD' },
        totalCost: { amount: Math.round(amount * 1.0999 * 100) / 100, currency: 'USD' },
        interestCharge: { amount: Math.round(amount * 0.0999 * 100) / 100, currency: 'USD' },
        promotionalRate: false
      },
      {
        id: 'fin-36mo',
        provider: 'Pear Financial',
        term: 36,
        apr: 12.99,
        monthlyPayment: { amount: Math.round((amount * 1.1299) / 36 * 100) / 100, currency: 'USD' },
        totalCost: { amount: Math.round(amount * 1.1299 * 100) / 100, currency: 'USD' },
        interestCharge: { amount: Math.round(amount * 0.1299 * 100) / 100, currency: 'USD' },
        promotionalRate: false
      }
    ]
  };
};

const applyForFinancing = (application) => {
  const id = generateId('app');

  return {
    applicationId: id,
    status: 'approved',
    approvedAmount: application.amount,
    term: parseInt(application.optionId.split('-')[1].replace('mo', '')),
    apr: application.optionId.includes('6mo') || application.optionId.includes('12mo') ? 0 : 9.99,
    monthlyPayment: {
      amount: Math.round(application.amount.amount / 12 * 100) / 100,
      currency: 'USD'
    },
    message: 'Congratulations! Your financing application has been approved.'
  };
};

// Webhook functions
const registerWebhook = (registration) => {
  const id = generateId('wh');
  const now = new Date().toISOString();

  const webhook = {
    id,
    url: registration.url,
    events: registration.events,
    secret: `whsec_${Math.random().toString(36).substr(2, 32)}`,
    active: true,
    createdAt: now
  };

  webhooks.set(id, webhook);
  return webhook;
};

const deleteWebhook = (webhookId) => {
  if (!webhooks.has(webhookId)) return false;
  webhooks.delete(webhookId);
  return true;
};

// Helper function
const getBrandFromType = (paymentMethod) => {
  switch (paymentMethod.type) {
    case 'credit_card':
    case 'debit_card':
      return ['Visa', 'Mastercard', 'Amex', 'Discover'][Math.floor(Math.random() * 4)];
    case 'pear_card':
      return 'Pear Card';
    case 'pear_pay':
      return 'Pear Pay';
    case 'paypal':
      return 'PayPal';
    default:
      return paymentMethod.type;
  }
};

module.exports = {
  // Transactions
  createTransaction,
  getTransaction,
  captureTransaction,
  voidTransaction,
  verifyPaymentMethod,

  // Payment Methods
  listPaymentMethods,
  createPaymentMethod,
  getPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,

  // Refunds
  createRefund,
  getRefund,

  // Pear Card
  linkPearCard,
  getPearCard,
  getPearCardRewards,
  getPearCardInstallments,

  // Financing
  checkFinancingEligibility,
  getFinancingOptions,
  applyForFinancing,

  // Webhooks
  registerWebhook,
  deleteWebhook
};
