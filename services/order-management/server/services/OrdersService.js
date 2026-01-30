/* eslint-disable no-unused-vars */
const Service = require('./Service');
const orderData = require('../data/orderData');

/**
* Cancel order
*/
const cancelOrder = ({ orderId, cancelRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = orderData.cancelOrder(orderId, cancelRequest);
      if (!result) {
        return reject(Service.rejectResponse('Order not found', 404));
      }
      if (result.error) {
        return reject(Service.rejectResponse(result.message, 400));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

/**
* Cancel order item
*/
const cancelOrderItem = ({ orderId, itemId, cancelItemRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = orderData.cancelOrderItem(orderId, itemId, cancelItemRequest);
      if (!result) {
        return reject(Service.rejectResponse('Order or item not found', 404));
      }
      if (result.error) {
        return reject(Service.rejectResponse(result.message, 400));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

/**
* Create order
*/
const createOrder = ({ orderRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = orderData.createOrder(orderRequest);
      resolve(Service.successResponse(result, 201));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

/**
* Get gift receipt
*/
const getGiftReceipt = ({ orderId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = orderData.getGiftReceipt(orderId);
      if (!result) {
        return reject(Service.rejectResponse('Order not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

/**
* Get order details
*/
const getOrder = ({ orderId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = orderData.getOrder(orderId);
      if (!result) {
        return reject(Service.rejectResponse('Order not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

/**
* Get order receipt
*/
const getOrderReceipt = ({ orderId, format }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = orderData.getOrderReceipt(orderId);
      if (!result) {
        return reject(Service.rejectResponse('Order not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

/**
* Get order tracking
*/
const getOrderTracking = ({ orderId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = orderData.getOrderTracking(orderId);
      if (!result) {
        return reject(Service.rejectResponse('Order not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

/**
* List orders
*/
const listOrders = ({ status, startDate, endDate, channel, customerId, page, limit }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = orderData.listOrders({ status, startDate, endDate, channel, customerId, page, limit });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

/**
* Lookup order by number
*/
const lookupOrder = ({ orderNumber, email }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = orderData.lookupOrder(orderNumber, email);
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
  cancelOrder,
  cancelOrderItem,
  createOrder,
  getGiftReceipt,
  getOrder,
  getOrderReceipt,
  getOrderTracking,
  listOrders,
  lookupOrder,
};
