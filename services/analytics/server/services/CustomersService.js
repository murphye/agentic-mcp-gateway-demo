/* eslint-disable no-unused-vars */
const Service = require('./Service');
const analyticsData = require('../data/analyticsData');

const getCohortAnalysis = ({ cohortType, metric, periods }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = analyticsData.getCohortAnalysis({ cohortType, metric, periods });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const getCustomerLTV = ({ segment }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = analyticsData.getCustomerLTV({ segment });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const getCustomerOverview = ({ startDate, endDate }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = analyticsData.getCustomerOverview({ startDate, endDate });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const getCustomerSegments = () => new Promise(
  async (resolve, reject) => {
    try {
      const result = analyticsData.getCustomerSegments();
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

module.exports = {
  getCohortAnalysis,
  getCustomerLTV,
  getCustomerOverview,
  getCustomerSegments,
};
