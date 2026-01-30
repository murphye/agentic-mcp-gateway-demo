/* eslint-disable no-unused-vars */
const Service = require('./Service');
const customerData = require('../data/customerData');

const getPreferences = ({ userId }) => new Promise(
  async (resolve, reject) => {
    try {
      const targetUserId = userId || customerData.getCurrentUser();
      const result = customerData.getPreferences(targetUserId);
      if (!result) {
        return reject(Service.rejectResponse('Preferences not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const updatePreferences = ({ preferencesUpdate }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.updatePreferences(customerData.getCurrentUser(), preferencesUpdate);
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const unsubscribeNotifications = ({ unsubscribeRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.unsubscribeNotifications(
        customerData.getCurrentUser(),
        unsubscribeRequest?.channels || []
      );
      if (!result) {
        return reject(Service.rejectResponse('User not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

module.exports = {
  getPreferences,
  updatePreferences,
  unsubscribeNotifications,
};
