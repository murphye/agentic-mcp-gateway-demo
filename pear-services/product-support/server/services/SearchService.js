/* eslint-disable no-unused-vars */
const Service = require('./Service');
const supportData = require('../data/supportData');

/**
* Get search suggestions
*/
const getSearchSuggestions = ({ q, device_type, limit }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.getSearchSuggestions(q);
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
* Search support content
*/
const searchSupport = ({ q, content_type, device_type, locale, limit }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.searchContent(q, {
        contentType: content_type?.[0] || 'all',
        deviceType: device_type,
        limit: limit || 20,
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
  getSearchSuggestions,
  searchSupport,
};
