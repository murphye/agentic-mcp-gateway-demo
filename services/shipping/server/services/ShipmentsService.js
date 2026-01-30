/* eslint-disable no-unused-vars */
const Service = require('./Service');
const shippingData = require('../data/shippingData');

/**
 * Cancel scheduled pickup
 */
const cancelPickup = ({ pickupId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = shippingData.cancelPickup(pickupId);

      if (!result) {
        return reject(Service.rejectResponse(`Pickup not found: ${pickupId}`, 404));
      }

      if (result.error) {
        return reject(Service.rejectResponse(result.error, 400));
      }

      resolve(Service.successResponse({ message: 'Pickup cancelled successfully' }));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Cancel shipment
 */
const cancelShipment = ({ shipmentId, cancelShipmentRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const reason = cancelShipmentRequest?.reason;
      const result = shippingData.cancelShipment(shipmentId, reason);

      if (!result) {
        return reject(Service.rejectResponse(`Shipment not found: ${shipmentId}`, 404));
      }

      if (result.error) {
        return reject(Service.rejectResponse(result.error, 400));
      }

      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Create shipment
 */
const createShipment = ({ createShipmentRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const shipment = shippingData.createShipment(createShipmentRequest);
      resolve(Service.successResponse(shipment, 201));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Get shipment details
 */
const getShipment = ({ shipmentId }) => new Promise(
  async (resolve, reject) => {
    try {
      const shipment = shippingData.getShipment(shipmentId);

      if (!shipment) {
        return reject(Service.rejectResponse(`Shipment not found: ${shipmentId}`, 404));
      }

      resolve(Service.successResponse(shipment));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * List shipments
 */
const listShipments = ({ orderId, status, carrier, startDate, endDate, page, limit }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = shippingData.listShipments({
        orderId,
        status,
        carrier,
        startDate,
        endDate,
        page: page || 1,
        limit: limit || 20
      });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Schedule carrier pickup
 */
const schedulePickup = ({ pickupRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const pickup = shippingData.schedulePickup(pickupRequest);
      resolve(Service.successResponse(pickup, 201));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Update shipment
 */
const updateShipment = ({ shipmentId, updateShipmentRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const shipment = shippingData.updateShipment(shipmentId, updateShipmentRequest);

      if (!shipment) {
        return reject(Service.rejectResponse(`Shipment not found: ${shipmentId}`, 404));
      }

      resolve(Service.successResponse(shipment));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

module.exports = {
  cancelPickup,
  cancelShipment,
  createShipment,
  getShipment,
  listShipments,
  schedulePickup,
  updateShipment,
};
