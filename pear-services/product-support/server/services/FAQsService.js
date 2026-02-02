/* eslint-disable no-unused-vars */
const Service = require('./Service');
const supportData = require('../data/supportData');

/**
* Get FAQ by ID
*/
const getFAQ = ({ faq_id, locale }) => new Promise(
  async (resolve, reject) => {
    try {
      const faq = supportData.getFAQ(faq_id);
      if (!faq) {
        return reject(Service.rejectResponse('FAQ not found', 404));
      }
      resolve(Service.successResponse(faq));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

/**
* List frequently asked questions
*/
const listFAQs = ({ product_id, device_type, topic, locale, limit }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.listFAQs({
        deviceType: device_type,
        limit: limit || 50,
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
  getFAQ,
  listFAQs,
};
