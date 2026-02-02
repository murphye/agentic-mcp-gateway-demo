/* eslint-disable no-unused-vars */
const Service = require('./Service');
const storeData = require('../data/storeData');

/**
 * Get personalized recommendations
 */
const getRecommendations = ({ type, limit }) => new Promise(
  async (resolve, reject) => {
    try {
      const recommendations = storeData.getRecommendations(
        'default',
        type || 'for-you',
        limit || 10
      );
      resolve(Service.successResponse(recommendations));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Get related products
 */
const getRelatedProducts = ({ productId, type, limit }) => new Promise(
  async (resolve, reject) => {
    try {
      const related = storeData.getRelatedProducts(
        productId,
        type || 'similar',
        limit || 10
      );
      resolve(Service.successResponse(related));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

module.exports = {
  getRecommendations,
  getRelatedProducts,
};
