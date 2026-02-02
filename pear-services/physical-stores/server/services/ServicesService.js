/* eslint-disable no-unused-vars */
const Service = require('./Service');
const storeData = require('../data/storeData');

/**
 * Get service pricing
 */
const getServicePricing = ({ serviceId, deviceModel }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = storeData.getServicePricing(serviceId, deviceModel);

      if (!result) {
        return reject(Service.rejectResponse(`Service not found: ${serviceId}`, 404));
      }

      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * List available services
 */
const listServices = ({ storeId, category }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = storeData.listServices({ storeId, category });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

module.exports = {
  getServicePricing,
  listServices,
};
