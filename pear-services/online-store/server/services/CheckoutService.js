/* eslint-disable no-unused-vars */
const Service = require('./Service');
const storeData = require('../data/storeData');

/**
 * Get checkout session
 */
const getCheckoutSession = ({ sessionId }) => new Promise(
  async (resolve, reject) => {
    try {
      const session = storeData.getCheckoutSession(sessionId);

      if (!session) {
        return reject(Service.rejectResponse(`Session not found: ${sessionId}`, 404));
      }

      resolve(Service.successResponse(session));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Get shipping options
 */
const getShippingOptions = ({ shippingOptionsRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        options: storeData.shippingOptions.map(opt => ({
          ...opt,
          estimatedDelivery: {
            ...opt.estimatedDelivery,
            date: new Date(Date.now() + opt.estimatedDelivery.maxDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        }))
      }));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Initiate checkout
 */
const initiateCheckout = ({ checkoutInitRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const { shippingAddressId, billingAddressId } = checkoutInitRequest || {};
      const session = storeData.createCheckoutSession('default', shippingAddressId, billingAddressId);
      resolve(Service.successResponse(session));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Place order
 */
const placeOrder = ({ sessionId, placeOrderRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const order = storeData.placeOrder(sessionId);

      if (!order) {
        return reject(Service.rejectResponse(`Session not found: ${sessionId}`, 404));
      }

      resolve(Service.successResponse(order, 201));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Set payment method
 */
const setPaymentMethod = ({ sessionId, paymentMethodRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const { type, cardToken } = paymentMethodRequest;
      const session = storeData.setPaymentMethod(sessionId, type, cardToken);

      if (!session) {
        return reject(Service.rejectResponse(`Session not found: ${sessionId}`, 404));
      }

      resolve(Service.successResponse(session));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Set shipping option
 */
const setShippingOption = ({ sessionId, shippingOptionRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const { shippingOptionId } = shippingOptionRequest;
      const session = storeData.setShippingOption(sessionId, shippingOptionId);

      if (!session) {
        return reject(Service.rejectResponse(`Session or shipping option not found`, 404));
      }

      resolve(Service.successResponse(session));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

module.exports = {
  getCheckoutSession,
  getShippingOptions,
  initiateCheckout,
  placeOrder,
  setPaymentMethod,
  setShippingOption,
};
