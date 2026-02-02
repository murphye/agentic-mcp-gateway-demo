/**
 * Pear Computer Customer Accounts Service - Mock Data Module
 * Sample data aligned with Payments and Order-Management services
 */

const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

// In-memory storage
const users = new Map();
const addresses = new Map();
const devices = new Map();
const preferences = new Map();
const familyGroups = new Map();
const familyInvitations = new Map();

// Initialize sample data aligned with payments and orders services
const initSampleData = () => {
  // ==================== USER PROFILES ====================

  // cust-001: John Smith (San Francisco) - Active Pear One Premium subscriber
  const user1 = {
    id: 'cust-001',
    pearId: 'john.smith@email.com',
    firstName: 'John',
    lastName: 'Smith',
    displayName: 'John Smith',
    email: 'john.smith@email.com',
    emailVerified: true,
    phoneNumber: '+1-415-555-0123',
    phoneVerified: true,
    photoUrl: 'https://assets.pearcomputer.com/avatars/cust-001.jpg',
    dateOfBirth: '1985-03-15',
    locale: 'en-US',
    timezone: 'America/Los_Angeles',
    createdAt: '2020-06-15T10:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  };

  // cust-002: Emily Chen (Los Angeles) - Pear Music subscriber
  const user2 = {
    id: 'cust-002',
    pearId: 'emily.chen@email.com',
    firstName: 'Emily',
    lastName: 'Chen',
    displayName: 'Emily Chen',
    email: 'emily.chen@email.com',
    emailVerified: true,
    phoneNumber: '+1-310-555-0456',
    phoneVerified: true,
    photoUrl: 'https://assets.pearcomputer.com/avatars/cust-002.jpg',
    dateOfBirth: '1992-07-22',
    locale: 'en-US',
    timezone: 'America/Los_Angeles',
    createdAt: '2021-03-10T14:00:00Z',
    updatedAt: '2024-01-16T14:20:00Z'
  };

  // cust-003: Marcus Johnson (Chicago) - PearCare+ subscriber
  const user3 = {
    id: 'cust-003',
    pearId: 'marcus.johnson@email.com',
    firstName: 'Marcus',
    lastName: 'Johnson',
    displayName: 'Marcus Johnson',
    email: 'marcus.johnson@email.com',
    emailVerified: true,
    phoneNumber: '+1-312-555-0789',
    phoneVerified: true,
    photoUrl: 'https://assets.pearcomputer.com/avatars/cust-003.jpg',
    dateOfBirth: '1988-11-30',
    locale: 'en-US',
    timezone: 'America/Chicago',
    createdAt: '2022-01-05T09:00:00Z',
    updatedAt: '2024-01-20T09:15:00Z'
  };

  // cust-004: Sarah Williams (Seattle) - Pear Fitness+ subscriber
  const user4 = {
    id: 'cust-004',
    pearId: 'sarah.williams@email.com',
    firstName: 'Sarah',
    lastName: 'Williams',
    displayName: 'Sarah Williams',
    email: 'sarah.williams@email.com',
    emailVerified: true,
    phoneNumber: '+1-206-555-0321',
    phoneVerified: true,
    photoUrl: 'https://assets.pearcomputer.com/avatars/cust-004.jpg',
    dateOfBirth: '1995-04-18',
    locale: 'en-US',
    timezone: 'America/Los_Angeles',
    createdAt: '2022-06-20T16:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z'
  };

  // cust-005: David Park (Austin) - Retail store customer
  const user5 = {
    id: 'cust-005',
    pearId: 'david.park@email.com',
    firstName: 'David',
    lastName: 'Park',
    displayName: 'David Park',
    email: 'david.park@email.com',
    emailVerified: true,
    phoneNumber: '+1-512-555-0567',
    phoneVerified: false,
    photoUrl: null,
    dateOfBirth: '1990-09-05',
    locale: 'en-US',
    timezone: 'America/Chicago',
    createdAt: '2023-02-14T12:00:00Z',
    updatedAt: '2024-01-19T14:30:00Z'
  };

  // cust-006: Amanda Rodriguez (Miami) - Family organizer
  const user6 = {
    id: 'cust-006',
    pearId: 'amanda.rodriguez@email.com',
    firstName: 'Amanda',
    lastName: 'Rodriguez',
    displayName: 'Amanda Rodriguez',
    email: 'amanda.rodriguez@email.com',
    emailVerified: true,
    phoneNumber: '+1-305-555-0890',
    phoneVerified: true,
    photoUrl: 'https://assets.pearcomputer.com/avatars/cust-006.jpg',
    dateOfBirth: '1987-12-03',
    locale: 'en-US',
    timezone: 'America/New_York',
    createdAt: '2021-08-30T11:00:00Z',
    updatedAt: '2024-01-22T11:00:00Z'
  };

  // cust-007: Michael Thompson (Denver) - Return customer
  const user7 = {
    id: 'cust-007',
    pearId: 'michael.thompson@email.com',
    firstName: 'Michael',
    lastName: 'Thompson',
    displayName: 'Michael Thompson',
    email: 'michael.thompson@email.com',
    emailVerified: true,
    phoneNumber: '+1-303-555-0234',
    phoneVerified: true,
    photoUrl: null,
    dateOfBirth: '1983-06-25',
    locale: 'en-US',
    timezone: 'America/Denver',
    createdAt: '2023-05-10T15:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  };

  // cust-008: Jennifer Lee (Boston) - Pear TV+ subscriber
  const user8 = {
    id: 'cust-008',
    pearId: 'jennifer.lee@email.com',
    firstName: 'Jennifer',
    lastName: 'Lee',
    displayName: 'Jennifer Lee',
    email: 'jennifer.lee@email.com',
    emailVerified: true,
    phoneNumber: '+1-617-555-0456',
    phoneVerified: true,
    photoUrl: 'https://assets.pearcomputer.com/avatars/cust-008.jpg',
    dateOfBirth: '1991-02-14',
    locale: 'en-US',
    timezone: 'America/New_York',
    createdAt: '2022-11-25T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z'
  };

  // cust-009: Robert Martinez (Phoenix) - New customer
  const user9 = {
    id: 'cust-009',
    pearId: 'robert.martinez@email.com',
    firstName: 'Robert',
    lastName: 'Martinez',
    displayName: 'Robert Martinez',
    email: 'robert.martinez@email.com',
    emailVerified: true,
    phoneNumber: '+1-602-555-0678',
    phoneVerified: false,
    photoUrl: null,
    dateOfBirth: '1979-08-12',
    locale: 'en-US',
    timezone: 'America/Phoenix',
    createdAt: '2024-01-26T08:00:00Z',
    updatedAt: '2024-01-26T08:00:00Z'
  };

  users.set(user1.id, user1);
  users.set(user2.id, user2);
  users.set(user3.id, user3);
  users.set(user4.id, user4);
  users.set(user5.id, user5);
  users.set(user6.id, user6);
  users.set(user7.id, user7);
  users.set(user8.id, user8);
  users.set(user9.id, user9);

  // ==================== ADDRESSES ====================

  // John Smith addresses
  const addr1 = {
    id: 'addr-001',
    userId: 'cust-001',
    label: 'Home',
    firstName: 'John',
    lastName: 'Smith',
    company: null,
    street1: '123 Main St',
    street2: 'Apt 4B',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94102',
    country: 'US',
    phone: '+1-415-555-0123',
    isDefaultShipping: true,
    isDefaultBilling: true,
    validated: true,
    createdAt: '2020-06-15T10:00:00Z',
    updatedAt: '2020-06-15T10:00:00Z'
  };

  const addr2 = {
    id: 'addr-002',
    userId: 'cust-001',
    label: 'Work',
    firstName: 'John',
    lastName: 'Smith',
    company: 'Tech Innovations Inc',
    street1: '500 Market St',
    street2: 'Floor 12',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94105',
    country: 'US',
    phone: '+1-415-555-9999',
    isDefaultShipping: false,
    isDefaultBilling: false,
    validated: true,
    createdAt: '2021-02-10T09:00:00Z',
    updatedAt: '2021-02-10T09:00:00Z'
  };

  // Emily Chen address
  const addr3 = {
    id: 'addr-003',
    userId: 'cust-002',
    label: 'Home',
    firstName: 'Emily',
    lastName: 'Chen',
    company: null,
    street1: '456 Sunset Blvd',
    street2: null,
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90028',
    country: 'US',
    phone: '+1-310-555-0456',
    isDefaultShipping: true,
    isDefaultBilling: true,
    validated: true,
    createdAt: '2021-03-10T14:00:00Z',
    updatedAt: '2021-03-10T14:00:00Z'
  };

  // Marcus Johnson address
  const addr4 = {
    id: 'addr-004',
    userId: 'cust-003',
    label: 'Home',
    firstName: 'Marcus',
    lastName: 'Johnson',
    company: null,
    street1: '789 Michigan Ave',
    street2: 'Unit 2201',
    city: 'Chicago',
    state: 'IL',
    postalCode: '60611',
    country: 'US',
    phone: '+1-312-555-0789',
    isDefaultShipping: true,
    isDefaultBilling: true,
    validated: true,
    createdAt: '2022-01-05T09:00:00Z',
    updatedAt: '2022-01-05T09:00:00Z'
  };

  // Sarah Williams address
  const addr5 = {
    id: 'addr-005',
    userId: 'cust-004',
    label: 'Home',
    firstName: 'Sarah',
    lastName: 'Williams',
    company: null,
    street1: '321 Pike St',
    street2: 'Apt 15C',
    city: 'Seattle',
    state: 'WA',
    postalCode: '98101',
    country: 'US',
    phone: '+1-206-555-0321',
    isDefaultShipping: true,
    isDefaultBilling: true,
    validated: true,
    createdAt: '2022-06-20T16:00:00Z',
    updatedAt: '2022-06-20T16:00:00Z'
  };

  // David Park address
  const addr6 = {
    id: 'addr-006',
    userId: 'cust-005',
    label: 'Home',
    firstName: 'David',
    lastName: 'Park',
    company: null,
    street1: '567 Congress Ave',
    street2: null,
    city: 'Austin',
    state: 'TX',
    postalCode: '78701',
    country: 'US',
    phone: '+1-512-555-0567',
    isDefaultShipping: true,
    isDefaultBilling: true,
    validated: true,
    createdAt: '2023-02-14T12:00:00Z',
    updatedAt: '2023-02-14T12:00:00Z'
  };

  // Amanda Rodriguez address
  const addr7 = {
    id: 'addr-007',
    userId: 'cust-006',
    label: 'Home',
    firstName: 'Amanda',
    lastName: 'Rodriguez',
    company: null,
    street1: '890 Ocean Drive',
    street2: 'Penthouse A',
    city: 'Miami',
    state: 'FL',
    postalCode: '33139',
    country: 'US',
    phone: '+1-305-555-0890',
    isDefaultShipping: true,
    isDefaultBilling: true,
    validated: true,
    createdAt: '2021-08-30T11:00:00Z',
    updatedAt: '2021-08-30T11:00:00Z'
  };

  // Michael Thompson address
  const addr8 = {
    id: 'addr-008',
    userId: 'cust-007',
    label: 'Home',
    firstName: 'Michael',
    lastName: 'Thompson',
    company: null,
    street1: '234 16th St Mall',
    street2: 'Suite 500',
    city: 'Denver',
    state: 'CO',
    postalCode: '80202',
    country: 'US',
    phone: '+1-303-555-0234',
    isDefaultShipping: true,
    isDefaultBilling: true,
    validated: true,
    createdAt: '2023-05-10T15:00:00Z',
    updatedAt: '2023-05-10T15:00:00Z'
  };

  // Jennifer Lee address
  const addr9 = {
    id: 'addr-009',
    userId: 'cust-008',
    label: 'Home',
    firstName: 'Jennifer',
    lastName: 'Lee',
    company: null,
    street1: '456 Newbury St',
    street2: null,
    city: 'Boston',
    state: 'MA',
    postalCode: '02116',
    country: 'US',
    phone: '+1-617-555-0456',
    isDefaultShipping: true,
    isDefaultBilling: true,
    validated: true,
    createdAt: '2022-11-25T10:00:00Z',
    updatedAt: '2022-11-25T10:00:00Z'
  };

  // Robert Martinez address
  const addr10 = {
    id: 'addr-010',
    userId: 'cust-009',
    label: 'Home',
    firstName: 'Robert',
    lastName: 'Martinez',
    company: null,
    street1: '678 Camelback Rd',
    street2: null,
    city: 'Phoenix',
    state: 'AZ',
    postalCode: '85016',
    country: 'US',
    phone: '+1-602-555-0678',
    isDefaultShipping: true,
    isDefaultBilling: true,
    validated: true,
    createdAt: '2024-01-26T08:00:00Z',
    updatedAt: '2024-01-26T08:00:00Z'
  };

  addresses.set(addr1.id, addr1);
  addresses.set(addr2.id, addr2);
  addresses.set(addr3.id, addr3);
  addresses.set(addr4.id, addr4);
  addresses.set(addr5.id, addr5);
  addresses.set(addr6.id, addr6);
  addresses.set(addr7.id, addr7);
  addresses.set(addr8.id, addr8);
  addresses.set(addr9.id, addr9);
  addresses.set(addr10.id, addr10);

  // ==================== DEVICES ====================

  // John Smith devices (matches order items)
  const device1 = {
    id: 'dev-001',
    userId: 'cust-001',
    name: "John's PearPhone 16 Pro",
    type: 'pearphone',
    model: 'PearPhone 16 Pro',
    serialNumber: 'PEAR-PPH16-2024-001234',
    osVersion: 'PearOS 18.2.1',
    registeredAt: '2024-01-17T14:30:00Z',
    lastSeen: '2024-01-26T10:00:00Z',
    lastLocation: {
      latitude: 37.7749,
      longitude: -122.4194,
      accuracy: 10,
      address: '123 Main St, San Francisco, CA 94102',
      timestamp: '2024-01-26T10:00:00Z'
    },
    findMyEnabled: true,
    activationLockEnabled: true,
    lostMode: false,
    batteryLevel: 87
  };

  const device2 = {
    id: 'dev-002',
    userId: 'cust-001',
    name: "John's PearPods Pro 2",
    type: 'pearpods',
    model: 'PearPods Pro 2',
    serialNumber: 'PEAR-PPP2-2024-005678',
    osVersion: '6.2',
    registeredAt: '2024-01-21T18:00:00Z',
    lastSeen: '2024-01-26T09:30:00Z',
    lastLocation: null,
    findMyEnabled: true,
    activationLockEnabled: false,
    lostMode: false,
    batteryLevel: 92
  };

  // Emily Chen device
  const device3 = {
    id: 'dev-003',
    userId: 'cust-002',
    name: "Emily's PearBook Pro",
    type: 'pearbook',
    model: 'PearBook Pro 16"',
    serialNumber: 'PEAR-MBP16-2024-PENDING',
    osVersion: 'pearOS Sonoma 14.3',
    registeredAt: '2024-01-16T14:20:00Z',
    lastSeen: '2024-01-26T08:00:00Z',
    lastLocation: {
      latitude: 34.0522,
      longitude: -118.2437,
      accuracy: 15,
      address: '456 Sunset Blvd, Los Angeles, CA 90028',
      timestamp: '2024-01-26T08:00:00Z'
    },
    findMyEnabled: true,
    activationLockEnabled: true,
    lostMode: false,
    batteryLevel: 65
  };

  // Marcus Johnson device
  const device4 = {
    id: 'dev-004',
    userId: 'cust-003',
    name: "Marcus's PearBook Pro 14\"",
    type: 'pearbook',
    model: 'PearBook Pro 14" M3 Max',
    serialNumber: 'PEAR-MBP14-2024-M3MAX-001',
    osVersion: 'pearOS Sonoma 14.3',
    registeredAt: '2024-01-22T15:45:00Z',
    lastSeen: '2024-01-26T11:00:00Z',
    lastLocation: {
      latitude: 41.8781,
      longitude: -87.6298,
      accuracy: 8,
      address: '789 Michigan Ave, Chicago, IL 60611',
      timestamp: '2024-01-26T11:00:00Z'
    },
    findMyEnabled: true,
    activationLockEnabled: true,
    lostMode: false,
    batteryLevel: 100
  };

  // Sarah Williams device
  const device5 = {
    id: 'dev-005',
    userId: 'cust-004',
    name: "Sarah's PearWatch",
    type: 'pearwatch',
    model: 'PearWatch Series 10 45mm',
    serialNumber: 'PEAR-PWS10-2024-002345',
    osVersion: 'watchOS 11.2',
    registeredAt: '2024-01-22T13:20:00Z',
    lastSeen: '2024-01-26T07:30:00Z',
    lastLocation: {
      latitude: 47.6062,
      longitude: -122.3321,
      accuracy: 5,
      address: '321 Pike St, Seattle, WA 98101',
      timestamp: '2024-01-26T07:30:00Z'
    },
    findMyEnabled: true,
    activationLockEnabled: true,
    lostMode: false,
    batteryLevel: 78
  };

  // David Park device
  const device6 = {
    id: 'dev-006',
    userId: 'cust-005',
    name: "David's PearPods Pro 3",
    type: 'pearpods',
    model: 'PearPods Pro 3 (USB-C)',
    serialNumber: 'PEAR-PPP3-2024-003456',
    osVersion: '7.0',
    registeredAt: '2024-01-19T15:00:00Z',
    lastSeen: '2024-01-25T18:00:00Z',
    lastLocation: null,
    findMyEnabled: true,
    activationLockEnabled: false,
    lostMode: false,
    batteryLevel: 45
  };

  // Amanda Rodriguez device
  const device7 = {
    id: 'dev-007',
    userId: 'cust-006',
    name: "Amanda's PearPad Pro",
    type: 'pearpad',
    model: 'PearPad Pro 11" M4',
    serialNumber: 'PEAR-PPM4-2024-004567',
    osVersion: 'padOS 18.2',
    registeredAt: '2024-01-25T10:00:00Z',
    lastSeen: '2024-01-26T12:00:00Z',
    lastLocation: {
      latitude: 25.7617,
      longitude: -80.1918,
      accuracy: 12,
      address: '890 Ocean Drive, Miami, FL 33139',
      timestamp: '2024-01-26T12:00:00Z'
    },
    findMyEnabled: true,
    activationLockEnabled: true,
    lostMode: false,
    batteryLevel: 54
  };

  // Jennifer Lee device
  const device8 = {
    id: 'dev-008',
    userId: 'cust-008',
    name: "Jennifer's PearPhone 16 Pro",
    type: 'pearphone',
    model: 'PearPhone 16 Pro',
    serialNumber: 'PEAR-PPH16-2024-PENDING2',
    osVersion: 'PearOS 18.2.1',
    registeredAt: '2024-01-25T10:00:00Z',
    lastSeen: '2024-01-26T09:00:00Z',
    lastLocation: {
      latitude: 42.3601,
      longitude: -71.0589,
      accuracy: 10,
      address: '456 Newbury St, Boston, MA 02116',
      timestamp: '2024-01-26T09:00:00Z'
    },
    findMyEnabled: true,
    activationLockEnabled: true,
    lostMode: false,
    batteryLevel: 91
  };

  devices.set(device1.id, device1);
  devices.set(device2.id, device2);
  devices.set(device3.id, device3);
  devices.set(device4.id, device4);
  devices.set(device5.id, device5);
  devices.set(device6.id, device6);
  devices.set(device7.id, device7);
  devices.set(device8.id, device8);

  // ==================== PREFERENCES ====================

  const defaultPrefs = {
    language: 'en',
    currency: 'USD',
    measurementSystem: 'imperial',
    notifications: {
      email: { marketing: false, orderUpdates: true, security: true, newsletters: false, productAnnouncements: false },
      push: { orderUpdates: true, promotions: false, reminders: true },
      sms: { orderUpdates: false, security: true }
    },
    privacy: { shareAnalytics: true, personalizedAds: false, shareWithPartners: false },
    accessibility: { reduceMotion: false, highContrast: false, fontSize: 'medium' }
  };

  const prefs1 = { ...defaultPrefs, userId: 'cust-001', notifications: { ...defaultPrefs.notifications, email: { ...defaultPrefs.notifications.email, productAnnouncements: true } } };
  const prefs2 = { ...defaultPrefs, userId: 'cust-002' };
  const prefs3 = { ...defaultPrefs, userId: 'cust-003', notifications: { ...defaultPrefs.notifications, email: { ...defaultPrefs.notifications.email, marketing: true } } };
  const prefs4 = { ...defaultPrefs, userId: 'cust-004', notifications: { ...defaultPrefs.notifications, push: { ...defaultPrefs.notifications.push, promotions: true } } };
  const prefs5 = { ...defaultPrefs, userId: 'cust-005' };
  const prefs6 = { ...defaultPrefs, userId: 'cust-006', notifications: { ...defaultPrefs.notifications, email: { ...defaultPrefs.notifications.email, newsletters: true } } };
  const prefs7 = { ...defaultPrefs, userId: 'cust-007' };
  const prefs8 = { ...defaultPrefs, userId: 'cust-008', privacy: { ...defaultPrefs.privacy, personalizedAds: true } };
  const prefs9 = { ...defaultPrefs, userId: 'cust-009' };

  preferences.set('cust-001', prefs1);
  preferences.set('cust-002', prefs2);
  preferences.set('cust-003', prefs3);
  preferences.set('cust-004', prefs4);
  preferences.set('cust-005', prefs5);
  preferences.set('cust-006', prefs6);
  preferences.set('cust-007', prefs7);
  preferences.set('cust-008', prefs8);
  preferences.set('cust-009', prefs9);

  // ==================== FAMILY GROUPS ====================

  // Amanda Rodriguez's family (matches Pear One Family subscription)
  const family1 = {
    id: 'fam-001',
    name: 'Rodriguez Family',
    organizer: {
      id: 'cust-006',
      name: 'Amanda Rodriguez',
      email: 'amanda.rodriguez@email.com',
      role: 'organizer',
      photoUrl: 'https://assets.pearcomputer.com/avatars/cust-006.jpg',
      joinedAt: '2024-01-22T11:00:00Z'
    },
    members: [
      {
        id: 'cust-006',
        name: 'Amanda Rodriguez',
        email: 'amanda.rodriguez@email.com',
        role: 'organizer',
        photoUrl: 'https://assets.pearcomputer.com/avatars/cust-006.jpg',
        joinedAt: '2024-01-22T11:00:00Z'
      },
      {
        id: 'fam-001-member-1',
        name: 'Carlos Rodriguez',
        email: 'carlos.rodriguez@email.com',
        role: 'adult',
        photoUrl: null,
        joinedAt: '2024-01-22T12:00:00Z'
      },
      {
        id: 'fam-001-member-2',
        name: 'Sofia Rodriguez',
        email: 'sofia.rodriguez@email.com',
        role: 'child',
        photoUrl: null,
        joinedAt: '2024-01-22T12:30:00Z'
      },
      {
        id: 'fam-001-member-3',
        name: 'Miguel Rodriguez',
        email: 'miguel.rodriguez@email.com',
        role: 'child',
        photoUrl: null,
        joinedAt: '2024-01-22T12:45:00Z'
      }
    ],
    sharedSubscriptions: [
      { name: 'Pear One Family', type: 'Pear One' },
      { name: 'Pear Music Family', type: 'Pear Music' },
      { name: 'Pear TV+', type: 'Pear TV+' },
      { name: 'Pear Arcade', type: 'Pear Arcade' }
    ],
    storageUsed: 85899345920,   // 80GB
    storageLimit: 214748364800, // 200GB
    createdAt: '2024-01-22T11:00:00Z'
  };

  familyGroups.set(family1.id, family1);
  // Map user to family
  familyGroups.set('user-cust-006', 'fam-001');

  // Sample pending invitation
  const invite1 = {
    id: 'inv-001',
    email: 'grandmother.rodriguez@email.com',
    role: 'adult',
    familyId: 'fam-001',
    familyName: 'Rodriguez Family',
    invitedBy: 'Amanda Rodriguez',
    status: 'pending',
    createdAt: '2024-01-25T10:00:00Z',
    expiresAt: '2024-02-25T10:00:00Z'
  };

  familyInvitations.set(invite1.id, invite1);
};

initSampleData();

// Current user context (simulated - in real app would come from JWT)
let currentUserId = 'cust-001';

const setCurrentUser = (userId) => {
  currentUserId = userId;
};

const getCurrentUser = () => currentUserId;

// ==================== PROFILE FUNCTIONS ====================

const getProfile = (userId = currentUserId) => users.get(userId) || null;

const updateProfile = (userId = currentUserId, updates) => {
  const user = users.get(userId);
  if (!user) return null;

  if (updates.firstName) user.firstName = updates.firstName;
  if (updates.lastName) user.lastName = updates.lastName;
  if (updates.displayName) user.displayName = updates.displayName;
  if (updates.phoneNumber) {
    user.phoneNumber = updates.phoneNumber;
    user.phoneVerified = false;
  }
  if (updates.dateOfBirth) user.dateOfBirth = updates.dateOfBirth;
  if (updates.locale) user.locale = updates.locale;
  if (updates.timezone) user.timezone = updates.timezone;
  user.updatedAt = new Date().toISOString();

  return user;
};

const uploadProfilePhoto = (userId = currentUserId) => {
  const user = users.get(userId);
  if (!user) return null;
  user.photoUrl = `https://assets.pearcomputer.com/avatars/${userId}.jpg`;
  user.updatedAt = new Date().toISOString();
  return { photoUrl: user.photoUrl };
};

const deleteProfilePhoto = (userId = currentUserId) => {
  const user = users.get(userId);
  if (!user) return false;
  user.photoUrl = null;
  user.updatedAt = new Date().toISOString();
  return true;
};

const requestEmailVerification = (userId = currentUserId) => {
  const user = users.get(userId);
  return user ? { sent: true } : null;
};

const requestPhoneVerification = (userId = currentUserId, phoneNumber) => {
  const user = users.get(userId);
  return user ? { sent: true, phoneNumber } : null;
};

const confirmPhoneVerification = (userId = currentUserId, code) => {
  const user = users.get(userId);
  if (!user) return null;
  if (code === '123456') {
    user.phoneVerified = true;
    user.updatedAt = new Date().toISOString();
    return { verified: true };
  }
  return { verified: false, error: 'Invalid code' };
};

// ==================== ADDRESS FUNCTIONS ====================

const listAddresses = (userId = currentUserId) => {
  return Array.from(addresses.values()).filter(a => a.userId === userId);
};

const getAddress = (addressId) => addresses.get(addressId) || null;

const createAddress = (userId = currentUserId, data) => {
  const id = generateId('addr');
  const now = new Date().toISOString();
  const address = {
    id,
    userId,
    label: data.label || 'Address',
    firstName: data.firstName,
    lastName: data.lastName,
    company: data.company || null,
    street1: data.street1,
    street2: data.street2 || null,
    city: data.city,
    state: data.state,
    postalCode: data.postalCode,
    country: data.country,
    phone: data.phone || null,
    isDefaultShipping: data.isDefaultShipping || false,
    isDefaultBilling: data.isDefaultBilling || false,
    validated: true,
    createdAt: now,
    updatedAt: now
  };

  // Clear other defaults if this is default
  if (address.isDefaultShipping) {
    listAddresses(userId).forEach(a => { a.isDefaultShipping = false; });
  }
  if (address.isDefaultBilling) {
    listAddresses(userId).forEach(a => { a.isDefaultBilling = false; });
  }

  addresses.set(id, address);
  return address;
};

const updateAddress = (addressId, data) => {
  const address = addresses.get(addressId);
  if (!address) return null;

  Object.keys(data).forEach(key => {
    if (data[key] !== undefined && key !== 'id' && key !== 'userId') {
      address[key] = data[key];
    }
  });
  address.updatedAt = new Date().toISOString();
  return address;
};

const deleteAddress = (addressId) => {
  return addresses.delete(addressId);
};

const setDefaultAddress = (addressId, { defaultShipping, defaultBilling }) => {
  const address = addresses.get(addressId);
  if (!address) return null;

  if (defaultShipping) {
    listAddresses(address.userId).forEach(a => { a.isDefaultShipping = false; });
    address.isDefaultShipping = true;
  }
  if (defaultBilling) {
    listAddresses(address.userId).forEach(a => { a.isDefaultBilling = false; });
    address.isDefaultBilling = true;
  }
  address.updatedAt = new Date().toISOString();
  return address;
};

// ==================== DEVICE FUNCTIONS ====================

const listDevices = (userId = currentUserId) => {
  return Array.from(devices.values()).filter(d => d.userId === userId);
};

const getDevice = (deviceId) => devices.get(deviceId) || null;

const updateDevice = (deviceId, data) => {
  const device = devices.get(deviceId);
  if (!device) return null;

  if (data.name) device.name = data.name;
  if (data.findMyEnabled !== undefined) device.findMyEnabled = data.findMyEnabled;

  return device;
};

const removeDevice = (deviceId) => {
  return devices.delete(deviceId);
};

const locateDevice = (deviceId) => {
  const device = devices.get(deviceId);
  if (!device) return null;
  return {
    lastLocation: device.lastLocation,
    locationPending: !device.lastLocation
  };
};

const playDeviceSound = (deviceId) => {
  const device = devices.get(deviceId);
  return device ? { sent: true } : null;
};

const enableLostMode = (deviceId, { message, contactPhone }) => {
  const device = devices.get(deviceId);
  if (!device) return null;
  device.lostMode = true;
  return { enabled: true, message, contactPhone };
};

const disableLostMode = (deviceId) => {
  const device = devices.get(deviceId);
  if (!device) return null;
  device.lostMode = false;
  return { disabled: true };
};

// ==================== PREFERENCES FUNCTIONS ====================

const getPreferences = (userId = currentUserId) => preferences.get(userId) || null;

const updatePreferences = (userId = currentUserId, updates) => {
  let prefs = preferences.get(userId);
  if (!prefs) {
    prefs = { userId };
  }

  const deepMerge = (target, source) => {
    Object.keys(source).forEach(key => {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        target[key] = target[key] || {};
        deepMerge(target[key], source[key]);
      } else if (source[key] !== undefined) {
        target[key] = source[key];
      }
    });
    return target;
  };

  deepMerge(prefs, updates);
  preferences.set(userId, prefs);
  return prefs;
};

const unsubscribeNotifications = (userId = currentUserId, channels) => {
  const prefs = preferences.get(userId);
  if (!prefs) return null;

  channels.forEach(channel => {
    if (channel === 'marketing_email' && prefs.notifications?.email) {
      prefs.notifications.email.marketing = false;
    }
    if (channel === 'newsletters' && prefs.notifications?.email) {
      prefs.notifications.email.newsletters = false;
    }
    if (channel === 'promotions_push' && prefs.notifications?.push) {
      prefs.notifications.push.promotions = false;
    }
    if (channel === 'sms_all' && prefs.notifications?.sms) {
      prefs.notifications.sms.orderUpdates = false;
    }
  });

  return { unsubscribed: channels };
};

// ==================== FAMILY FUNCTIONS ====================

const getFamilyGroup = (userId = currentUserId) => {
  const familyId = familyGroups.get(`user-${userId}`);
  if (!familyId) return null;
  return familyGroups.get(familyId) || null;
};

const createFamilyGroup = (userId = currentUserId, { name }) => {
  if (familyGroups.get(`user-${userId}`)) {
    return { error: true, message: 'Already in a family group' };
  }

  const user = users.get(userId);
  if (!user) return null;

  const id = generateId('fam');
  const now = new Date().toISOString();

  const family = {
    id,
    name: name || `${user.lastName} Family`,
    organizer: {
      id: userId,
      name: user.displayName,
      email: user.email,
      role: 'organizer',
      photoUrl: user.photoUrl,
      joinedAt: now
    },
    members: [{
      id: userId,
      name: user.displayName,
      email: user.email,
      role: 'organizer',
      photoUrl: user.photoUrl,
      joinedAt: now
    }],
    sharedSubscriptions: [],
    storageUsed: 0,
    storageLimit: 214748364800,
    createdAt: now
  };

  familyGroups.set(id, family);
  familyGroups.set(`user-${userId}`, id);
  return family;
};

const leaveFamilyGroup = (userId = currentUserId) => {
  const familyId = familyGroups.get(`user-${userId}`);
  if (!familyId) return { error: true, message: 'Not in a family group' };

  const family = familyGroups.get(familyId);
  if (family.organizer.id === userId) {
    return { error: true, message: 'Organizer cannot leave without transferring' };
  }

  family.members = family.members.filter(m => m.id !== userId);
  familyGroups.delete(`user-${userId}`);
  return { left: true };
};

const listFamilyInvitations = (userId = currentUserId) => {
  const user = users.get(userId);
  const familyId = familyGroups.get(`user-${userId}`);

  const sent = familyId ? Array.from(familyInvitations.values()).filter(i => i.familyId === familyId) : [];
  const received = user ? Array.from(familyInvitations.values()).filter(i => i.email === user.email && i.status === 'pending') : [];

  return { sent, received };
};

const inviteToFamily = (userId = currentUserId, { email, role = 'adult' }) => {
  const familyId = familyGroups.get(`user-${userId}`);
  if (!familyId) return { error: true, message: 'Not in a family group' };

  const family = familyGroups.get(familyId);
  if (family.organizer.id !== userId) {
    return { error: true, message: 'Only organizer can invite' };
  }

  if (family.members.length >= 6) {
    return { error: true, message: 'Family is full (max 6 members)' };
  }

  const user = users.get(userId);
  const id = generateId('inv');
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const invitation = {
    id,
    email,
    role,
    familyId,
    familyName: family.name,
    invitedBy: user.displayName,
    status: 'pending',
    createdAt: now,
    expiresAt
  };

  familyInvitations.set(id, invitation);
  return invitation;
};

const cancelFamilyInvitation = (invitationId) => {
  return familyInvitations.delete(invitationId);
};

const acceptFamilyInvitation = (userId = currentUserId, invitationId) => {
  const invitation = familyInvitations.get(invitationId);
  if (!invitation || invitation.status !== 'pending') return null;

  const user = users.get(userId);
  if (!user || user.email !== invitation.email) return null;

  if (familyGroups.get(`user-${userId}`)) {
    return { error: true, message: 'Already in a family group' };
  }

  const family = familyGroups.get(invitation.familyId);
  if (!family) return null;

  family.members.push({
    id: userId,
    name: user.displayName,
    email: user.email,
    role: invitation.role,
    photoUrl: user.photoUrl,
    joinedAt: new Date().toISOString()
  });

  familyGroups.set(`user-${userId}`, invitation.familyId);
  invitation.status = 'accepted';

  return family;
};

const declineFamilyInvitation = (invitationId) => {
  const invitation = familyInvitations.get(invitationId);
  if (!invitation) return false;
  invitation.status = 'declined';
  return true;
};

const removeFamilyMember = (userId = currentUserId, memberId) => {
  const familyId = familyGroups.get(`user-${userId}`);
  if (!familyId) return { error: true, message: 'Not in a family group' };

  const family = familyGroups.get(familyId);
  if (family.organizer.id !== userId) {
    return { error: true, message: 'Only organizer can remove members' };
  }

  if (memberId === userId) {
    return { error: true, message: 'Cannot remove yourself' };
  }

  family.members = family.members.filter(m => m.id !== memberId);
  familyGroups.delete(`user-${memberId}`);
  return { removed: true };
};

// ==================== INTERNAL FUNCTIONS ====================

const getUser = (userId) => users.get(userId) || null;

const getUserAddresses = (userId) => listAddresses(userId);

const lookupUsers = ({ emails, ids }) => {
  const results = [];

  if (emails) {
    const emailList = emails.split(',').map(e => e.trim());
    for (const user of users.values()) {
      if (emailList.includes(user.email)) {
        results.push(user);
      }
    }
  }

  if (ids) {
    const idList = ids.split(',').map(i => i.trim());
    for (const id of idList) {
      const user = users.get(id);
      if (user && !results.find(u => u.id === id)) {
        results.push(user);
      }
    }
  }

  return results;
};

module.exports = {
  // Context
  setCurrentUser,
  getCurrentUser,

  // Profile
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
  requestEmailVerification,
  requestPhoneVerification,
  confirmPhoneVerification,

  // Addresses
  listAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,

  // Devices
  listDevices,
  getDevice,
  updateDevice,
  removeDevice,
  locateDevice,
  playDeviceSound,
  enableLostMode,
  disableLostMode,

  // Preferences
  getPreferences,
  updatePreferences,
  unsubscribeNotifications,

  // Family
  getFamilyGroup,
  createFamilyGroup,
  leaveFamilyGroup,
  listFamilyInvitations,
  inviteToFamily,
  cancelFamilyInvitation,
  acceptFamilyInvitation,
  declineFamilyInvitation,
  removeFamilyMember,

  // Internal
  getUser,
  getUserAddresses,
  lookupUsers
};
