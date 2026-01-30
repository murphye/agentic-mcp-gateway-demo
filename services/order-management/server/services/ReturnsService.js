/* eslint-disable no-unused-vars */
const Service = require('./Service');
const orderData = require('../data/orderData');

/**
* Check return eligibility
*/
const checkReturnEligibility = ({ eligibilityRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = orderData.checkReturnEligibility(eligibilityRequest);
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
* Initiate return
*/
const createReturn = ({ returnRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = orderData.createReturn(returnRequest);
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
* Get return details
*/
const getReturn = ({ returnId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = orderData.getReturn(returnId);
      if (!result) {
        return reject(Service.rejectResponse('Return not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

/**
* Get return shipping label
*/
const getReturnLabel = ({ returnId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = orderData.getReturnLabel(returnId);
      if (!result) {
        return reject(Service.rejectResponse('Return not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

/**
* List returns
*/
const listReturns = ({ status, customerId, page, limit }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = orderData.listReturns({ status, customerId, page, limit });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

module.exports = {
  checkReturnEligibility,
  createReturn,
  getReturn,
  getReturnLabel,
  listReturns,
};
