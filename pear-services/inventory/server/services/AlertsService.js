/* eslint-disable no-unused-vars */
const Service = require('./Service');
const inventoryData = require('../data/inventoryData');

/**
 * Acknowledge alert
 * Mark an alert as acknowledged
 *
 * alertId String
 * no response value expected for this operation
 */
const acknowledgeAlert = ({ alertId }) => new Promise(
  async (resolve, reject) => {
    try {
      const alert = inventoryData.acknowledgeAlert(alertId);

      if (!alert) {
        return reject(Service.rejectResponse(
          `Alert not found: ${alertId}`,
          404
        ));
      }

      resolve(Service.successResponse({ message: 'Alert acknowledged', alert }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 500
      ));
    }
  }
);

/**
 * List inventory alerts
 * Retrieve active inventory alerts
 *
 * type String  (optional)
 * severity String  (optional)
 * acknowledged Boolean  (optional)
 * returns AlertListResponse
 */
const listAlerts = ({ type, severity, acknowledged }) => new Promise(
  async (resolve, reject) => {
    try {
      let alerts = inventoryData.getAlerts();

      // Apply filters
      if (type) {
        alerts = alerts.filter(a => a.type === type);
      }

      if (severity) {
        alerts = alerts.filter(a => a.severity === severity);
      }

      if (acknowledged !== undefined) {
        alerts = alerts.filter(a => a.acknowledged === acknowledged);
      }

      resolve(Service.successResponse({
        alerts
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 500
      ));
    }
  }
);

module.exports = {
  acknowledgeAlert,
  listAlerts,
};
