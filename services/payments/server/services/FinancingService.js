/* eslint-disable no-unused-vars */
const Service = require('./Service');
const paymentsData = require('../data/paymentsData');

/**
* Apply for financing
*/
const applyForFinancing = ({ financingApplication }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = paymentsData.applyForFinancing(financingApplication);
      resolve(Service.successResponse(result, 201));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

/**
* Check financing eligibility
*/
const checkFinancingEligibility = ({ eligibilityRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = paymentsData.checkFinancingEligibility(eligibilityRequest);
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
* Get financing options
*/
const getFinancingOptions = ({ optionsRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = paymentsData.getFinancingOptions(optionsRequest);
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
  applyForFinancing,
  checkFinancingEligibility,
  getFinancingOptions,
};
