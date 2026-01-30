/* eslint-disable no-unused-vars */
const Service = require('./Service');
const customerData = require('../data/customerData');

const getProfile = () => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.getProfile();
      if (!result) {
        return reject(Service.rejectResponse('Profile not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const updateProfile = ({ profileUpdate }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.updateProfile(customerData.getCurrentUser(), profileUpdate);
      if (!result) {
        return reject(Service.rejectResponse('Profile not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const uploadProfilePhoto = ({ photoUpload }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.uploadProfilePhoto();
      if (!result) {
        return reject(Service.rejectResponse('Profile not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const deleteProfilePhoto = () => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.deleteProfilePhoto();
      if (!result) {
        return reject(Service.rejectResponse('Profile not found', 404));
      }
      resolve(Service.successResponse(null, 204));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const requestEmailVerification = () => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.requestEmailVerification();
      if (!result) {
        return reject(Service.rejectResponse('Profile not found', 404));
      }
      resolve(Service.successResponse(result, 202));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const requestPhoneVerification = ({ phoneRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.requestPhoneVerification(customerData.getCurrentUser(), phoneRequest?.phoneNumber);
      if (!result) {
        return reject(Service.rejectResponse('Profile not found', 404));
      }
      resolve(Service.successResponse(result, 202));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const confirmPhoneVerification = ({ phoneConfirm }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.confirmPhoneVerification(customerData.getCurrentUser(), phoneConfirm?.code);
      if (!result) {
        return reject(Service.rejectResponse('Profile not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

module.exports = {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
  requestEmailVerification,
  requestPhoneVerification,
  confirmPhoneVerification,
};
