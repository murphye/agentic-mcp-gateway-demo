/* eslint-disable no-unused-vars */
const Service = require('./Service');
const supportData = require('../data/supportData');

/**
* Check software compatibility
*/
const checkSoftwareCompatibility = ({ product_id, software_version }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.checkSoftwareCompatibility(product_id, software_version);
      if (!result) {
        return reject(Service.rejectResponse('Software update not found', 404));
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
* Get software update details
*/
const getSoftwareUpdate = ({ update_id, locale }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.getSoftwareUpdate(update_id);
      if (!result) {
        return reject(Service.rejectResponse('Software update not found', 404));
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
* List software updates
*/
const listSoftwareUpdates = ({ device_type, os_type, current_version }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.listSoftwareUpdates({
        osType: os_type,
        deviceType: device_type,
        limit: 10,
        offset: 0
      });
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
  checkSoftwareCompatibility,
  getSoftwareUpdate,
  listSoftwareUpdates,
};
