/* eslint-disable no-unused-vars */
const Service = require('./Service');
const shippingData = require('../data/shippingData');

/**
 * Get shipping label
 */
const getShippingLabel = ({ shipmentId, format }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = shippingData.getLabel(shipmentId, format || 'pdf');

      if (!result) {
        return reject(Service.rejectResponse(`Shipment not found: ${shipmentId}`, 404));
      }

      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Regenerate shipping label
 */
const regenerateLabel = ({ shipmentId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = shippingData.regenerateLabel(shipmentId);

      if (!result) {
        return reject(Service.rejectResponse(`Shipment not found: ${shipmentId}`, 404));
      }

      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

module.exports = {
  getShippingLabel,
  regenerateLabel,
};
