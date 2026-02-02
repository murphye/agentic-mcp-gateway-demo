/* eslint-disable no-unused-vars */
const Service = require('./Service');
const analyticsData = require('../data/analyticsData');

const getDashboard = ({ dashboardId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = analyticsData.getDashboard(dashboardId);
      if (!result) {
        return reject(Service.rejectResponse('Dashboard not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const listDashboards = () => new Promise(
  async (resolve, reject) => {
    try {
      const result = analyticsData.listDashboards();
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

module.exports = {
  getDashboard,
  listDashboards,
};
