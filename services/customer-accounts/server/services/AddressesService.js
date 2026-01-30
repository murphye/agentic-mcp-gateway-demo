/* eslint-disable no-unused-vars */
const Service = require('./Service');
const customerData = require('../data/customerData');

const listAddresses = ({ userId }) => new Promise(
  async (resolve, reject) => {
    try {
      const targetUserId = userId || customerData.getCurrentUser();
      const result = customerData.listAddresses(targetUserId);
      resolve(Service.successResponse({ addresses: result }));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const getAddress = ({ addressId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.getAddress(addressId);
      if (!result) {
        return reject(Service.rejectResponse('Address not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const createAddress = ({ addressRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.createAddress(customerData.getCurrentUser(), addressRequest);
      resolve(Service.successResponse(result, 201));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const updateAddress = ({ addressId, addressRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.updateAddress(addressId, addressRequest);
      if (!result) {
        return reject(Service.rejectResponse('Address not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const deleteAddress = ({ addressId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.deleteAddress(addressId);
      if (!result) {
        return reject(Service.rejectResponse('Address not found', 404));
      }
      resolve(Service.successResponse(null, 204));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const setDefaultAddress = ({ addressId, defaultRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.setDefaultAddress(addressId, defaultRequest || {});
      if (!result) {
        return reject(Service.rejectResponse('Address not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

module.exports = {
  listAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
