/* eslint-disable no-unused-vars */
const Service = require('./Service');
const supportData = require('../data/supportData');

const getDiagnosticsHistory = ({ deviceId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.getDiagnosticsHistory(
        supportData.getCurrentUser(),
        deviceId
      );
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const getDiagnosticsResults = ({ sessionId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.getDiagnosticsResults(sessionId);
      if (!result) {
        return reject(Service.rejectResponse('Diagnostics session not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const runDiagnostics = ({ diagnosticsRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.runDiagnostics(
        supportData.getCurrentUser(),
        diagnosticsRequest
      );
      resolve(Service.successResponse(result, 202));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

module.exports = {
  getDiagnosticsHistory,
  getDiagnosticsResults,
  runDiagnostics,
};
