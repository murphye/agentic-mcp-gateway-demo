/**
 * The ProfileController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/ProfileService');
const confirmPhoneVerification = async (request, response) => {
  await Controller.handleRequest(request, response, service.confirmPhoneVerification);
};

const deleteProfilePhoto = async (request, response) => {
  await Controller.handleRequest(request, response, service.deleteProfilePhoto);
};

const getProfile = async (request, response) => {
  await Controller.handleRequest(request, response, service.getProfile);
};

const requestEmailVerification = async (request, response) => {
  await Controller.handleRequest(request, response, service.requestEmailVerification);
};

const requestPhoneVerification = async (request, response) => {
  await Controller.handleRequest(request, response, service.requestPhoneVerification);
};

const updateProfile = async (request, response) => {
  await Controller.handleRequest(request, response, service.updateProfile);
};

const uploadProfilePhoto = async (request, response) => {
  await Controller.handleRequest(request, response, service.uploadProfilePhoto);
};


module.exports = {
  confirmPhoneVerification,
  deleteProfilePhoto,
  getProfile,
  requestEmailVerification,
  requestPhoneVerification,
  updateProfile,
  uploadProfilePhoto,
};
