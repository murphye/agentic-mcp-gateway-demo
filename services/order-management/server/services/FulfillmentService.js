/* eslint-disable no-unused-vars */
const Service = require('./Service');
const orderData = require('../data/orderData');

/**
* Create shipment
*/
const createShipment = ({ orderId, shipmentRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = orderData.createShipment(orderId, shipmentRequest);
      if (!result) {
        return reject(Service.rejectResponse('Order not found', 404));
      }
      resolve(Service.successResponse(result, 201));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

/**
* Update fulfillment status
*/
const updateFulfillmentStatus = ({ orderId, statusUpdate }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = orderData.updateFulfillmentStatus(orderId, statusUpdate);
      if (!result) {
        return reject(Service.rejectResponse('Order not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

module.exports = {
  createShipment,
  updateFulfillmentStatus,
};
