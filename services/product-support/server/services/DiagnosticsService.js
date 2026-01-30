/* eslint-disable no-unused-vars */
const Service = require('./Service');
const supportData = require('../data/supportData');

/**
* Get diagnostics results
*/
const getDiagnosticsResults = ({ session_id }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.getDiagnosticResults(session_id);
      if (!result) {
        return reject(Service.rejectResponse('Diagnostics session not found', 404));
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

/**
* Run device diagnostics
*/
const runDiagnostics = ({ diagnosticsRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.runDiagnostics(diagnosticsRequest);
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
  getDiagnosticsResults,
  runDiagnostics,
};
