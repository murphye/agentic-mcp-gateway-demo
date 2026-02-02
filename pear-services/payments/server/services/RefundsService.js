/* eslint-disable no-unused-vars */
const Service = require('./Service');
const paymentsData = require('../data/paymentsData');

/**
* Create refund
*/
const createRefund = ({ refundRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = paymentsData.createRefund(refundRequest);
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
* Get refund details
*/
const getRefund = ({ refundId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = paymentsData.getRefund(refundId);
      if (!result) {
        return reject(Service.rejectResponse('Refund not found', 404));
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
  createRefund,
  getRefund,
};
