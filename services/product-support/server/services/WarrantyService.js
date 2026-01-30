/* eslint-disable no-unused-vars */
const Service = require('./Service');
const supportData = require('../data/supportData');

/**
* Check warranty coverage
*/
const checkWarrantyCoverage = ({ serial_number }) => new Promise(
  async (resolve, reject) => {
    try {
      const serialNumber = serial_number || '';
      // Extract product ID from serial number pattern or use default
      const productId = serialNumber.startsWith('PEAR-')
        ? serialNumber.split('-').slice(0, 3).join('-')
        : 'PEAR-PPH-1601';

      const result = supportData.checkWarrantyCoverage(serialNumber, productId);
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
* Get PearCare+ plans
*/
const getPearCarePlans = ({ product_id, locale }) => new Promise(
  async (resolve, reject) => {
    try {
      const productId = product_id || '';
      // Determine device type from product ID
      let deviceType = 'pphone';
      if (productId.includes('PBK') || productId.includes('PBA')) {
        deviceType = 'pearbook';
      } else if (productId.includes('PW')) {
        deviceType = 'pear_watch';
      } else if (productId.includes('PPD')) {
        deviceType = 'pearpods';
      }

      const result = supportData.getPearCarePlans(deviceType);
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
* Get warranty information for a product
*/
const getProductWarrantyInfo = ({ product_id, locale }) => new Promise(
  async (resolve, reject) => {
    try {
      const productId = product_id || '';
      const result = supportData.getProductWarranty(productId);
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
  checkWarrantyCoverage,
  getPearCarePlans,
  getProductWarrantyInfo,
};
