/* eslint-disable no-unused-vars */
const Service = require('./Service');
const shippingData = require('../data/shippingData');

/**
 * Subscribe to tracking updates
 */
const subscribeToTracking = ({ trackingSubscriptionRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = shippingData.subscribeToTracking(trackingSubscriptionRequest);
      resolve(Service.successResponse(result, 201));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Track package
 */
const trackPackage = ({ trackingNumber, carrier }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = shippingData.trackPackage(trackingNumber, carrier);

      if (!result) {
        return reject(Service.rejectResponse(`Tracking number not found: ${trackingNumber}`, 404));
      }

      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

module.exports = {
  subscribeToTracking,
  trackPackage,
};
