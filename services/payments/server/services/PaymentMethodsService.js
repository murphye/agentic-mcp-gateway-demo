/* eslint-disable no-unused-vars */
const Service = require('./Service');
const paymentsData = require('../data/paymentsData');

/**
* Store payment method
*/
const createPaymentMethod = ({ paymentMethodRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = paymentsData.createPaymentMethod(paymentMethodRequest);
      resolve(Service.successResponse(result, 201));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

/**
* Delete payment method
*/
const deletePaymentMethod = ({ paymentMethodId }) => new Promise(
  async (resolve, reject) => {
    try {
      const deleted = paymentsData.deletePaymentMethod(paymentMethodId);
      if (!deleted) {
        return reject(Service.rejectResponse('Payment method not found', 404));
      }
      resolve(Service.successResponse(null, 204));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

/**
* Get payment method
*/
const getPaymentMethod = ({ paymentMethodId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = paymentsData.getPaymentMethod(paymentMethodId);
      if (!result) {
        return reject(Service.rejectResponse('Payment method not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

/**
* List stored payment methods
*/
const listPaymentMethods = ({ customerId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = paymentsData.listPaymentMethods(customerId);
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

/**
* Update payment method
*/
const updatePaymentMethod = ({ paymentMethodId, updateRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = paymentsData.updatePaymentMethod(paymentMethodId, updateRequest);
      if (!result) {
        return reject(Service.rejectResponse('Payment method not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  createPaymentMethod,
  deletePaymentMethod,
  getPaymentMethod,
  listPaymentMethods,
  updatePaymentMethod,
};
