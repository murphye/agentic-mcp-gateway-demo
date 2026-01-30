/* eslint-disable no-unused-vars */
const Service = require('./Service');
const storeData = require('../data/storeData');

/**
 * Create product review
 */
const createReview = ({ productId, reviewRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const { rating, title, body, pros, cons, recommendProduct } = reviewRequest;
      const review = storeData.createReview(
        productId,
        'default',
        rating,
        title,
        body,
        pros,
        cons,
        recommendProduct
      );
      resolve(Service.successResponse(review, 201));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

/**
 * Get product reviews
 */
const getProductReviews = ({ productId, rating, verified, sort, page, limit }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = storeData.getProductReviews(productId, {
        rating,
        verified,
        sort: sort || 'recent',
        page: page || 1,
        limit: limit || 10
      });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 500));
    }
  }
);

module.exports = {
  createReview,
  getProductReviews,
};
