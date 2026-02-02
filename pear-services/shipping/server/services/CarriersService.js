/* eslint-disable no-unused-vars */
const Service = require('./Service');
const shippingData = require('../data/shippingData');

/**
 * Get carrier services
 */
const getCarrierServices = ({ carrierCode }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = shippingData.getCarrierServices(carrierCode);

      if (!result) {
        return reject(Service.rejectResponse(`Carrier not found: ${carrierCode}`, 404));
      }

      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * List available carriers
 */
const listCarriers = ({ country }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = shippingData.listCarriers(country);
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

module.exports = {
  getCarrierServices,
  listCarriers,
};
