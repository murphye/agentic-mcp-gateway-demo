/* eslint-disable no-unused-vars */
const Service = require('./Service');
const supportData = require('../data/supportData');

/**
* Get repair options
*/
const getRepairOptions = ({ serial_number, product_id, issue_type, postal_code }) => new Promise(
  async (resolve, reject) => {
    try {
      const productId = product_id || 'PEAR-PPH-1601';

      const result = supportData.getRepairOptions(productId, issue_type);
      if (!result) {
        return reject(Service.rejectResponse('Product not found or no repair options available', 404));
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
* Get repair pricing
*/
const getRepairPricing = ({ product_id, repair_type, coverage_type }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.getRepairPricing(product_id, repair_type);
      if (!result) {
        return reject(Service.rejectResponse('Repair pricing not found for this product/repair type', 404));
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

module.exports = {
  getRepairOptions,
  getRepairPricing,
};
