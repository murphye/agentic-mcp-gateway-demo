/* eslint-disable no-unused-vars */
const Service = require('./Service');
const analyticsData = require('../data/analyticsData');

const getSalesByRegion = ({ startDate, endDate, level }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = analyticsData.getSalesByRegion({ startDate, endDate, level });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const getSalesForecast = ({ horizon, category, confidence }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = analyticsData.getSalesForecast({ horizon, category, confidence });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const getSalesSummary = ({ startDate, endDate, channel, region, compareWith }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = analyticsData.getSalesSummary({ startDate, endDate, channel, region, compareWith });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const getSalesTrends = ({ startDate, endDate, granularity, metrics, dimensions }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = analyticsData.getSalesTrends({ startDate, endDate, granularity, metrics, dimensions });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

module.exports = {
  getSalesByRegion,
  getSalesForecast,
  getSalesSummary,
  getSalesTrends,
};
