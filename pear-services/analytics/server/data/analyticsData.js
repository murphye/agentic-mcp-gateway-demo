/**
 * Analytics Sample Data
 * Aligned with customer-accounts, payments, order-management, inventory, and product-catalog services
 */

// Product data aligned with product-catalog
const products = [
  { id: 'prod-pp15p', name: 'PearPhone 15 Pro', category: 'phones', price: 999.00 },
  { id: 'prod-pp15pm', name: 'PearPhone 15 Pro Max', category: 'phones', price: 1199.00 },
  { id: 'prod-pp15', name: 'PearPhone 15', category: 'phones', price: 799.00 },
  { id: 'prod-pbp14', name: 'PearBook Pro 14"', category: 'laptops', price: 1999.00 },
  { id: 'prod-pbp16', name: 'PearBook Pro 16"', category: 'laptops', price: 2499.00 },
  { id: 'prod-pba', name: 'PearBook Air', category: 'laptops', price: 1299.00 },
  { id: 'prod-pwu', name: 'PearWatch Ultra', category: 'wearables', price: 799.00 },
  { id: 'prod-pws9', name: 'PearWatch Series 9', category: 'wearables', price: 399.00 },
  { id: 'prod-ppp', name: 'PearPods Pro', category: 'audio', price: 249.00 },
  { id: 'prod-pp3', name: 'PearPods 3rd Gen', category: 'audio', price: 169.00 },
  { id: 'prod-ppdp', name: 'PearPad Pro 12.9"', category: 'tablets', price: 1099.00 },
  { id: 'prod-ppda', name: 'PearPad Air', category: 'tablets', price: 599.00 }
];

// Customer data aligned with customer-accounts
const customers = [
  { id: 'cust-001', name: 'John Smith', segment: 'high_value', acquisitionChannel: 'organic', joinDate: '2022-03-15' },
  { id: 'cust-002', name: 'Emily Chen', segment: 'regular', acquisitionChannel: 'paid_search', joinDate: '2022-06-20' },
  { id: 'cust-003', name: 'Marcus Johnson', segment: 'high_value', acquisitionChannel: 'referral', joinDate: '2021-11-10' },
  { id: 'cust-004', name: 'Sarah Williams', segment: 'premium', acquisitionChannel: 'organic', joinDate: '2020-08-05' },
  { id: 'cust-005', name: 'David Park', segment: 'new', acquisitionChannel: 'social', joinDate: '2024-01-02' },
  { id: 'cust-006', name: 'Amanda Rodriguez', segment: 'regular', acquisitionChannel: 'email', joinDate: '2023-04-18' },
  { id: 'cust-007', name: 'Michael Thompson', segment: 'high_value', acquisitionChannel: 'organic', joinDate: '2021-07-22' },
  { id: 'cust-008', name: 'Jennifer Lee', segment: 'at_risk', acquisitionChannel: 'paid_search', joinDate: '2022-12-01' },
  { id: 'cust-009', name: 'Robert Martinez', segment: 'regular', acquisitionChannel: 'referral', joinDate: '2023-09-14' }
];

// Helper functions
const generateDateRange = (startDate, endDate) => {
  const dates = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

const randomVariance = (base, variance = 0.2) => {
  return base * (1 + (Math.random() - 0.5) * 2 * variance);
};

// Sales Summary
const getSalesSummary = ({ startDate, endDate, channel, region, compareWith }) => {
  const baseRevenue = 2450000;
  const baseOrders = 1850;
  const baseUnits = 2340;

  return {
    period: { startDate, endDate },
    metrics: {
      totalRevenue: {
        value: randomVariance(baseRevenue),
        previousValue: randomVariance(baseRevenue * 0.92),
        change: randomVariance(baseRevenue * 0.08),
        changePercent: 8.7,
        trend: 'up'
      },
      totalOrders: {
        value: baseOrders,
        previousValue: Math.floor(baseOrders * 0.95),
        change: Math.floor(baseOrders * 0.05),
        changePercent: 5.3,
        trend: 'up'
      },
      totalUnits: {
        value: baseUnits,
        previousValue: Math.floor(baseUnits * 0.94),
        change: Math.floor(baseUnits * 0.06),
        changePercent: 6.4,
        trend: 'up'
      },
      averageOrderValue: {
        value: 1324.32,
        previousValue: 1289.45,
        change: 34.87,
        changePercent: 2.7,
        trend: 'up'
      },
      conversionRate: {
        value: 0.032,
        previousValue: 0.029,
        change: 0.003,
        changePercent: 10.3,
        trend: 'up'
      },
      newCustomers: {
        value: 423,
        previousValue: 398,
        change: 25,
        changePercent: 6.3,
        trend: 'up'
      },
      returningCustomerRevenue: {
        value: randomVariance(baseRevenue * 0.65),
        previousValue: randomVariance(baseRevenue * 0.62),
        change: randomVariance(baseRevenue * 0.03),
        changePercent: 4.8,
        trend: 'up'
      }
    },
    byChannel: {
      online: { revenue: randomVariance(baseRevenue * 0.55), orders: Math.floor(baseOrders * 0.52), percentOfTotal: 55 },
      retail: { revenue: randomVariance(baseRevenue * 0.32), orders: Math.floor(baseOrders * 0.35), percentOfTotal: 32 },
      business: { revenue: randomVariance(baseRevenue * 0.10), orders: Math.floor(baseOrders * 0.08), percentOfTotal: 10 },
      education: { revenue: randomVariance(baseRevenue * 0.03), orders: Math.floor(baseOrders * 0.05), percentOfTotal: 3 }
    }
  };
};

// Sales Trends
const getSalesTrends = ({ startDate, endDate, granularity, metrics, dimensions }) => {
  const dates = generateDateRange(startDate, endDate);
  const dataPoints = dates.map((date, index) => {
    const dayOfWeek = new Date(date).getDay();
    const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.7 : 1.0;
    const baseRevenue = 85000 * weekendFactor;

    return {
      date,
      revenue: Math.round(randomVariance(baseRevenue)),
      orders: Math.floor(randomVariance(65 * weekendFactor)),
      units: Math.floor(randomVariance(82 * weekendFactor)),
      aov: Math.round(randomVariance(1308) * 100) / 100,
      conversionRate: Math.round(randomVariance(0.031) * 1000) / 1000
    };
  });

  return {
    granularity: granularity || 'daily',
    dataPoints,
    dimensions: {}
  };
};

// Sales by Region
const getSalesByRegion = ({ startDate, endDate, level }) => {
  return {
    regions: [
      {
        name: 'North America',
        code: 'NA',
        revenue: 1568000,
        orders: 1205,
        percentOfTotal: 64,
        growth: 12.3,
        subRegions: [
          { name: 'California', code: 'CA', revenue: 425000, orders: 320, percentOfTotal: 27 },
          { name: 'Texas', code: 'TX', revenue: 285000, orders: 215, percentOfTotal: 18 },
          { name: 'New York', code: 'NY', revenue: 312000, orders: 240, percentOfTotal: 20 },
          { name: 'Florida', code: 'FL', revenue: 198000, orders: 155, percentOfTotal: 13 }
        ]
      },
      {
        name: 'Europe',
        code: 'EU',
        revenue: 588000,
        orders: 420,
        percentOfTotal: 24,
        growth: 8.5,
        subRegions: [
          { name: 'United Kingdom', code: 'UK', revenue: 185000, orders: 135, percentOfTotal: 31 },
          { name: 'Germany', code: 'DE', revenue: 142000, orders: 98, percentOfTotal: 24 },
          { name: 'France', code: 'FR', revenue: 115000, orders: 82, percentOfTotal: 20 }
        ]
      },
      {
        name: 'Asia Pacific',
        code: 'APAC',
        revenue: 294000,
        orders: 225,
        percentOfTotal: 12,
        growth: 18.7,
        subRegions: [
          { name: 'Japan', code: 'JP', revenue: 125000, orders: 95, percentOfTotal: 43 },
          { name: 'Australia', code: 'AU', revenue: 89000, orders: 68, percentOfTotal: 30 }
        ]
      }
    ]
  };
};

// Sales Forecast
const getSalesForecast = ({ horizon = 30, category, confidence = 0.95 }) => {
  const today = new Date();
  const forecast = [];

  for (let i = 1; i <= horizon; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dayOfWeek = date.getDay();
    const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.7 : 1.0;
    const trendFactor = 1 + (i * 0.001);
    const basePredicted = 85000 * weekendFactor * trendFactor;
    const variance = basePredicted * (1 - confidence) * 2;

    forecast.push({
      date: date.toISOString().split('T')[0],
      predicted: Math.round(basePredicted),
      lowerBound: Math.round(basePredicted - variance),
      upperBound: Math.round(basePredicted + variance)
    });
  }

  const totalPredicted = forecast.reduce((sum, f) => sum + f.predicted, 0);

  return {
    generatedAt: new Date().toISOString(),
    horizon,
    confidence,
    forecast,
    summary: {
      totalPredicted,
      averageDaily: Math.round(totalPredicted / horizon),
      trend: 'increasing'
    }
  };
};

// Product Performance
const getProductPerformance = ({ startDate, endDate, category, sortBy, sortOrder, page = 1, limit = 50 }) => {
  let productList = products.map((p, index) => ({
    productId: p.id,
    name: p.name,
    category: p.category,
    revenue: Math.round(randomVariance(p.price * 150)),
    units: Math.floor(randomVariance(150)),
    orders: Math.floor(randomVariance(120)),
    averagePrice: p.price,
    margin: Math.round(randomVariance(0.35) * 100) / 100,
    growth: Math.round((Math.random() * 30 - 5) * 10) / 10,
    rank: index + 1
  }));

  if (category) {
    productList = productList.filter(p => p.category === category);
  }

  productList.sort((a, b) => {
    const field = sortBy || 'revenue';
    return sortOrder === 'asc' ? a[field] - b[field] : b[field] - a[field];
  });

  productList.forEach((p, i) => p.rank = i + 1);

  const totalItems = productList.length;
  const start = (page - 1) * limit;
  const paged = productList.slice(start, start + limit);

  return {
    products: paged,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit)
    }
  };
};

// Product Analytics
const getProductAnalytics = (productId, { startDate, endDate }) => {
  const product = products.find(p => p.id === productId);
  if (!product) return null;

  const dates = generateDateRange(startDate, endDate);
  const salesTrend = dates.map(date => ({
    date,
    revenue: Math.round(randomVariance(product.price * 5)),
    units: Math.floor(randomVariance(5))
  }));

  return {
    productId,
    name: product.name,
    summary: {
      totalRevenue: Math.round(randomVariance(product.price * 150)),
      totalUnits: Math.floor(randomVariance(150)),
      averagePrice: product.price,
      returnRate: Math.round(randomVariance(0.03) * 100) / 100,
      rating: Math.round(randomVariance(4.5) * 10) / 10,
      reviewCount: Math.floor(randomVariance(250))
    },
    salesTrend,
    byVariant: [
      { variantId: `${productId}-256`, name: '256GB', revenue: Math.round(randomVariance(product.price * 80)), units: Math.floor(randomVariance(80)) },
      { variantId: `${productId}-512`, name: '512GB', revenue: Math.round(randomVariance(product.price * 50)), units: Math.floor(randomVariance(50)) },
      { variantId: `${productId}-1tb`, name: '1TB', revenue: Math.round(randomVariance(product.price * 20)), units: Math.floor(randomVariance(20)) }
    ],
    customerDemographics: {
      ageGroups: { '18-24': 15, '25-34': 35, '35-44': 28, '45-54': 15, '55+': 7 },
      newVsReturning: { new: 42, returning: 58 }
    },
    relatedProducts: products.filter(p => p.id !== productId && p.category === product.category).slice(0, 3).map(p => ({
      productId: p.id,
      name: p.name,
      correlation: Math.round(Math.random() * 50 + 30) / 100
    }))
  };
};

// Category Performance
const getCategoryPerformance = ({ startDate, endDate }) => {
  const categoryList = ['phones', 'laptops', 'wearables', 'audio', 'tablets'];
  const totalRevenue = 2450000;

  return {
    categories: categoryList.map(cat => {
      const catProducts = products.filter(p => p.category === cat);
      const catRevenue = Math.round(randomVariance(totalRevenue * (cat === 'phones' ? 0.4 : cat === 'laptops' ? 0.3 : 0.1)));

      return {
        category: cat,
        revenue: catRevenue,
        units: Math.floor(randomVariance(400)),
        orders: Math.floor(randomVariance(350)),
        growth: Math.round((Math.random() * 20 - 5) * 10) / 10,
        percentOfTotal: Math.round(catRevenue / totalRevenue * 100),
        topProducts: catProducts.slice(0, 3).map(p => ({
          productId: p.id,
          name: p.name,
          revenue: Math.round(randomVariance(p.price * 50))
        }))
      };
    })
  };
};

// Customer Overview
const getCustomerOverview = ({ startDate, endDate }) => {
  return {
    totalCustomers: { value: 45230, previousValue: 42150, change: 3080, changePercent: 7.3, trend: 'up' },
    newCustomers: { value: 3080, previousValue: 2850, change: 230, changePercent: 8.1, trend: 'up' },
    activeCustomers: { value: 18450, previousValue: 17200, change: 1250, changePercent: 7.3, trend: 'up' },
    averageLTV: { value: 2850, previousValue: 2680, change: 170, changePercent: 6.3, trend: 'up' },
    churnRate: { value: 0.028, previousValue: 0.032, change: -0.004, changePercent: -12.5, trend: 'down' },
    nps: { value: 72, previousValue: 68, change: 4, changePercent: 5.9, trend: 'up' },
    customersByAcquisitionChannel: {
      organic: 15800,
      paid_search: 12500,
      social: 8200,
      referral: 5800,
      email: 2930
    }
  };
};

// Customer Segments
const getCustomerSegments = () => {
  return {
    segments: [
      {
        name: 'Premium',
        description: 'High-spending loyal customers with multiple product purchases',
        customerCount: 4523,
        percentOfTotal: 10,
        averageLTV: 8500,
        averageOrderValue: 2150,
        purchaseFrequency: 4.2,
        topCategories: ['phones', 'laptops', 'wearables']
      },
      {
        name: 'High Value',
        description: 'Regular customers with above-average spending',
        customerCount: 9046,
        percentOfTotal: 20,
        averageLTV: 4200,
        averageOrderValue: 1450,
        purchaseFrequency: 2.8,
        topCategories: ['phones', 'audio', 'tablets']
      },
      {
        name: 'Regular',
        description: 'Standard customers with periodic purchases',
        customerCount: 18092,
        percentOfTotal: 40,
        averageLTV: 1850,
        averageOrderValue: 950,
        purchaseFrequency: 1.5,
        topCategories: ['phones', 'audio']
      },
      {
        name: 'New',
        description: 'Recently acquired customers (< 90 days)',
        customerCount: 6785,
        percentOfTotal: 15,
        averageLTV: 650,
        averageOrderValue: 780,
        purchaseFrequency: 1.1,
        topCategories: ['audio', 'wearables']
      },
      {
        name: 'At Risk',
        description: 'Previously active customers showing declining engagement',
        customerCount: 6784,
        percentOfTotal: 15,
        averageLTV: 1200,
        averageOrderValue: 680,
        purchaseFrequency: 0.8,
        topCategories: ['phones', 'audio']
      }
    ]
  };
};

// Cohort Analysis
const getCohortAnalysis = ({ cohortType = 'acquisition_month', metric = 'retention', periods = 12 }) => {
  const cohorts = [];
  const baseDate = new Date();
  baseDate.setMonth(baseDate.getMonth() - periods);

  for (let i = 0; i < Math.min(periods, 6); i++) {
    const cohortDate = new Date(baseDate);
    cohortDate.setMonth(cohortDate.getMonth() + i);
    const monthName = cohortDate.toLocaleString('default', { month: 'short', year: 'numeric' });

    const periodsData = [];
    let retention = 100;
    for (let p = 0; p <= periods - i; p++) {
      if (p > 0) retention *= (0.85 + Math.random() * 0.1);
      periodsData.push({
        period: p,
        value: Math.round(retention * 10) / 10,
        percentOfInitial: Math.round(retention * 10) / 10
      });
    }

    cohorts.push({
      name: monthName,
      startDate: cohortDate.toISOString().split('T')[0],
      size: Math.floor(randomVariance(500)),
      periods: periodsData
    });
  }

  return { cohortType, metric, cohorts };
};

// Customer LTV
const getCustomerLTV = ({ segment }) => {
  return {
    averageLTV: 2850,
    medianLTV: 1950,
    distribution: [
      { range: '$0-$500', count: 8500, percentOfTotal: 18.8 },
      { range: '$500-$1000', count: 9800, percentOfTotal: 21.7 },
      { range: '$1000-$2500', count: 12500, percentOfTotal: 27.6 },
      { range: '$2500-$5000', count: 8200, percentOfTotal: 18.1 },
      { range: '$5000+', count: 6230, percentOfTotal: 13.8 }
    ],
    bySegment: [
      { segment: 'Premium', averageLTV: 8500, customerCount: 4523 },
      { segment: 'High Value', averageLTV: 4200, customerCount: 9046 },
      { segment: 'Regular', averageLTV: 1850, customerCount: 18092 },
      { segment: 'New', averageLTV: 650, customerCount: 6785 },
      { segment: 'At Risk', averageLTV: 1200, customerCount: 6784 }
    ]
  };
};

// Inventory Health
const getInventoryHealth = ({ category, location }) => {
  return {
    summary: {
      totalSKUs: 1245,
      totalUnits: 185000,
      totalValue: 42500000,
      healthyStock: 1050,
      lowStock: 125,
      outOfStock: 28,
      overstock: 42
    },
    alerts: [
      { type: 'stockout', severity: 'critical', message: 'PearPods Pro running critically low - 3 days of supply', affectedSKUs: 1 },
      { type: 'low_stock', severity: 'warning', message: 'Multiple PearPhone 15 Pro variants below reorder point', affectedSKUs: 5 },
      { type: 'overstock', severity: 'info', message: 'PearWatch Series 8 excess inventory detected', affectedSKUs: 3 }
    ]
  };
};

// Inventory Turnover
const getInventoryTurnover = ({ startDate, endDate, groupBy = 'category' }) => {
  return {
    averageTurnover: 8.5,
    byGroup: [
      { name: 'phones', turnover: 12.4, daysOfSupply: 29, trend: 'up' },
      { name: 'laptops', turnover: 6.8, daysOfSupply: 54, trend: 'stable' },
      { name: 'wearables', turnover: 9.2, daysOfSupply: 40, trend: 'up' },
      { name: 'audio', turnover: 15.6, daysOfSupply: 23, trend: 'up' },
      { name: 'tablets', turnover: 5.4, daysOfSupply: 68, trend: 'down' }
    ]
  };
};

// Stockout Risk
const getStockoutRisk = ({ threshold = 14 }) => {
  return {
    atRisk: [
      { sku: 'PPP-256-BLK', productName: 'PearPods Pro - Black', currentStock: 145, daysOfSupply: 3, dailySalesRate: 48, reorderPoint: 250, incomingStock: 500, expectedStockoutDate: '2024-01-19' },
      { sku: 'PP15P-256-NAT', productName: 'PearPhone 15 Pro 256GB - Natural', currentStock: 320, daysOfSupply: 8, dailySalesRate: 40, reorderPoint: 400, incomingStock: 600, expectedStockoutDate: '2024-01-24' },
      { sku: 'PP15P-512-BLU', productName: 'PearPhone 15 Pro 512GB - Blue', currentStock: 180, daysOfSupply: 10, dailySalesRate: 18, reorderPoint: 200, incomingStock: 300, expectedStockoutDate: '2024-01-26' },
      { sku: 'PWU-49-TIT', productName: 'PearWatch Ultra 49mm - Titanium', currentStock: 95, daysOfSupply: 12, dailySalesRate: 8, reorderPoint: 100, incomingStock: 150, expectedStockoutDate: '2024-01-28' }
    ]
  };
};

// Fulfillment Metrics
const getFulfillmentMetrics = ({ startDate, endDate, location }) => {
  return {
    totalOrders: 1850,
    fulfillmentRate: 0.987,
    averageProcessingTime: 4.2,
    averageShipTime: 2.1,
    onTimeDeliveryRate: 0.945,
    byLocation: [
      { location: 'California DC', orders: 680, fulfillmentRate: 0.992, averageProcessingTime: 3.8 },
      { location: 'Texas DC', orders: 520, fulfillmentRate: 0.985, averageProcessingTime: 4.5 },
      { location: 'New Jersey DC', orders: 450, fulfillmentRate: 0.988, averageProcessingTime: 4.0 },
      { location: 'Illinois DC', orders: 200, fulfillmentRate: 0.978, averageProcessingTime: 4.8 }
    ]
  };
};

// Support Metrics
const getSupportMetrics = ({ startDate, endDate }) => {
  return {
    totalTickets: 2450,
    openTickets: 185,
    averageResponseTime: 2.4,
    averageResolutionTime: 18.5,
    firstContactResolutionRate: 0.68,
    customerSatisfaction: 4.5,
    byCategory: [
      { category: 'Technical Support', tickets: 980, percentOfTotal: 40 },
      { category: 'Orders & Shipping', tickets: 612, percentOfTotal: 25 },
      { category: 'Billing', tickets: 490, percentOfTotal: 20 },
      { category: 'Returns', tickets: 245, percentOfTotal: 10 },
      { category: 'Other', tickets: 123, percentOfTotal: 5 }
    ]
  };
};

// Return Metrics
const getReturnMetrics = ({ startDate, endDate }) => {
  return {
    totalReturns: 185,
    returnRate: 0.032,
    totalRefunded: 245000,
    byReason: [
      { reason: 'Changed Mind', count: 65, percentOfTotal: 35 },
      { reason: 'Defective/Not Working', count: 42, percentOfTotal: 23 },
      { reason: 'Not as Described', count: 32, percentOfTotal: 17 },
      { reason: 'Wrong Item', count: 24, percentOfTotal: 13 },
      { reason: 'Better Price Found', count: 22, percentOfTotal: 12 }
    ],
    byCategory: [
      { category: 'audio', returnRate: 0.045, count: 52 },
      { category: 'wearables', returnRate: 0.038, count: 35 },
      { category: 'phones', returnRate: 0.028, count: 48 },
      { category: 'tablets', returnRate: 0.025, count: 28 },
      { category: 'laptops', returnRate: 0.022, count: 22 }
    ]
  };
};

// Reports
const reports = [
  {
    id: 'rpt-001',
    name: 'Daily Sales Summary',
    description: 'Daily overview of sales metrics across all channels',
    type: 'scheduled',
    category: 'Sales',
    schedule: { frequency: 'daily', time: '06:00' },
    recipients: ['sales-team@pearcomputer.com'],
    lastRun: '2024-01-16T06:00:00Z',
    nextRun: '2024-01-17T06:00:00Z',
    createdBy: 'admin',
    createdAt: '2023-01-15T10:00:00Z'
  },
  {
    id: 'rpt-002',
    name: 'Weekly Inventory Health',
    description: 'Weekly inventory status and stockout risk analysis',
    type: 'scheduled',
    category: 'Inventory',
    schedule: { frequency: 'weekly', dayOfWeek: 1, time: '08:00' },
    recipients: ['inventory@pearcomputer.com', 'operations@pearcomputer.com'],
    lastRun: '2024-01-15T08:00:00Z',
    nextRun: '2024-01-22T08:00:00Z',
    createdBy: 'admin',
    createdAt: '2023-02-01T14:30:00Z'
  },
  {
    id: 'rpt-003',
    name: 'Monthly Executive Summary',
    description: 'Comprehensive monthly business performance report',
    type: 'scheduled',
    category: 'Executive',
    schedule: { frequency: 'monthly', dayOfMonth: 1, time: '07:00' },
    recipients: ['executives@pearcomputer.com'],
    lastRun: '2024-01-01T07:00:00Z',
    nextRun: '2024-02-01T07:00:00Z',
    createdBy: 'admin',
    createdAt: '2022-06-01T09:00:00Z'
  },
  {
    id: 'rpt-004',
    name: 'Product Performance Analysis',
    description: 'Detailed product-level performance metrics',
    type: 'ad_hoc',
    category: 'Products',
    schedule: null,
    recipients: [],
    lastRun: '2024-01-14T15:30:00Z',
    nextRun: null,
    createdBy: 'analyst-01',
    createdAt: '2024-01-10T11:20:00Z'
  }
];

// Dashboards
const dashboards = [
  {
    id: 'dash-001',
    name: 'Executive Overview',
    description: 'High-level business metrics for executives',
    category: 'Executive',
    widgets: [
      { id: 'w1', type: 'metric', title: 'Total Revenue', position: { x: 0, y: 0, w: 3, h: 1 } },
      { id: 'w2', type: 'metric', title: 'Orders', position: { x: 3, y: 0, w: 3, h: 1 } },
      { id: 'w3', type: 'chart', title: 'Revenue Trend', position: { x: 0, y: 1, w: 6, h: 2 } },
      { id: 'w4', type: 'chart', title: 'Sales by Region', position: { x: 6, y: 0, w: 6, h: 3 } }
    ],
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-01-10T14:30:00Z'
  },
  {
    id: 'dash-002',
    name: 'Sales Performance',
    description: 'Detailed sales analytics dashboard',
    category: 'Sales',
    widgets: [
      { id: 'w1', type: 'metric', title: 'Daily Revenue', position: { x: 0, y: 0, w: 2, h: 1 } },
      { id: 'w2', type: 'metric', title: 'Conversion Rate', position: { x: 2, y: 0, w: 2, h: 1 } },
      { id: 'w3', type: 'metric', title: 'AOV', position: { x: 4, y: 0, w: 2, h: 1 } },
      { id: 'w4', type: 'chart', title: 'Hourly Sales', position: { x: 0, y: 1, w: 12, h: 2 } },
      { id: 'w5', type: 'table', title: 'Top Products', position: { x: 0, y: 3, w: 6, h: 3 } }
    ],
    createdAt: '2023-03-20T09:00:00Z',
    updatedAt: '2024-01-12T11:15:00Z'
  },
  {
    id: 'dash-003',
    name: 'Inventory Operations',
    description: 'Real-time inventory monitoring',
    category: 'Operations',
    widgets: [
      { id: 'w1', type: 'metric', title: 'Total SKUs', position: { x: 0, y: 0, w: 2, h: 1 } },
      { id: 'w2', type: 'metric', title: 'Low Stock Items', position: { x: 2, y: 0, w: 2, h: 1 } },
      { id: 'w3', type: 'metric', title: 'Out of Stock', position: { x: 4, y: 0, w: 2, h: 1 } },
      { id: 'w4', type: 'table', title: 'Stockout Risk', position: { x: 0, y: 1, w: 12, h: 3 } }
    ],
    createdAt: '2023-05-10T14:00:00Z',
    updatedAt: '2024-01-15T08:45:00Z'
  },
  {
    id: 'dash-004',
    name: 'Customer Insights',
    description: 'Customer analytics and segmentation',
    category: 'Customers',
    widgets: [
      { id: 'w1', type: 'metric', title: 'Active Customers', position: { x: 0, y: 0, w: 3, h: 1 } },
      { id: 'w2', type: 'metric', title: 'NPS Score', position: { x: 3, y: 0, w: 3, h: 1 } },
      { id: 'w3', type: 'chart', title: 'Customer Segments', position: { x: 0, y: 1, w: 6, h: 2 } },
      { id: 'w4', type: 'chart', title: 'Acquisition Channels', position: { x: 6, y: 1, w: 6, h: 2 } }
    ],
    createdAt: '2023-07-01T10:30:00Z',
    updatedAt: '2024-01-14T16:20:00Z'
  }
];

// Report Functions
const listReports = ({ type }) => {
  let filtered = reports;
  if (type) {
    filtered = reports.filter(r => r.type === type);
  }
  return { reports: filtered };
};

const getReport = (reportId) => reports.find(r => r.id === reportId);

const createReport = (reportData) => {
  const newReport = {
    id: `rpt-${String(reports.length + 1).padStart(3, '0')}`,
    ...reportData,
    type: reportData.schedule ? 'scheduled' : 'ad_hoc',
    lastRun: null,
    nextRun: reportData.schedule ? new Date(Date.now() + 86400000).toISOString() : null,
    createdBy: 'api-user',
    createdAt: new Date().toISOString()
  };
  reports.push(newReport);
  return newReport;
};

const deleteReport = (reportId) => {
  const index = reports.findIndex(r => r.id === reportId);
  if (index === -1) return false;
  reports.splice(index, 1);
  return true;
};

const runReport = (reportId, params) => {
  const report = reports.find(r => r.id === reportId);
  if (!report) return null;
  report.lastRun = new Date().toISOString();
  return {
    executionId: `exec-${Date.now()}`,
    status: 'running'
  };
};

const downloadReport = (reportId, format) => {
  const report = reports.find(r => r.id === reportId);
  if (!report) return null;
  return `Date,Revenue,Orders\n2024-01-15,85000,65\n2024-01-16,92000,72\n`;
};

// Dashboard Functions
const listDashboards = () => ({ dashboards });

const getDashboard = (dashboardId) => {
  const dashboard = dashboards.find(d => d.id === dashboardId);
  if (!dashboard) return null;

  return {
    dashboard,
    data: {
      w1: { value: 2450000, change: 8.7 },
      w2: { value: 1850, change: 5.3 },
      w3: { data: generateDateRange('2024-01-01', '2024-01-16').map(d => ({ date: d, value: Math.round(randomVariance(85000)) })) }
    },
    generatedAt: new Date().toISOString()
  };
};

// Query Execution
const executeQuery = (query) => {
  const { metrics, dimensions, dateRange, filters, orderBy, limit } = query;

  return {
    columns: [
      { name: 'date', type: 'date' },
      ...metrics.map(m => ({ name: m, type: 'number' }))
    ],
    rows: generateDateRange(dateRange.start, dateRange.end).slice(0, limit || 100).map(date => [
      date,
      ...metrics.map(m => Math.round(randomVariance(m === 'revenue' ? 85000 : m === 'orders' ? 65 : 82)))
    ]),
    metadata: {
      rowCount: Math.min(generateDateRange(dateRange.start, dateRange.end).length, limit || 100),
      executionTime: Math.round(Math.random() * 500 + 100),
      truncated: false
    }
  };
};

module.exports = {
  // Sales
  getSalesSummary,
  getSalesTrends,
  getSalesByRegion,
  getSalesForecast,
  // Products
  getProductPerformance,
  getProductAnalytics,
  getCategoryPerformance,
  // Customers
  getCustomerOverview,
  getCustomerSegments,
  getCohortAnalysis,
  getCustomerLTV,
  // Inventory
  getInventoryHealth,
  getInventoryTurnover,
  getStockoutRisk,
  // Operations
  getFulfillmentMetrics,
  getSupportMetrics,
  getReturnMetrics,
  // Reports
  listReports,
  getReport,
  createReport,
  deleteReport,
  runReport,
  downloadReport,
  // Dashboards
  listDashboards,
  getDashboard,
  // Query
  executeQuery
};
