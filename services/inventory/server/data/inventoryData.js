/**
 * Data access module for inventory data
 * Loads and provides access to inventory.json
 */

const path = require('path');
const fs = require('fs');

// Load inventory data
const inventoryPath = path.join(__dirname, '..', '..', 'data', 'inventory.json');
const inventoryData = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));

// In-memory stores for runtime data (transfers, reservations, alerts)
const transfers = [];
const reservations = new Map();
const alerts = [];
const stockMovements = [];

// Generate some sample alerts based on stock levels
function generateAlerts() {
  const generatedAlerts = [];
  inventoryData.stockLevels.forEach(stock => {
    const totalAvailable = stock.locations.reduce((sum, loc) => sum + loc.available, 0);
    const totalOnHand = stock.locations.reduce((sum, loc) => sum + loc.quantity, 0);

    if (stock.status === 'low_stock' || totalAvailable < stock.reorderPoint) {
      generatedAlerts.push({
        id: `ALT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: totalAvailable === 0 ? 'out_of_stock' : 'low_stock',
        severity: totalAvailable === 0 ? 'critical' : 'high',
        sku: stock.sku,
        productName: stock.productName,
        locationId: 'ALL',
        locationName: 'All Locations',
        message: totalAvailable === 0
          ? `${stock.productName} (${stock.sku}) is out of stock`
          : `${stock.productName} (${stock.sku}) is below reorder point (${totalAvailable} available, reorder at ${stock.reorderPoint})`,
        currentQuantity: totalAvailable,
        threshold: stock.reorderPoint,
        acknowledged: false,
        acknowledgedBy: null,
        acknowledgedAt: null,
        createdAt: new Date().toISOString()
      });
    }
  });
  return generatedAlerts;
}

// Initialize alerts
alerts.push(...generateAlerts());

// Helper to get warehouse/location by ID
function getWarehouseById(locationId) {
  return inventoryData.warehouses.find(w => w.id === locationId);
}

// Get all warehouses/locations
function getAllLocations() {
  return inventoryData.warehouses.map(w => ({
    id: w.id,
    name: w.name,
    type: w.type,
    code: w.code,
    address: {
      street1: w.address.street,
      street2: null,
      city: w.address.city,
      state: w.address.state,
      postalCode: w.address.zip,
      country: w.address.country
    },
    region: w.address.state,
    timezone: 'America/Los_Angeles',
    active: w.active,
    capabilities: ['shipping', 'receiving'],
    operatingHours: {
      monday: '6:00 AM - 10:00 PM',
      tuesday: '6:00 AM - 10:00 PM',
      wednesday: '6:00 AM - 10:00 PM',
      thursday: '6:00 AM - 10:00 PM',
      friday: '6:00 AM - 10:00 PM',
      saturday: '8:00 AM - 6:00 PM',
      sunday: 'Closed'
    },
    contactEmail: `${w.code.toLowerCase()}@pearcomputer.com`,
    contactPhone: '+1-800-PEAR-NOW'
  }));
}

// Get all stock levels (flattened by location)
function getAllStockLevels() {
  const stockLevels = [];
  inventoryData.stockLevels.forEach(stock => {
    stock.locations.forEach(loc => {
      const warehouse = getWarehouseById(loc.locationId);
      stockLevels.push({
        sku: stock.sku,
        productId: stock.productId,
        productName: stock.productName,
        locationId: loc.locationId,
        locationName: warehouse ? warehouse.name : loc.locationId,
        quantityOnHand: loc.quantity,
        quantityReserved: loc.reserved,
        quantityAvailable: loc.available,
        quantityOnOrder: 0,
        reorderPoint: stock.reorderPoint,
        reorderQuantity: stock.reorderQuantity,
        lastReceived: null,
        lastSold: null,
        updatedAt: new Date().toISOString()
      });
    });
  });
  return stockLevels;
}

// Get stock by SKU
function getStockBySku(sku) {
  const stock = inventoryData.stockLevels.find(s => s.sku === sku);
  if (!stock) return null;

  const totalOnHand = stock.locations.reduce((sum, loc) => sum + loc.quantity, 0);
  const totalReserved = stock.locations.reduce((sum, loc) => sum + loc.reserved, 0);
  const totalAvailable = stock.locations.reduce((sum, loc) => sum + loc.available, 0);

  return {
    sku: stock.sku,
    productId: stock.productId,
    productName: stock.productName,
    totalOnHand,
    totalReserved,
    totalAvailable,
    locations: stock.locations.map(loc => {
      const warehouse = getWarehouseById(loc.locationId);
      return {
        sku: stock.sku,
        productId: stock.productId,
        productName: stock.productName,
        locationId: loc.locationId,
        locationName: warehouse ? warehouse.name : loc.locationId,
        quantityOnHand: loc.quantity,
        quantityReserved: loc.reserved,
        quantityAvailable: loc.available,
        quantityOnOrder: 0,
        reorderPoint: stock.reorderPoint,
        reorderQuantity: stock.reorderQuantity,
        lastReceived: null,
        lastSold: null,
        updatedAt: new Date().toISOString()
      };
    })
  };
}

// Get stock at specific location
function getStockAtLocation(sku, locationId) {
  const stock = inventoryData.stockLevels.find(s => s.sku === sku);
  if (!stock) return null;

  const locationStock = stock.locations.find(l => l.locationId === locationId);
  if (!locationStock) return null;

  const warehouse = getWarehouseById(locationId);
  return {
    sku: stock.sku,
    productId: stock.productId,
    productName: stock.productName,
    locationId: locationStock.locationId,
    locationName: warehouse ? warehouse.name : locationId,
    quantityOnHand: locationStock.quantity,
    quantityReserved: locationStock.reserved,
    quantityAvailable: locationStock.available,
    quantityOnOrder: 0,
    reorderPoint: stock.reorderPoint,
    reorderQuantity: stock.reorderQuantity,
    lastReceived: null,
    lastSold: null,
    updatedAt: new Date().toISOString()
  };
}

// Update stock at location
function updateStockAtLocation(sku, locationId, quantity, reason) {
  const stock = inventoryData.stockLevels.find(s => s.sku === sku);
  if (!stock) return null;

  const locationStock = stock.locations.find(l => l.locationId === locationId);
  if (!locationStock) return null;

  const previousQuantity = locationStock.quantity;
  locationStock.quantity = quantity;
  locationStock.available = quantity - locationStock.reserved;

  // Record movement
  stockMovements.push({
    id: `MOV-${Date.now()}`,
    sku,
    locationId,
    type: 'adjustment',
    quantity: quantity - previousQuantity,
    reference: reason,
    timestamp: new Date().toISOString(),
    performedBy: 'system'
  });

  return getStockAtLocation(sku, locationId);
}

// Adjust stock
function adjustStock(sku, locationId, adjustment, reason, notes, referenceNumber) {
  const stock = inventoryData.stockLevels.find(s => s.sku === sku);
  if (!stock) return null;

  const locationStock = stock.locations.find(l => l.locationId === locationId);
  if (!locationStock) return null;

  const previousQuantity = locationStock.quantity;
  const newQuantity = previousQuantity + adjustment;

  if (newQuantity < 0) return null;

  locationStock.quantity = newQuantity;
  locationStock.available = newQuantity - locationStock.reserved;

  const adjustmentRecord = {
    adjustmentId: `ADJ-${Date.now()}`,
    sku,
    locationId,
    previousQuantity,
    adjustment,
    newQuantity,
    reason,
    notes,
    referenceNumber,
    adjustedAt: new Date().toISOString(),
    adjustedBy: 'system'
  };

  // Record movement
  stockMovements.push({
    id: `MOV-${Date.now()}`,
    sku,
    locationId,
    type: 'adjustment',
    quantity: adjustment,
    reference: referenceNumber || reason,
    timestamp: new Date().toISOString(),
    performedBy: 'system'
  });

  return adjustmentRecord;
}

// Reserve stock
function reserveStock(orderId, items, expiresAt) {
  const reservedItems = [];
  const insufficientItems = [];

  // Check availability for all items first
  for (const item of items) {
    const stock = getStockBySku(item.sku);
    if (!stock || stock.totalAvailable < item.quantity) {
      insufficientItems.push({
        sku: item.sku,
        requested: item.quantity,
        available: stock ? stock.totalAvailable : 0
      });
    }
  }

  if (insufficientItems.length > 0) {
    return { error: 'INSUFFICIENT_STOCK', items: insufficientItems };
  }

  // Make reservations
  for (const item of items) {
    const stock = inventoryData.stockLevels.find(s => s.sku === item.sku);
    let remainingToReserve = item.quantity;

    // Prefer specific location if specified
    const locations = item.preferredLocationId
      ? [stock.locations.find(l => l.locationId === item.preferredLocationId), ...stock.locations.filter(l => l.locationId !== item.preferredLocationId)]
      : stock.locations;

    for (const loc of locations) {
      if (!loc || remainingToReserve <= 0) continue;

      const toReserve = Math.min(remainingToReserve, loc.available);
      if (toReserve > 0) {
        loc.reserved += toReserve;
        loc.available -= toReserve;
        remainingToReserve -= toReserve;

        reservedItems.push({
          sku: item.sku,
          quantity: toReserve,
          locationId: loc.locationId
        });
      }
    }
  }

  const reservation = {
    reservationId: `RES-${Date.now()}`,
    orderId,
    status: 'active',
    items: reservedItems,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };

  reservations.set(reservation.reservationId, reservation);
  return reservation;
}

// Cancel reservation
function cancelReservation(reservationId) {
  const reservation = reservations.get(reservationId);
  if (!reservation) return null;

  // Release reserved stock
  for (const item of reservation.items) {
    const stock = inventoryData.stockLevels.find(s => s.sku === item.sku);
    if (stock) {
      const loc = stock.locations.find(l => l.locationId === item.locationId);
      if (loc) {
        loc.reserved -= item.quantity;
        loc.available += item.quantity;
      }
    }
  }

  reservation.status = 'cancelled';
  return true;
}

// Get transfers
function getTransfers() {
  return transfers;
}

// Create transfer
function createTransfer(fromLocationId, toLocationId, items, priority, notes, requestedDeliveryDate) {
  const fromWarehouse = getWarehouseById(fromLocationId);
  const toWarehouse = getWarehouseById(toLocationId);

  if (!fromWarehouse || !toWarehouse) return null;

  const transfer = {
    id: `TRF-${Date.now()}`,
    fromLocationId,
    fromLocationName: fromWarehouse.name,
    toLocationId,
    toLocationName: toWarehouse.name,
    status: 'pending',
    items: items.map(item => {
      const stock = inventoryData.stockLevels.find(s => s.sku === item.sku);
      return {
        sku: item.sku,
        productName: stock ? stock.productName : item.sku,
        quantity: item.quantity,
        receivedQuantity: null
      };
    }),
    priority: priority || 'normal',
    notes,
    requestedBy: 'system',
    approvedBy: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    expectedArrival: requestedDeliveryDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
  };

  transfers.push(transfer);
  return transfer;
}

// Get transfer by ID
function getTransferById(transferId) {
  return transfers.find(t => t.id === transferId);
}

// Update transfer status
function updateTransferStatus(transferId, status, notes) {
  const transfer = transfers.find(t => t.id === transferId);
  if (!transfer) return null;

  transfer.status = status;
  if (notes) transfer.notes = notes;
  transfer.updatedAt = new Date().toISOString();

  if (status === 'approved') {
    transfer.approvedBy = 'system';
  }

  return transfer;
}

// Get alerts
function getAlerts() {
  return alerts;
}

// Acknowledge alert
function acknowledgeAlert(alertId) {
  const alert = alerts.find(a => a.id === alertId);
  if (!alert) return null;

  alert.acknowledged = true;
  alert.acknowledgedBy = 'system';
  alert.acknowledgedAt = new Date().toISOString();
  return alert;
}

// Get stock movements
function getStockMovements() {
  return stockMovements;
}

// Get stock summary
function getStockSummary(groupBy) {
  const allStock = getAllStockLevels();
  const summary = {};

  allStock.forEach(stock => {
    let key;
    if (groupBy === 'location') {
      key = stock.locationId;
    } else if (groupBy === 'region') {
      const warehouse = getWarehouseById(stock.locationId);
      key = warehouse ? warehouse.address.state : 'Unknown';
    } else {
      // Default: group by product
      key = stock.productId;
    }

    if (!summary[key]) {
      summary[key] = { skuCount: 0, unitCount: 0, value: 0, skus: new Set() };
    }

    if (!summary[key].skus.has(stock.sku)) {
      summary[key].skuCount++;
      summary[key].skus.add(stock.sku);
    }
    summary[key].unitCount += stock.quantityOnHand;
    summary[key].value += stock.quantityOnHand * 100; // Placeholder value
  });

  return {
    generatedAt: new Date().toISOString(),
    totalSkus: new Set(allStock.map(s => s.sku)).size,
    totalUnits: allStock.reduce((sum, s) => sum + s.quantityOnHand, 0),
    totalValue: allStock.reduce((sum, s) => sum + s.quantityOnHand * 100, 0),
    summary: Object.entries(summary).map(([key, data]) => ({
      groupKey: key,
      skuCount: data.skuCount,
      unitCount: data.unitCount,
      value: data.value
    }))
  };
}

module.exports = {
  getAllLocations,
  getWarehouseById,
  getAllStockLevels,
  getStockBySku,
  getStockAtLocation,
  updateStockAtLocation,
  adjustStock,
  reserveStock,
  cancelReservation,
  getTransfers,
  createTransfer,
  getTransferById,
  updateTransferStatus,
  getAlerts,
  acknowledgeAlert,
  getStockMovements,
  getStockSummary,
  reservations
};
