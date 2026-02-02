/* eslint-disable no-unused-vars */
const Service = require('./Service');
const analyticsData = require('../data/analyticsData');

const getCategoryPerformance = ({ startDate, endDate }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = analyticsData.getCategoryPerformance({ startDate, endDate });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const getProductAnalytics = ({ productId, startDate, endDate }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = analyticsData.getProductAnalytics(productId, { startDate, endDate });
      if (!result) {
        return reject(Service.rejectResponse('Product not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const getProductPerformance = ({ startDate, endDate, category, sortBy, sortOrder, page, limit }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = analyticsData.getProductPerformance({ startDate, endDate, category, sortBy, sortOrder, page, limit });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

module.exports = {
  getCategoryPerformance,
  getProductAnalytics,
  getProductPerformance,
};
