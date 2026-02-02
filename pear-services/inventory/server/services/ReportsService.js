/* eslint-disable no-unused-vars */
const Service = require('./Service');
const inventoryData = require('../data/inventoryData');

/**
 * Get stock movement history
 * Retrieve historical stock movements
 *
 * sku String  (optional)
 * locationId String  (optional)
 * startDate date  (optional)
 * endDate date  (optional)
 * page Integer  (optional)
 * limit Integer  (optional)
 * returns StockMovementReport
 */
const getStockMovements = ({ sku, locationId, startDate, endDate, page = 1, limit = 50 }) => new Promise(
  async (resolve, reject) => {
    try {
      let movements = inventoryData.getStockMovements();

      // Apply filters
      if (sku) {
        movements = movements.filter(m => m.sku === sku);
      }

      if (locationId) {
        movements = movements.filter(m => m.locationId === locationId);
      }

      if (startDate) {
        const start = new Date(startDate);
        movements = movements.filter(m => new Date(m.timestamp) >= start);
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        movements = movements.filter(m => new Date(m.timestamp) <= end);
      }

      // Pagination
      const totalItems = movements.length;
      const totalPages = Math.ceil(totalItems / limit);
      const startIndex = (page - 1) * limit;
      const paginatedItems = movements.slice(startIndex, startIndex + limit);

      resolve(Service.successResponse({
        movements: paginatedItems,
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
 * Get stock summary report
 * Generate a summary of current stock levels
 *
 * groupBy String  (optional)
 * returns StockSummaryReport
 */
const getStockSummary = ({ groupBy }) => new Promise(
  async (resolve, reject) => {
    try {
      const summary = inventoryData.getStockSummary(groupBy);
      resolve(Service.successResponse(summary));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 500
      ));
    }
  }
);

module.exports = {
  getStockMovements,
  getStockSummary,
};
