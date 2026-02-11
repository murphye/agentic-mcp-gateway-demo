/* eslint-disable no-unused-vars */
const Service = require('./Service');
const storeData = require('../data/storeData');

/**
 * Get all store locations
 */
const getAllStores = () => new Promise(
  async (resolve, reject) => {
    try {
      const result = storeData.listStores({});
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Get store details
 */
const getStore = ({ storeId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = storeData.getStore(storeId);

      if (!result) {
        return reject(Service.rejectResponse(`Store not found: ${storeId}`, 404));
      }

      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Get store hours
 */
const getStoreHours = ({ storeId, startDate, endDate }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = storeData.getStoreHours(storeId, startDate, endDate);

      if (!result) {
        return reject(Service.rejectResponse(`Store not found: ${storeId}`, 404));
      }

      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * List store locations
 */
const listStores = ({ latitude, longitude, radius, city, state, country, postalCode, services, page, limit }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = storeData.listStores({
        latitude,
        longitude,
        radius,
        city,
        state,
        country,
        services,
        page,
        limit
      });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

module.exports = {
  getAllStores,
  getStore,
  getStoreHours,
  listStores,
};
