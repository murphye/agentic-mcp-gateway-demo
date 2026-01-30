/* eslint-disable no-unused-vars */
const Service = require('./Service');
const inventoryData = require('../data/inventoryData');

/**
 * Adjust stock (add/remove)
 * Adjust stock quantity with audit trail
 *
 * stockAdjustmentRequest StockAdjustmentRequest
 * returns StockAdjustmentResponse
 */
const adjustStock = ({ stockAdjustmentRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const { sku, locationId, adjustment, reason, notes, referenceNumber } = stockAdjustmentRequest;

      const result = inventoryData.adjustStock(sku, locationId, adjustment, reason, notes, referenceNumber);

      if (!result) {
        return reject(Service.rejectResponse(
          'SKU or location not found, or adjustment would result in negative stock',
          400
        ));
      }

      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 500
      ));
    }
  }
);

/**
 * Cancel stock reservation
 * Release reserved stock back to available inventory
 *
 * reservationId String
 * no response value expected for this operation
 */
const cancelReservation = ({ reservationId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = inventoryData.cancelReservation(reservationId);

      if (!result) {
        return reject(Service.rejectResponse(
          `Reservation not found: ${reservationId}`,
          404
        ));
      }

      resolve(Service.successResponse({ code: 204 }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 500
      ));
    }
  }
);

/**
 * Get stock at specific location
 * Retrieve stock level for a SKU at a specific location
 *
 * sku String
 * locationId String
 * returns StockLevel
 */
const getStockAtLocation = ({ sku, locationId }) => new Promise(
  async (resolve, reject) => {
    try {
      const stockLevel = inventoryData.getStockAtLocation(sku, locationId);

      if (!stockLevel) {
        return reject(Service.rejectResponse(
          `Stock not found for SKU ${sku} at location ${locationId}`,
          404
        ));
      }

      resolve(Service.successResponse(stockLevel));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 500
      ));
    }
  }
);

/**
 * Get stock for specific SKU
 * Retrieve stock levels across all locations for a specific SKU
 *
 * sku String
 * returns SkuStockDetail
 */
const getStockBySku = ({ sku }) => new Promise(
  async (resolve, reject) => {
    try {
      const stockDetail = inventoryData.getStockBySku(sku);

      if (!stockDetail) {
        return reject(Service.rejectResponse(
          `SKU not found: ${sku}`,
          404
        ));
      }

      resolve(Service.successResponse(stockDetail));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 500
      ));
    }
  }
);

/**
 * Get stock levels
 * Retrieve current stock levels with optional filters
 *
 * sku String Filter by SKU (supports wildcards) (optional)
 * locationId String Filter by location ID (optional)
 * locationType String Filter by location type (optional)
 * belowReorderPoint Boolean Only return items below reorder point (optional)
 * page Integer  (optional)
 * limit Integer  (optional)
 * returns StockLevelResponse
 */
const getStockLevels = ({ sku, locationId, locationType, belowReorderPoint, page = 1, limit = 50 }) => new Promise(
  async (resolve, reject) => {
    try {
      let stockLevels = inventoryData.getAllStockLevels();

      // Apply filters
      if (sku) {
        const skuPattern = sku.replace(/\*/g, '.*');
        const regex = new RegExp(`^${skuPattern}$`, 'i');
        stockLevels = stockLevels.filter(s => regex.test(s.sku));
      }

      if (locationId) {
        stockLevels = stockLevels.filter(s => s.locationId === locationId);
      }

      if (locationType) {
        const locations = inventoryData.getAllLocations();
        const locationIds = locations
          .filter(l => l.type === locationType)
          .map(l => l.id);
        stockLevels = stockLevels.filter(s => locationIds.includes(s.locationId));
      }

      if (belowReorderPoint) {
        stockLevels = stockLevels.filter(s => s.quantityAvailable < s.reorderPoint);
      }

      // Pagination
      const totalItems = stockLevels.length;
      const totalPages = Math.ceil(totalItems / limit);
      const startIndex = (page - 1) * limit;
      const paginatedItems = stockLevels.slice(startIndex, startIndex + limit);

      resolve(Service.successResponse({
        items: paginatedItems,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages
        }
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 500
      ));
    }
  }
);

/**
 * Reserve stock for order
 * Reserve inventory for a pending order
 *
 * stockReservationRequest StockReservationRequest
 * returns StockReservation
 */
const reserveStock = ({ stockReservationRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const { orderId, items, expiresAt } = stockReservationRequest;

      const result = inventoryData.reserveStock(orderId, items, expiresAt);

      if (result.error === 'INSUFFICIENT_STOCK') {
        return reject(Service.rejectResponse(
          {
            code: 'INSUFFICIENT_STOCK',
            message: 'Insufficient stock for one or more items',
            items: result.items
          },
          409
        ));
      }

      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 500
      ));
    }
  }
);

/**
 * Update stock level
 * Update the stock level for a SKU at a specific location
 *
 * sku String
 * locationId String
 * stockUpdateRequest StockUpdateRequest
 * returns StockLevel
 */
const updateStock = ({ sku, locationId, stockUpdateRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const { quantity, reason, notes } = stockUpdateRequest;

      const result = inventoryData.updateStockAtLocation(sku, locationId, quantity, reason);

      if (!result) {
        return reject(Service.rejectResponse(
          `Stock not found for SKU ${sku} at location ${locationId}`,
          404
        ));
      }

      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 500
      ));
    }
  }
);

module.exports = {
  adjustStock,
  cancelReservation,
  getStockAtLocation,
  getStockBySku,
  getStockLevels,
  reserveStock,
  updateStock,
};
