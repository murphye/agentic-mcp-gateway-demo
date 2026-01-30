/* eslint-disable no-unused-vars */
const Service = require('./Service');
const analyticsData = require('../data/analyticsData');

const getInventoryHealth = ({ category, location }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = analyticsData.getInventoryHealth({ category, location });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const getInventoryTurnover = ({ startDate, endDate, groupBy }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = analyticsData.getInventoryTurnover({ startDate, endDate, groupBy });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const getStockoutRisk = ({ threshold }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = analyticsData.getStockoutRisk({ threshold });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

module.exports = {
  getInventoryHealth,
  getInventoryTurnover,
  getStockoutRisk,
};
