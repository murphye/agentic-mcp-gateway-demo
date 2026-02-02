/* eslint-disable no-unused-vars */
const Service = require('./Service');
const shippingData = require('../data/shippingData');

/**
 * Create return label
 */
const createReturnLabel = ({ returnLabelRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = shippingData.createReturnLabel(returnLabelRequest);
      resolve(Service.successResponse(result, 201));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Track return shipment
 */
const trackReturn = ({ returnId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = shippingData.trackReturn(returnId);

      if (!result) {
        return reject(Service.rejectResponse(`Return not found: ${returnId}`, 404));
      }

      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

module.exports = {
  createReturnLabel,
  trackReturn,
};
