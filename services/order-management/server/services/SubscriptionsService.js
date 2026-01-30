/* eslint-disable no-unused-vars */
const Service = require('./Service');
const orderData = require('../data/orderData');

/**
* Cancel subscription
*/
const cancelSubscription = ({ subscriptionId, cancelRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = orderData.cancelSubscription(subscriptionId, cancelRequest);
      if (!result) {
        return reject(Service.rejectResponse('Subscription not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

/**
* Get subscription details
*/
const getSubscription = ({ subscriptionId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = orderData.getSubscription(subscriptionId);
      if (!result) {
        return reject(Service.rejectResponse('Subscription not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

/**
* List subscriptions
*/
const listSubscriptions = ({ status, customerId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = orderData.listSubscriptions({ status, customerId });
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

/**
* Update subscription
*/
const updateSubscription = ({ subscriptionId, subscriptionUpdate }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = orderData.updateSubscription(subscriptionId, subscriptionUpdate);
      if (!result) {
        return reject(Service.rejectResponse('Subscription not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

module.exports = {
  cancelSubscription,
  getSubscription,
  listSubscriptions,
  updateSubscription,
};
