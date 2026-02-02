/* eslint-disable no-unused-vars */
const Service = require('./Service');
const supportData = require('../data/supportData');

const getSurvey = ({ surveyId }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.getSurvey(surveyId);
      if (!result) {
        return reject(Service.rejectResponse('Survey not found', 404));
      }
      resolve(Service.successResponse(result));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const submitFeedback = ({ feedbackRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      const result = supportData.submitFeedback(
        supportData.getCurrentUser(),
        feedbackRequest
      );
      resolve(Service.successResponse(result, 201));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

const submitSurveyResponse = ({ surveyId, surveyResponse }) => new Promise(
  async (resolve, reject) => {
    try {
      const survey = supportData.getSurvey(surveyId);
      if (!survey) {
        return reject(Service.rejectResponse('Survey not found', 404));
      }
      const result = supportData.submitSurveyResponse(surveyId, surveyResponse?.responses);
      resolve(Service.successResponse(null, 200));
    } catch (e) {
      reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
    }
  },
);

module.exports = {
  getSurvey,
  submitFeedback,
  submitSurveyResponse,
};
