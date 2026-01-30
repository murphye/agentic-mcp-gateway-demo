/* eslint-disable no-unused-vars */
const Service = require('./Service');
const inventoryData = require('../data/inventoryData');

/**
 * Get location details
 * Retrieve detailed information about an inventory location
 *
 * locationId String
 * returns Location
 */
const getLocation = ({ locationId }) => new Promise(
  async (resolve, reject) => {
    try {
      const locations = inventoryData.getAllLocations();
      const location = locations.find(l => l.id === locationId);

      if (!location) {
        return reject(Service.rejectResponse(
          `Location not found: ${locationId}`,
          404
        ));
      }

      resolve(Service.successResponse(location));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 500
      ));
    }
  }
);

/**
 * Get all inventory at location
 * Retrieve complete inventory for a specific location
 *
 * locationId String
 * page Integer  (optional)
 * limit Integer  (optional)
 * returns StockLevelResponse
 */
const getLocationInventory = ({ locationId, page = 1, limit = 50 }) => new Promise(
  async (resolve, reject) => {
    try {
      const locations = inventoryData.getAllLocations();
      const location = locations.find(l => l.id === locationId);

      if (!location) {
        return reject(Service.rejectResponse(
          `Location not found: ${locationId}`,
          404
        ));
      }

      let stockLevels = inventoryData.getAllStockLevels();
      stockLevels = stockLevels.filter(s => s.locationId === locationId);

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
 * List inventory locations
 * Retrieve all warehouses, distribution centers, and stores
 *
 * type String  (optional)
 * region String  (optional)
 * active Boolean  (optional)
 * returns LocationListResponse
 */
const listLocations = ({ type, region, active = true }) => new Promise(
  async (resolve, reject) => {
    try {
      let locations = inventoryData.getAllLocations();

      // Apply filters
      if (type) {
        locations = locations.filter(l => l.type === type);
      }

      if (region) {
        locations = locations.filter(l => l.region === region);
      }

      if (active !== undefined) {
        locations = locations.filter(l => l.active === active);
      }

      resolve(Service.successResponse({
        locations
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 500
      ));
    }
  }
);

module.exports = {
  getLocation,
  getLocationInventory,
  listLocations,
};
