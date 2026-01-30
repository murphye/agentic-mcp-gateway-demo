/* eslint-disable no-unused-vars */
const Service = require('./Service');
const analyticsData = require('../data/analyticsData');

const getFulfillmentMetrics = ({ startDate, endDate, location }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = analyticsData.getFulfillmentMetrics({ startDate, endDate, location });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const getReturnMetrics = ({ startDate, endDate }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = analyticsData.getReturnMetrics({ startDate, endDate });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const getSupportMetrics = ({ startDate, endDate }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = analyticsData.getSupportMetrics({ startDate, endDate });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

module.exports = {
  getFulfillmentMetrics,
  getReturnMetrics,
  getSupportMetrics,
};
