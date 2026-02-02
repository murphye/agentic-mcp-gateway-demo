/* eslint-disable no-unused-vars */
const Service = require('./Service');
const customerData = require('../data/customerData');

const listDevices = ({ userId }) => new Promise(
  async (resolve, reject) => {
    try {
      const targetUserId = userId || customerData.getCurrentUser();
      const result = customerData.listDevices(targetUserId);
      resolve(Service.successResponse({ devices: result }));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const getDevice = ({ deviceId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.getDevice(deviceId);
      if (!result) {
        return reject(Service.rejectResponse('Device not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const updateDevice = ({ deviceId, deviceUpdate }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.updateDevice(deviceId, deviceUpdate || {});
      if (!result) {
        return reject(Service.rejectResponse('Device not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const removeDevice = ({ deviceId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.removeDevice(deviceId);
      if (!result) {
        return reject(Service.rejectResponse('Device not found', 404));
      }
      resolve(Service.successResponse(null, 204));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const locateDevice = ({ deviceId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.locateDevice(deviceId);
      if (!result) {
        return reject(Service.rejectResponse('Device not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const playDeviceSound = ({ deviceId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.playDeviceSound(deviceId);
      if (!result) {
        return reject(Service.rejectResponse('Device not found', 404));
      }
      resolve(Service.successResponse(result, 202));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const enableLostMode = ({ deviceId, lostModeRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.enableLostMode(deviceId, lostModeRequest || {});
      if (!result) {
        return reject(Service.rejectResponse('Device not found', 404));
      }
      resolve(Service.successResponse(result, 202));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const disableLostMode = ({ deviceId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = customerData.disableLostMode(deviceId);
      if (!result) {
        return reject(Service.rejectResponse('Device not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

module.exports = {
  listDevices,
  getDevice,
  updateDevice,
  removeDevice,
  locateDevice,
  playDeviceSound,
  enableLostMode,
  disableLostMode,
};
