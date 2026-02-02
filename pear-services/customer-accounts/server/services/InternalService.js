/* eslint-disable no-unused-vars */
const Service = require('./Service');
const customerData = require('../data/customerData');

const getUser = ({ userId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.getUser(userId);
      if (!result) {
        return reject(Service.rejectResponse('User not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const getUserAddresses = ({ userId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.getUserAddresses(userId);
      resolve(Service.successResponse({ addresses: result }));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const lookupUsers = ({ emails, ids }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.lookupUsers({ emails, ids });
      resolve(Service.successResponse({ users: result }));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

module.exports = {
  getUser,
  getUserAddresses,
  lookupUsers,
};
