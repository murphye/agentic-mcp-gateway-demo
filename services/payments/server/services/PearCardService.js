/* eslint-disable no-unused-vars */
const Service = require('./Service');
const paymentsData = require('../data/paymentsData');

/**
* Get Pear Card details
*/
const getPearCard = ({ cardId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = paymentsData.getPearCard(cardId);
      if (!result) {
        return reject(Service.rejectResponse('Pear Card not found', 404));
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
* Get Pear Card installment plans
*/
const getPearCardInstallments = ({ cardId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = paymentsData.getPearCardInstallments(cardId);
      if (!result) {
        return reject(Service.rejectResponse('Pear Card not found', 404));
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
* Get Pear Card rewards
*/
const getPearCardRewards = ({ cardId, startDate, endDate }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = paymentsData.getPearCardRewards(cardId, startDate, endDate);
      if (!result) {
        return reject(Service.rejectResponse('Pear Card not found', 404));
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
* Link Pear Card
*/
const linkPearCard = ({ linkRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = paymentsData.linkPearCard(linkRequest);
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
  getPearCard,
  getPearCardInstallments,
  getPearCardRewards,
  linkPearCard,
};
