/**
 * Shipping Data Module
 * Combines seed data with algorithms for realistic shipping rate calculation
 */

// ============================================================================
// SEED DATA - Carriers
// ============================================================================

const carriers = {
  fedex: {
    code: 'fedex',
    name: 'FedEx',
    logo: 'https://cdn.pearcomputer.com/carriers/fedex-logo.png',
    trackingUrl: 'https://www.fedex.com/fedextrack/?trknbr={tracking}',
    countries: ['US', 'CA', 'MX', 'GB', 'DE', 'FR', 'JP', 'AU', 'CN'],
    features: ['tracking', 'signature', 'insurance', 'saturday_delivery', 'hold_at_location'],
    services: {
      ground: {
        code: 'fedex_ground',
        name: 'FedEx Ground',
        description: 'Cost-effective ground shipping',
        deliveryDays: { min: 3, max: 7 },
        domestic: true,
        international: false,
        trackingLevel: 'detailed',
        baseRate: 8.99,
        weightRate: 0.45,  // per lb
        dimFactor: 139     // dimensional weight divisor
      },
      home_delivery: {
        code: 'fedex_home',
        name: 'FedEx Home Delivery',
        description: 'Residential delivery with evening and weekend options',
        deliveryDays: { min: 2, max: 5 },
        domestic: true,
        international: false,
        trackingLevel: 'detailed',
        baseRate: 10.99,
        weightRate: 0.55,
        dimFactor: 139
      },
      express_saver: {
        code: 'fedex_express_saver',
        name: 'FedEx Express Saver',
        description: '3-day delivery by end of day',
        deliveryDays: { min: 3, max: 3 },
        domestic: true,
        international: false,
        trackingLevel: 'detailed',
        baseRate: 15.99,
        weightRate: 0.85,
        dimFactor: 139
      },
      '2day': {
        code: 'fedex_2day',
        name: 'FedEx 2Day',
        description: '2-day delivery by end of day',
        deliveryDays: { min: 2, max: 2 },
        domestic: true,
        international: false,
        trackingLevel: 'detailed',
        baseRate: 19.99,
        weightRate: 1.10,
        dimFactor: 139
      },
      overnight: {
        code: 'fedex_overnight',
        name: 'FedEx Standard Overnight',
        description: 'Next business day by 3pm',
        deliveryDays: { min: 1, max: 1 },
        domestic: true,
        international: false,
        trackingLevel: 'detailed',
        baseRate: 29.99,
        weightRate: 1.75,
        dimFactor: 139
      },
      priority_overnight: {
        code: 'fedex_priority',
        name: 'FedEx Priority Overnight',
        description: 'Next business day by 10:30am',
        deliveryDays: { min: 1, max: 1 },
        domestic: true,
        international: false,
        trackingLevel: 'detailed',
        baseRate: 39.99,
        weightRate: 2.25,
        dimFactor: 139
      },
      international_economy: {
        code: 'fedex_intl_economy',
        name: 'FedEx International Economy',
        description: 'International delivery in 4-6 business days',
        deliveryDays: { min: 4, max: 6 },
        domestic: false,
        international: true,
        trackingLevel: 'detailed',
        baseRate: 45.99,
        weightRate: 3.50,
        dimFactor: 139
      },
      international_priority: {
        code: 'fedex_intl_priority',
        name: 'FedEx International Priority',
        description: 'International delivery in 1-3 business days',
        deliveryDays: { min: 1, max: 3 },
        domestic: false,
        international: true,
        trackingLevel: 'detailed',
        baseRate: 79.99,
        weightRate: 5.50,
        dimFactor: 139
      }
    }
  },
  ups: {
    code: 'ups',
    name: 'UPS',
    logo: 'https://cdn.pearcomputer.com/carriers/ups-logo.png',
    trackingUrl: 'https://www.ups.com/track?tracknum={tracking}',
    countries: ['US', 'CA', 'MX', 'GB', 'DE', 'FR', 'JP', 'AU', 'CN', 'BR'],
    features: ['tracking', 'signature', 'insurance', 'saturday_delivery', 'access_point'],
    services: {
      ground: {
        code: 'ups_ground',
        name: 'UPS Ground',
        description: 'Economical ground shipping',
        deliveryDays: { min: 3, max: 7 },
        domestic: true,
        international: false,
        trackingLevel: 'detailed',
        baseRate: 9.49,
        weightRate: 0.48,
        dimFactor: 139
      },
      '3day_select': {
        code: 'ups_3day',
        name: 'UPS 3 Day Select',
        description: '3 business day delivery',
        deliveryDays: { min: 3, max: 3 },
        domestic: true,
        international: false,
        trackingLevel: 'detailed',
        baseRate: 14.99,
        weightRate: 0.80,
        dimFactor: 139
      },
      '2day_air': {
        code: 'ups_2day',
        name: 'UPS 2nd Day Air',
        description: '2 business day delivery',
        deliveryDays: { min: 2, max: 2 },
        domestic: true,
        international: false,
        trackingLevel: 'detailed',
        baseRate: 21.99,
        weightRate: 1.15,
        dimFactor: 139
      },
      next_day_air: {
        code: 'ups_next_day',
        name: 'UPS Next Day Air',
        description: 'Next business day by end of day',
        deliveryDays: { min: 1, max: 1 },
        domestic: true,
        international: false,
        trackingLevel: 'detailed',
        baseRate: 32.99,
        weightRate: 1.85,
        dimFactor: 139
      },
      next_day_air_early: {
        code: 'ups_next_day_early',
        name: 'UPS Next Day Air Early',
        description: 'Next business day by 8am',
        deliveryDays: { min: 1, max: 1 },
        domestic: true,
        international: false,
        trackingLevel: 'detailed',
        baseRate: 54.99,
        weightRate: 2.75,
        dimFactor: 139
      },
      worldwide_expedited: {
        code: 'ups_worldwide_exp',
        name: 'UPS Worldwide Expedited',
        description: 'International delivery in 2-5 business days',
        deliveryDays: { min: 2, max: 5 },
        domestic: false,
        international: true,
        trackingLevel: 'detailed',
        baseRate: 55.99,
        weightRate: 4.00,
        dimFactor: 139
      },
      worldwide_express: {
        code: 'ups_worldwide_express',
        name: 'UPS Worldwide Express',
        description: 'International delivery in 1-3 business days',
        deliveryDays: { min: 1, max: 3 },
        domestic: false,
        international: true,
        trackingLevel: 'detailed',
        baseRate: 89.99,
        weightRate: 6.00,
        dimFactor: 139
      }
    }
  },
  usps: {
    code: 'usps',
    name: 'USPS',
    logo: 'https://cdn.pearcomputer.com/carriers/usps-logo.png',
    trackingUrl: 'https://tools.usps.com/go/TrackConfirmAction?tLabels={tracking}',
    countries: ['US', 'CA', 'MX', 'GB', 'DE', 'FR', 'JP', 'AU'],
    features: ['tracking', 'signature', 'insurance', 'po_box_delivery'],
    services: {
      ground_advantage: {
        code: 'usps_ground',
        name: 'USPS Ground Advantage',
        description: 'Affordable shipping in 2-5 days',
        deliveryDays: { min: 2, max: 5 },
        domestic: true,
        international: false,
        trackingLevel: 'basic',
        baseRate: 5.99,
        weightRate: 0.35,
        dimFactor: 166
      },
      priority: {
        code: 'usps_priority',
        name: 'USPS Priority Mail',
        description: '1-3 business day delivery',
        deliveryDays: { min: 1, max: 3 },
        domestic: true,
        international: false,
        trackingLevel: 'detailed',
        baseRate: 8.49,
        weightRate: 0.55,
        dimFactor: 166
      },
      priority_express: {
        code: 'usps_express',
        name: 'USPS Priority Mail Express',
        description: 'Overnight to 2-day delivery with money-back guarantee',
        deliveryDays: { min: 1, max: 2 },
        domestic: true,
        international: false,
        trackingLevel: 'detailed',
        baseRate: 26.99,
        weightRate: 1.50,
        dimFactor: 166
      },
      priority_intl: {
        code: 'usps_priority_intl',
        name: 'USPS Priority Mail International',
        description: 'International delivery in 6-10 business days',
        deliveryDays: { min: 6, max: 10 },
        domestic: false,
        international: true,
        trackingLevel: 'basic',
        baseRate: 35.99,
        weightRate: 2.50,
        dimFactor: 166
      },
      priority_express_intl: {
        code: 'usps_express_intl',
        name: 'USPS Priority Mail Express International',
        description: 'International delivery in 3-5 business days',
        deliveryDays: { min: 3, max: 5 },
        domestic: false,
        international: true,
        trackingLevel: 'detailed',
        baseRate: 49.99,
        weightRate: 4.00,
        dimFactor: 166
      }
    }
  },
  dhl: {
    code: 'dhl',
    name: 'DHL Express',
    logo: 'https://cdn.pearcomputer.com/carriers/dhl-logo.png',
    trackingUrl: 'https://www.dhl.com/us-en/home/tracking.html?tracking-id={tracking}',
    countries: ['US', 'CA', 'MX', 'GB', 'DE', 'FR', 'JP', 'AU', 'CN', 'BR', 'IN', 'KR'],
    features: ['tracking', 'signature', 'insurance', 'saturday_delivery', 'on_demand_delivery'],
    services: {
      express_worldwide: {
        code: 'dhl_express',
        name: 'DHL Express Worldwide',
        description: 'International door-to-door delivery',
        deliveryDays: { min: 2, max: 5 },
        domestic: false,
        international: true,
        trackingLevel: 'detailed',
        baseRate: 59.99,
        weightRate: 4.50,
        dimFactor: 139
      },
      express_1200: {
        code: 'dhl_express_1200',
        name: 'DHL Express 12:00',
        description: 'International delivery by noon',
        deliveryDays: { min: 1, max: 3 },
        domestic: false,
        international: true,
        trackingLevel: 'detailed',
        baseRate: 89.99,
        weightRate: 6.50,
        dimFactor: 139
      },
      express_900: {
        code: 'dhl_express_900',
        name: 'DHL Express 9:00',
        description: 'International delivery by 9am',
        deliveryDays: { min: 1, max: 2 },
        domestic: false,
        international: true,
        trackingLevel: 'detailed',
        baseRate: 119.99,
        weightRate: 8.00,
        dimFactor: 139
      }
    }
  }
};

// ============================================================================
// SEED DATA - Zone Definitions (US ZIP code prefixes to zones)
// ============================================================================

const zoneMatrix = {
  // Origin zone -> Destination zone prefix -> zone number
  // Zone affects delivery time and price multiplier
  '9': {  // West Coast origin (CA, WA, OR)
    '9': 2, '8': 3, '7': 4, '6': 5, '5': 5, '4': 6, '3': 6, '2': 7, '1': 7, '0': 8
  },
  '8': {  // Mountain (CO, AZ, NV)
    '9': 3, '8': 2, '7': 3, '6': 4, '5': 4, '4': 5, '3': 5, '2': 6, '1': 6, '0': 7
  },
  '7': {  // South Central (TX, OK)
    '9': 4, '8': 3, '7': 2, '6': 3, '5': 3, '4': 4, '3': 4, '2': 5, '1': 6, '0': 6
  },
  '6': {  // Midwest (IL, MO)
    '9': 5, '8': 4, '7': 3, '6': 2, '5': 3, '4': 3, '3': 4, '2': 4, '1': 5, '0': 5
  },
  '5': {  // North Central (MN, WI)
    '9': 5, '8': 4, '7': 3, '6': 3, '5': 2, '4': 3, '3': 4, '2': 4, '1': 5, '0': 5
  },
  '4': {  // Great Lakes (MI, OH, IN)
    '9': 6, '8': 5, '7': 4, '6': 3, '5': 3, '4': 2, '3': 3, '2': 3, '1': 4, '0': 5
  },
  '3': {  // Southeast (FL, GA)
    '9': 6, '8': 5, '7': 4, '6': 4, '5': 4, '4': 3, '3': 2, '2': 3, '1': 4, '0': 5
  },
  '2': {  // Mid-Atlantic (VA, NC, DC)
    '9': 7, '8': 6, '7': 5, '6': 4, '5': 4, '4': 3, '3': 3, '2': 2, '1': 3, '0': 4
  },
  '1': {  // Northeast (NY, PA, NJ)
    '9': 7, '8': 6, '7': 6, '6': 5, '5': 5, '4': 4, '3': 4, '2': 3, '1': 2, '0': 3
  },
  '0': {  // New England (MA, CT)
    '9': 8, '8': 7, '7': 6, '6': 5, '5': 5, '4': 5, '3': 5, '2': 4, '1': 3, '0': 2
  }
};

// Zone multipliers for pricing
const zoneMultipliers = {
  2: 1.0,
  3: 1.15,
  4: 1.30,
  5: 1.45,
  6: 1.60,
  7: 1.75,
  8: 1.90
};

// ============================================================================
// SEED DATA - Surcharges
// ============================================================================

const surcharges = {
  residential: { amount: 4.50, description: 'Residential delivery surcharge' },
  signature_required: { amount: 3.75, description: 'Signature required' },
  adult_signature: { amount: 6.50, description: 'Adult signature required' },
  saturday_delivery: { amount: 16.00, description: 'Saturday delivery' },
  oversize: { amount: 95.00, description: 'Oversize package (>96 inches)' },
  additional_handling: { amount: 14.00, description: 'Additional handling (>70 lbs or >48 inches)' },
  fuel: { percentage: 0.075, description: 'Fuel surcharge' },  // 7.5%
  remote_area: { amount: 25.00, description: 'Remote area delivery' },
  insurance_fee: { percentage: 0.025, description: 'Insurance (2.5% of declared value)' }
};

// ============================================================================
// SEED DATA - Pear Computer Warehouse Locations
// ============================================================================

const warehouses = {
  'WH-CA': {
    id: 'WH-CA',
    name: 'Pear Distribution Center - West',
    address: {
      name: 'Pear Computer Fulfillment',
      street1: '1 Infinite Loop',
      city: 'Cupertino',
      state: 'CA',
      postalCode: '95014',
      country: 'US',
      phone: '+1-408-555-1000'
    }
  },
  'WH-TX': {
    id: 'WH-TX',
    name: 'Pear Distribution Center - South',
    address: {
      name: 'Pear Computer Fulfillment',
      street1: '500 Technology Way',
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      country: 'US',
      phone: '+1-512-555-2000'
    }
  },
  'WH-NJ': {
    id: 'WH-NJ',
    name: 'Pear Distribution Center - East',
    address: {
      name: 'Pear Computer Fulfillment',
      street1: '100 Commerce Drive',
      city: 'Newark',
      state: 'NJ',
      postalCode: '07102',
      country: 'US',
      phone: '+1-973-555-3000'
    }
  }
};

// ============================================================================
// IN-MEMORY STORES
// ============================================================================

const shipments = new Map();
const returns = new Map();
const pickups = new Map();
const trackingSubscriptions = new Map();

// ============================================================================
// ALGORITHMS - Rate Calculation
// ============================================================================

/**
 * Calculate dimensional weight
 */
function calculateDimWeight(dimensions, dimFactor) {
  if (!dimensions) return 0;
  const { length = 0, width = 0, height = 0, unit = 'in' } = dimensions;

  // Convert to inches if cm
  const l = unit === 'cm' ? length / 2.54 : length;
  const w = unit === 'cm' ? width / 2.54 : width;
  const h = unit === 'cm' ? height / 2.54 : height;

  return (l * w * h) / dimFactor;
}

/**
 * Convert weight to pounds
 */
function convertToPounds(weight) {
  if (!weight) return 1;
  const { value = 1, unit = 'lb' } = weight;

  switch (unit) {
    case 'oz': return value / 16;
    case 'g': return value / 453.592;
    case 'kg': return value * 2.20462;
    default: return value;
  }
}

/**
 * Get shipping zone between two postal codes
 */
function getZone(originPostal, destPostal) {
  const originPrefix = String(originPostal).charAt(0);
  const destPrefix = String(destPostal).charAt(0);

  const originZones = zoneMatrix[originPrefix] || zoneMatrix['9'];
  return originZones[destPrefix] || 5;
}

/**
 * Calculate delivery date based on service and ship date
 */
function calculateDeliveryDate(shipDate, minDays, maxDays) {
  const ship = shipDate ? new Date(shipDate) : new Date();

  // Skip weekends for business days
  let businessDays = 0;
  let currentDate = new Date(ship);

  while (businessDays < maxDays) {
    currentDate.setDate(currentDate.getDate() + 1);
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      businessDays++;
    }
  }

  return currentDate.toISOString().split('T')[0];
}

/**
 * Calculate shipping rate for a single carrier service
 */
function calculateServiceRate(service, packages, zone, options = {}) {
  const { residential = true, signatureRequired = false, insurance = false, declaredValue } = options;

  let totalWeight = 0;
  let totalDimWeight = 0;

  for (const pkg of packages) {
    const actualWeight = convertToPounds(pkg.weight);
    const dimWeight = calculateDimWeight(pkg.dimensions, service.dimFactor);

    totalWeight += actualWeight;
    totalDimWeight += dimWeight;
  }

  // Use billable weight (greater of actual or dimensional)
  const billableWeight = Math.max(totalWeight, totalDimWeight);

  // Base calculation
  let cost = service.baseRate + (billableWeight * service.weightRate);

  // Apply zone multiplier
  cost *= zoneMultipliers[zone] || 1;

  // Apply surcharges
  if (residential) {
    cost += surcharges.residential.amount;
  }

  if (signatureRequired) {
    cost += surcharges.signature_required.amount;
  }

  // Fuel surcharge
  cost += cost * surcharges.fuel.percentage;

  // Insurance
  if (insurance && declaredValue) {
    cost += declaredValue.amount * surcharges.insurance_fee.percentage;
  }

  // Additional handling for heavy/large packages
  if (billableWeight > 70) {
    cost += surcharges.additional_handling.amount;
  }

  // Round to 2 decimal places
  cost = Math.round(cost * 100) / 100;

  // Retail cost is about 25% higher
  const retailCost = Math.round(cost * 1.25 * 100) / 100;

  return { cost, retailCost, billableWeight };
}

/**
 * Calculate all available rates
 */
function calculateRates(rateRequest) {
  const { origin, destination, packages, shipDate, residential, signatureRequired, insurance, declaredValue } = rateRequest;

  const originPostal = origin?.postalCode || '95014';
  const destPostal = destination?.postalCode || '10001';
  const destCountry = destination?.country || 'US';

  const zone = getZone(originPostal, destPostal);
  const isDomestic = destCountry === 'US';

  const rates = [];
  const options = { residential, signatureRequired, insurance, declaredValue };

  for (const [carrierCode, carrier] of Object.entries(carriers)) {
    for (const [serviceKey, service] of Object.entries(carrier.services)) {
      // Skip if service doesn't match domestic/international need
      if (isDomestic && !service.domestic) continue;
      if (!isDomestic && !service.international) continue;

      const { cost, retailCost, billableWeight } = calculateServiceRate(service, packages, zone, options);
      const deliveryDate = calculateDeliveryDate(shipDate, service.deliveryDays.min, service.deliveryDays.max);

      rates.push({
        id: `rate-${carrierCode}-${service.code}-${Date.now()}`,
        carrier: carrier.name,
        carrierCode: carrier.code,
        service: service.name,
        serviceCode: service.code,
        cost: { amount: cost, currency: 'USD' },
        retailCost: { amount: retailCost, currency: 'USD' },
        estimatedDelivery: {
          date: deliveryDate,
          minDays: service.deliveryDays.min,
          maxDays: service.deliveryDays.max,
          guaranteed: service.deliveryDays.max <= 2
        },
        deliveryDays: service.deliveryDays.max,
        trackingSupported: service.trackingLevel !== 'none',
        insuranceIncluded: insurance,
        signatureIncluded: signatureRequired
      });
    }
  }

  // Sort by cost ascending
  rates.sort((a, b) => a.cost.amount - b.cost.amount);

  return { rates, messages: [] };
}

/**
 * Estimate delivery dates for a postal code
 */
function estimateDelivery(postalCode, country, items) {
  const estimates = [];
  const serviceTypes = ['standard', 'express', 'overnight'];

  const deliveryTimes = {
    standard: { days: 5, cutoff: '14:00' },
    express: { days: 2, cutoff: '12:00' },
    overnight: { days: 1, cutoff: '10:00' }
  };

  for (const type of serviceTypes) {
    const config = deliveryTimes[type];
    const deliveryDate = calculateDeliveryDate(null, config.days, config.days);

    estimates.push({
      service: type.charAt(0).toUpperCase() + type.slice(1),
      deliveryDate,
      cutoffTime: config.cutoff,
      businessDays: config.days,
      inStock: true
    });
  }

  return { estimates };
}

// ============================================================================
// ALGORITHMS - Tracking Generation
// ============================================================================

/**
 * Generate a realistic tracking number
 */
function generateTrackingNumber(carrierCode) {
  const prefixes = {
    fedex: '7489',
    ups: '1Z',
    usps: '9400',
    dhl: 'JD01'
  };

  const prefix = prefixes[carrierCode] || '1234';
  const random = Math.random().toString().slice(2, 14);

  if (carrierCode === 'ups') {
    return `${prefix}${random.slice(0, 6).toUpperCase()}${random.slice(6, 16)}`;
  }

  return `${prefix}${random}`;
}

/**
 * Generate tracking events for a shipment
 */
function generateTrackingEvents(shipment, currentStatus) {
  const events = [];
  const baseDate = new Date(shipment.createdAt);

  const statusProgression = [
    { status: 'label_created', description: 'Shipping label created' },
    { status: 'picked_up', description: 'Package picked up by carrier' },
    { status: 'in_transit', description: 'Package in transit' },
    { status: 'in_transit', description: 'Package arrived at distribution center' },
    { status: 'out_for_delivery', description: 'Package out for delivery' },
    { status: 'delivered', description: 'Package delivered' }
  ];

  const statusIndex = {
    pending: 0,
    label_created: 1,
    picked_up: 2,
    in_transit: 4,
    out_for_delivery: 5,
    delivered: 6,
    exception: 4,
    cancelled: 1
  };

  const maxIndex = statusIndex[currentStatus] || 0;

  for (let i = 0; i < maxIndex && i < statusProgression.length; i++) {
    const eventDate = new Date(baseDate);
    eventDate.setHours(eventDate.getHours() + (i * 8) + Math.floor(Math.random() * 4));

    events.push({
      status: statusProgression[i].status,
      description: statusProgression[i].description,
      location: {
        city: ['Oakland', 'Memphis', 'Louisville', 'Newark'][i % 4],
        state: ['CA', 'TN', 'KY', 'NJ'][i % 4],
        country: 'US',
        postalCode: ['94601', '38118', '40213', '07102'][i % 4]
      },
      timestamp: eventDate.toISOString()
    });
  }

  return events.reverse();  // Most recent first
}

// ============================================================================
// SHIPMENT OPERATIONS
// ============================================================================

function createShipment(request) {
  const id = `ship-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const trackingNumber = generateTrackingNumber(request.carrier);
  const carrier = carriers[request.carrier];

  const shipment = {
    id,
    orderId: request.orderId,
    status: 'label_created',
    carrier: carrier?.name || request.carrier,
    carrierCode: request.carrier,
    service: request.service,
    trackingNumber,
    trackingUrl: carrier?.trackingUrl.replace('{tracking}', trackingNumber) || null,
    labelUrl: `https://api.pearcomputer.com/v1/shipping/labels/${id}`,
    origin: request.origin,
    destination: request.destination,
    packages: request.packages,
    items: request.items || [],
    shippingCost: { amount: 19.99, currency: 'USD' },
    insurance: request.insurance || { insured: false },
    signatureRequired: request.signatureRequired || false,
    deliveryInstructions: request.deliveryInstructions || null,
    estimatedDelivery: calculateDeliveryDate(request.shipDate, 3, 5),
    actualDelivery: null,
    events: [{
      status: 'label_created',
      description: 'Shipping label created',
      location: {
        city: request.origin?.city || 'Cupertino',
        state: request.origin?.state || 'CA',
        country: 'US'
      },
      timestamp: new Date().toISOString()
    }],
    createdAt: new Date().toISOString(),
    shippedAt: null,
    deliveredAt: null
  };

  shipments.set(id, shipment);
  return shipment;
}

function getShipment(shipmentId) {
  return shipments.get(shipmentId);
}

function updateShipment(shipmentId, updates) {
  const shipment = shipments.get(shipmentId);
  if (!shipment) return null;

  if (updates.status) {
    shipment.status = updates.status;
    shipment.events = generateTrackingEvents(shipment, updates.status);

    if (updates.status === 'picked_up') {
      shipment.shippedAt = new Date().toISOString();
    } else if (updates.status === 'delivered') {
      shipment.deliveredAt = new Date().toISOString();
      shipment.actualDelivery = new Date().toISOString();
    }
  }

  if (updates.deliveryInstructions) {
    shipment.deliveryInstructions = updates.deliveryInstructions;
  }

  shipments.set(shipmentId, shipment);
  return shipment;
}

function cancelShipment(shipmentId, reason) {
  const shipment = shipments.get(shipmentId);
  if (!shipment) return null;

  if (['picked_up', 'in_transit', 'out_for_delivery', 'delivered'].includes(shipment.status)) {
    return { error: 'Cannot cancel shipment after pickup' };
  }

  shipment.status = 'cancelled';
  shipment.events.unshift({
    status: 'cancelled',
    description: reason || 'Shipment cancelled',
    location: null,
    timestamp: new Date().toISOString()
  });

  shipments.set(shipmentId, shipment);
  return shipment;
}

function listShipments(filters = {}) {
  let results = Array.from(shipments.values());

  if (filters.orderId) {
    results = results.filter(s => s.orderId === filters.orderId);
  }
  if (filters.status) {
    results = results.filter(s => s.status === filters.status);
  }
  if (filters.carrier) {
    results = results.filter(s => s.carrierCode === filters.carrier);
  }
  if (filters.startDate) {
    results = results.filter(s => new Date(s.createdAt) >= new Date(filters.startDate));
  }
  if (filters.endDate) {
    results = results.filter(s => new Date(s.createdAt) <= new Date(filters.endDate));
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const startIndex = (page - 1) * limit;
  const paginatedResults = results.slice(startIndex, startIndex + limit);

  return {
    shipments: paginatedResults,
    pagination: {
      page,
      limit,
      totalItems: results.length,
      totalPages: Math.ceil(results.length / limit)
    }
  };
}

// ============================================================================
// TRACKING OPERATIONS
// ============================================================================

function trackPackage(trackingNumber, carrierCode) {
  // Find shipment by tracking number
  const shipment = Array.from(shipments.values()).find(s => s.trackingNumber === trackingNumber);

  if (!shipment) {
    // Generate mock tracking for demo
    return {
      trackingNumber,
      carrier: carrierCode ? carriers[carrierCode]?.name : 'Unknown',
      status: 'in_transit',
      statusDescription: 'Package is in transit to destination',
      estimatedDelivery: calculateDeliveryDate(null, 2, 3),
      actualDelivery: null,
      signedBy: null,
      destination: null,
      events: [
        {
          status: 'in_transit',
          description: 'Package departed facility',
          location: { city: 'Memphis', state: 'TN', country: 'US', postalCode: '38118' },
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          status: 'in_transit',
          description: 'Package arrived at facility',
          location: { city: 'Memphis', state: 'TN', country: 'US', postalCode: '38118' },
          timestamp: new Date(Date.now() - 7200000).toISOString()
        },
        {
          status: 'picked_up',
          description: 'Package picked up',
          location: { city: 'Cupertino', state: 'CA', country: 'US', postalCode: '95014' },
          timestamp: new Date(Date.now() - 86400000).toISOString()
        }
      ]
    };
  }

  return {
    trackingNumber: shipment.trackingNumber,
    carrier: shipment.carrier,
    status: shipment.status,
    statusDescription: getStatusDescription(shipment.status),
    estimatedDelivery: shipment.estimatedDelivery,
    actualDelivery: shipment.actualDelivery,
    signedBy: shipment.status === 'delivered' ? 'J. DOE' : null,
    destination: shipment.destination,
    events: shipment.events
  };
}

function getStatusDescription(status) {
  const descriptions = {
    pending: 'Shipment is being prepared',
    label_created: 'Shipping label has been created',
    picked_up: 'Package has been picked up by carrier',
    in_transit: 'Package is in transit',
    out_for_delivery: 'Package is out for delivery',
    delivered: 'Package has been delivered',
    exception: 'Delivery exception occurred',
    returned: 'Package is being returned to sender',
    cancelled: 'Shipment has been cancelled'
  };
  return descriptions[status] || status;
}

function subscribeToTracking(request) {
  const subscriptionId = `sub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  trackingSubscriptions.set(subscriptionId, {
    id: subscriptionId,
    trackingNumber: request.trackingNumber,
    carrier: request.carrier,
    webhookUrl: request.webhookUrl,
    events: request.events || ['all'],
    createdAt: new Date().toISOString()
  });

  return { subscriptionId };
}

// ============================================================================
// LABEL OPERATIONS
// ============================================================================

function getLabel(shipmentId, format = 'pdf') {
  const shipment = shipments.get(shipmentId);
  if (!shipment) return null;

  return {
    labelUrl: `https://api.pearcomputer.com/v1/shipping/labels/${shipmentId}.${format}`,
    trackingNumber: shipment.trackingNumber,
    format
  };
}

function regenerateLabel(shipmentId) {
  const shipment = shipments.get(shipmentId);
  if (!shipment) return null;

  // Generate new tracking number
  shipment.trackingNumber = generateTrackingNumber(shipment.carrierCode);
  const carrier = carriers[shipment.carrierCode];
  shipment.trackingUrl = carrier?.trackingUrl.replace('{tracking}', shipment.trackingNumber) || null;

  shipments.set(shipmentId, shipment);

  return {
    labelUrl: `https://api.pearcomputer.com/v1/shipping/labels/${shipmentId}.pdf`,
    trackingNumber: shipment.trackingNumber
  };
}

// ============================================================================
// RETURN OPERATIONS
// ============================================================================

function createReturnLabel(request) {
  const id = `ret-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const carrier = request.carrier || 'usps';
  const trackingNumber = generateTrackingNumber(carrier);

  const returnLabel = {
    id,
    orderId: request.orderId,
    trackingNumber,
    carrier: carriers[carrier]?.name || carrier,
    labelUrl: `https://api.pearcomputer.com/v1/shipping/returns/${id}/label.pdf`,
    qrCodeUrl: `https://api.pearcomputer.com/v1/shipping/returns/${id}/qr.png`,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dropOffLocations: [
      {
        name: 'USPS Post Office',
        address: {
          street1: '123 Main Street',
          city: request.customerAddress?.city || 'San Francisco',
          state: request.customerAddress?.state || 'CA',
          postalCode: request.customerAddress?.postalCode || '94102',
          country: 'US'
        },
        hours: 'Mon-Fri 9am-5pm, Sat 9am-1pm'
      },
      {
        name: 'FedEx Office',
        address: {
          street1: '456 Market Street',
          city: request.customerAddress?.city || 'San Francisco',
          state: request.customerAddress?.state || 'CA',
          postalCode: request.customerAddress?.postalCode || '94102',
          country: 'US'
        },
        hours: 'Mon-Fri 7am-9pm, Sat-Sun 9am-6pm'
      }
    ]
  };

  returns.set(id, {
    ...returnLabel,
    status: 'label_created',
    customerAddress: request.customerAddress,
    returnAddress: request.returnAddress,
    items: request.items,
    createdAt: new Date().toISOString()
  });

  return returnLabel;
}

function trackReturn(returnId) {
  const returnInfo = returns.get(returnId);
  if (!returnInfo) return null;

  return {
    trackingNumber: returnInfo.trackingNumber,
    carrier: returnInfo.carrier,
    status: returnInfo.status,
    statusDescription: getStatusDescription(returnInfo.status),
    estimatedDelivery: null,
    actualDelivery: null,
    signedBy: null,
    destination: returnInfo.returnAddress,
    events: [{
      status: 'label_created',
      description: 'Return label created - awaiting package drop-off',
      location: null,
      timestamp: returnInfo.createdAt
    }]
  };
}

// ============================================================================
// CARRIER OPERATIONS
// ============================================================================

function listCarriers(country) {
  let carrierList = Object.values(carriers);

  if (country) {
    carrierList = carrierList.filter(c => c.countries.includes(country));
  }

  return {
    carriers: carrierList.map(c => ({
      code: c.code,
      name: c.name,
      logo: c.logo,
      trackingUrl: c.trackingUrl,
      countries: c.countries,
      features: c.features
    }))
  };
}

function getCarrierServices(carrierCode) {
  const carrier = carriers[carrierCode];
  if (!carrier) return null;

  return {
    services: Object.values(carrier.services).map(s => ({
      code: s.code,
      name: s.name,
      description: s.description,
      deliveryDays: s.deliveryDays,
      domestic: s.domestic,
      international: s.international,
      trackingLevel: s.trackingLevel
    }))
  };
}

// ============================================================================
// ADDRESS VALIDATION
// ============================================================================

function validateAddress(address) {
  const corrections = [];
  const warnings = [];
  let standardized = { ...address };

  // Standardize state abbreviation
  const stateMap = {
    'california': 'CA', 'texas': 'TX', 'new york': 'NY', 'florida': 'FL',
    'illinois': 'IL', 'pennsylvania': 'PA', 'ohio': 'OH', 'georgia': 'GA'
  };

  const lowerState = (address.state || '').toLowerCase();
  if (stateMap[lowerState]) {
    corrections.push({
      field: 'state',
      original: address.state,
      corrected: stateMap[lowerState]
    });
    standardized.state = stateMap[lowerState];
  }

  // Check postal code format
  const postalCode = address.postalCode || '';
  if (address.country === 'US' && postalCode.length > 5) {
    const zip5 = postalCode.slice(0, 5);
    if (zip5 !== postalCode) {
      corrections.push({
        field: 'postalCode',
        original: postalCode,
        corrected: zip5
      });
      standardized.postalCode = zip5;
    }
  }

  // Check for PO Box
  const street1 = (address.street1 || '').toLowerCase();
  if (street1.includes('po box') || street1.includes('p.o. box')) {
    warnings.push('PO Box addresses may have limited carrier options');
  }

  return {
    valid: true,
    original: address,
    standardized,
    residential: !address.company,
    deliverable: true,
    corrections,
    warnings
  };
}

// ============================================================================
// PICKUP OPERATIONS
// ============================================================================

function schedulePickup(request) {
  const id = `pickup-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const confirmationNumber = `${carriers[request.carrier]?.code.toUpperCase() || 'PKP'}${Date.now().toString().slice(-8)}`;

  const pickup = {
    id,
    carrier: carriers[request.carrier]?.name || request.carrier,
    confirmationNumber,
    pickupDate: request.pickupDate,
    timeWindow: {
      start: request.readyTime || '09:00',
      end: request.closeTime || '17:00'
    },
    status: 'scheduled',
    address: request.address,
    packageCount: request.packageCount || 1,
    totalWeight: request.totalWeight,
    instructions: request.instructions,
    createdAt: new Date().toISOString()
  };

  pickups.set(id, pickup);
  return pickup;
}

function cancelPickup(pickupId) {
  const pickup = pickups.get(pickupId);
  if (!pickup) return null;

  if (pickup.status === 'completed') {
    return { error: 'Cannot cancel completed pickup' };
  }

  pickup.status = 'cancelled';
  pickups.set(pickupId, pickup);
  return { success: true };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Data
  carriers,
  warehouses,
  surcharges,

  // Rate calculations
  calculateRates,
  estimateDelivery,
  getZone,
  calculateDimWeight,

  // Shipments
  createShipment,
  getShipment,
  updateShipment,
  cancelShipment,
  listShipments,

  // Tracking
  trackPackage,
  subscribeToTracking,
  generateTrackingNumber,

  // Labels
  getLabel,
  regenerateLabel,

  // Returns
  createReturnLabel,
  trackReturn,

  // Carriers
  listCarriers,
  getCarrierServices,

  // Address
  validateAddress,

  // Pickups
  schedulePickup,
  cancelPickup
};
