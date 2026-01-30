/* eslint-disable no-unused-vars */
const Service = require('./Service');
const analyticsData = require('../data/analyticsData');

const createReport = ({ createReportRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = analyticsData.createReport(createReportRequest);
      resolve(Service.successResponse(result, 201));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const deleteReport = ({ reportId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = analyticsData.deleteReport(reportId);
      if (!result) {
        return reject(Service.rejectResponse('Report not found', 404));
      }
      resolve(Service.successResponse(null, 204));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const downloadReport = ({ reportId, format }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = analyticsData.downloadReport(reportId, format);
      if (!result) {
        return reject(Service.rejectResponse('Report not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const executeQuery = ({ analyticsQuery }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = analyticsData.executeQuery(analyticsQuery);
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const getReport = ({ reportId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = analyticsData.getReport(reportId);
      if (!result) {
        return reject(Service.rejectResponse('Report not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const listReports = ({ type }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = analyticsData.listReports({ type });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const runReport = ({ reportId, runReportRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = analyticsData.runReport(reportId, runReportRequest);
      if (!result) {
        return reject(Service.rejectResponse('Report not found', 404));
      }
      resolve(Service.successResponse(result, 202));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

module.exports = {
  createReport,
  deleteReport,
  downloadReport,
  executeQuery,
  getReport,
  listReports,
  runReport,
};
