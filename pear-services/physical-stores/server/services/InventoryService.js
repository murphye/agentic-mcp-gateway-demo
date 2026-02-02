/* eslint-disable no-unused-vars */
const Service = require('./Service');
const storeData = require('../data/storeData');

/**
 * Check pickup availability
 */
const checkPickupAvailability = ({ pickupCheckRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const { items, storeIds, latitude, longitude, radius } = pickupCheckRequest;
      const result = storeData.checkPickupAvailability({
        items,
        storeIds,
        latitude,
        longitude,
        radius
      });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Check store inventory
 */
const getStoreInventory = ({ storeId, productId, sku }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = storeData.getStoreInventory(storeId, { productId, sku });

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
 * Reserve for pickup
 */
const reserveForPickup = ({ pickupReserveRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const { storeId, items, orderId } = pickupReserveRequest;
      const result = storeData.reserveForPickup({ storeId, items, orderId });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

module.exports = {
  checkPickupAvailability,
  getStoreInventory,
  reserveForPickup,
};
