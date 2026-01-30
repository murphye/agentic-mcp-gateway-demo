/* eslint-disable no-unused-vars */
const Service = require('./Service');
const paymentsData = require('../data/paymentsData');

/**
* Capture authorized payment
*/
const captureTransaction = ({ transactionId, captureRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = paymentsData.captureTransaction(transactionId, captureRequest);
      if (!result) {
        return reject(Service.rejectResponse('Transaction not found', 404));
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
* Create payment transaction
*/
const createTransaction = ({ transactionRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = paymentsData.createTransaction(transactionRequest);
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
* Get transaction details
*/
const getTransaction = ({ transactionId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = paymentsData.getTransaction(transactionId);
      if (!result) {
        return reject(Service.rejectResponse('Transaction not found', 404));
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
* Verify payment method
*/
const verifyPaymentMethod = ({ verifyRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = paymentsData.verifyPaymentMethod(verifyRequest);
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
* Void transaction
*/
const voidTransaction = ({ transactionId, voidRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = paymentsData.voidTransaction(transactionId, voidRequest);
      if (!result) {
        return reject(Service.rejectResponse('Transaction not found', 404));
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
  captureTransaction,
  createTransaction,
  getTransaction,
  verifyPaymentMethod,
  voidTransaction,
};
