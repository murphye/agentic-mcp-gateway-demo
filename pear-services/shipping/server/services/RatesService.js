/* eslint-disable no-unused-vars */
const Service = require('./Service');
const shippingData = require('../data/shippingData');

/**
 * Calculate shipping rates
 */
const calculateRates = ({ rateRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = shippingData.calculateRates(rateRequest);
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Estimate delivery date
 */
const estimateDelivery = ({ deliveryEstimateRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const { postalCode, country, items } = deliveryEstimateRequest;
      const result = shippingData.estimateDelivery(postalCode, country, items);
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Validate address
 */
const validateAddress = ({ address }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = shippingData.validateAddress(address);
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

module.exports = {
  calculateRates,
  estimateDelivery,
  validateAddress,
};
