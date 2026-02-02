/* eslint-disable no-unused-vars */
const Service = require('./Service');
const paymentsData = require('../data/paymentsData');

/**
* Delete webhook
*/
const deleteWebhook = ({ webhookId }) => new Promise(
  async (resolve, reject) => {
    try {
      const deleted = paymentsData.deleteWebhook(webhookId);
      if (!deleted) {
        return reject(Service.rejectResponse('Webhook not found', 404));
      }
      resolve(Service.successResponse(null, 204));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

/**
* Register webhook
*/
const registerWebhook = ({ webhookRegistration }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = paymentsData.registerWebhook(webhookRegistration);
      resolve(Service.successResponse(result, 201));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  deleteWebhook,
  registerWebhook,
};
