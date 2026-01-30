/**
 * Physical Stores Data Module
 * Manages store locations, appointments, services, events, and inventory
 */

// Seed data: Store locations
const stores = [
  {
    id: 'STORE-001',
    name: 'Pear Infinite Loop',
    slug: 'infinite-loop',
    storeNumber: 'R001',
    type: 'flagship',
    address: {
      street1: '1 Infinite Loop',
      city: 'Cupertino',
      state: 'CA',
      postalCode: '95014',
      country: 'US'
    },
    coordinates: { latitude: 37.3318, longitude: -122.0312 },
    phone: '+1 (408) 996-1010',
    email: 'infiniteloop@pearcomputer.com',
    timezone: 'America/Los_Angeles',
    hours: {
      monday: { open: '10:00', close: '21:00' },
      tuesday: { open: '10:00', close: '21:00' },
      wednesday: { open: '10:00', close: '21:00' },
      thursday: { open: '10:00', close: '21:00' },
      friday: { open: '10:00', close: '21:00' },
      saturday: { open: '10:00', close: '21:00' },
      sunday: { open: '11:00', close: '18:00' }
    },
    services: ['genius_grove', 'personal_setup', 'workshops', 'business', 'trade_in', 'carrier_activation'],
    features: ['pickup', 'delivery', 'express_checkout', 'personal_shopping'],
    images: [
      { url: 'https://images.pearcomputer.com/stores/infinite-loop-exterior.jpg', type: 'exterior' },
      { url: 'https://images.pearcomputer.com/stores/infinite-loop-interior.jpg', type: 'interior' }
    ],
    parkingInfo: 'Free parking garage with 2 hours validation',
    transitInfo: 'VTA Bus Line 23 stops at De Anza Blvd',
    accessibilityFeatures: ['wheelchair_accessible', 'hearing_loop', 'sign_language_available']
  },
  {
    id: 'STORE-002',
    name: 'Pear Fifth Avenue',
    slug: 'fifth-avenue',
    storeNumber: 'R002',
    type: 'flagship',
    address: {
      street1: '767 Fifth Avenue',
      city: 'New York',
      state: 'NY',
      postalCode: '10153',
      country: 'US'
    },
    coordinates: { latitude: 40.7640, longitude: -73.9729 },
    phone: '+1 (212) 336-1440',
    email: 'fifthavenue@pearcomputer.com',
    timezone: 'America/New_York',
    hours: {
      monday: { open: '08:00', close: '22:00' },
      tuesday: { open: '08:00', close: '22:00' },
      wednesday: { open: '08:00', close: '22:00' },
      thursday: { open: '08:00', close: '22:00' },
      friday: { open: '08:00', close: '22:00' },
      saturday: { open: '08:00', close: '22:00' },
      sunday: { open: '08:00', close: '22:00' }
    },
    services: ['genius_grove', 'personal_setup', 'workshops', 'business', 'trade_in', 'carrier_activation', '24_hour'],
    features: ['pickup', 'delivery', 'express_checkout', 'personal_shopping', 'concierge'],
    images: [
      { url: 'https://images.pearcomputer.com/stores/fifth-avenue-cube.jpg', type: 'exterior' },
      { url: 'https://images.pearcomputer.com/stores/fifth-avenue-interior.jpg', type: 'interior' }
    ],
    parkingInfo: 'Central Parking at 61st Street nearby',
    transitInfo: 'Subway: N, R, W to Fifth Avenue/59th Street',
    accessibilityFeatures: ['wheelchair_accessible', 'hearing_loop', 'sign_language_available']
  },
  {
    id: 'STORE-003',
    name: 'Pear Union Square',
    slug: 'union-square-sf',
    storeNumber: 'R003',
    type: 'flagship',
    address: {
      street1: '300 Post Street',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94108',
      country: 'US'
    },
    coordinates: { latitude: 37.7889, longitude: -122.4074 },
    phone: '+1 (415) 392-0202',
    email: 'unionsquare@pearcomputer.com',
    timezone: 'America/Los_Angeles',
    hours: {
      monday: { open: '10:00', close: '21:00' },
      tuesday: { open: '10:00', close: '21:00' },
      wednesday: { open: '10:00', close: '21:00' },
      thursday: { open: '10:00', close: '21:00' },
      friday: { open: '10:00', close: '21:00' },
      saturday: { open: '10:00', close: '21:00' },
      sunday: { open: '11:00', close: '18:00' }
    },
    services: ['genius_grove', 'personal_setup', 'workshops', 'business', 'trade_in'],
    features: ['pickup', 'delivery', 'express_checkout', 'personal_shopping'],
    images: [
      { url: 'https://images.pearcomputer.com/stores/union-square-exterior.jpg', type: 'exterior' }
    ],
    parkingInfo: 'Union Square Garage nearby',
    transitInfo: 'BART/Muni: Powell Street Station',
    accessibilityFeatures: ['wheelchair_accessible', 'hearing_loop']
  },
  {
    id: 'STORE-004',
    name: 'Pear Michigan Avenue',
    slug: 'michigan-avenue',
    storeNumber: 'R004',
    type: 'flagship',
    address: {
      street1: '401 N Michigan Avenue',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60611',
      country: 'US'
    },
    coordinates: { latitude: 41.8902, longitude: -87.6244 },
    phone: '+1 (312) 529-9500',
    email: 'michiganave@pearcomputer.com',
    timezone: 'America/Chicago',
    hours: {
      monday: { open: '10:00', close: '21:00' },
      tuesday: { open: '10:00', close: '21:00' },
      wednesday: { open: '10:00', close: '21:00' },
      thursday: { open: '10:00', close: '21:00' },
      friday: { open: '10:00', close: '21:00' },
      saturday: { open: '10:00', close: '21:00' },
      sunday: { open: '11:00', close: '18:00' }
    },
    services: ['genius_grove', 'personal_setup', 'workshops', 'business', 'trade_in', 'carrier_activation'],
    features: ['pickup', 'delivery', 'express_checkout'],
    images: [
      { url: 'https://images.pearcomputer.com/stores/michigan-ave-exterior.jpg', type: 'exterior' }
    ],
    parkingInfo: 'Millennium Park Garage nearby',
    transitInfo: 'CTA Red Line to Grand',
    accessibilityFeatures: ['wheelchair_accessible', 'hearing_loop', 'sign_language_available']
  },
  {
    id: 'STORE-005',
    name: 'Pear The Grove',
    slug: 'the-grove',
    storeNumber: 'R005',
    type: 'retail',
    address: {
      street1: '189 The Grove Drive',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90036',
      country: 'US'
    },
    coordinates: { latitude: 34.0722, longitude: -118.3578 },
    phone: '+1 (323) 900-0123',
    email: 'thegrove@pearcomputer.com',
    timezone: 'America/Los_Angeles',
    hours: {
      monday: { open: '10:00', close: '21:00' },
      tuesday: { open: '10:00', close: '21:00' },
      wednesday: { open: '10:00', close: '21:00' },
      thursday: { open: '10:00', close: '21:00' },
      friday: { open: '10:00', close: '22:00' },
      saturday: { open: '10:00', close: '22:00' },
      sunday: { open: '11:00', close: '19:00' }
    },
    services: ['genius_grove', 'personal_setup', 'workshops', 'trade_in'],
    features: ['pickup', 'delivery', 'express_checkout'],
    images: [],
    parkingInfo: 'Free parking lot with 2 hours validation',
    transitInfo: 'Metro Bus Lines 14, 16, 316',
    accessibilityFeatures: ['wheelchair_accessible']
  },
  {
    id: 'STORE-020',
    name: 'Pear Toronto Eaton Centre',
    slug: 'toronto-eaton-centre',
    storeNumber: 'R020',
    type: 'flagship',
    address: {
      street1: '220 Yonge Street',
      city: 'Toronto',
      state: 'ON',
      postalCode: 'M5B 2H1',
      country: 'CA'
    },
    coordinates: { latitude: 43.6544, longitude: -79.3807 },
    phone: '+1 (416) 367-0077',
    email: 'toronto@pearcomputer.com',
    timezone: 'America/Toronto',
    hours: {
      monday: { open: '10:00', close: '21:00' },
      tuesday: { open: '10:00', close: '21:00' },
      wednesday: { open: '10:00', close: '21:00' },
      thursday: { open: '10:00', close: '21:00' },
      friday: { open: '10:00', close: '21:00' },
      saturday: { open: '10:00', close: '21:00' },
      sunday: { open: '11:00', close: '19:00' }
    },
    services: ['genius_grove', 'personal_setup', 'workshops', 'business', 'trade_in', 'carrier_activation'],
    features: ['pickup', 'delivery', 'express_checkout', 'personal_shopping'],
    images: [],
    parkingInfo: 'Eaton Centre Garage with 2 hours validation',
    transitInfo: 'TTC: Dundas or Queen stations',
    accessibilityFeatures: ['wheelchair_accessible', 'hearing_loop', 'sign_language_available']
  },
  {
    id: 'STORE-022',
    name: 'Pear London Regent Street',
    slug: 'london-regent-street',
    storeNumber: 'R022',
    type: 'flagship',
    address: {
      street1: '235 Regent Street',
      city: 'London',
      state: '',
      postalCode: 'W1B 2EL',
      country: 'UK'
    },
    coordinates: { latitude: 51.5138, longitude: -0.1404 },
    phone: '+44 20 7153 9000',
    email: 'regentstreet@pearcomputer.com',
    timezone: 'Europe/London',
    hours: {
      monday: { open: '10:00', close: '21:00' },
      tuesday: { open: '10:00', close: '21:00' },
      wednesday: { open: '10:00', close: '21:00' },
      thursday: { open: '10:00', close: '21:00' },
      friday: { open: '10:00', close: '21:00' },
      saturday: { open: '10:00', close: '21:00' },
      sunday: { open: '12:00', close: '18:00' }
    },
    services: ['genius_grove', 'personal_setup', 'workshops', 'business', 'trade_in', 'carrier_activation'],
    features: ['pickup', 'delivery', 'express_checkout', 'personal_shopping', 'concierge'],
    images: [],
    parkingInfo: 'Q-Park Oxford Street nearby',
    transitInfo: 'Tube: Oxford Circus (Bakerloo, Central, Victoria lines)',
    accessibilityFeatures: ['wheelchair_accessible', 'hearing_loop', 'sign_language_available']
  }
];

// Seed data: Services
const geniusGroveServices = [
  {
    id: 'SVC-001',
    name: 'Hardware Repair',
    category: 'repair',
    description: 'Screen replacements, battery service, and other hardware repairs',
    duration: 60,
    requiresAppointment: false,
    availableAt: ['STORE-001', 'STORE-002', 'STORE-003', 'STORE-004', 'STORE-005', 'STORE-020', 'STORE-022']
  },
  {
    id: 'SVC-002',
    name: 'Software Support',
    category: 'support',
    description: 'Help with software issues, updates, and troubleshooting',
    duration: 30,
    requiresAppointment: false,
    availableAt: ['STORE-001', 'STORE-002', 'STORE-003', 'STORE-004', 'STORE-005', 'STORE-020', 'STORE-022']
  },
  {
    id: 'SVC-003',
    name: 'One-on-One Training',
    category: 'training',
    description: 'Personalized training sessions on any Pear product or service',
    duration: 60,
    requiresAppointment: true,
    availableAt: ['STORE-001', 'STORE-002', 'STORE-003', 'STORE-004', 'STORE-020', 'STORE-022']
  },
  {
    id: 'SVC-004',
    name: 'Device Setup',
    category: 'support',
    description: 'Help setting up new devices including data transfer',
    duration: 45,
    requiresAppointment: false,
    availableAt: ['STORE-001', 'STORE-002', 'STORE-003', 'STORE-004', 'STORE-005', 'STORE-020', 'STORE-022']
  },
  {
    id: 'SVC-005',
    name: 'Business Consulting',
    category: 'business',
    description: 'Consultation for business customers on Pear solutions',
    duration: 60,
    requiresAppointment: true,
    availableAt: ['STORE-001', 'STORE-002', 'STORE-004', 'STORE-020', 'STORE-022']
  },
  {
    id: 'SVC-006',
    name: 'Trade-In Evaluation',
    category: 'trade_in',
    description: 'Get your device evaluated for trade-in value',
    duration: 15,
    requiresAppointment: false,
    availableAt: ['STORE-001', 'STORE-002', 'STORE-003', 'STORE-004', 'STORE-005', 'STORE-020', 'STORE-022']
  }
];

// Seed data: Service pricing
const servicePricing = {
  'SVC-001': {
    serviceId: 'SVC-001',
    serviceName: 'Hardware Repair',
    pricing: [
      { description: 'pPhone Screen Replacement', price: { amount: 279, currency: 'USD' }, warranty: '90 days', notes: 'Original Pear parts' },
      { description: 'pPhone Battery Replacement', price: { amount: 89, currency: 'USD' }, warranty: '90 days', notes: 'May vary by model' },
      { description: 'PearBook Screen Replacement', price: { amount: 549, currency: 'USD' }, warranty: '90 days', notes: 'Varies by model' },
      { description: 'PearBook Battery Replacement', price: { amount: 199, currency: 'USD' }, warranty: '90 days', notes: null },
      { description: 'PearPad Screen Replacement', price: { amount: 349, currency: 'USD' }, warranty: '90 days', notes: 'Varies by model' }
    ]
  },
  'SVC-002': {
    serviceId: 'SVC-002',
    serviceName: 'Software Support',
    pricing: [
      { description: 'Software Troubleshooting', price: { amount: 0, currency: 'USD' }, warranty: null, notes: 'Free service' }
    ]
  },
  'SVC-003': {
    serviceId: 'SVC-003',
    serviceName: 'One-on-One Training',
    pricing: [
      { description: 'New Device Training (within 90 days)', price: { amount: 0, currency: 'USD' }, warranty: null, notes: 'Free with purchase' },
      { description: 'Standard Training Session', price: { amount: 99, currency: 'USD' }, warranty: null, notes: '60 minute session' }
    ]
  },
  'SVC-004': {
    serviceId: 'SVC-004',
    serviceName: 'Device Setup',
    pricing: [
      { description: 'Basic Setup', price: { amount: 0, currency: 'USD' }, warranty: null, notes: 'Free service' },
      { description: 'Data Transfer', price: { amount: 0, currency: 'USD' }, warranty: null, notes: 'Free service' }
    ]
  },
  'SVC-005': {
    serviceId: 'SVC-005',
    serviceName: 'Business Consulting',
    pricing: [
      { description: 'Business Consultation', price: { amount: 0, currency: 'USD' }, warranty: null, notes: 'Free for business customers' }
    ]
  },
  'SVC-006': {
    serviceId: 'SVC-006',
    serviceName: 'Trade-In Evaluation',
    pricing: [
      { description: 'Device Evaluation', price: { amount: 0, currency: 'USD' }, warranty: null, notes: 'Free service - trade-in value depends on device condition' }
    ]
  }
};

// Seed data: Events
const events = [
  {
    id: 'EVT-2024-00156',
    title: 'Today at Pear: Photo Walk with pPhone 16',
    description: 'Join us for a creative photo walk around Infinite Loop campus using the advanced camera features of pPhone 16 Pro.',
    category: 'workshop',
    topic: 'photography',
    store: { id: 'STORE-001', name: 'Pear Infinite Loop' },
    dateTime: '2024-01-20T10:00:00-08:00',
    duration: 120,
    instructor: 'Alex Rivera',
    capacity: 20,
    spotsRemaining: 2,
    isFree: true,
    price: null,
    requirements: ['pPhone 16 or later'],
    ageRestriction: null,
    imageUrl: 'https://images.pearcomputer.com/events/photo-walk.jpg'
  },
  {
    id: 'EVT-2024-00157',
    title: 'Getting Started with PearBook',
    description: 'Learn the basics of your new PearBook including system preferences, file management, and built-in apps.',
    category: 'workshop',
    topic: 'mac_basics',
    store: { id: 'STORE-002', name: 'Pear Fifth Avenue' },
    dateTime: '2024-01-21T14:00:00-05:00',
    duration: 90,
    instructor: 'Maria Santos',
    capacity: 15,
    spotsRemaining: 3,
    isFree: true,
    price: null,
    requirements: ['Any PearBook'],
    ageRestriction: null,
    imageUrl: 'https://images.pearcomputer.com/events/pearbook-basics.jpg'
  },
  {
    id: 'EVT-2024-00158',
    title: 'Music Creation on PearPad Pro',
    description: 'Discover how to create music using GarageBand and Logic Pro on your PearPad Pro.',
    category: 'workshop',
    topic: 'music_creation',
    store: { id: 'STORE-003', name: 'Pear Union Square' },
    dateTime: '2024-01-22T16:00:00-08:00',
    duration: 120,
    instructor: 'Jordan Kim',
    capacity: 12,
    spotsRemaining: 0,
    isFree: true,
    price: null,
    requirements: ['PearPad Pro', 'Pear Pencil (optional)'],
    ageRestriction: null,
    imageUrl: 'https://images.pearcomputer.com/events/music-creation.jpg'
  },
  {
    id: 'EVT-2024-00159',
    title: 'Pear Watch Health Features Deep Dive',
    description: 'Explore the health and fitness features of Pear Watch including heart monitoring, sleep tracking, and workout detection.',
    category: 'workshop',
    topic: 'health_fitness',
    store: { id: 'STORE-020', name: 'Pear Toronto Eaton Centre' },
    dateTime: '2024-01-23T11:00:00-05:00',
    duration: 90,
    instructor: 'Sarah Thompson',
    capacity: 20,
    spotsRemaining: 5,
    isFree: true,
    price: null,
    requirements: ['Any Pear Watch'],
    ageRestriction: null,
    imageUrl: 'https://images.pearcomputer.com/events/watch-health.jpg'
  },
  {
    id: 'EVT-2024-00160',
    title: 'Pro Video Editing with Final Cut Pro',
    description: 'Advanced video editing techniques using Final Cut Pro on PearBook Pro.',
    category: 'workshop',
    topic: 'video_editing',
    store: { id: 'STORE-022', name: 'Pear London Regent Street' },
    dateTime: '2024-01-25T10:00:00+00:00',
    duration: 180,
    instructor: 'James Mitchell',
    capacity: 10,
    spotsRemaining: 2,
    isFree: false,
    price: { amount: 49, currency: 'GBP' },
    requirements: ['PearBook Pro with Final Cut Pro installed'],
    ageRestriction: '16+',
    imageUrl: 'https://images.pearcomputer.com/events/fcp-advanced.jpg'
  },
  {
    id: 'EVT-2024-00161',
    title: 'Kids Hour: Drawing with PearPad',
    description: 'A fun session for kids to learn drawing and creativity on PearPad.',
    category: 'session',
    topic: 'kids',
    store: { id: 'STORE-001', name: 'Pear Infinite Loop' },
    dateTime: '2024-01-27T10:00:00-08:00',
    duration: 60,
    instructor: 'Emma Chen',
    capacity: 15,
    spotsRemaining: 8,
    isFree: true,
    price: null,
    requirements: [],
    ageRestriction: '6-12 years',
    imageUrl: 'https://images.pearcomputer.com/events/kids-drawing.jpg'
  }
];

// In-memory data stores
const appointments = new Map();
const eventRegistrations = new Map();
const pickupReservations = new Map();

// Store inventory simulation
const storeInventory = new Map();

// Initialize some inventory
function initializeInventory() {
  stores.forEach(store => {
    const inventory = [
      { productId: 'PPHONE-16-PRO', sku: 'PP16P-256-BLK', name: 'pPhone 16 Pro 256GB Black', quantity: Math.floor(Math.random() * 20) + 5 },
      { productId: 'PPHONE-16-PRO', sku: 'PP16P-256-WHT', name: 'pPhone 16 Pro 256GB White', quantity: Math.floor(Math.random() * 15) + 3 },
      { productId: 'PPHONE-16', sku: 'PP16-128-BLK', name: 'pPhone 16 128GB Black', quantity: Math.floor(Math.random() * 25) + 10 },
      { productId: 'PEARBOOK-PRO-14', sku: 'PBP14-512-SG', name: 'PearBook Pro 14" 512GB Space Gray', quantity: Math.floor(Math.random() * 10) + 2 },
      { productId: 'PEARBOOK-AIR', sku: 'PBA13-256-MN', name: 'PearBook Air 13" 256GB Midnight', quantity: Math.floor(Math.random() * 15) + 5 },
      { productId: 'PEARPAD-PRO-11', sku: 'PPD11-256-SG', name: 'PearPad Pro 11" 256GB Space Gray', quantity: Math.floor(Math.random() * 12) + 4 },
      { productId: 'PEAR-WATCH-10', sku: 'PW10-45-GPS', name: 'Pear Watch Series 10 45mm GPS', quantity: Math.floor(Math.random() * 20) + 8 },
      { productId: 'PEARPODS-PRO', sku: 'PPODS-PRO-2', name: 'PearPods Pro 2nd Gen', quantity: Math.floor(Math.random() * 30) + 15 }
    ];
    storeInventory.set(store.id, inventory);
  });
}

initializeInventory();

// Helper: Generate unique ID
function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Helper: Calculate distance between coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Helper: Get current store status
function getStoreStatus(store) {
  const now = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = days[now.getDay()];
  const hours = store.hours[dayName];

  if (!hours || hours.closed) {
    return { isOpen: false, opensAt: null, closesAt: null };
  }

  const currentTime = now.toTimeString().slice(0, 5);
  const isOpen = currentTime >= hours.open && currentTime < hours.close;

  return {
    isOpen,
    opensAt: hours.open,
    closesAt: hours.close
  };
}

// Helper: Format store for response
function formatStore(store, distance = null) {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const regularHours = {};
  days.forEach(day => {
    if (store.hours[day]) {
      regularHours[day] = store.hours[day];
    }
  });

  return {
    id: store.id,
    name: store.name,
    slug: store.slug,
    storeNumber: store.storeNumber,
    address: store.address,
    coordinates: store.coordinates,
    phone: store.phone,
    email: store.email,
    timezone: store.timezone,
    hours: {
      regular: regularHours,
      special: [],
      currentStatus: getStoreStatus(store)
    },
    services: store.services,
    features: store.features,
    images: store.images,
    parkingInfo: store.parkingInfo,
    transitInfo: store.transitInfo,
    accessibilityFeatures: store.accessibilityFeatures,
    ...(distance !== null && { distance: Math.round(distance * 10) / 10 })
  };
}

// ============ STORES ============

function listStores({ latitude, longitude, radius = 25, city, state, country, services, page = 1, limit = 20 }) {
  let filtered = [...stores];

  // Filter by location if coordinates provided
  if (latitude && longitude) {
    filtered = filtered.map(store => ({
      ...store,
      distance: calculateDistance(latitude, longitude, store.coordinates.latitude, store.coordinates.longitude)
    })).filter(store => store.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
  }

  // Filter by city
  if (city) {
    filtered = filtered.filter(store =>
      store.address.city.toLowerCase().includes(city.toLowerCase())
    );
  }

  // Filter by state
  if (state) {
    filtered = filtered.filter(store =>
      store.address.state.toLowerCase() === state.toLowerCase()
    );
  }

  // Filter by country
  if (country) {
    filtered = filtered.filter(store =>
      store.address.country.toLowerCase() === country.toLowerCase()
    );
  }

  // Filter by services
  if (services && services.length > 0) {
    filtered = filtered.filter(store =>
      services.every(svc => store.services.includes(svc))
    );
  }

  // Pagination
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const paginatedStores = filtered.slice(startIndex, startIndex + limit);

  return {
    stores: paginatedStores.map(store => formatStore(store, store.distance)),
    pagination: { page, limit, totalItems, totalPages }
  };
}

function getStore(storeId) {
  const store = stores.find(s => s.id === storeId);
  return store ? formatStore(store) : null;
}

function getStoreHours(storeId, startDate, endDate) {
  const store = stores.find(s => s.id === storeId);
  if (!store) return null;

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const regularHours = {};
  days.forEach(day => {
    if (store.hours[day]) {
      regularHours[day] = store.hours[day];
    }
  });

  return {
    regular: regularHours,
    special: [], // Could add holiday hours here
    currentStatus: getStoreStatus(store)
  };
}

// ============ APPOINTMENTS ============

function listAppointments({ status, storeId }) {
  let result = Array.from(appointments.values());

  if (status) {
    const now = new Date();
    if (status === 'upcoming') {
      result = result.filter(apt => new Date(apt.dateTime) > now && apt.status !== 'cancelled');
    } else if (status === 'past') {
      result = result.filter(apt => new Date(apt.dateTime) <= now);
    } else if (status === 'cancelled') {
      result = result.filter(apt => apt.status === 'cancelled');
    }
  }

  if (storeId) {
    result = result.filter(apt => apt.store.id === storeId);
  }

  return { appointments: result };
}

function createAppointment({ storeId, type, slotId, deviceType, deviceModel, deviceSerialNumber, issueDescription, notes }) {
  const store = stores.find(s => s.id === storeId);
  if (!store) {
    throw { status: 400, message: `Store not found: ${storeId}` };
  }

  // Parse slot ID to get date and time
  const slotParts = slotId.split('-');
  const slotDate = slotParts.slice(1, 4).join('-');
  const slotTime = slotParts.slice(4).join(':');

  const appointment = {
    id: generateId('APT'),
    confirmationCode: Math.random().toString(36).substr(2, 8).toUpperCase(),
    type,
    status: 'confirmed',
    store: {
      id: store.id,
      name: store.name,
      address: store.address
    },
    dateTime: `${slotDate}T${slotTime}:00`,
    duration: 60,
    customer: {
      id: 'CUST-12345',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567'
    },
    device: deviceType ? {
      type: deviceType,
      model: deviceModel || null,
      serialNumber: deviceSerialNumber || null
    } : null,
    issue: issueDescription || null,
    notes: notes || null,
    checkinCode: Math.random().toString(36).substr(2, 6).toUpperCase(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  appointments.set(appointment.id, appointment);
  return appointment;
}

function getAppointment(appointmentId) {
  return appointments.get(appointmentId) || null;
}

function updateAppointment(appointmentId, { slotId, notes, deviceSerialNumber }) {
  const appointment = appointments.get(appointmentId);
  if (!appointment) return null;

  if (slotId) {
    const slotParts = slotId.split('-');
    const slotDate = slotParts.slice(1, 4).join('-');
    const slotTime = slotParts.slice(4).join(':');
    appointment.dateTime = `${slotDate}T${slotTime}:00`;
  }

  if (notes !== undefined) {
    appointment.notes = notes;
  }

  if (deviceSerialNumber !== undefined && appointment.device) {
    appointment.device.serialNumber = deviceSerialNumber;
  }

  appointment.updatedAt = new Date().toISOString();
  appointments.set(appointmentId, appointment);
  return appointment;
}

function cancelAppointment(appointmentId) {
  const appointment = appointments.get(appointmentId);
  if (!appointment) return false;

  appointment.status = 'cancelled';
  appointment.updatedAt = new Date().toISOString();
  appointments.set(appointmentId, appointment);
  return true;
}

function getAppointmentAvailability({ storeId, serviceType, startDate, endDate, productCategory }) {
  const store = stores.find(s => s.id === storeId);
  if (!store) return null;

  // Generate availability slots for the next 7 days from startDate
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
  const dates = [];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][d.getDay()];
    const storeHours = store.hours[dayName];

    if (!storeHours || storeHours.closed) continue;

    const dateStr = d.toISOString().split('T')[0];
    const slots = [];

    // Generate hourly slots during store hours
    const openHour = parseInt(storeHours.open.split(':')[0]);
    const closeHour = parseInt(storeHours.close.split(':')[0]);

    for (let hour = openHour; hour < closeHour - 1; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
      const slotId = `SLOT-${dateStr}-${startTime.replace(':', '-')}`;

      // Randomly mark some slots as unavailable
      const available = Math.random() > 0.3;

      slots.push({
        id: slotId,
        startTime,
        endTime,
        available
      });
    }

    dates.push({ date: dateStr, slots });
  }

  return {
    storeId,
    serviceType,
    dates
  };
}

// ============ SERVICES ============

function listServices({ storeId, category }) {
  let filtered = [...geniusGroveServices];

  if (storeId) {
    filtered = filtered.filter(svc => svc.availableAt.includes(storeId));
  }

  if (category) {
    filtered = filtered.filter(svc => svc.category === category);
  }

  return { services: filtered };
}

function getServicePricing(serviceId, deviceModel) {
  const pricing = servicePricing[serviceId];
  if (!pricing) return null;

  // Could filter pricing by device model if provided
  return pricing;
}

// ============ EVENTS ============

function listEvents({ storeId, category, topic, startDate, endDate, page = 1, limit = 20 }) {
  let filtered = [...events];

  if (storeId) {
    filtered = filtered.filter(evt => evt.store.id === storeId);
  }

  if (category) {
    filtered = filtered.filter(evt => evt.category === category);
  }

  if (topic) {
    filtered = filtered.filter(evt => evt.topic.toLowerCase().includes(topic.toLowerCase()));
  }

  if (startDate) {
    filtered = filtered.filter(evt => new Date(evt.dateTime) >= new Date(startDate));
  }

  if (endDate) {
    filtered = filtered.filter(evt => new Date(evt.dateTime) <= new Date(endDate));
  }

  // Sort by date
  filtered.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  // Pagination
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const paginatedEvents = filtered.slice(startIndex, startIndex + limit);

  return {
    events: paginatedEvents,
    pagination: { page, limit, totalItems, totalPages }
  };
}

function getEvent(eventId) {
  return events.find(evt => evt.id === eventId) || null;
}

function registerForEvent(eventId, { attendees = 1, specialRequirements }) {
  const event = events.find(evt => evt.id === eventId);
  if (!event) return null;

  if (event.spotsRemaining < attendees) {
    throw { status: 409, message: 'Not enough spots available' };
  }

  const registration = {
    id: generateId('REG'),
    eventId,
    confirmationCode: Math.random().toString(36).substr(2, 8).toUpperCase(),
    attendees,
    status: 'confirmed',
    qrCode: `https://pearcomputer.com/events/checkin/${eventId}/${Math.random().toString(36).substr(2, 12)}`,
    createdAt: new Date().toISOString()
  };

  // Update event spots
  event.spotsRemaining -= attendees;

  eventRegistrations.set(registration.id, registration);
  return registration;
}

// ============ INVENTORY ============

function getStoreInventory(storeId, { productId, sku }) {
  const inventory = storeInventory.get(storeId);
  if (!inventory) return null;

  let items = [...inventory];

  if (productId) {
    items = items.filter(item => item.productId === productId);
  }

  if (sku) {
    items = items.filter(item => item.sku === sku);
  }

  return {
    storeId,
    items: items.map(item => ({
      productId: item.productId,
      sku: item.sku,
      name: item.name,
      availability: item.quantity > 5 ? 'in_stock' : item.quantity > 0 ? 'low_stock' : 'out_of_stock',
      quantity: item.quantity,
      pickupAvailable: item.quantity > 0,
      pickupReadyTime: item.quantity > 0 ? 'Today, within 2 hours' : null
    }))
  };
}

function checkPickupAvailability({ items, storeIds, latitude, longitude, radius = 50 }) {
  let targetStores = stores;

  // Filter by specific store IDs
  if (storeIds && storeIds.length > 0) {
    targetStores = stores.filter(s => storeIds.includes(s.id));
  }

  // Filter by location
  if (latitude && longitude) {
    targetStores = targetStores.filter(store => {
      const distance = calculateDistance(latitude, longitude, store.coordinates.latitude, store.coordinates.longitude);
      store._distance = distance;
      return distance <= radius;
    }).sort((a, b) => a._distance - b._distance);
  }

  const result = targetStores.map(store => {
    const inventory = storeInventory.get(store.id) || [];
    const itemAvailability = items.map(requestedItem => {
      const inventoryItem = inventory.find(i => i.sku === requestedItem.sku);
      const available = inventoryItem && inventoryItem.quantity >= requestedItem.quantity;
      return {
        sku: requestedItem.sku,
        available,
        quantity: available ? requestedItem.quantity : (inventoryItem?.quantity || 0)
      };
    });

    const allAvailable = itemAvailability.every(item => item.available);

    return {
      store: {
        id: store.id,
        name: store.name,
        distance: store._distance ? Math.round(store._distance * 10) / 10 : null
      },
      allItemsAvailable: allAvailable,
      items: itemAvailability,
      pickupReadyTime: allAvailable ? new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() : null
    };
  });

  return { stores: result };
}

function reserveForPickup({ storeId, items, orderId }) {
  const store = stores.find(s => s.id === storeId);
  if (!store) {
    throw { status: 400, message: `Store not found: ${storeId}` };
  }

  const inventory = storeInventory.get(storeId) || [];
  const reservedItems = [];

  // Check and reserve items
  for (const requestedItem of items) {
    const inventoryItem = inventory.find(i => i.sku === requestedItem.sku);
    if (!inventoryItem || inventoryItem.quantity < requestedItem.quantity) {
      throw { status: 409, message: `Insufficient inventory for ${requestedItem.sku}` };
    }

    // Reserve the item
    inventoryItem.quantity -= requestedItem.quantity;
    reservedItems.push({
      sku: requestedItem.sku,
      name: inventoryItem.name,
      quantity: requestedItem.quantity
    });
  }

  const reservation = {
    reservationId: generateId('PICKUP'),
    storeId,
    storeName: store.name,
    items: reservedItems,
    status: 'reserved',
    pickupReadyTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    pickupInstructions: `Visit the pickup counter at ${store.name}. Present your confirmation code or QR code to collect your items.`
  };

  pickupReservations.set(reservation.reservationId, reservation);
  return reservation;
}

module.exports = {
  // Stores
  listStores,
  getStore,
  getStoreHours,

  // Appointments
  listAppointments,
  createAppointment,
  getAppointment,
  updateAppointment,
  cancelAppointment,
  getAppointmentAvailability,

  // Services
  listServices,
  getServicePricing,

  // Events
  listEvents,
  getEvent,
  registerForEvent,

  // Inventory
  getStoreInventory,
  checkPickupAvailability,
  reserveForPickup
};
